import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { Dropdown } from "react-bootstrap";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

HeaderCalendar.propTypes = {
  filters: PropTypes.object,
  options: PropTypes.object,
};

function HeaderCalendar({ filters, options, onChange }) {
  const [DateNow, setDateNow] = useState(new Date());
  const [valueKey, setValueKey] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const CurrentWeek = moment().week();
    const FilterWeek = moment(filters.from).week();
    if (FilterWeek === CurrentWeek) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [filters]);
  return (
    <Fragment>
      <div className="d-flex justify-content-between mb-15px">
        <div className="d-flex">
          <button
            className="btn-calendar-teacher"
            type="button"
            onClick={options.WeeksPrev}
          >
            <i className="fal fa-angle-left"></i>
          </button>
          <button
            type="button"
            className="mx-2 btn-calendar-teacher"
            onClick={options.WeeksNext}
          >
            <i className="fal fa-angle-right"></i>
          </button>
          <button
            className="btn-calendar-teacher"
            type="button"
            onClick={options.WeeksToday}
            disabled={isDisabled}
          >
            Hôm nay
          </button>
          <div className="ms-2">
            <Dropdown>
              <Dropdown.Toggle className="h-40px btn-calendar-teacher">
                Chú thích <i className="fal fa-angle-down"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className="d-flex align-items-center">
                  <div className="w-10px h-10px bg-success rounded-circle"></div>
                  <span className="pl-10px font-size-sm font-weight-bold">
                    Hoàn thành
                  </span>
                </Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center">
                  <div className="w-10px h-10px bg-warning rounded-circle"></div>
                  <span className="pl-10px font-size-sm font-weight-bold">
                    Đã chọn GV
                  </span>
                </Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center">
                  <div className="w-10px h-10px bg-primary rounded-circle"></div>
                  <span className="pl-10px font-size-sm font-weight-bold">
                    Chưa chọn GV
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="d-flex">
          <button type="button" className="btn btn-primary mr-10px" onClick={options.onRefresh}>
            Làm mới
          </button>
          <div className="w-300px position-relative me-3">
            <input
              name="_key"
              type="text"
              className="form-control pr-50px"
              placeholder="Nhập tên trường ..."
              autoComplete="off"
              onChange={(e) => {
                setValueKey(e.target.value);
                onChange.Key(e.target.value);
              }}
              value={valueKey}
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
              selected={DateNow}
              onChange={(date) => {
                setDateNow(date);
                onChange.DatePicker(date);
              }}
              popperPlacement="bottom-end"
              //shouldCloseOnSelect={false}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
            />
          </div>
        </div>
      </div>
      <div className="h-40px border-top border-right border-left d-flex align-items-center justify-content-center">
        <div className="font-weight-bold text-uppercase font-size-md">
          Lịch từ {moment(filters.from).format("ll")}
          <span className="px-2">đến</span>
          {moment(filters.from).format("ll")}
        </div>
      </div>
    </Fragment>
  );
}

export default HeaderCalendar;
