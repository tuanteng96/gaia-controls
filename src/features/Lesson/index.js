import React, { useEffect, useRef, useState } from "react";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import ModalLesson from "./components/Modal/ModalLesson";
import Sidebar from "./components/Sidebar/Sidebar";
import LessonCrud from "./_redux/LessonCrud";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { toAbsoluteUrl } from "../../helpers/AssetsHelpers";
import { useParams } from "react-router-dom";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function Lesson(props) {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    Type: 662,
    _pi: 1,
    _ps: 10,
    _key: "",
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

  const typingTimeoutRef = useRef(null);

  const retrieveLesson = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    LessonCrud.getListLesson(params)
      .then(({ list, total, error, right }) => {
        if (error && right) {
          Swal.fire({
            icon: "error",
            title: "Bạn không có quyền.",
            text: "Vui lòng xin cấp quyền để truy cập !",
            confirmButtonColor: "#3699FF",
            allowOutsideClick: false,
          }).then(() => {
            window.location.href = "/";
          });
        } else {
          setListLesson(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
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

  const onChangeSearch = (value) => {
    setLoading(true);
    setListLesson([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        setFilters({ ...filters, _Pi: 1, _key: value, Type: 662 });
      } else {
        setFilters({ ...filters, _Pi: 1, _key: value, Type: id });
      }
    }, 500);
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
                type="button"
                className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                onClick={() => onOpenModal()}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <div className="max-w-450px mb-4 position-relative">
                <input
                  type="text"
                  className="form-control pr-50px"
                  placeholder="Nhập tên bài giảng ..."
                  onChange={(e) => onChangeSearch(e.target.value)}
                />
                <div className="position-absolute top-12px right-15px pointer-events-none">
                  <i className="far fa-search"></i>
                </div>
              </div>
              <BaseTablesCustom
                data={ListLesson}
                textDataNull="Không có dữ liệu."
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
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên" },
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "DynamicID",
                    text: "Mã",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Mã" },
                    headerStyle: () => {
                      return { minWidth: "100%", width: "85px" };
                    },
                  },
                  {
                    dataField: "Version",
                    text: "Version",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Version" },
                    formatter: (cell, row) => <div>{row.Version}</div>,
                  },
                  {
                    dataField: "LinkOnline",
                    text: "LinkOnline",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "LinkOnline" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        {row.LinkOnline && (
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                {row.LinkOnline}
                              </Tooltip>
                            }
                          >
                            <a
                              href={toAbsoluteUrl(`/${row.LinkOnline}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-block white-space-pw"
                            >
                              <i className="fas fa-link icon-md"></i>
                            </a>
                          </OverlayTrigger>
                        )}
                      </div>
                    ),
                  },
                  {
                    dataField: "GiaoAnPdf",
                    text: "Giáo án",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Giáo án" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        {row.GiaoAnPdf && (
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                {row.GiaoAnPdf}
                              </Tooltip>
                            }
                          >
                            <a
                              href={toAbsoluteUrl(
                                `/upload/image/${row.GiaoAnPdf}`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-block white-space-pw"
                            >
                              <i className="fas fa-file-pdf icon-md"></i>
                            </a>
                          </OverlayTrigger>
                        )}
                      </div>
                    ),
                  },
                  {
                    dataField: "FileMaHoa",
                    text: "File Mã hóa",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "File Mã hóa" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        {row.FileMaHoa && (
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                {row.FileMaHoa}
                              </Tooltip>
                            }
                          >
                            <a
                              href={toAbsoluteUrl(`/${row.FileMaHoa}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-block white-space-pw"
                            >
                              <i className="fas fa-file-alt icon-md"></i>
                            </a>
                          </OverlayTrigger>
                        )}
                      </div>
                    ),
                  },
                  {
                    dataField: "Thumbnail",
                    text: "Hình ảnh",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Hình ảnh" },
                    formatter: (cell, row) => (
                      <div className="w-100px">
                        <a
                          href={toAbsoluteUrl(`/upload/image/${row.Thumbnail}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block text-center"
                        >
                          <img
                            className="max-w-100"
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
