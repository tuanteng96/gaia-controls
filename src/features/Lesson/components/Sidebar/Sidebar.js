import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LessonCrud from "../../_redux/LessonCrud";
import { fetchCateList } from "../../_redux/LessonSlice";
import ModalCategories from "../Modal/ModalCategories";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

Sidebar.propTypes = {
  openModal: PropTypes.func,
};

function Sidebar({ openModal }) {
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const { listCate, loading } = useSelector(({ lesson }) => ({
    listCate: lesson.listCate,
    loading: lesson.loading,
  }));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCateList({ ParentID: 662 }))
      .unwrap()
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
      });
  }, [dispatch]);

  const onOpenModal = (item = {}) => {
    setIsModal(true);
    setDefaultValues(item);
  };

  const onHideModal = () => {
    setIsModal(false);
    setDefaultValues({});
  };

  const onAddEdit = (values) => {
    setIsLoading(true);
    const dataPost = {
      ...values,
      ApplicationKey: "type",
      ParentID: 662,
    };
    LessonCrud.addEditCate(dataPost)
      .then((response) => {
        dispatch(fetchCateList({ ParentID: 662 }))
          .unwrap()
          .then((result) => {
            setIsLoading(false);
            onHideModal();
            toast.success(
              values.ID ? "Cập nhập thành công !" : "Thêm mới thành công",
              {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500,
              }
            );
          })
          .catch((rejectedValueOrSerializedError) => {
            console.log(rejectedValueOrSerializedError);
          });
      })
      .catch((error) => console.log(error));
  };

  const onDelete = (item) => {
    if (!item.ID) return;
    const dataPost = {
      deleteId: item.ID,
    };
    Swal.fire({
      title: "Bạn muốn xóa nhóm ?",
      text: "Bạn có chắc chắn muốn xóa nhóm này không ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Tôi muốn xóa!",
      cancelButtonText: "Đóng",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          LessonCrud.deleteCate(dataPost)
            .then((response) => {
              dispatch(fetchCateList({ ParentID: 662 }))
                .unwrap()
                .then((result) => {
                  resolve();
                })
                .catch((rejectedValueOrSerializedError) => {
                  console.log(rejectedValueOrSerializedError);
                });
            })
            .catch((error) => console.log(error));
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Xóa nhóm thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  return (
    <div className="hpanel hgreen">
      <div className="panel-heading hbuilt">
        Nhóm bài giảng
        <button
          className="btn btn-sm btn-success position-absolute top-9px right-9px"
          onClick={onOpenModal}
        >
          Thêm mới
        </button>
      </div>
      <div className="panel-body">
        {!loading.fetchCate && (
          <div className="dd tree">
            <div className="dd-list">
              {listCate && listCate.length > 0 ? (
                listCate &&
                listCate.map((item, index) => (
                  <NavLink
                    to={`/admin/r/bai-giang/${item.ID}`}
                    className={(links) => (links.isActive ? "active" : "")}
                    key={index}
                  >
                    <div className="dd-item">
                      <div className="dd-handle font-weight-500">
                        <span className="label h-bg-navy-blue">
                          <i className="fal fa-layer-group"></i>
                        </span>
                        {item.Title}
                        <div className="position-absolute top-9px right-9px">
                          <button
                            className="btn btn-sm btn-success w-24px h-24px"
                            onClick={() =>
                              openModal({
                                Type: {
                                  label: item.Title,
                                  value: item.ID,
                                },
                              })
                            }
                          >
                            <i className="fal fa-plus pe-0 icon-sm"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary ms-2 w-24px h-24px"
                            onClick={() => onOpenModal(item)}
                          >
                            <i className="fas fa-pen icon-sm pe-0"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger ms-2 w-24px h-24px"
                            onClick={() => onDelete(item)}
                          >
                            <i className="fas fa-trash icon-sm pe-0"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                ))
              ) : (
                <div>Chưa có nhóm bài giảng</div>
              )}
            </div>
          </div>
        )}
        {loading.fetchCate && <div>Đang tải ...</div>}
      </div>
      <ModalCategories
        show={isModal}
        onHide={onHideModal}
        onAddEdit={onAddEdit}
        loading={isLoading}
        defaultValues={defaultValues}
      />
    </div>
  );
}

export default Sidebar;
