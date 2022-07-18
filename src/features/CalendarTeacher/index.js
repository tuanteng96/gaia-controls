import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import "../../_assets/sass/pages/_calendar-teacher.scss";
import BodyCalendar from "./BodyCalendar";
import HeaderCalendar from "./HeaderCalendar";
import { getCurrentDate } from "../../helpers/DateTimeHelpers";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function CalendarTeacher(props) {
  const [filters, setFilters] = useState({
    Pi: 1,
    Ps: 10,
    From: getCurrentDate().From,
    To: getCurrentDate().To,
    Key: "",
  });
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const onWeeksChange = (date = new Date(), Type) => {
    let newFrom, newTo;
    if (Type === "PREV") {
      newFrom = moment(date)
        .subtract(1, "weeks")
        .startOf("week")
        .toDate();
      newTo = moment(date)
        .subtract(1, "weeks")
        .endOf("week")
        .toDate();
    }
    if (Type === "NEXT") {
      newFrom = moment(date)
        .add(1, "weeks")
        .startOf("week")
        .toDate();
      newTo = moment(date)
        .add(1, "weeks")
        .endOf("week")
        .toDate();
    }
    if (!Type) {
      newFrom = moment(date)
        .startOf("week")
        .toDate();
      newTo = moment(date)
        .endOf("week")
        .toDate();
    }
    setFilters((prevState) => ({
      ...prevState,
      Pi: 1,
      From: newFrom,
      To: newTo,
    }));
  };

  const onChangeKey = (value) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, Pi: 1, Key: value });
    }, 500);
  };

  return (
    <div className="calendar-teacher">
      <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
        <div className="hpanel">
          <div className="panel-body">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-uppercase font-size-h3 mb-0">
                Bảng lịch giáo viên
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 mb-30px">
          <HeaderCalendar
            filters={filters}
            options={{
              WeeksPrev: () => onWeeksChange(filters.From, "PREV"),
              WeeksNext: () => onWeeksChange(filters.From, "NEXT"),
              WeeksToday: () => onWeeksChange(),
            }}
            onChange={{
              Key: (value) => onChangeKey(value),
              DatePicker: (date) => onWeeksChange(date),
            }}
          />
          <BodyCalendar filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default CalendarTeacher;
