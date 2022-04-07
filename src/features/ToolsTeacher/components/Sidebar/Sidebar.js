import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { fetchCateList } from "../../_redux/ToolsTeacherSlice";
import ToolsTeacherCrud from "../../_redux/ToolsTeacherCrud";
import ModalCategories from "../Modal/ModalCategories";

Sidebar.propTypes = {
  openModal: PropTypes.func,
};

function Sidebar({ openModal }) {
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const { listCate, loading } = useSelector(({ toolTeacher }) => ({
    listCate: toolTeacher.listCate,
    loading: toolTeacher.loading,
  }));
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchCateList({
        _key: "",
      })
    )
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
        ...values
    };
    ToolsTeacherCrud.addEditCate(dataPost)
      .then((response) => {
        dispatch(fetchCateList({ _key: "" }))
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
    // if (item.TypeItemCount > 0) {
    //   Swal.fire({
    //     title: `Không thể xóa nhóm ${item.Title} ?`,
    //     text:
    //       "Bạn cần xóa hết danh sách bài giảng để có thể thực hiện xóa nhóm ?",
    //     icon: "warning",
    //     confirmButtonColor: "#3699FF",
    //     cancelButtonText: "Đóng",
    //     showLoaderOnConfirm: true,
    //   });
    //   return;
    // }
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
          ToolsTeacherCrud.deleteCate(dataPost)
            .then((response) => {
              dispatch(fetchCateList({ _key: "" }))
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
        Nhóm giáo cụ
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
                      to={`/giao-cu/${item.ID}`}
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
                <div>Chưa có nhóm giáo cụ</div>
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
