import React, { useEffect, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import FiltersSchedule from "./components/Filters/FiltersSchedule";
import ModalScheduleClass from "./components/Modal/ModalScheduleClass";
import { toast } from "react-toastify";
import ScheduleClassCrud from "./_redux/ScheduleClassCrud";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import Swal from "sweetalert2";
import { AlertError } from "../../helpers/AlertHelpers";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function ScheduleClass(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    From$date_from: "",
    To$date_to: "",
  });
  const [ListSchedule, setListSchedule] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [VisibleModal, setVisibleModal] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const retrieveSchedule = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    ScheduleClassCrud.getAll(params)
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
          setListSchedule(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    retrieveSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onFilters = ({ From, To, SchoolID }) => {
    setLoading(true);
    setFilters((prevState) => ({
      ...prevState,
      From$date_from: From ? moment(From).format("MM-DD-YYYY") : "",
      To$date_to: To ? moment(To).format("MM-DD-YYYY") : "",
      SchoolID: SchoolID ? SchoolID.ID : "",
    }));
  };

  const openModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(true);
  };
  const hideModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(false);
  };

  const onAddEdit = (values) => {
    setBtnLoading(true);
    const newObj = {
      ...values,
      From: values.From ? moment(values.From).format("MM-DD-YYYY HH:mm") : "",
      To: values.To ? moment(values.To).format("MM-DD-YYYY HH:mm") : "",
      CalendarList: values.CalendarList.map((item) => ({
        ...item,
        Days: item.Days.map((day) => ({
          ...day,
          Items: day.Items
            ? day.Items.map((os) => ({
                Title: os.Title,
                From: os.From,
                To: os.To,
              }))
            : [],
        })),
      })),
    };

    delete newObj.HourScheduleList;
    ScheduleClassCrud.addEdit(newObj)
      .then((response) => {
        if (response.error) {
          setBtnLoading(false);
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle:
              "Không thể thêm mới xếp lịch cho trường. Vui lòng kiểm tra lại.",
            error: response.error,
          });
        } else {
          retrieveSchedule(() => {
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
        }
      })
      .catch(({ response }) => {
        setBtnLoading(false);
        AlertError({
          title: "Xảy ra lỗi",
          errorTitle:
            "Không thể thêm mới xếp lịch cho trường. Vui lòng kiểm tra lại.",
          error: response.data.error,
        });
      });
  };

  const onDelete = (item) => {
    if (!item.ID) return;
    const dataPost = {
      deleteId: item.ID,
    };
    Swal.fire({
      title: "Bạn muốn xóa xếp lịch này ?",
      text: "Bạn có chắc chắn muốn xóa xếp lịc trường này không ?",
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
          ScheduleClassCrud.Delete(dataPost)
            .then(() => {
              retrieveSchedule(() => {
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
              Xếp lịch trường
            </h2>
            <div className="btn btn-md btn-primary t_dong_xep_lich" id="0">
              Tự động xếp lịch
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách lịch học theo trường
              <button
                type="button"
                className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                onClick={openModal}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <FiltersSchedule onSubmit={onFilters} loading={loading} />
              <BaseTablesCustom
                data={ListSchedule}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListSchedule([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListSchedule([]);
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
                    dataField: "SchoolTitle",
                    text: "Tên Trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    formatter: (cell, row, rowIndex) => (
                      <div>{row.SchoolTitle}</div>
                    ),
                    attrs: { "data-title": "Tên trường" },
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "From",
                    text: "Thời gian bắt đầu",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Thời gian bắt đầu" },
                    formatter: (cell, row) => (
                      <div>
                        {row.From
                          ? moment(row.From).format("DD-MM-YYYY")
                          : "Không giới hạn"}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
                    },
                  },
                  {
                    dataField: "To",
                    text: "Thời gian kết thúc",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Thời gian kết thúc" },
                    formatter: (cell, row) => (
                      <div>
                        {row.To
                          ? moment(row.To).format("DD-MM-YYYY")
                          : "Không giới hạn"}
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
                      return (
                        <div className="text-center d-flex justify-content-center">
                          <div
                            className="btn-info text-white me-2 px-2 h-24px d-inline-block rounded cursor-pointer font-size-sm line-height-xxl t_dong_xep_lich"
                            id={row.ID}
                          >
                            Tự động xếp lịch
                          </div>
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
      </div>
      <ModalScheduleClass
        show={VisibleModal}
        onHide={hideModal}
        onAddEdit={onAddEdit}
        btnLoading={btnLoading}
        defaultValues={defaultValues}
      />
    </div>
  );
}

export default ScheduleClass;
