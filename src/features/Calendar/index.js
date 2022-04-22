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
import { AlertError } from "../../helpers/AlertHelpers";
import SpinnerMessage from "../../components/spinners/SpinnerMessage";
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
  const [PageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ListCalendar, setListCalendar] = useState([]);
  const [SpinnerShow, setSpinnerShow] = useState(false);
  const [StartEndHour, setStartEndHour] = useState(null);

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
    if (!StartEndHour) return;
    var TimeDayStart = StartEndHour.HourMin;
    var TimeDayEnd = StartEndHour.HourMax;
    const { StartLesson, EndLesson, HourScheduleList, Session } = item;
    var TotalMinutes, TotalPeriod, TotalStart;
    if (!HourScheduleList || !HourScheduleList.length === 0) return;
    if (Session === "SANG") {
      const HourScheduleS = HourScheduleList.filter((o) => {
        const TimeS = moment(o.To, "HH:mm:ss");
        const TimeStop = moment("12:00:00", "HH:mm:ss");
        return TimeS.isBefore(TimeStop);
      });
      if (!HourScheduleS || HourScheduleS.length === 0) return;
      // Tổng Phút Sáng
      TimeDayEnd = HourScheduleS[HourScheduleS.length - 1].To;
      TotalMinutes = moment(TimeDayEnd, "HH:mm:ss").diff(
        moment(TimeDayStart, "HH:mm:ss"),
        "minutes"
      );

      // Tổng Thời gian tiết
      TotalPeriod = moment(EndLesson, "HH:mm:ss").diff(
        moment(StartLesson, "HH:mm:ss"),
        "minutes"
      );

      // Bắt Đầu
      TotalStart = moment(StartLesson, "HH:mm:ss").diff(
        moment(TimeDayStart, "HH:mm:ss"),
        "minutes"
      );
    }
    if (Session === "CHIEU") {
      
      const HourScheduleC = HourScheduleList.filter((o) => {
        const TimeS = moment(o.To, "HH:mm:ss");
        const TimeStop = moment("12:00:00", "HH:mm:ss");
        return !TimeS.isBefore(TimeStop);
      });
      
      if (!HourScheduleC || HourScheduleC.length === 0) return;

      // Tổng Phút Chiều
      TimeDayStart = HourScheduleC[0].From;
      TotalMinutes = moment(TimeDayEnd, "HH:mm:ss").diff(
        moment(TimeDayStart, "HH:mm:ss"),
        "minutes"
      );

      // Tổng Thời gian tiết
      TotalPeriod = moment(EndLesson, "HH:mm:ss").diff(
        moment(StartLesson, "HH:mm:ss"),
        "minutes"
      );

      // Bắt Đầu
      TotalStart = moment(StartLesson, "HH:mm:ss").diff(
        moment(TimeDayStart, "HH:mm:ss"),
        "minutes"
      );
    }
    const widthLesson = (TotalPeriod / TotalMinutes) * 100;
    const LeftStartLesson = (TotalStart / TotalMinutes) * 100;
    return {
      left: `${LeftStartLesson}%`,
      width: `${widthLesson}%`,
    };
  };

  const getListCalendar = (newLoading = false, callback) => {
    !newLoading && !loading && setLoading(true);
    const params = getRequestParams(filters);
    CalendarCrud.getAll(params)
      .then(({ list, pcount, error, right, more }) => {
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
          setStartEndHour(more);
          setPageCount(pcount);
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

  const onSubmitTeacher = (option, period) => {
    setSpinnerShow(true);
    const objSubmit = {
      ID: period.ID,
      UserID: option ? option.ID : 0,
      UserTitle: option ? option.FullName : "",
    };

    CalendarCrud.addTeacher(objSubmit)
      .then((response) => {
        if (response.error) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Không thể xếp lịch cho giáo viên này.",
            error: response.error,
          });
        } else {
          getListCalendar(true, () =>
            setTimeout(() => setSpinnerShow(false), 300)
          );
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

  const getAllTeacher = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 0,
      _orders: {
        Id: true,
      },
      _appends: {
        IsSchoolTeacher: 0,
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

  const getCalenderSession = (items, Session) => {
    if (Session === "SANG") {
      return items.filter((item) => {
        const TimeEnd = moment(item.To).format("HH:mm");
        const TimeS = moment(TimeEnd, "HH:mm");
        const TimeStop = moment("12:00", "HH:mm");
        return TimeS.isBefore(TimeStop);
      });
    }
    if (Session === "CHIEU") {
      return items.filter((item) => {
        const TimeEnd = moment(item.To).format("HH:mm");
        const TimeS = moment(TimeEnd, "HH:mm");
        const TimeStop = moment("12:00", "HH:mm");
        return !TimeS.isBefore(TimeStop);
      });
    }
  };

  const isClassStatus = (item) => {
    if (!item.UserID) {
      return "bg-primary h-38px";
    }
    if (item.Rejects && item.Rejects.length > 0) {
      return "bg-danger h-20px";
    }
    if (item.Teaching.Status === "") {
      return "bg-warning h-20px";
    }
    if (item.Teaching.Status === "NHAN_TIET") {
      return "bg-success h-20px";
    }
  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">Bảng lịch</h2>
          </div>
        </div>
      </div>

      <div className="bg-white px-3">
        <div className="py-3 d-flex justify-content-between">
          <div className="d-flex">
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
          <div className="d-flex">
            <div className="d-flex align-items-center">
              <div className="w-15px h-15px bg-success rounded-circle"></div>
              <div className="pl-5px font-size-sm font-weight-bold">
                Hoàn thành
              </div>
            </div>
            <div className="d-flex align-items-center ms-4">
              <div className="w-15px h-15px bg-warning rounded-circle"></div>
              <div className="pl-5px font-size-sm font-weight-bold">
                Đã chọn GV
              </div>
            </div>
            <div className="d-flex align-items-center ms-4">
              <div className="w-15px h-15px bg-danger rounded-circle"></div>
              <div className="pl-5px font-size-sm font-weight-bold">
                GV thay thế
              </div>
            </div>
            <div className="d-flex align-items-center ms-4">
              <div className="w-15px h-15px bg-primary rounded-circle"></div>
              <div className="pl-5px font-size-sm font-weight-bold">
                Chưa chọn GV
              </div>
            </div>
          </div>
        </div>
        <div className="border-top border-left border-right text-center font-weight-bold text-uppercase h-40px d-flex justify-content-center align-items-center font-size-md">
          Lịch từ{" "}
          {filters.From$date_from &&
            moment(filters.From$date_from).format("ll")}{" "}
          - {filters.To$date_to && moment(filters.To$date_to).format("ll")}
        </div>
        <div className="d-flex position-relative align-items-start">
          <div className="border border-end-0 w-200px">
            {/* Header Sidebar */}

            <div className="p-2 h-80px d-flex align-items-center justify-content-center min-w-200px border-right text-uppercase font-weight-bold">
              Trường / Lớp
            </div>
            {/* End Header Sidebar */}

            {!loading && ListCalendar && ListCalendar.length > 0 && (
              <Fragment>
                {/* Body Header Sidebar */}
                {ListCalendar.map((item, index) => (
                  <div className="d-flex border-top" key={index}>
                    <div className="flex-1 d-flex align-items-center justify-content-center text-uppercase font-weight-bold p-3 py-0 text-center min-h-40px">
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: item.CalendarList.length,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.SchoolTitle}
                      </div>
                    </div>
                    <div className="w-70px border-left">
                      {item.CalendarList &&
                        item.CalendarList.map((classs, idx) => (
                          <div
                            key={idx}
                            className={`${item.CalendarList.length - 1 !==
                              idx &&
                              "border-bottom"} px-2 h-40px d-flex align-items-center justify-content-center`}
                          >
                            <div className="text-truncate">
                              {classs.ClassTitle}
                            </div>
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 border-right min-w-200px w-200px w-100">
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
              <div className="flex-1 min-w-200px w-200px w-100">
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
                  <div
                    className="border-top"
                    style={{ minWidth: "1400px" }}
                    key={x}
                  >
                    {calendar.CalendarList &&
                      calendar.CalendarList.map((classs, idx) => (
                        <div key={idx} className={`d-flex`}>
                          {classs.Days &&
                            classs.Days.map((item, o) => (
                              <div
                                className={`d-flex min-w-200px w-200px w-100 ${classs
                                  .Days.length -
                                  1 !==
                                  o && "border-right"} flex-1`}
                                key={o}
                              >
                                <div className={`flex-1`}>
                                  <div
                                    className={`h-40px ${classs.Days !== o &&
                                      "border-right"}`}
                                  >
                                    <div
                                      className={`d-flex w-100 position-relative h-40px ${calendar
                                        .CalendarList.length -
                                        1 !==
                                        idx && "border-bottom"}`}
                                    >
                                      {item.Items &&
                                        item.Items.length > 0 &&
                                        getCalenderSession(
                                          item.Items,
                                          "SANG"
                                        ).map((period, ix) => (
                                          <Fragment key={ix}>
                                            <OverlayTrigger
                                              rootClose
                                              trigger="click"
                                              key="top"
                                              placement="top"
                                              //onToggle={(a) => console.log(a)}
                                              overlay={
                                                <Popover
                                                  id={`popover-positioned-top}`}
                                                >
                                                  <Popover.Header className="text-uppercase font-weight-bold">
                                                    <span className="pt-1 d-block">
                                                      {period.Title} ({" "}
                                                      {moment(
                                                        period.From
                                                      ).format("HH:mm")}{" "}
                                                      -{" "}
                                                      {moment(period.To).format(
                                                        "HH:mm"
                                                      )}{" "}
                                                      )
                                                      <div>
                                                        {moment(
                                                          item.Day
                                                        ).format(
                                                          "DD-MM-YYYY HH:mm"
                                                        )}
                                                      </div>
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
                                                        loadOptions={
                                                          getAllTeacher
                                                        }
                                                        placeholder="Chọn giáo viên"
                                                        value={
                                                          period.UserID
                                                            ? {
                                                                value:
                                                                  period.UserID,
                                                                label:
                                                                  period.UserTitle,
                                                              }
                                                            : null
                                                        }
                                                        onChange={(option) =>
                                                          onSubmitTeacher(
                                                            option,
                                                            period
                                                          )
                                                        }
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
                                                className={`${isClassStatus(
                                                  period
                                                )} cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center`}
                                                style={GetCurrentLesson({
                                                  StartLesson: moment(
                                                    period.From
                                                  ).format("HH:mm:ss"),
                                                  EndLesson: moment(
                                                    period.To
                                                  ).format("HH:mm:ss"),
                                                  HourScheduleList:
                                                    calendar.School
                                                      .HourScheduleList,
                                                  Session: "SANG",
                                                })}
                                              >
                                                <span className="text-white font-size-xs font-weight-border">
                                                  {period.Title.match(
                                                    /\d/g
                                                  ).join("")}
                                                </span>
                                              </div>
                                            </OverlayTrigger>
                                            {period.UserID ? (
                                              <div className="shadow h-20px w-100 position-absolute bottom-0 text-center font-size-xs pt-2px text-truncate px-3">
                                                {period.UserTitle}
                                              </div>
                                            ) : (
                                              ""
                                            )}
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
                                      {item.Items &&
                                        item.Items.length > 0 &&
                                        getCalenderSession(
                                          item.Items,
                                          "CHIEU"
                                        ).map((period, ix) => (
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
                                                      {period.Title} ({" "}
                                                      {moment(
                                                        period.From
                                                      ).format("HH:mm")}{" "}
                                                      -{" "}
                                                      {moment(period.To).format(
                                                        "HH:mm"
                                                      )}{" "}
                                                      )
                                                      <div>
                                                        {moment(
                                                          item.Day
                                                        ).format(
                                                          "DD-MM-YYYY HH:mm"
                                                        )}
                                                      </div>
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
                                                        loadOptions={
                                                          getAllTeacher
                                                        }
                                                        placeholder="Chọn giáo viên"
                                                        value={
                                                          period.UserID
                                                            ? {
                                                                value:
                                                                  period.UserID,
                                                                label:
                                                                  period.UserTitle,
                                                              }
                                                            : null
                                                        }
                                                        onChange={(option) =>
                                                          onSubmitTeacher(
                                                            option,
                                                            period
                                                          )
                                                        }
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
                                                className={`${isClassStatus(
                                                  period
                                                )} cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center`}
                                                style={GetCurrentLesson({
                                                  StartLesson: moment(
                                                    period.From
                                                  ).format("HH:mm:ss"),
                                                  EndLesson: moment(
                                                    period.To
                                                  ).format("HH:mm:ss"),
                                                  HourScheduleList:
                                                    calendar.School
                                                      .HourScheduleList,
                                                  Session: "CHIEU",
                                                })}
                                              >
                                                <span className="text-white font-size-xs font-weight-border">
                                                  {period.Title.match(
                                                    /\d/g
                                                  ).join("")}
                                                </span>
                                              </div>
                                            </OverlayTrigger>
                                            {period.UserID ? (
                                              <div className="shadow h-20px w-100 position-absolute bottom-0 text-center font-size-xs pt-2px text-truncate px-3">
                                                {period.UserTitle}
                                              </div>
                                            ) : (
                                              ""
                                            )}
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

        <div className="d-flex justify-content-between px-2">
          <Pagination
            className="my-3"
            count={PageCount}
            page={filters._pi}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => {
              setLoading(true);
              setFilters((prevState) => ({
                ...prevState,
                _pi: value,
              }));
            }}
          />
          <div className="d-flex align-items-center">
            Hiển thị
            <DropdownButton
              as={ButtonGroup}
              key="secondary"
              id={`dropdown-variants-Secondary`}
              variant=" font-weight-boldest"
              title={filters._ps}
            >
              {Array(5)
                .fill()
                .map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={index}
                    active={filters._ps === (index + 1) * 10}
                    onClick={() =>
                      setFilters((prevState) => ({
                        ...prevState,
                        _ps: (index + 1) * 10,
                      }))
                    }
                  >
                    {(index + 1) * 10}
                  </Dropdown.Item>
                ))}
            </DropdownButton>
            trên trang
          </div>
        </div>
      </div>
      <SpinnerMessage isShow={SpinnerShow} text="Đang cập nhập ..." />
    </div>
  );
}

export default Calendar;
