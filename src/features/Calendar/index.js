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
import Select from "react-select";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function Calendar(props) {
  const [CurrentDate, setCurrentDate] = useState(moment());
  const [Filters, setFilters] = useState({
    Start: null,
    End: null,
    Key: "",
  });
  const [loading, setLoading] = useState(true);
  const [ListCalendar, setListCalendar] = useState([]);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const now = CurrentDate ? moment(CurrentDate) : moment();
    var Start = now.clone().weekday(0);
    var End = now.clone().weekday(6);
    setFilters((prevState) => ({
      ...prevState,
      Start,
      End,
    }));
  }, [CurrentDate]);

  useEffect(() => {
    getListCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Filters]);

  const GetCurrentLesson = (item) => {
    const { StartLesson, EndLesson } = item;

    const TotalMinutes = moment("11:30:00", "HH:mm:ss").diff(
      moment("07:15:00", "HH:mm:ss"),
      "minutes"
    );
    const TotalStart = moment(StartLesson, "HH:mm:ss").diff(
      moment("07:15:00", "HH:mm:ss"),
      "minutes"
    );
    const TotalEnd = moment(EndLesson, "HH:mm:ss").diff(
      moment("07:15:00", "HH:mm:ss"),
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
    setTimeout(() => {
      setLoading(false);
      setListCalendar([1]);
      callback && callback();
    }, 1500);
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters((prevState) => ({ ...prevState, Key: value }));
    }, 500);
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
          Lịch từ {Filters.Start && moment(Filters.Start).format("ll")} -{" "}
          {Filters.End && moment(Filters.End).format("ll")}
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
                {Array(5)
                  .fill()
                  .map((item, index) => (
                    <div className="d-flex border-top" key={index}>
                      <div className="flex-1 border-right d-flex align-items-center justify-content-center text-uppercase font-weight-bold p-3 text-center">
                        Trường tiếu học Minh Sơn {index + 1}
                      </div>
                      <div className="w-80px">
                        <div className="border-bottom px-2 h-40px d-flex align-items-center justify-content-center">
                          Lớp 1
                        </div>
                        <div className="border-bottom px-2 h-40px d-flex align-items-center justify-content-center">
                          Lớp 2
                        </div>
                        <div className="border-bottom px-2 h-40px d-flex align-items-center justify-content-center">
                          Lớp 3
                        </div>
                        <div className="border-bottom px-2 h-40px d-flex align-items-center justify-content-center">
                          Lớp 4
                        </div>
                        <div className="px-2 h-40px d-flex align-items-center justify-content-center">
                          Lớp 5
                        </div>
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
                {Array(5)
                  .fill()
                  .map((item, x) => (
                    <div className="d-flex" key={x}>
                      {Array(7)
                        .fill()
                        .map((item, index) => (
                          <div
                            className={`flex-1 border-top ${index !== 6 &&
                              "border-right"} min-w-225px`}
                            key={index}
                          >
                            <div className="d-flex">
                              <div className={`flex-1 border-right`}>
                                {Array(5)
                                  .fill()
                                  .map((item, idx) => (
                                    <div
                                      className={`${idx !== 4 &&
                                        "border-bottom"} h-40px`}
                                      key={idx}
                                    >
                                      <div className="d-flex w-100 position-relative h-40px">
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
                                                  Tiết 1 (
                                                  {moment(
                                                    "07:15:00",
                                                    "HH:mm:ss"
                                                  )
                                                    .add(
                                                      40 * idx + index * 40,
                                                      "minute"
                                                    )
                                                    .format("HH:mm:ss")}{" "}
                                                  -{" "}
                                                  {moment(
                                                    "07:15:00",
                                                    "HH:mm:ss"
                                                  )
                                                    .add(
                                                      40 * (idx + 1) +
                                                        (index + 1) * 40,
                                                      "minute"
                                                    )
                                                    .format("HH:mm:ss")}
                                                  )
                                                </span>
                                              </Popover.Header>
                                              <Popover.Body>
                                                <label>Giáo viên</label>
                                                <div>
                                                  <Select
                                                    className="select-control"
                                                    classNamePrefix="select"
                                                    isDisabled={false}
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="Status"
                                                    options={[
                                                      {
                                                        label:
                                                          "Nguyễn Tài Tuấn",
                                                        value: "1",
                                                      },
                                                    ]}
                                                    placeholder="Chọn giáo viên"
                                                    onChange={(option) => {
                                                      console.log(option);
                                                    }}
                                                  />
                                                </div>
                                              </Popover.Body>
                                            </Popover>
                                          }
                                        >
                                          <div
                                            className={`w-15px h-40px border-right bg-primary cursor-pointer position-absolute top-0`}
                                            style={GetCurrentLesson({
                                              StartLesson: moment(
                                                "07:15:00",
                                                "HH:mm:ss"
                                              )
                                                .add(
                                                  40 * idx + index * 40,
                                                  "minute"
                                                )
                                                .format("HH:mm:ss"),
                                              EndLesson: moment(
                                                "07:15:00",
                                                "HH:mm:ss"
                                              )
                                                .add(
                                                  40 * (idx + 1) +
                                                    (index + 1) * 40,
                                                  "minute"
                                                )
                                                .format("HH:mm:ss"),
                                            })}
                                          ></div>
                                        </OverlayTrigger>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <div className="flex-1">
                                {Array(5)
                                  .fill()
                                  .map((item, idx) => (
                                    <div
                                      className={`${idx !== 4 &&
                                        "border-bottom"} h-40px`}
                                      key={idx}
                                    >
                                      {/* {moment("13:30:00", "HH:mm:ss")
                                        .add(30 * idx + index * 30, "minute")
                                        .format("HH:mm:ss")}{" "}
                                      -
                                      {moment("13:30:00", "HH:mm:ss")
                                        .add(
                                          30 * (idx + 1) + (index + 1) * 30,
                                          "minute"
                                        )
                                        .format("HH:mm:ss")} */}
                                      <div className="d-flex w-100 position-relative h-40px">
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
                                                  Tiết 1 (8H00 - 8H45)
                                                </span>
                                              </Popover.Header>
                                              <Popover.Body>
                                                <label>Giáo viên</label>
                                                <div>
                                                  <Select
                                                    className="select-control"
                                                    classNamePrefix="select"
                                                    isDisabled={false}
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="Status"
                                                    options={[
                                                      {
                                                        label:
                                                          "Nguyễn Tài Tuấn",
                                                        value: "1",
                                                      },
                                                    ]}
                                                    placeholder="Chọn giáo viên"
                                                    onChange={(option) => {
                                                      console.log(option);
                                                    }}
                                                  />
                                                </div>
                                              </Popover.Body>
                                            </Popover>
                                          }
                                        >
                                          <div
                                            className={`w-15px h-40px border-right bg-primary cursor-pointer position-absolute top-0`}
                                            style={{
                                              left: `${(idx + 1) * 9}px`,
                                            }}
                                          ></div>
                                        </OverlayTrigger>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
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
            count={5}
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
