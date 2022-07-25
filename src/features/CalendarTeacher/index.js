import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import "../../_assets/sass/pages/_calendar-teacher.scss";
import BodyCalendar from "./BodyCalendar";
import HeaderCalendar from "./HeaderCalendar";
import { getCurrentDate } from "../../helpers/DateTimeHelpers";
import Swal from "sweetalert2";
import CalendarTeachersCrud from "./_redux/CalendarTeachersCrud";
import { useDispatch } from "react-redux";
import { setHourTeachers } from "./_redux/CalendarTeachersSlice";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function CalendarTeacher(props) {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 10,
    from: getCurrentDate().From,
    to: getCurrentDate().To,
    key: "",
  });
  const [loading, setLoading] = useState(false);
  const [Lists, setLists] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageTotal, setPageTotal] = useState(0);
  const typingTimeoutRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getListTeacherCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getListTeacherCalendar = (
    isLoading = true,
    filtersCurrent = filters,
    callback
  ) => {
    isLoading && setLoading(true);
    const newFilters = {
      ...filtersCurrent,
      from: moment(filtersCurrent.from).format("MM-DD-YYYY"),
      to: moment(filtersCurrent.to).format("MM-DD-YYYY"),
    };
    CalendarTeachersCrud.getAll(newFilters)
      .then(({ list, HourMin, HourMax, total, pi, error, right, ...data }) => {
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
          setLists((prevState) => (pi > 1 ? prevState.concat(list) : list));
          setPageTotal(total);
          setLoading(false);
          dispatch(setHourTeachers({ HourMin, HourMax }));
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = () => {
    getListTeacherCalendar(true, { ...filters, pi: 1 });
  };

  const fetchMoreData = () => {
    if (Lists.length < PageTotal) {
      setFilters((prevState) => ({ ...prevState, pi: prevState.pi + 1 }));
    } else {
      setHasMore(false);
    }
  };

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
      pi: 1,
      from: newFrom,
      to: newTo,
    }));
  };

  const onChangeKey = (value) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, pi: 1, key: value });
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
              WeeksPrev: () => onWeeksChange(filters.from, "PREV"),
              WeeksNext: () => onWeeksChange(filters.from, "NEXT"),
              WeeksToday: () => onWeeksChange(),
              onRefresh: () => onRefresh(),
            }}
            onChange={{
              Key: (value) => onChangeKey(value),
              DatePicker: (date) => onWeeksChange(date),
            }}
          />
          <BodyCalendar
            filters={filters}
            Lists={Lists}
            options={{
              hasMore: hasMore,
              loadMoreData: fetchMoreData,
              loading: loading,
            }}
            // onChange={{
            //   onChangeTeacher: onChangeTeacher,
            //   onOpenModalAdd: onOpenModalAdd,
            // }}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarTeacher;
