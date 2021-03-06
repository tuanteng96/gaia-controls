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
import { toast } from "react-toastify";

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
  const [loadingBtn, setLoadingBtn] = useState({
    Books: false
  })
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
            title: "B???n kh??ng c?? quy???n.",
            text: "Vui l??ng xin c???p quy???n ????? truy c???p !",
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

  const onRefresh = () => {
    getListCalendar(true, { ...filters, pi: 1 });
  }

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
            title: "X???y ra l???i",
            errorTitle: "Kh??ng th??? x???p l???ch cho gi??o vi??n n??y.",
            error: response.error,
          });
        } else {
          getListCalendar(false, { ...filters, pi: 1 });
        }
      })
      .catch(({ response }) => {
        AlertError({
          title: "X???y ra l???i",
          errorTitle: "Kh??ng th??? x???p l???ch cho gi??o vi??n n??y.",
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

  const onAddBooks = (values) => {
    setLoadingBtn(prevState => ({...prevState, Books: true}))
    let newData = values.dayItem.Index.map((item) => ({
      ...values,
      major: values.major.IsThematic ? { Title: values.major.Title } : null,
      dayItem: {
        ...values.dayItem,
        ID: values?.dayItem?.MajorID ? item?.ID : values.dayItem?.ID ?? 0,
        Index: item.value,
        IndexTitle: item.label,
        ClassID: values.dayItem.ClassID?.value ?? "",
        ClassLevel: values.dayItem.ClassID?.Level ?? "",
        ClassTitle: values.dayItem.ClassID?.label ?? "",
        Date: moment(values.dayItem.Date).format("YYYY-MM-DD"),
        SchoolID: values.dayItem.SchoolID?.ID ?? "",
        SchoolTitle: values.dayItem.SchoolID?.Title ?? "",
        TeacherID: values.dayItem.TeacherID?.value ?? "",
        TeacherTitle: values.dayItem.TeacherID?.label ?? "",
      },
    }));
    const dataSubmit = {
      list: newData,
    };
    CalendarSchoolCrud.addBooks(dataSubmit)
      .then((response) => {
        getListCalendar(false, { ...filters, pi: 1 }, () => {
          setLoadingBtn((prevState) => ({ ...prevState, Books: false }));
          onHideModalAdd();
          toast.success(
            values.dayItem.ID ? "C???p nh???p th??nh c??ng !" : "Th??m m???i th??nh c??ng",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            }
          );
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="calendar-school">
      <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
        <div className="hpanel">
          <div className="panel-body overflow-visible">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-uppercase font-size-h3 mb-0">
                B???ng l???ch tr?????ng
              </h2>
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  ?????t l???ch m???i
                  <i className="fal fa-angle-down"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      onOpenModalAdd({
                        IsThematic: false, // Kh??ng ph???i chuy??n ?????
                      })
                    }
                  >
                    T???o ti???t th??ng th?????ng
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      onOpenModalAdd({
                        IsThematic: true, // C?? ph???i chuy??n ?????
                      })
                    }
                  >
                    T???o ti???t chuy??n ?????
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
            onChange={{
              onChangeTeacher: onChangeTeacher,
              onOpenModalAdd: onOpenModalAdd,
            }}
          />
          <ModalAddBooks
            show={IsModalAdd}
            onHide={onHideModalAdd}
            InitialValueAdd={InitialValueAdd}
            onSubmit={onAddBooks}
            loadingBtn={loadingBtn}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarSchool;
