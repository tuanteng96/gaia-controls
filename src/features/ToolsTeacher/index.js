import React, { useEffect, useRef, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import ToolsTeacherCrud from "./_redux/ToolsTeacherCrud";
import { toAbsoluteUrl } from "../../helpers/AssetsHelpers";
import Sidebar from "./components/Sidebar/Sidebar";
import ModalTools from "./components/Modal/ModalTools";
import { AlertError } from "../../helpers/AlertHelpers";

ToolsTeacher.propTypes = {};

function ToolsTeacher(props) {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    Type: 0,
    _pi: 1,
    _ps: 10,
    _key: "",
  });
  const [ListTools, setListTools] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [ModalAdd, setModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const typingTimeoutRef = useRef(null);

  const retrieveTools = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    ToolsTeacherCrud.getAllTools(params)
      .then(({ list, total, error, right }) => {
        if (error && right) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Bạn không có quyền truy cập chức năng này.",
            error: error,
          });
        } else {
          setListTools(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch(({ response }) => {
        AlertError({
          title: "Xảy ra lỗi",
          errorTitle: "Không thể truy cập chức năng này.",
          error: response.data.error,
        });
      });
  };

  useEffect(() => {
    if (id) {
      setFilters((prevState) => ({ ...prevState, Type: id }));
    }
  }, [id]);

  useEffect(() => {
    retrieveTools();
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
      Type: values.Type ? values.Type.value : "",
      TypeName: values.Type ? values.Type.label : "",
    };
    ToolsTeacherCrud.addEditTools(objPost)
      .then(() => {
        retrieveTools(() => {
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
          ToolsTeacherCrud.deleteTools(dataPost)
            .then(() => {
              retrieveTools(() => {
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
        toast.success("Xóa giáo cụ thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    setListTools([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        setFilters({ ...filters, _Pi: 1, _key: value, Type: 0 });
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
            <h2 className="text-uppercase font-size-h3 mb-0">Quản lý giáo cụ</h2>
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
              Danh sách giáo cụ
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
                  placeholder="Nhập tên giáo cụ ..."
                  onChange={(e) => onChangeSearch(e.target.value)}
                />
                <div className="position-absolute top-12px right-15px pointer-events-none">
                  <i className="far fa-search"></i>
                </div>
              </div>
              <BaseTablesCustom
                data={ListTools}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListTools([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListTools([]);
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
                    text: "Tên giáo cụ",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên" },
                    headerStyle: () => {
                      return { minWidth: "350px", width: "350px" };
                    },
                  },
                  {
                    dataField: "Type",
                    text: "Danh mục",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Danh mục" },
                    formatter: (cell, row) => <div>{row.TypeName}</div>,
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
      </div>
      <ModalTools
        show={ModalAdd}
        onHide={onHideModal}
        defaultValues={defaultValues}
        onAddEdit={onAddEdit}
        btnLoading={btnLoading}
      />
    </div>
  );
}

export default ToolsTeacher;
