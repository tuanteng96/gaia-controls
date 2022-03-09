import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { fetchCateList } from "../../_redux/LessonSlice";
import ModalCategories from "../Modal/ModalCategories";
// import PropTypes from 'prop-types';

// Sidebar.propTypes = {

// };

function Sidebar(props) {
  const [isModal, setIsModal] = useState(false);

  const { listCate, loading } = useSelector(({ lesson }) => ({
    listCate: lesson.listCate,
    loading: lesson.loading,
  }));
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCateList({ ParentID: 794 }))
      .unwrap()
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
      });
  }, [dispatch]);

  const onOpenModal = () => {
    setIsModal(true);
  };

  const onHideModal = () => {
    setIsModal(false);
  };

  const onDelete = () => {
    Swal.fire({
      title: "Bạn muốn xóa nhóm ?",
      text: "Bạn có chắc chắn muốn xóa nhóm này không ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Đúng, Tôi muốn xóa!",
      cancelButtonText: "Đóng",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 3000);
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
        <div className="dd tree">
          <div className="dd-list">
            {Array(6)
              .fill()
              .map((item, index) => (
                <div className="dd-item" key={index}>
                  <div className="dd-handle font-weight-500">
                    <span className="label h-bg-navy-blue">
                      <i className="fal fa-layer-group"></i>
                    </span>
                    Mỹ phẩm {index + 1}
                    <div className="position-absolute top-9px right-9px">
                      <button className="btn btn-sm btn-success">
                        <i className="fal fa-plus pe-0 icon-sm"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-primary ms-2"
                        onClick={onOpenModal}
                      >
                        <i className="fas fa-pen icon-sm pe-0"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => onDelete()}
                      >
                        <i className="fas fa-trash icon-sm pe-0"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ModalCategories show={isModal} onHide={onHideModal} />
    </div>
  );
}

export default Sidebar;
