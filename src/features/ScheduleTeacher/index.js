import React, { useEffect, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import Swal from "sweetalert2";
import { AlertError } from "../../helpers/AlertHelpers";
import FiltersSchedule from "../ScheduleClass/components/Filters/FiltersSchedule";

import moment from "moment";
import "moment/locale/vi";
import ModalClassDays from "./components/Modal/ModalClassDays";
import ScheduleClassCrud from "../ScheduleClass/_redux/ScheduleClassCrud";

moment.locale("vi");

function ScheduleTeacher(props) {
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

  const retrieveSchedule = (newLoading = false, callback) => {
    !newLoading && !loading && setLoading(true);
    const params = getRequestParams({
      ...filters,
      query: "&xep-lich-giao-vien=1",
    });
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
      .catch(({ response }) => {
        AlertError({
          title: "Xảy ra lỗi",
          errorTitle: "Không thể xếp lịch cho giáo viên này.",
          error: response.error,
        });
      });
  };

  useEffect(() => {
    retrieveSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (defaultValues && defaultValues.ID) {
      const index =
        ListSchedule &&
        ListSchedule.findIndex((item) => item.ID === defaultValues.ID);
      if (index > -1) {
        setDefaultValues(ListSchedule[index]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ListSchedule]);

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

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Xếp lịch giáo viên
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">Danh sách trường</div>
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
      <ModalClassDays
        show={VisibleModal}
        onHide={hideModal}
        defaultValues={defaultValues}
        retrieveSchedule={retrieveSchedule}
      />
    </div>
  );
}

export default ScheduleTeacher;
