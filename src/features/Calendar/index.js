import React, { Fragment, useEffect, useRef, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import {
  DropdownButton,
  ButtonGroup,
  Dropdown,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import DatePicker from "react-datepicker";
import TeacherCrud from "../Teacher/_redux/TeacherCrud";
import { AsyncPaginate } from "react-select-async-paginate";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import Swal from "sweetalert2";

import moment from "moment";
import "moment/locale/vi";
import CalendarCrud from "./_redux/CalendarCrud";
moment.locale("vi");

function Calendar(props) {
  const [CurrentDate, setCurrentDate] = useState(moment());
  const [filters, setFilters] = useState({
    _key: "",
    SchoolID: 0,
    From$date_from: "",
    To$date_to: "",
    _pi: 1,
    _ps: 10,
  });
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ListCalendar, setListCalendar] = useState([]);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const now = CurrentDate ? moment(CurrentDate) : moment();
    var Start = now.clone().weekday(0);
    var End = now.clone().weekday(6);
    setFilters((prevState) => ({
      ...prevState,
      From$date_from: moment(Start).format("MM-DD-YYYY"),
      To$date_to: moment(End).format("MM-DD-YYYY"),
    }));
  }, [CurrentDate]);

  useEffect(() => {
    if (filters.From$date_from || filters.To$date_to) getListCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const GetCurrentLesson = (item) => {
    const { StartLesson, EndLesson } = item;

    const TotalMinutes = moment("11:30:00", "HH:mm:ss").diff(
      moment("07:00:00", "HH:mm:ss"),
      "minutes"
    );
    const TotalStart = moment(StartLesson, "HH:mm:ss").diff(
      moment("07:00:00", "HH:mm:ss"),
      "minutes"
    );
    const TotalEnd = moment(EndLesson, "HH:mm:ss").diff(
      moment("07:00:00", "HH:mm:ss"),
      "minutes"
    );
    const LeftStartLesson = (TotalStart / TotalMinutes) * 100;
    const LeftEndLesson = (TotalEnd / TotalMinutes) * 100;
    return {
      left: `${LeftStartLesson}%`,
      width: `${LeftEndLesson - LeftStartLesson}%`,
    };
  };

  const getListCalendar = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    CalendarCrud.getAll(params)
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
          setListCalendar(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters((prevState) => ({ ...prevState, _key: value }));
    }, 500);
  };

  const getAllTeacher = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 1,
      _orders: {
        Id: true,
      },
      _appends: {
        IsSchoolTeacher: 1,
      },
      _ignoredf: ["Status"],
    };

    const { list, pcount } = await TeacherCrud.getAllTeacher(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({
          ...item,
          label: item.FullName,
          value: item.ID,
        }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };

  console.log(ListCalendar);

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">Bảng lịch</h2>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="p-3 d-flex">
          <div className="w-400px position-relative me-3">
            <input
              name="_key"
              type="text"
              className="form-control pr-50px"
              placeholder="Nhập tên trường ..."
              autoComplete="off"
              onChange={(e) => onChangeSearch(e.target.value)}
            //value={Filters.Key}
            />
            <div className="position-absolute top-12px right-15px pointer-events-none">
              <i className="far fa-search"></i>
            </div>
          </div>
          <div className="w-300px">
            <DatePicker
              popperProps={{
                positionFixed: true,
              }}
              className="form-control"
              selected={new Date(CurrentDate)}
              onChange={(date) => setCurrentDate(date)}
              popperPlacement="bottom-end"
              //shouldCloseOnSelect={false}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
            />
          </div>
        </div>
        <div className="border-top border-left border-right text-center font-weight-bold text-uppercase h-40px d-flex justify-content-center align-items-center font-size-md">
          Lịch từ{" "}
          {filters.From$date_from &&
            moment(filters.From$date_from).format("ll")}{" "}
          - {filters.To$date_to && moment(filters.To$date_to).format("ll")}
        </div>
        <div className="d-flex position-relative">
          <div className="border border-end-0 w-300px">
            {/* Header Sidebar */}

            <div className="p-2 h-80px d-flex align-items-center justify-content-center min-w-300px border-right text-uppercase font-weight-bold">
              Trường / Lớp
            </div>
            {/* End Header Sidebar */}

            {!loading && ListCalendar && ListCalendar.length > 0 && (
              <Fragment>
                {/* Body Header Sidebar */}
                {ListCalendar.map((item, index) => (
                  <div className="d-flex border-top" key={index}>
                    <div className="flex-1 border-right d-flex align-items-center justify-content-center text-uppercase font-weight-bold p-3 py-0 text-center min-h-40px">
                      {item.SchoolTitle}
                    </div>
                    <div className="w-80px">
                      {item.CalendarList &&
                        item.CalendarList.map((classs, idx) => (
                          <div
                            key={idx}
                            className={`${item.CalendarList.length - 1 !==
                              idx &&
                              "border-bottom"} px-2 h-40px d-flex align-items-center justify-content-center`}
                          >
                            {classs.ClassTitle}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
                {/* End Body Header Sidebar */}
              </Fragment>
            )}
          </div>
          <div className="border flex-1 overflow-auto">
            {/* Header */}
            <div className="d-flex">
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 2
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 3
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 4
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 5
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 6
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 border-right min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  Thứ 7
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-225px">
                <div className="h-40px border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                  CN
                </div>
                <div className="d-flex">
                  <div className="w-50 border-right h-40px d-flex align-items-center justify-content-center">
                    Sáng
                  </div>
                  <div className="w-50 h-40px d-flex align-items-center justify-content-center">
                    Chiều
                  </div>
                </div>
              </div>
            </div>
            {/* End Header */}
            {!loading && ListCalendar && ListCalendar.length > 0 && (
              <Fragment>
                {/* Body */}
                {ListCalendar.map((calendar, x) => (
                  <div className="d-flex flex-column border-top" style={{ width: "1575px" }} key={x}>
                    {calendar.CalendarList &&
                      calendar.CalendarList.map((classs, idx) => (
                        <div key={idx} className={`d-flex`}>
                          {classs.Days &&
                            classs.Days.map((item, o) => (
                              <div className={`d-flex min-w-225px border-right`} key={o}>
                                <div className={`flex-1 ${classs.Days !== o && "border-right"}`}>
                                  <div className="h-40px">
                                    <div
                                      className={`d-flex w-100 position-relative h-40px ${calendar
                                        .CalendarList.length -
                                        1 !==
                                        idx && "border-bottom"}`}
                                    >
                                      {item.Items && item.Items.length > 0 && item.Items.map((period, ix) => (
                                        <Fragment key={ix}>
                                          <OverlayTrigger
                                            rootClose
                                            trigger="click"
                                            key="top"
                                            placement="top"
                                            overlay={
                                              <Popover
                                                id={`popover-positioned-top}`}
                                              >
                                                <Popover.Header className="text-uppercase font-weight-bold">
                                                  <span className="pt-1 d-block">
                                                    {period.Title} ( {moment(period.From).format("HH:mm")} - {moment(period.To).format("HH:mm")} )
                                                  </span>
                                                </Popover.Header>
                                                <Popover.Body>
                                                  <label>Giáo viên</label>
                                                  <div>
                                                    <AsyncPaginate
                                                      className="select-control"
                                                      classNamePrefix="select"
                                                      isClearable={true}
                                                      name="SchoolID"
                                                      loadOptions={getAllTeacher}
                                                      placeholder="Chọn trường"
                                                      value={{
                                                        label: "Tuấn Nguyễn DZ",
                                                        value: 3779,
                                                      }}
                                                      onChange={(option) => {
                                                        console.log(option);
                                                        // setFieldValue(
                                                        //   "SchoolID",
                                                        //   option,
                                                        //   false
                                                        // );
                                                      }}
                                                      //onBlur={handleBlur}
                                                      additional={{
                                                        page: 1,
                                                      }}
                                                    />
                                                  </div>
                                                </Popover.Body>
                                              </Popover>
                                            }
                                          >
                                            <div
                                              className={`h-38px border-right bg-primary cursor-pointer position-absolute top-1px zindex-5`}
                                              style={GetCurrentLesson({
                                                StartLesson: moment(period.From).format("HH:mm:ss"),
                                                EndLesson: moment(period.To).format("HH:mm:ss"),
                                              })}
                                            ></div>
                                          </OverlayTrigger>
                                        </Fragment>
                                      ))}

                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="h-40px">
                                    <div
                                      className={`d-flex w-100 position-relative h-40px ${calendar
                                        .CalendarList.length -
                                        1 !==
                                        idx && "border-bottom"}`}
                                    >
                                      {item.Items && item.Items.length > 0 && item.Items.map((period, ix) => (
                                        <Fragment key={ix}>
                                          <OverlayTrigger
                                            rootClose
                                            trigger="click"
                                            key="top"
                                            placement="top"
                                            overlay={
                                              <Popover
                                                id={`popover-positioned-top}`}
                                              >
                                                <Popover.Header className="text-uppercase font-weight-bold">
                                                  <span className="pt-1 d-block">
                                                  {period.Title} ( {moment(period.From).format("HH:mm")} - {moment(period.To).format("HH:mm")} )
                                                  </span>
                                                </Popover.Header>
                                                <Popover.Body>
                                                  <label>Giáo viên</label>
                                                  <div>
                                                    <AsyncPaginate
                                                      className="select-control"
                                                      classNamePrefix="select"
                                                      isClearable={true}
                                                      name="SchoolID"
                                                      loadOptions={getAllTeacher}
                                                      placeholder="Chọn trường"
                                                      value={{
                                                        label: "Tuấn Nguyễn DZ",
                                                        value: 3779,
                                                      }}
                                                      onChange={(option) => {
                                                        console.log(option);
                                                        // setFieldValue(
                                                        //   "SchoolID",
                                                        //   option,
                                                        //   false
                                                        // );
                                                      }}
                                                      //onBlur={handleBlur}
                                                      additional={{
                                                        page: 1,
                                                      }}
                                                    />
                                                  </div>
                                                </Popover.Body>
                                              </Popover>
                                            }
                                          >
                                            <div
                                              className={`h-38px border-right bg-primary cursor-pointer position-absolute top-1px zindex-5`}
                                              style={GetCurrentLesson({
                                                StartLesson: moment(period.From).format("HH:mm:ss"),
                                                EndLesson: moment(period.To).format("HH:mm:ss"),
                                              })}
                                            ></div>
                                          </OverlayTrigger>
                                        </Fragment>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
                {/* End Body */}
              </Fragment>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center p-3 border border-top-0">
            Đang tải ...
          </div>
        ) : (
          ListCalendar &&
          ListCalendar.length === 0 && (
            <div className="text-center p-3 border border-top-0">
              Không có dữ liệu
            </div>
          )
        )}

        <div className="d-flex justify-content-between">
          <Pagination
            className="my-3"
            count={PageTotal}
            page={1}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => {
              console.log(value);
            }}
          />
          <div className="d-flex align-items-center">
            Hiển thị
            <DropdownButton
              as={ButtonGroup}
              key="secondary"
              id={`dropdown-variants-Secondary`}
              variant=" font-weight-boldest"
              title={5}
            >
              {Array(5)
                .fill()
                .map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={index}
                    //active={}
                    onClick={() => console.log("Click")}
                  >
                    {index}
                  </Dropdown.Item>
                ))}
            </DropdownButton>
            trên trang
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
