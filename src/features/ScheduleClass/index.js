import React, { useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import FiltersSchedule from "./components/Filters/FiltersSchedule";
import ModalScheduleClass from "./components/Modal/ModalScheduleClass";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function ScheduleClass(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    Status: 1,
    _orders: {},
    _ignoredf: ["Status"],
  });
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ListShedule, setListShedule] = useState([]);
  const [VisibleModal, setVisibleModal] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const openModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(true);
  };
  const hideModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(false);
  };

  const onAddEdit = (values) => {
    //setBtnLoading(true);
    const newObj = {
      ...values,
      From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
      To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
      CalendarList: values.CalendarList.map((item) => ({
        ...item,
        Days: item.Days.map((day) => ({
          ...day,
          Items: day.Items
            ? [
                {
                  Title: day.Items.Title,
                  From: day.Items.From,
                  To: day.Items.To,
                },
              ]
            : [],
        })),
      })),
    };

    delete newObj.HourScheduleList;

    console.log(newObj);

  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Xếp lịch trường
            </h2>
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
              <FiltersSchedule />
              <BaseTablesCustom
                data={ListShedule}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListShedule([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListShedule([]);
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
                    text: "Tên Trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên trường" },
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Cấp",
                    text: "Cấp",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Số điện thoại" },
                    formatter: (cell, row) => (
                      <div>
                        {row.Levels ? `Cấp ${row.Levels}` : "Chưa chọn cấp"}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "100px", width: "100px" };
                    },
                  },
                  {
                    dataField: "SchoolList",
                    text: "Trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Trường" },
                    formatter: (cell, row) => (
                      <div>
                        {row.SchoolList && row.SchoolList.length > 0
                          ? row.SchoolList.map((item) => item.Title).join(", ")
                          : "Chưa có trường"}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Desc",
                    text: "Mô tả",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Mô tả" },
                    formatter: (cell, row) => (
                      <div>{row.Desc ? row.Desc : "Chưa có mô tả"}</div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
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
                            //onClick={() => onDelete(row)}
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
      />
    </div>
  );
}

export default ScheduleClass;
