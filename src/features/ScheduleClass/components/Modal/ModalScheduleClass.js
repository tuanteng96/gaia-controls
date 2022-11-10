import React, { useState, Fragment, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Form, Formik, FieldArray, FastField } from "formik";
import { Button, Modal } from "react-bootstrap";
import ScheduleGenerator from "../../ScheduleGenerator";
import Select, { components } from "react-select";
import Swal from "sweetalert2";
//import LoaderTable from "../../../../layout/components/Loadings/LoaderTable";
//import ScheduleClassCrud from "../../_redux/ScheduleClassCrud";
//import clsx from "clsx";
import CalendarSchoolCrud from "../../../CalendarSchool/_redux/CalendarSchoolCrud";
import _ from "lodash";
import ListTeacherChoose from "../ListTeacherChoose";

import moment from "moment";
import "moment/locale/vi";
import clsx from "clsx";

moment.locale("vi");

ModalScheduleClass.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  SchoolID: null,
  SchoolTitle: "",
  From: "",
  To: "",
  CalendarList: [],
};

const initialGenerator = {
  School: null,
  Class: null,
  From: null,
  To: null,
};

const MyRefComponent = ({ values, onSubmitRef }) => {
  useEffect(() => {
    onSubmitRef(values);
  }, [values, onSubmitRef]);
  return null;
};

const dayGenerator = () => {
  const ListDay = [];
  for (var i = 0; i < 7; i++) {
    const obj = {
      DayOfWeek: i,
      Items: null,
    };
    ListDay.push(obj);
  }
  ListDay.push(ListDay.shift());
  return ListDay;
};

function ModalScheduleClass({
  show,
  onHide,
  onAddEdit,
  defaultValues,
  btnLoading,
  AllInitial,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [initialGenerators, setInitialGenerator] = useState(initialGenerator);
  //const [isCTModal, setIsCTModal] = useState(true);
  const [refHeight, setRefHeight] = useState([]);
  const [loadingBtnNext, setLoadingBtnNext] = useState(false);
  const [TabCurrent, setTabCurrent] = useState("Index");
  const [ListDay] = useState(dayGenerator());

  const elRefs = useRef([]);

  useEffect(() => {
    if (!defaultValues?.ID) {
      setInitialGenerator(initialGenerator);
      setInitialValues(initialValue);
      setTabCurrent("Index");
    } else {
      setInitialGenerator((prevState) => ({
        ...prevState,
        School: {
          SchoolID: defaultValues.SchoolID,
          label: defaultValues.SchoolTitle,
          value: defaultValues.SchoolID,
        },
        From: defaultValues.From,
        To: defaultValues.To,
      }));
      setInitialValues((prevState) => ({
        ...prevState,
        ID: defaultValues.ID,
        SchoolID: defaultValues.SchoolID,
        SchoolTitle: defaultValues.SchoolTitle,
        From: defaultValues.From,
        To: defaultValues.To,
        CalendarList:
          defaultValues.CalendarList && defaultValues.CalendarList.length > 0
            ? defaultValues.CalendarList.map((calendar) => ({
                ...calendar,
                Days:
                  calendar.Days && calendar.Days.length > 0
                    ? calendar.Days.map((day) => ({
                        ...day,
                        Items:
                          day.Items &&
                          Array.isArray(day.Items) &&
                          day.Items.length > 0
                            ? day.Items.map((os) => ({
                                ...os,
                                label: os.Title,
                                value: os.Title,
                              }))
                            : null,
                      }))
                    : [],
              }))
            : [],
        HourScheduleList: defaultValues.School.HourScheduleList
          ? defaultValues.School.HourScheduleList.map((item) => ({
              ...item,
              label: item.Title,
              value: item.Title,
            }))
          : [],
      }));
    }
  }, [show, defaultValues]);

  const onGeneratorBook = ({ School, From, To, Class }) => {
    const { ClassList, HourScheduleList, Title } = School;
    if (!ClassList || (Array.isArray(ClassList) && ClassList.length === 0)) {
      Swal.fire({
        icon: "error",
        title: "Xảy ra lỗi",
        text: `Vui lòng tạo lớp cho trường ${Title} để tạo có thể tạo được lịch.`,
      });
      return;
    }
    // await Swal.fire({
    //   title: "Bạn có xóa lịch không ?",
    //   text: `Bạn có muốn xóa lịch cũ của trường ${Title} không trước khi tạo lịch không?`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#d33",
    //   cancelButtonColor: "#6e7881",
    //   confirmButtonText: "Có và Tạo mới",
    //   cancelButtonText: "Không và Tạo mới",
    //   showLoaderOnConfirm: true,
    //   allowOutsideClick: () => !Swal.isLoading(),
    //   preConfirm: () => {
    //     return new Promise((resolve, reject) => {
    //       ScheduleClassCrud.DeleteTime({
    //         from: From
    //           ? moment(From).format("DD/MM/YYYY")
    //           : moment().format("DD/MM/YYYY"),
    //         to: To
    //           ? moment(From).format("DD/MM/YYYY")
    //           : moment()
    //               .add(30, "year")
    //               .format("DD/MM/YYYY"),
    //         schoolID: ID,
    //       })
    //         .then((response) => {
    //           resolve();
    //         })
    //         .catch((error) => console.log(error));
    //     });
    //   },
    // });

    var newCalendarList = [];
    if (!Class) {
      newCalendarList = ClassList.map((item) => ({
        ClassTitle: item.Title,
        ClassID: item.ID,
        ClassLevel: item.Level,
        Days: ListDay,
        ClassTeacherID: "",
      }));
    } else {
      newCalendarList = Class.map((item) => ({
        ClassTitle: item.Title,
        ClassID: item.ID,
        ClassLevel: item.Level,
        Days: ListDay,
        ClassTeacherID: "",
      }));
    }

    setInitialValues((prevState) => ({
      ...prevState,
      SchoolID: School.ID,
      SchoolTitle: School.Title,
      From: From,
      To: To,
      CalendarList: newCalendarList,
      HourScheduleList:
        HourScheduleList && HourScheduleList.length > 0
          ? HourScheduleList.map((item) => ({
              ...item,
              label: item.Title,
              value: item.Title,
            }))
          : [],
    }));
  };

  const CustomOption = ({ children, innerRef, data, ...props }) => {
    return (
      <components.Option {...props}>
        {children}
        <span className="font-size-xs ps-2 text-muted">
          ( {moment(data.From, "HH:mm:ss").format("HH:mm")} -{" "}
          {moment(data.To, "HH:mm:ss").format("HH:mm")} )
        </span>
      </components.Option>
    );
  };

  const onSubmitRef = (values) => {
    if (!values.CalendarList || values.CalendarList.length === 0) return;
    const newHeight = [];
    for (let x in values.CalendarList) {
      newHeight.push(elRefs?.current[x]?.clientHeight);
    }
    if (!_.isEqual(_.sortBy(newHeight), _.sortBy(refHeight))) {
      setRefHeight(newHeight);
    }
  };

  const onNextTeacher = ({ values, setFieldValue }) => {
    const { CalendarList } = values;
    setLoadingBtnNext(true);
    const newValues = {
      SchoolID: values.SchoolID,
      From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
      To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
      CalendarList: values.CalendarList.map((item) => ({
        ...item,
        Days: item.Days.map((day) => ({
          ...day,
          Items: day.Items ? day.Items.map((os) => os.Title) : [],
        })),
      })),
    };
    CalendarSchoolCrud.previewScheduleClass(newValues)
      .then((response) => {
        if (response?.Previews) {
          const { Previews } = response;
          const newCalendarList = CalendarList.map((item) => {
            let newCalendarItem = { ...item, AvaiList: null, NotList: null };
            const index = Previews.findIndex((o) => o.ClassID === item.ClassID);
            if (index > -1) {
              newCalendarItem.AvaiList = Previews[index].AvaiList;
              newCalendarItem.NotList = Previews[index].NotList;
            }
            return newCalendarItem;
          });
          setLoadingBtnNext(false);
          setFieldValue("CalendarList", newCalendarList, false);
          setTabCurrent("Teacher");
        } else {
          setLoadingBtnNext(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      scrollable={true}
      size="xxl"
      // onEntered={() => setIsCTModal(false)}
      // onExit={() => setIsCTModal(true)}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onAddEdit}
        enableReinitialize={true}
        validateOnChange={false}
      >
        {(formikProps) => {
          const { values, handleBlur } = formikProps;
          return (
            <Form
              className="d-flex flex-column overflow-hidden align-items-stretch"
              onSubmit={formikProps.handleSubmit}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {values.ID
                    ? `Lịch học ${values.SchoolTitle}`
                    : "Tạo mới lịch học"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ScheduleGenerator
                  onSubmit={onGeneratorBook}
                  initialValues={initialGenerators}
                  ID={values.ID}
                  onClearSchool={() => setInitialValues(initialValue)}
                  AllInitial={AllInitial}
                />
                {values.SchoolID && (
                  <div className="mt-4">
                    <div className="border-top border-left border-right text-center font-weight-bold text-uppercase h-50px d-flex justify-content-center align-items-center font-size-md">
                      {values.SchoolTitle}{" "}
                      {values.From &&
                        `- Từ ngày ${moment(values.From).format("ll")}`}{" "}
                      {values.To && `đến ${moment(values.To).format("ll")}`}
                    </div>
                    {/* SET 1 */}
                    {TabCurrent === "Teacher" && (
                      <div className="table-responsive-x">
                        <div className="table-responsive">
                          <table className="table table-bordered mb-0">
                            <thead>
                              <tr>
                                {values.CalendarList &&
                                  values.CalendarList.map((item, index) => (
                                    <th
                                      className={clsx(
                                        "min-w-265px w-265px h-50px text-center"
                                      )}
                                      key={index}
                                    >
                                      {item.ClassTitle}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name={`CalendarList`}
                                render={(arrayHelpers) => (
                                  <tr>
                                    {values.CalendarList &&
                                      values.CalendarList.map((item, index) => (
                                        <td
                                          className="min-w-265px w-265px p-0"
                                          key={index}
                                        >
                                          <ListTeacherChoose
                                            item={item}
                                            name={`CalendarList[${index}].ClassTeacherID`}
                                            valueClassTeacherID={
                                              item.ClassTeacherID
                                            }
                                            onUpdate={() =>
                                              onNextTeacher(formikProps)
                                            }
                                            formikProps={formikProps}
                                          />
                                        </td>
                                      ))}
                                  </tr>
                                )}
                              />
                            </tbody>
                          </table>
                        </div>
                        <div
                          className={clsx(
                            "element-loader",
                            !loadingBtnNext && "hide"
                          )}
                          style={{ top: "51px" }}
                        >
                          <div className="blockui">
                            <span>Đang tải ...</span>
                            <span>
                              <div className="spinner spinner-primary"></div>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SET 2 */}
                    {TabCurrent === "Index" && (
                      <div className="d-flex position-relative align-items-start">
                        <div className="border border-end-0 w-150px">
                          <div className="p-2 h-55px d-flex align-items-center justify-content-center min-w-150px border-right text-uppercase font-weight-bold">
                            Lớp
                          </div>
                          <div>
                            {values.CalendarList &&
                              values.CalendarList.map((item, index) => (
                                <div
                                  className="border-top px-2 d-flex align-items-center justify-content-center"
                                  style={{
                                    height: `${refHeight[index] || 55}px`,
                                  }}
                                  key={index}
                                >
                                  {item.ClassTitle}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="border flex-1 overflow-auto">
                          <div className="d-flex">
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 2
                              </div>
                            </div>
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 3
                              </div>
                            </div>
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 4
                              </div>
                            </div>
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 5
                              </div>
                            </div>
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 6
                              </div>
                            </div>
                            <div className="flex-1 border-right min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                Thứ 7
                              </div>
                            </div>
                            <div className="flex-1 min-w-200px">
                              <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                                CN
                              </div>
                            </div>
                          </div>
                          <MyRefComponent
                            values={values}
                            onSubmitRef={onSubmitRef}
                          />
                          {values.CalendarList &&
                            values.CalendarList.map((item, index) => (
                              <div
                                className="d-flex"
                                ref={(el) => (elRefs.current[index] = el)}
                                key={index}
                              >
                                <FieldArray
                                  name={`CalendarList[${index}].Days`}
                                  render={(arrayHelpers) => (
                                    <Fragment>
                                      {values.CalendarList[index].Days.map(
                                        (o, idx) => (
                                          <div
                                            className={`flex-1 p-2 min-h-55px border-top ${idx !==
                                              6 && "border-right"} min-w-200px`}
                                            key={idx}
                                          >
                                            <FastField
                                              name={`CalendarList[${index}].Days[${idx}].Items`}
                                              placeholder="Chọn tiết học"
                                            >
                                              {({ field, form, meta }) => (
                                                <Select
                                                  {...field}
                                                  isMulti
                                                  components={{
                                                    Option: CustomOption,
                                                  }}
                                                  menuPosition="fixed"
                                                  className="select-control"
                                                  classNamePrefix="select"
                                                  isClearable={true}
                                                  isSearchable={true}
                                                  //name={`CalendarList[${index}].Days[${idx}].Items`}
                                                  options={
                                                    values.HourScheduleList
                                                  }
                                                  placeholder="Chọn tiết học"
                                                  //value={o.Items}
                                                  onChange={(option) => {
                                                    form.setFieldValue(
                                                      `CalendarList[${index}].Days[${idx}].Items`,
                                                      option,
                                                      false
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                />
                                              )}
                                            </FastField>
                                          </div>
                                        )
                                      )}
                                    </Fragment>
                                  )}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    {TabCurrent === "Teacher" && (
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => setTabCurrent("Index")}
                      >
                        <i className="far fa-chevron-left font-size-xs mr-2"></i>
                        Quay lại
                      </Button>
                    )}
                  </div>
                  <div>
                    <Button type="button" variant="secondary" onClick={onHide}>
                      Đóng
                    </Button>
                    {values.SchoolID && (
                      <>
                        {TabCurrent === "Teacher" && (
                          <Button
                            type="submit"
                            variant="primary"
                            className={`btn btn-primary mt-0 ${btnLoading &&
                              "spinner spinner-white spinner-right"} w-auto h-auto`}
                            disabled={btnLoading}
                          >
                            {values.ID ? "Lưu thay đổi" : "Thêm mới"}
                          </Button>
                        )}
                        {TabCurrent === "Index" && (
                          <Button
                            type="button"
                            variant="primary"
                            className={`btn btn-primary mt-0 ${loadingBtnNext &&
                              "spinner spinner-white spinner-right"} w-auto h-auto`}
                            onClick={() => onNextTeacher(formikProps)}
                            disabled={loadingBtnNext}
                          >
                            Tiếp tục
                            <i className="far fa-chevron-right font-size-xs ms-2"></i>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalScheduleClass;
