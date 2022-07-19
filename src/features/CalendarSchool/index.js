import React, { useEffect, useRef, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import HeaderCalendar from "../CalendarSchool/HeaderCalendar";
import { getCurrentDate } from "../../helpers/DateTimeHelpers";
import "../../_assets/sass/pages/_calendar-school.scss";
import BodyCalendar from "./BodyCalendar";
import CalendarSchoolCrud from "./_redux/CalendarSchoolCrud";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setHourSchool } from "./_redux/CalendarSchoolSlice";
import { AlertError } from "../../helpers/AlertHelpers";
import { Dropdown } from "react-bootstrap";
import ModalAddBooks from "./components/Modal/ModalAddBooks";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function CalendarSchool(props) {
  const [filters, setFilters] = useState({
    key: "",
    from: getCurrentDate().From,
    to: getCurrentDate().To,
    pi: 1,
    ps: 5,
  });
  const [loading, setLoading] = useState(false);
  const [Lists, setLists] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageTotal, setPageTotal] = useState(0);
  const [IsModalAdd, setIsModalAdd] = useState(false);
  const [InitialValueAdd, setInitialValueAdd] = useState(null);
  const typingTimeoutRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getListCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getListCalendar = (
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
    CalendarSchoolCrud.getAll(newFilters)
      .then(({ SchoolList, HourMin, HourMax, Total, Pi, error, right }) => {
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
          setLists((prevState) =>
            Pi > 1 ? prevState.concat(SchoolList) : SchoolList
          );
          setPageTotal(Total);
          setLoading(false);
          dispatch(setHourSchool({ HourMin, HourMax }));
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  const onChangeTeacher = (value, item) => {
    setLoading(true);
    const objSubmit = {
      ID: item.ID,
      UserID: value ? value.ID : 0,
      UserTitle: value ? value.FullName : "",
    };

    CalendarSchoolCrud.addTeacher(objSubmit)
      .then((response) => {
        if (response.error) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Không thể xếp lịch cho giáo viên này.",
            error: response.error,
          });
        } else {
          getListCalendar(false, { ...filters, pi: 1 });
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
    setLoading(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, pi: 1, key: value });
    }, 500);
  };

  const onOpenModalAdd = (value) => {
    setInitialValueAdd(value);
    setIsModalAdd(true);
  };

  const onHideModalAdd = (value) => {
    setInitialValueAdd(null);
    setIsModalAdd(false);
  };

  return (
    <div className="calendar-school">
      <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
        <div className="hpanel">
          <div className="panel-body overflow-visible">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-uppercase font-size-h3 mb-0">
                Bảng lịch trường
              </h2>
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  Đặt lịch mới
                  <i className="fal fa-angle-down"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      onOpenModalAdd({
                        IsThematic: false, // Không phải chuyên đề
                      })
                    }
                  >
                    Tạo tiết thông thường
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      onOpenModalAdd({
                        IsThematic: true, // Có phải chuyên đề
                      })
                    }
                  >
                    Tạo tiết chuyên đề
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
          <BodyCalendar
            filters={filters}
            Lists={Lists}
            options={{
              hasMore: hasMore,
              loadMoreData: fetchMoreData,
              loading: loading,
            }}
            onChange={{
              onChangeTeacher: onChangeTeacher,
            }}
          />
          <ModalAddBooks
            show={IsModalAdd}
            onHide={onHideModalAdd}
            InitialValueAdd={InitialValueAdd}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarSchool;
