import React, { useEffect, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TeacherCrud from "./_redux/TeacherCrud";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import FiltersTeacher from "./components/Filters/FiltersTeacher";
import ModalTeacher from "./components/Modal/ModalTeacher";

function Teacher(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    _orders: {
      Id: true,
    },
    _appends: {
      IsSchoolTeacher: 1
    },
  });
  const [ListTeacher, setListTeacher] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [VisibleModal, setVisibleModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const retrieveTeacher = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    TeacherCrud.getAllTeacher(params)
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
          setListTeacher(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    retrieveTeacher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const openModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(true);
  };

  const hideModal = (item = {}) => {
    setDefaultValues({});
    setVisibleModal(false);
  };

  const onFilters = (values) => {
    const newObj = {
      _pi: 1,
      _key: values._key,
    };
    newObj.SchoolID = values.SchoolID ? values.SchoolID.value : "";
    newObj.Status = values.Status ? values.Status.value : "";
    setFilters((prevState) => ({ ...prevState, ...newObj }));
  };

  const onAddEdit = (values) => {
    const objPost = {
      ...values,
      SchoolID: values.SchoolID.ID,
      SchoolTitle: values.SchoolTitle.Title,
      Status: values.Status.value || 1
    };

    setBtnLoading(true);
    TeacherCrud.addEditTeacher(objPost)
      .then((response) => {
        retrieveTeacher(() => {
          hideModal();
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
      title: "Bạn muốn xóa giáo viên ?",
      text: "Bạn có chắc chắn muốn xóa giáo viên này không ?",
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
          TeacherCrud.deleteTeacher(dataPost)
            .then(() => {
              retrieveTeacher(() => {
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
        toast.success("Xóa giáo viên thành công !", {
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
              Quản lý giáo viên
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách giáo viên
              <button
                type="button"
                className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                onClick={openModal}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <FiltersTeacher onSubmit={onFilters} loading={loading} />
              <BaseTablesCustom
                data={ListTeacher}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListTeacher([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListTeacher([]);
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
                    dataField: "FullName",
                    text: "Tên giáo viên",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên trường" },
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "Phone",
                    text: "Số điện thoại",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Số điện thoại" },
                    formatter: (cell, row) => (
                      <div>
                        <div>{row.Phone}</div>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "Email",
                    text: "Email",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Email" },
                    formatter: (cell, row) => <div>{row.Email}</div>,
                    headerStyle: () => {
                      return { minWidth: "100px", width: "100px" };
                    },
                  },
                  {
                    dataField: "SchoolTitle",
                    text: "Trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Trường" },
                    formatter: (cell, row) => (
                      <div>
                        <div>{row.SchoolTitle}</div>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "UserName",
                    text: "User",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "User" },
                    formatter: (cell, row) => <div>{row.UserName}</div>,
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
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
                            onClick={() => openModal(row)}
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
                      return { minWidth: "85px", width: "85px" };
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
        <ModalTeacher
          defaultValues={defaultValues}
          show={VisibleModal}
          onHide={hideModal}
          onAddEdit={onAddEdit}
          btnLoading={btnLoading}
        />
      </div>
    </div>
  );
}

export default Teacher;
