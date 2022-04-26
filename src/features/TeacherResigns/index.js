import React, { useEffect, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import Swal from "sweetalert2";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import TeacherResignsCrud from "./_redux/TeacherResignsCrud";
import { toast } from "react-toastify";

import moment from "moment";
import "moment/dist/locale/vi";
moment.locale("vi");

function TeacherResigns(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    _orders: {
      Id: true,
    },
  });
  const [ListTeacher, setListTeacher] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const retrieveTeacher = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    TeacherResignsCrud.getAllTeacher(params)
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

  const onFinish = (item, status) => {
    Swal.fire({
      input: "textarea",
      inputLabel: "Ghi chú",
      inputPlaceholder: "Nhập ghi chú...",
      inputAttributes: {
        "aria-label": "Nhập ghi chú",
      },
      confirmButtonText: status === "DUYET" ? "Duyệt" : "Từ chối",
      cancelButtonText: "Đóng",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        confirmButton:
          status === "DUYET"
            ? "btn btn-success my-0 mx-1"
            : "btn btn-danger my-0 mx-1",
        cancelButton: "btn btn-secondary my-0 mx-1",
      },
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const desc = document.getElementById("swal2-input").value;
            const obj = {
              ConfirmDesc: desc,
              ConfirmStatus: status,
              ID: item.ID,
            };
            TeacherResignsCrud.onFinish(obj)
              .then((response) => {
                retrieveTeacher(() => {
                  resolve();
                });
              })
              .catch((error) => console.log(error));
          }, 200);
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(
          status === "DUYET" ? "Duyệt thành công !" : "Từ chối thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          }
        );
      }
    });
  };
  console.log(ListTeacher);
  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Giáo viên xin nghỉ
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách giáo viên xin nghỉ
            </div>
            <div className="panel-body overflow-visible">
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
                    dataField: "TeacherName",
                    text: "Tên giáo viên",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên giáo viên" },
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "Type",
                    text: "Loại",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Loại" },
                    formatter: (cell, row) =>
                      row.Type === "NGHI_PHEP" ? "Nghỉ phép" : "Nghỉ thường",
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "Desc",
                    text: "Ghi chú",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Ghi chú" },
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "TimeType",
                    text: "Ngày xin nghỉ",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Ngày xin nghỉ" },
                    formatter: (cell, row) => (
                      <div>
                        {row.TimeType === "NGHI_SANG" && (
                          <span>
                            Sáng
                            <span className="text-capitalize px-1">
                              {moment(row.From).format("dddd")},
                            </span>
                            Ngày {moment(row.From).format("DD.MM.YYYY")}
                          </span>
                        )}
                        {row.TimeType === "NGHI_CHIEU" && (
                          <span>
                            Chiều
                            <span className="text-capitalize px-1">
                              {moment(row.From).format("dddd")},
                            </span>
                            Ngày {moment(row.From).format("DD-MM-YYYY")}
                          </span>
                        )}
                        {row.TimeType === "NGHI_NGAY" && (
                          <span>
                            Ngày {moment(row.From).format("DD-MM-YYYY")}
                          </span>
                        )}
                        {row.TimeType === "NGHI_NHIEU_NGAY" && (
                          <span>
                            Từ
                            <span className="text-capitalize px-1">
                              {moment(row.From).format("HH:mm DD-MM-YYYY")}
                            </span>
                            đến
                            <span className="text-capitalize pl-1">
                              {moment(row.To).format("HH:mm DD-MM-YYYY")}
                            </span>
                          </span>
                        )}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Status",
                    text: "Trạng thái",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Trạng thái" },
                    formatter: (cell, row) => (
                      <div>
                        <label
                          className={`label label-${
                            !row.ConfirmUserID && !row.ConfirmStatus
                              ? "warning"
                              : ""
                          }${
                            row.ConfirmUserID && row.ConfirmStatus === "DUYET"
                              ? "success"
                              : ""
                          }${
                            row.ConfirmUserID && row.ConfirmStatus === "TU_CHOI"
                              ? "danger"
                              : ""
                          }`}
                        >
                          {!row.ConfirmUserID &&
                            !row.ConfirmStatus &&
                            "Đang chờ duyệt"}
                          {row.ConfirmUserID &&
                            row.ConfirmStatus === "DUYET" &&
                            "Đã duyệt"}
                          {row.ConfirmUserID &&
                            row.ConfirmStatus === "TU_CHOI" &&
                            "Đã từ chối"}
                        </label>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
                    },
                  },
                  {
                    dataField: "#",
                    text: "#",
                    formatter: (cell, row) => {
                      return !row.ConfirmUserID && !row.ConfirmStatus ? (
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary h-24px w-60px"
                            onClick={() => onFinish(row, "DUYET")}
                          >
                            Duyệt
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger h-24px w-60px ms-2"
                            onClick={() => onFinish(row, "TU_CHOI")}
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">Đã thực hiện</div>
                      );
                    },
                    headerAlign: "center",
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
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
    </div>
  );
}

export default TeacherResigns;
