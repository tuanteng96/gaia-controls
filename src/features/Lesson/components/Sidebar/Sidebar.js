import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LessonCrud from "../../_redux/LessonCrud";
import { fetchCateList } from "../../_redux/LessonSlice";
import ModalCategories from "../Modal/ModalCategories";
import PropTypes from "prop-types";
import { NavLink, useParams } from "react-router-dom";
import { useLession } from "../..";

Sidebar.propTypes = {
  openModal: PropTypes.func,
};

function Sidebar({ openModal }) {
  const { id } = useParams();
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const { updateTitle } = useLession();

  const { listCate, loading } = useSelector(({ lesson }) => ({
    listCate: lesson.listCate,
    loading: lesson.loading,
  }));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchCateList({
        ParentID: 662,
        _orders: {
          Order: false,
        },
      })
    )
      .unwrap()
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
      });
  }, [dispatch]);

  useEffect(() => {
    if (id && listCate && listCate.length > 0) {
      const index = listCate.findIndex((x) => Number(x.ID) === Number(id));
      updateTitle(listCate[index].Title);
    }
  }, [listCate, id, updateTitle]);

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
    if (item.TypeItemCount > 0) {
      Swal.fire({
        title: `Không thể xóa nhóm ${item.Title} ?`,
        text:
          "Bạn cần xóa hết danh sách bài giảng để có thể thực hiện xóa nhóm ?",
        icon: "warning",
        confirmButtonColor: "#3699FF",
        cancelButtonText: "Đóng",
        showLoaderOnConfirm: true,
      });
      return;
    }
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
          type="button"
          className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
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
                  <div className="dd-item" key={index}>
                    <NavLink
                      to={`/bai-giang/${item.ID}`}
                      className={(links) => (links.isActive ? "active" : "")}
                      key={index}
                    >
                      <div className="dd-handle font-weight-500">
                        <span className="label h-bg-navy-blue">
                          <i className="fal fa-layer-group"></i>
                        </span>
                        {item.Title}
                      </div>
                    </NavLink>
                    <div className="position-absolute top-9px right-9px">
                      <button
                        type="button"
                        className="btn btn-sm btn-success w-24px h-24px"
                        onClick={() =>
                          openModal({
                            Type: item.ID,
                          })
                        }
                      >
                        <i className="fal fa-plus pe-0 icon-sm"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary ms-2 w-24px h-24px"
                        onClick={() => onOpenModal(item)}
                      >
                        <i className="fas fa-pen icon-sm pe-0"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2 w-24px h-24px"
                        onClick={() => onDelete(item)}
                      >
                        <i className="fas fa-trash icon-sm pe-0"></i>
                      </button>
                    </div>
                  </div>
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
