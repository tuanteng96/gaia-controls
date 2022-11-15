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
import ModalScheduleClass from "../ScheduleClass/components/Modal/ModalScheduleClass";
import ModalDeleteScheduleClass from "./components/Modal/ModalDeleteScheduleClass";
import ModalTakeBreak from "./components/Modal/ModalTakeBreak";

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
    Books: false,
    ScheduleClass: false,
    DeleteSchedule: false,
    TakeBreak: false,
  });
  const [IsModal, setIsModal] = useState({
    AddScheduleClass: false,
    DeleteSchedule: false,
    TakeBreak: false,
  });
  const [IsModalAdd, setIsModalAdd] = useState(false);
  const [InitialValueAdd, setInitialValueAdd] = useState(null);
  const [AllInitial, setAllInitial] = useState(null);
  const typingTimeoutRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    let teacher_resigns = localStorage.getItem("teacher_resigns");
    if (teacher_resigns) {
      teacher_resigns = JSON.parse(teacher_resigns);
      onOpenModalTakeBreak(teacher_resigns);
    }
  }, []);

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

  const onRefresh = () => {
    getListCalendar(true, { ...filters, pi: 1 });
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

  const onOpenScheduleClass = (values) => {
    setAllInitial(values);
    setIsModal((prevState) => ({ ...prevState, AddScheduleClass: true }));
  };

  const onHideScheduleClass = () => {
    setAllInitial(null);
    setIsModal((prevState) => ({ ...prevState, AddScheduleClass: false }));
  };

  const onAddBooks = (values) => {
    setLoadingBtn((prevState) => ({ ...prevState, Books: true }));
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
            values.dayItem.ID ? "Cập nhập thành công !" : "Thêm mới thành công",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            }
          );
        });
      })
      .catch((error) => console.log(error));
  };

  const onDeleteBook = (item) => {
    Swal.fire({
      title: "Bạn muốn xóa ?",
      text: "Bạn có chắc chắn muốn lịch này không ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      denyButtonColor: "#3699FF",
      confirmButtonText: "Xóa lịch",
      cancelButtonText: "Đóng",
      showLoaderOnConfirm: true,
      showDenyButton: item?.Index.length > 1,
      denyButtonText: "Xóa chuyên đề",
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          CalendarSchoolCrud.deleteBooks({
            deletedIDs: [item.ID || item.CalendarItemID],
          })
            .then((response) => {
              getListCalendar(true, { ...filters, pi: 1 }, () => {
                resolve();
                onHideModalAdd();
                toast.success("Xóa lịch thành công.", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1500,
                });
              });
            })
            .catch((error) => console.log(error));
        });
      },
      preDeny: () => {
        return new Promise((resolve, reject) => {
          CalendarSchoolCrud.deleteBooks({
            deletedIDs: item.Index && item.Index.map((o) => o.ID),
          })
            .then((response) => {
              getListCalendar(true, { ...filters, pi: 1 }, () => {
                resolve();
                onHideModalAdd();
                toast.success("Xóa lịch thành công.", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1500,
                });
              });
            })
            .catch((error) => console.log(error));
        });
      },
    });
  };

  const onSubmitScheduleClass = (values) => {
    setLoadingBtn((prevState) => ({ ...prevState, ScheduleClass: true }));
    const newValues = {
      SchoolID: values.SchoolID,
      From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
      To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
      CalendarList: values.CalendarList.map((item) => ({
        ClassID: item?.ClassID || "",
        ClassTeacherID: item?.ClassTeacherID || "",
        Days: item.Days.map((day) => ({
          ...day,
          Items: day.Items ? day.Items.map((os) => os.Title) : [],
        })),
        IsHolder: item?.IsHolder && item.IsHolder === item?.ClassTeacherID,
      })),
    };
    CalendarSchoolCrud.addScheduleClass(newValues)
      .then((response) => {
        getListCalendar(false, "", () => {
          setLoadingBtn((prevState) => ({
            ...prevState,
            ScheduleClass: false,
          }));
          onHideScheduleClass();
          toast.success("Thêm mới lịch thành công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        });
      })
      .catch((err) => console.log(err));
  };

  const onSubmitTakeBreak = (values) => {
    setLoadingBtn((prevState) => ({ ...prevState, TakeBreak: true }));
    const newValue = {
      Changes:
        values.Changes &&
        values.Changes.filter((item) => item.ClassTeacherID).map((item) => ({
          DayItemID: item.ID,
          TeacherID: item.ClassTeacherID,
        })),
      FromTeacherID: values.TeacherID?.value,
    };
    CalendarSchoolCrud.ChangeTeaches(newValue)
      .then((response) => {
        getListCalendar(false, "", () => {
          onHideModalTakeBreak();
          setLoadingBtn((prevState) => ({ ...prevState, TakeBreak: false }));
          toast.success("Xóa lịch thành công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        });
      })
      .catch((error) => console.log(error));
  };

  const onOpenModalDeleteScheduleClass = (value) => {
    setAllInitial(value);
    setIsModal((prevState) => ({ ...prevState, DeleteSchedule: true }));
  };

  const onHideModalDeleteScheduleClass = () => {
    setAllInitial(null);
    setIsModal((prevState) => ({ ...prevState, DeleteSchedule: false }));
  };

  const onDeleteSchedule = (values, ListClass) => {
    setLoadingBtn((prevState) => ({ ...prevState, DeleteSchedule: true }));
    if (AllInitial?.TakeBreak) {
      const newValues = {
        SchoolIDs: values.SchoolID?.ID ? [values.SchoolID?.ID] : [],
        ClassIDs:
          values.ClassIDs && values.ClassIDs.length > 0
            ? values.ClassIDs.map((x) => x.ID)
            : ListClass && ListClass.map((x) => x.ID),
        From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
        To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
        Items: [],
        StatusDesc: "Nghỉ buổi",
      };
      CalendarSchoolCrud.takeScheduleOff(newValues)
        .then((response) => {
          getListCalendar(false, "", () => {
            setLoadingBtn((prevState) => ({
              ...prevState,
              DeleteSchedule: false,
            }));
            onHideModalDeleteScheduleClass();
            toast.success("Thông báo nghỉ buổi thành công", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
          });
        })
        .catch((err) => console.log(err));
    } else {
      const newValues = {
        SchoolIDs: values.SchoolID?.ID ? [values.SchoolID?.ID] : [],
        From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
        To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
        ClassIDs:
          values.ClassIDs && values.ClassIDs.length > 0
            ? values.ClassIDs.map((x) => x.ID)
            : ListClass && ListClass.map((x) => x.ID),
      };
      CalendarSchoolCrud.deleteScheduleClass(newValues)
        .then((response) => {
          getListCalendar(false, "", () => {
            setLoadingBtn((prevState) => ({
              ...prevState,
              DeleteSchedule: false,
            }));
            onHideModalDeleteScheduleClass();
            toast.success("Xóa lịch của lớp thành công", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const onOpenModalTakeBreak = (initialValue) => {
    if (initialValue) setAllInitial(initialValue);
    setIsModal((prevState) => ({ ...prevState, TakeBreak: true }));
  };

  const onHideModalTakeBreak = () => {
    setAllInitial(null);
    setIsModal((prevState) => ({ ...prevState, TakeBreak: false }));
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
              <div className="d-flex">
                <a
                  href="/admin/r/bang-lich-giao-vien"
                  className="btn btn-outline-primary mr-8px"
                >
                  Bảng lịch giáo viên
                </a>
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Đặt lịch mới
                    <i className="fal fa-angle-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() =>
                        onOpenScheduleClass({ isClassChoose: false })
                      }
                    >
                      Tạo mới lịch
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      onClick={() =>
                        onOpenScheduleClass({ isClassChoose: true })
                      }
                    >
                      Tạo lịch cho lớp
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={onOpenModalDeleteScheduleClass}>
                      Xóa lịch
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      onClick={() =>
                        onOpenModalDeleteScheduleClass({
                          TakeBreak: true,
                        })
                      }
                    >
                      Thông báo nghỉ buổi
                    </Dropdown.Item> */}
                    {/* <Dropdown.Item>
                      Thay đổi lịch trong 1 khoảng thời gian
                    </Dropdown.Item> */}
                    {/* <Dropdown.Item>Thêm tiết cho lớp</Dropdown.Item> */}
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item onClick={() => onOpenModalTakeBreak()}>
                      Xin nghỉ
                    </Dropdown.Item>
                    <Dropdown.Item>Thay đổi giáo viên</Dropdown.Item>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item
                      onClick={() =>
                        onOpenModalAdd({
                          IsThematic: false,
                        })
                      }
                    >
                      Tạo tiết
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        onOpenModalAdd({
                          IsThematic: true,
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
            onDeleteBook={onDeleteBook}
            loadingBtn={loadingBtn}
          />
          <ModalScheduleClass
            show={IsModal.AddScheduleClass}
            onHide={onHideScheduleClass}
            onAddEdit={onSubmitScheduleClass}
            btnLoading={loadingBtn.ScheduleClass}
            AllInitial={AllInitial}
          />
          <ModalDeleteScheduleClass
            show={IsModal.DeleteSchedule}
            onHide={onHideModalDeleteScheduleClass}
            loadingBtn={loadingBtn.DeleteSchedule}
            onSubmit={onDeleteSchedule}
            AllInitial={AllInitial}
          />
          <ModalTakeBreak
            show={IsModal.TakeBreak}
            onHide={onHideModalTakeBreak}
            loadingBtn={loadingBtn.TakeBreak}
            onSubmit={onSubmitTakeBreak}
            AllInitial={AllInitial}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarSchool;
