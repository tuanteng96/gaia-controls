import React, { useEffect, useRef, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalAddEdit from "./components/Modal/ModalAddEdit";
import ToolsEmExCrud from "./_redux/ToolsEmExCrud";
import { AlertError } from "../../helpers/AlertHelpers";
import { getRequestParams } from "../../helpers/ParamsHelpers";

function ToolsEmEx(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
  });
  const [ListToolsEx, setListToolsEx] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const typingTimeoutRef = useRef(null);

  const retrieveToolsEmEx = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    ToolsEmExCrud.getAll(params)
      .then(({ list, total, error, right }) => {
        if (error && right) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Bạn không có quyền truy cập chức năng này.",
            error: error,
          });
        } else {
          setListToolsEx(list);
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
    retrieveToolsEmEx();
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
      TeacherID: values.TeacherID ? values.TeacherID.value : "",
      TeacherTitle: values.TeacherID ? values.TeacherID.label : "",
      Items:
        values.Items && values.Items.length > 0
          ? values.Items.filter((item) => item.TeachingItemID && item.Qty).map(
              (item) => ({
                ...item,
                TeachingItemID: item.TeachingItemID.value || "",
              })
            )
          : [],
    };
    ToolsEmExCrud.addEdit(objPost)
      .then(() => {
        retrieveToolsEmEx(() => {
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
      title: "Bạn muốn xóa ?",
      text: "Bạn có chắc chắn muốn đơn này này không ?",
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
          ToolsEmExCrud.onDelete(dataPost)
            .then(() => {
              retrieveToolsEmEx(() => {
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
        toast.success("Xóa thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    setListToolsEx([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        setFilters({ ...filters, _Pi: 1, _key: value });
      } else {
        setFilters({ ...filters, _Pi: 1, _key: value });
      }
    }, 500);
  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Nhập xuất giáo cụ
            </h2>
            <div>
              <button
                className="btn btn-outline-primary"
                onClick={() => onOpenModal({ IsOut: false })}
              >
                <i className="fal fa-arrow-from-right"></i>
                Nhập giáo cụ
              </button>
              <button
                className="btn btn-outline-danger ml-10px"
                onClick={() => onOpenModal({ IsOut: true })}
              >
                <i className="fal fa-arrow-from-left"></i>
                Xuất giáo cụ
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách nhập xuất giáo cụ
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
                data={ListToolsEx}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListToolsEx([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListToolsEx([]);
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
                    text: "Tên",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên" },
                    headerStyle: () => {
                      return { minWidth: "350px" };
                    },
                  },
                  {
                    dataField: "Code",
                    text: "Mã",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Mã" },
                    formatter: (cell, row) => <div>{row.Code}</div>,
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "TeacherTitle",
                    text: "Giáo viên",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Giáo viên" },
                    headerStyle: () => {
                      return { minWidth: "300px", width: "300px" };
                    },
                  },
                  {
                    dataField: "Items",
                    text: "Giáo cụ",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Giáo cụ" },
                    formatter: (cell, row) => (
                      <div>
                        {row.Items && row.Items.length > 0
                          ? row.Items.map((item, index) => (
                              <span>
                                {item.TeachingItemTitle} ({item.Qty})
                                {row.Items.length - 1 !== index && " , "}
                              </span>
                            ))
                          : "Không có giáo cụ"}
                      </div>
                    ),
                  },
                  {
                    dataField: "IsOut",
                    text: "Loại",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Mã" },
                    formatter: (cell, row) => (
                      <div>
                        <label
                          className={`label label-${
                            row.IsOut ? "danger" : "success"
                          }`}
                        >
                          Đơn {row.IsOut ? "xuất" : "nhập"}
                        </label>
                      </div>
                    ),
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
      <ModalAddEdit
        show={ModalAdd}
        onHide={onHideModal}
        defaultValues={defaultValues}
        onAddEdit={onAddEdit}
        btnLoading={btnLoading}
      />
    </div>
  );
}

export default ToolsEmEx;
