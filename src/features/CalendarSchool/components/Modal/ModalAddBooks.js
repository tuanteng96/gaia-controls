import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import AsyncSelectTeachers from "../../../../components/Selects/AsyncSelectTeachers";
import AsyncSelectSchool from "../../../../components/Selects/AsyncSelectSchool";
import Select from "react-select";
import { OverlayTrigger, Popover } from "react-bootstrap";
import PopoverAddTeacher from "../Popover/PopoverAddTeacher";
import DatePicker from "react-datepicker";
import SelectTeachersParams from "../SelectTeachersParams";

const initialValue = {
  major: { Title: "", IsThematic: false },
  dayItem: {
    IsThematic: false,
    ID: 0, //id buoi
    SchoolID: "", //id truong
    SchoolTitle: "", //ten truong
    ClassID: "", //
    ClassTitle: "", //
    ClassLevel: "", //
    Date: "", //
    Index: "", //tieets hoc 1->12
    TeacherID: "", //id gias vien
    TeacherTitle: "", //ten vien
  },
  joins: [],
};

const AddSchema = Yup.object().shape({
  major: Yup.object()
    .shape({
      IsThematic: Yup.bool().notRequired(),
      Title: Yup.string().when("IsThematic", {
        is: (IsThematic) => IsThematic,
        then: Yup.string().required("Vui lòng nhập chuyên đề"),
      }),
    })
    .nullable()
    .required("Thiếu thông tin"),
  dayItem: Yup.object()
    .shape({
      SchoolID: Yup.object()
        .nullable()
        .required("Vui lòng chọn trường"),
      ClassID: Yup.object()
        .nullable()
        .when("IsThematic", {
          is: (IsThematic) => !IsThematic,
          then: Yup.object()
            .nullable()
            .required("Vui lòng chọn lớp"),
        }),
      Index: Yup.array()
        .nullable()
        .required("Vui lòng chọn tiết"),
      TeacherID: Yup.object()
        .nullable()
        .required("Vui lòng chọn giáo viên"),
      Date: Yup.string()
        .nullable()
        .required("Vui lòng chọn ngày"),
    })
    .nullable()
    .required("Thiếu thông tin"),
});

function ModalAddBooks({
  show,
  onHide,
  onSubmit,
  InitialValueAdd,
  loadingBtn,
  onDeleteBook,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [SchoolCurrent, setSchoolCurrent] = useState(null);
  const [ListIndex, setListIndex] = useState([]);
  const [ListClass, setListClass] = useState([]);
  const [keyUpdate, setKeyUpdate] = useState(0);

  useEffect(() => {
    if (SchoolCurrent) {
      setListIndex(
        (SchoolCurrent?.HourScheduleList &&
          SchoolCurrent?.HourScheduleList.map((item, idx) => ({
            ...item,
            label: item.Title,
            value: idx + 1,
          }))) ||
          []
      );
      setListClass(
        (SchoolCurrent?.ClassList &&
          SchoolCurrent?.ClassList.map((item) => ({
            ...item,
            label: item.Title,
            value: item.ID,
          }))) ||
          []
      );
    } else {
      setListIndex([]);
      setListClass([]);
    }
  }, [SchoolCurrent]);

  useEffect(() => {
    if (InitialValueAdd) {
      setInitialValues((prevState) => ({
        ...prevState,
        major: {
          ...prevState.major,
          IsThematic: InitialValueAdd.IsThematic ?? false,
          Title: InitialValueAdd?.major?.Title ?? "",
        },
        dayItem: {
          ...prevState.dayItem,
          IsThematic: InitialValueAdd.IsThematic ?? false,
          ID: InitialValueAdd?.dayItem?.ID ?? 0,
          CalendarItemID: InitialValueAdd?.dayItem?.CalendarItemID ?? 0,
          SchoolID: InitialValueAdd?.dayItem?.SchoolID ?? "",
          ClassID: InitialValueAdd?.dayItem?.ClassID ?? "",
          Date: InitialValueAdd?.dayItem?.Date ?? "",
          TeacherID: InitialValueAdd?.dayItem?.TeacherID ?? "",
          Index: InitialValueAdd?.dayItem?.Index ?? [],
          MajorID: InitialValueAdd?.dayItem?.MajorID ?? 0,
        },
        joins: InitialValueAdd.joins ?? [],
      }));
      if (InitialValueAdd?.dayItem?.SchoolID) {
        setSchoolCurrent(InitialValueAdd?.dayItem?.SchoolID);
      }
    } else {
      setInitialValues(initialValue);
      setSchoolCurrent(null);
    }
  }, [InitialValueAdd]);
  if (!InitialValueAdd) return <Fragment></Fragment>;
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
      enforceFocus={false}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={AddSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            setFieldValue,
          } = formikProps;
          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>
                  {values?.dayItem?.ID ? "Thông tin tiết" : "Tạo mới tiết"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="p-15px border-bottom">
                  <div className="form-group d-flex justify-content-between align-items-center">
                    <label className="mb-0">Tiết có chuyên đề</label>
                    <span className="switchs">
                      <label>
                        <input
                          type="checkbox"
                          name="major.IsThematic"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values?.major?.IsThematic}
                        />
                        <span></span>
                      </label>
                    </span>
                  </div>
                  {values?.major?.IsThematic && (
                    <div className="form-group">
                      <label>Tên chuyên đề</label>
                      <input
                        className={`form-control ${
                          errors?.major?.Title && touched?.major?.Title
                            ? "is-invalid solid-invalid"
                            : ""
                        }`}
                        name="major.Title"
                        value={values?.major?.Title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Nhập tên chuyên đề"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Ngày</label>
                    <DatePicker
                      popperProps={{
                        positionFixed: true,
                      }}
                      className={`form-control ${
                        errors?.dayItem?.Date && touched?.dayItem?.Date
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      selected={
                        values?.dayItem?.Date
                          ? new Date(values?.dayItem?.Date)
                          : ""
                      }
                      onChange={(date) => {
                        setFieldValue("dayItem.Date", date, false);
                        !values?.major?.IsThematic &&
                          setFieldValue("dayItem.TeacherID", "", false);
                        setKeyUpdate(keyUpdate + 1);
                      }}
                      // popperPlacement="bottom-end"
                      //shouldCloseOnSelect={false}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                    />
                  </div>
                  <div className="form-group">
                    <label>Trường</label>
                    <AsyncSelectSchool
                      className={`select-control ${
                        errors?.dayItem?.SchoolID && touched?.dayItem?.SchoolID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      placeholder="Chọn trường"
                      name="dayItem.SchoolID"
                      menuPosition="fixed"
                      value={values.dayItem.SchoolID}
                      onChange={(option) => {
                        setFieldValue("dayItem.SchoolID", option, false);
                        setFieldValue("dayItem.Index", "", false);
                        setFieldValue("dayItem.ClassID", "", false);
                        !values?.major?.IsThematic &&
                          setFieldValue("dayItem.TeacherID", "", false);
                        setSchoolCurrent(option);
                        setKeyUpdate(keyUpdate + 1);
                      }}
                      //onBlur={handleBlur}
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Danh sách trường trống"
                          : "Không tìm thấy trường phù hợp."
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Lớp</label>
                    <Select
                      isClearable
                      className={`select-control ${
                        errors?.dayItem?.ClassID && touched?.dayItem?.ClassID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      name="dayItem.ClassID"
                      options={ListClass}
                      placeholder="Chọn lớp"
                      value={values.dayItem.ClassID}
                      onChange={(option) => {
                        setFieldValue("dayItem.ClassID", option, false);
                        !values?.major?.IsThematic &&
                          setFieldValue("dayItem.TeacherID", "", false);
                        setKeyUpdate(keyUpdate + 1);
                      }}
                      //onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.dayItem.SchoolID}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tiết học</label>
                    <Select
                      isClearable
                      className={`select-control ${
                        errors?.dayItem?.Index && touched?.dayItem?.Index
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      isMulti={values?.major?.IsThematic}
                      classNamePrefix="select"
                      name="dayItem.Index"
                      options={ListIndex}
                      placeholder="Chọn tiết"
                      value={values.dayItem.Index}
                      onChange={(option) => {
                        setFieldValue(
                          "dayItem.Index",
                          !Array.isArray(option) ? [option] : option,
                          false
                        );
                        !values?.major?.IsThematic &&
                          setFieldValue("dayItem.TeacherID", "", false);
                        setKeyUpdate(keyUpdate + 1);
                      }}
                      //onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.dayItem.SchoolID}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label>Giáo viên</label>
                    {values?.major?.IsThematic && (
                      <AsyncSelectTeachers
                        isClearable
                        className={`select-control ${
                          errors?.dayItem?.TeacherID &&
                          touched?.dayItem?.TeacherID
                            ? "is-invalid solid-invalid"
                            : ""
                        }`}
                        placeholder="Chọn giáo viên"
                        name="TeacherID"
                        menuPosition="fixed"
                        value={values?.dayItem?.TeacherID}
                        onChange={(option) => {
                          setFieldValue("dayItem.TeacherID", option, false);
                        }}
                        //onBlur={handleBlur}
                        noOptionsMessage={({ inputValue }) =>
                          !inputValue
                            ? "Danh sách giáo viên trống"
                            : "Không tìm thấy giáo viên phù hợp."
                        }
                      />
                    )}
                    {!values?.major?.IsThematic && (
                      <SelectTeachersParams
                        //key={keyUpdate}
                        isClearable
                        className={`select-control ${
                          errors?.dayItem?.TeacherID &&
                          touched?.dayItem?.TeacherID
                            ? "is-invalid solid-invalid"
                            : ""
                        }`}
                        placeholder="Chọn giáo viên"
                        name="TeacherID"
                        params={{
                          Date: values?.dayItem?.Date,
                          SchoolID: values.dayItem.SchoolID,
                          ClassID: values.dayItem.ClassID,
                          Index: values.dayItem.Index,
                        }}
                        value={values?.dayItem?.TeacherID}
                        onChange={(option) => {
                          setFieldValue("dayItem.TeacherID", option, false);
                        }}
                        //onBlur={handleBlur}
                      />
                    )}
                  </div>
                </div>
                <div className="p-15px">
                  <div className="d-flex align-items-center justify-content-between mb-12px">
                    <div className="font-weight-bold text-uppercase font-size-md">
                      Giáo viên phụ
                    </div>
                    <OverlayTrigger
                      rootClose
                      trigger="click"
                      key="top"
                      placement="top"
                      overlay={
                        <Popover id={`popover-positioned-top}`}>
                          <PopoverAddTeacher
                            onSubmit={(value, { resetForm }) => {
                              const newJoins = values.joins
                                ? [...values.joins]
                                : [];
                              const index = newJoins.findIndex(
                                (item) =>
                                  item.TeacherID === value?.TeacherID?.value
                              );
                              if (index > -1) {
                                newJoins[index].Desc = value.Desc;
                                newJoins[index].IsRequire = value.IsRequire;
                                newJoins[index].SkillID = value?.SkillID?.value;
                                newJoins[index].SkillTitle =
                                  value?.SkillID?.label;
                              } else {
                                const newJoinItem = {
                                  TeacherID: value?.TeacherID?.value,
                                  TeacherTitle: value?.TeacherID?.label,
                                  Desc: value.Desc,
                                  IsRequire: value.IsRequire,
                                  SkillID: value?.SkillID?.value,
                                  SkillTitle: value?.SkillID?.label,
                                };
                                newJoins.push(newJoinItem);
                              }
                              setFieldValue("joins", newJoins, false);
                              resetForm();
                              document.body.click();
                            }}
                          />
                        </Popover>
                      }
                    >
                      <button className="btn btn-success btn-xss" type="button">
                        Thêm GV
                      </button>
                    </OverlayTrigger>
                  </div>
                  {values.joins && values.joins.length > 0 ? (
                    <FieldArray
                      name="joins"
                      render={(arrayHelpers) => (
                        <div className="list-assistant">
                          {values.joins.map((item, index) => (
                            <div className="list-assistant__item" key={index}>
                              <div className="flex-1">
                                <div className="font-size-md font-weight-500">
                                  {item.TeacherTitle}
                                  {item.IsRequire && (
                                    <i className="text-danger fas fa-badge-check pl-5px"></i>
                                  )}
                                </div>
                                <div className="text-muted">
                                  {item.SkillTitle} -{" "}
                                  {item.Desc || "Không có ghi chú"}
                                </div>
                              </div>
                              <div
                                className="list-assistant__close"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <i className="fal fa-times"></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  ) : (
                    <div className="text-muted font-size-sm">
                      Chưa có giáo viên phụ.
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                  <div>
                    {values?.dayItem?.ID || values?.dayItem?.CalendarItemID ? (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => onDeleteBook(values?.dayItem)}
                        className={`btn btn-primary`}
                      >
                        Xóa lịch
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <Button type="button" variant="secondary" onClick={onHide}>
                      Đóng
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className={`btn btn-primary ${loadingBtn.Books &&
                        "spinner spinner-white spinner-right mt-0"} w-auto h-auto`}
                      disabled={loadingBtn.Books}
                    >
                      {values?.dayItem?.ID || values?.dayItem?.CalendarItemID
                        ? "Cập nhập"
                        : "Thêm mới"}
                    </Button>
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

ModalAddBooks.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

export default ModalAddBooks;
