import React, { useEffect, useState } from "react";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import ModalLesson from "./components/Modal/ModalLesson";
import Sidebar from "./components/Sidebar/Sidebar";
import LessonCrud from "./_redux/LessonCrud";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { toAbsoluteUrl } from "../../helpers/AssetsHelpers";
import { useParams } from "react-router-dom";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";

const getRequestParams = (filters) => {
  let params = {};
  if (filters.Type) {
    params.Type = Number(filters.Type);
  }
  if (filters._pi) {
    params._pi = filters._pi;
  }
  if (filters._ps) {
    params._ps = filters._ps;
  }
  if (filters._orders) {
    params._orders = filters._orders;
  }
  return params;
};

function Lesson(props) {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    Type: 662,
    _pi: 1,
    _ps: 10,
    _orders: {
      RenewDate: true,
    },
  });
  const [ListLesson, setListLesson] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [ModalAdd, setModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const retrieveLesson = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    LessonCrud.getListLesson(params)
      .then(({ list, pi, ps, total }) => {
        setListLesson(list);
        setPageTotal(total);
        setLoading(false);
        callback && callback();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (id) {
      setFilters((prevState) => ({ ...prevState, Type: id }));
    }
  }, [id]);

  useEffect(() => {
    retrieveLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onOpenModal = (item = {}) => {
    setDefaultValues(item);
    setModalAdd(true);
  };

  const onHideModal = () => {
    setDefaultValues({});
    setModalAdd(false);
  };

  const onAddEdit = (values) => {
    setBtnLoading(true);
    const objPost = {
      ...values,
      FileMaHoa: values.FileMaHoa ? values.FileMaHoa.value : "",
      LinkOnline: values.LinkOnline ? values.LinkOnline.value : "",
      Type: values.Type ? values.Type.value : "",
    };
    LessonCrud.addEditLesson(objPost)
      .then(() => {
        retrieveLesson(() => {
          onHideModal();
          setBtnLoading(false);
          toast.success(
            values.ID ? "Cập nhập thành công !" : "Thêm mới thành công",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            }
          );
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
      title: "Bạn muốn xóa bài giảng ?",
      text: "Bạn có chắc chắn muốn xóa bài giảng này không ?",
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
          LessonCrud.deleteLesson(dataPost)
            .then(() => {
              retrieveLesson(() => {
                setTimeout(() => {
                  resolve();
                }, 300);
              });
            })
            .catch((error) => console.log(error));
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Xóa bài giảng thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Quản lý nhóm bài giảng / Bài giảng
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Sidebar openModal={onOpenModal} />
        </div>
        <div className="col-lg-8">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách bài giảng
              <button
                className="btn btn-sm btn-success position-absolute top-9px right-9px"
                onClick={() => onOpenModal()}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <BaseTablesCustom
                data={ListLesson}
                textDataNull="Không có bài giảng."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListLesson([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListLesson([]);
                    const Pi = page;
                    setFilters({ ...filters, _pi: Pi });
                  },
                }}
                columns={[
                  {
                    dataField: "",
                    text: "STT",
                    formatter: (cell, row, rowIndex) => {
                      const rowNumber =
                        filters._ps * (filters._pi - 1) + (rowIndex + 1);
                      return rowNumber;
                    },
                    headerStyle: () => {
                      return { width: "60px", fontWeight: "800" };
                    },
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "STT" },
                  },
                  {
                    dataField: "Title",
                    text: "Tên bài giảng",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Tên" },
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "DynamicID",
                    text: "Mã",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Mã" },
                    headerStyle: () => {
                      return { minWidth: "100%", width: "85px" };
                    },
                  },
                  {
                    dataField: "TypeName",
                    text: "Nhóm",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Nhóm" },
                  },
                  {
                    dataField: "LinkOnline",
                    text: "LinkOnline",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "LinkOnline" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        <a
                          href={toAbsoluteUrl(
                            `/upload/image/${row.LinkOnline}`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block white-space-pw"
                        >
                          {row.LinkOnline}
                        </a>
                      </div>
                    ),
                  },
                  {
                    dataField: "GiaoAnPdf",
                    text: "Giáo án",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Giáo án" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        <a
                          href={toAbsoluteUrl(`/upload/image/${row.GiaoAnPdf}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block white-space-pw"
                        >
                          {row.GiaoAnPdf}
                        </a>
                      </div>
                    ),
                  },
                  {
                    dataField: "FileMaHoa",
                    text: "File Mã hóa",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "File Mã hóa" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        <a
                          href={toAbsoluteUrl(`/upload/image/${row.FileMaHoa}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block white-space-pw"
                        >
                          {row.FileMaHoa}
                        </a>
                      </div>
                    ),
                  },
                  {
                    dataField: "Thumbnail",
                    text: "Hình ảnh",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Hình ảnh" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        <a
                          href={toAbsoluteUrl(`/upload/image/${row.Thumbnail}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          <img
                            className="w-100"
                            src={toAbsoluteUrl(
                              `/upload/image/${row.Thumbnail}`
                            )}
                            alt={row.Thumbnail}
                          />
                        </a>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "100%", width: "115px" };
                    },
                  },
                  {
                    dataField: "#",
                    text: "#",
                    formatter: (cell, row) => {
                      return (
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-24px h-24px"
                            onClick={() => onOpenModal(row)}
                          >
                            <i
                              className="fas fa-pen icon-sm pe-0"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2 w-24px h-24px"
                            onClick={() => onDelete(row)}
                          >
                            <i
                              className="fas fa-trash icon-sm pe-0"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      );
                    },
                    headerAlign: "center",
                    headerStyle: () => {
                      return { minWidth: "100%", width: "85px" };
                    },
                    attrs: { "data-action": "true" },
                  },
                ]}
                loading={loading}
                keyField="ID"
                className="table-responsive-attr"
                classes="table table-bordered"
              />
            </div>
          </div>
        </div>
        <ModalLesson
          show={ModalAdd}
          onHide={onHideModal}
          defaultValues={defaultValues}
          onAddEdit={onAddEdit}
          btnLoading={btnLoading}
        />
      </div>
    </div>
  );
}

export default Lesson;
