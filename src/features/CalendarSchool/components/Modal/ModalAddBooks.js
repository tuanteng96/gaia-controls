import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import AsyncSelectTeachers from "../../../../components/Selects/AsyncSelectTeachers";
import AsyncSelectSchool from "../../../../components/Selects/AsyncSelectSchool";
import Select from "react-select";
import { OverlayTrigger, Popover } from "react-bootstrap";
import AsyncSelectSkills from "../../../../components/Selects/AsyncSelectSkills";

const initialValue = {
  major: null,
  dayItem: {
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
  // TeacherId: Yup.object()
  //     .shape({
  //         value: Yup.string(),
  //         label: Yup.string(),
  //     })
  //     .nullable()
  //     .required('Vui lòng chọn giáo viên')
});

function ModalAddBooks({
  show,
  onHide,
  onSubmit,
  InitialValueAdd,
  btnLoading,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [SchoolCurrent, setSchoolCurrent] = useState(null);
  const [ListIndex, setListIndex] = useState([]);
  const [ListClass, setListClass] = useState([]);

  useEffect(() => {
    if (SchoolCurrent) {
      setListIndex(
        SchoolCurrent.HourScheduleList.map((item, idx) => ({
          ...item,
          label: item.Title,
          value: item.idx + 1,
        })) ?? []
      );
      setListClass(
        SchoolCurrent?.ClassList.map((item) => ({
          ...item,
          label: item.Title,
          value: item.ID,
        })) ?? []
      );
    } else {
      setListIndex([]);
      setListClass([]);
    }
  }, [SchoolCurrent]);

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
                  {InitialValueAdd?.IsThematic
                    ? "Tạo mới tiết chuyên đề"
                    : "Tạo mới tiết thông thường"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="p-15px border-bottom">
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
                        setFieldValue("dayItem.Index", null, false);
                        setFieldValue("dayItem.ClassID", null, false);
                        setSchoolCurrent(option);
                      }}
                      onBlur={handleBlur}
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
                      className="select-control"
                      classNamePrefix="select"
                      name="dayItem.ClassLevel"
                      options={ListClass}
                      placeholder="Chọn lớp"
                      value={values.dayItem.ClassLevel}
                      onChange={(option) => {
                        setFieldValue("dayItem.ClassLevel", option, false);
                      }}
                      onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.dayItem.SchoolID}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tiết học</label>
                    <Select
                      isMulti
                      className="select-control"
                      classNamePrefix="select"
                      name="dayItem.Index"
                      options={ListIndex}
                      placeholder="Chọn tiết"
                      value={values.dayItem.Index}
                      onChange={(option) => {
                        setFieldValue("dayItem.Index", option, false);
                      }}
                      onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.dayItem.SchoolID}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label>Giáo viên</label>
                    <AsyncSelectTeachers
                      className={`select-control ${
                        errors?.dayItem?.TeacherID &&
                        touched?.dayItem?.TeacherID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      placeholder="Chọn giáo viên"
                      name="TeacherID"
                      menuPosition="fixed"
                      value={values.dayItem.TeacherID}
                      onChange={(option) => {
                        setFieldValue("dayItem.TeacherID", option, false);
                      }}
                      onBlur={handleBlur}
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Danh sách giáo viên trống"
                          : "Không tìm thấy giáo viên phù hợp."
                      }
                    />
                  </div>
                </div>
                <div className="p-15px">
                  <div className="d-flex align-items-center justify-content-between mb-5px">
                    <div className="font-weight-bold text-uppercase font-size-sm">
                      Giáo viên phụ
                    </div>
                    <OverlayTrigger
                      rootClose
                      trigger="click"
                      key="top"
                      placement="top"
                      overlay={
                        <Popover id={`popover-positioned-top}`}>
                          <Popover.Header className="font-weight-bold d-flex justify-content-between py-2">
                            Thêm giáo viên phụ
                          </Popover.Header>
                          <Popover.Body>
                            <div className="form-group">
                              <label>Giáo viên</label>
                              <AsyncSelectTeachers
                                className={`select-control ${
                                  errors?.dayItem?.TeacherID &&
                                  touched?.dayItem?.TeacherID
                                    ? "is-invalid solid-invalid"
                                    : ""
                                }`}
                                placeholder="Chọn giáo viên"
                                name="adad"
                                value={values.dayItem.TeacherID}
                                onChange={(option) => {
                                  setFieldValue(
                                    "dayItem.TeacherID",
                                    option,
                                    false
                                  );
                                }}
                                onBlur={handleBlur}
                                noOptionsMessage={({ inputValue }) =>
                                  !inputValue
                                    ? "Danh sách giáo viên trống"
                                    : "Không tìm thấy giáo viên phù hợp."
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Kỹ năng</label>
                              <AsyncSelectSkills
                                className={`select-control ${
                                  errors?.dayItem?.TeacherID &&
                                  touched?.dayItem?.TeacherID
                                    ? "is-invalid solid-invalid"
                                    : ""
                                }`}
                                placeholder="Chọn kỹ năng"
                                name="adad"
                                value={values.dayItem.TeacherID}
                                onChange={(option) => {
                                  setFieldValue(
                                    "dayItem.TeacherID",
                                    option,
                                    false
                                  );
                                }}
                                onBlur={handleBlur}
                                noOptionsMessage={({ inputValue }) =>
                                  !inputValue
                                    ? "Danh sách giáo viên trống"
                                    : "Không tìm thấy giáo viên phù hợp."
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Mô tả</label>
                              <textarea
                                rows="3"
                                className="form-control"
                                name="desc"
                                value={values.desc}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Nhập mô tả"
                              />
                            </div>
                            <div className="form-group mb-0 d-flex justify-content-between align-items-center">
                              <label className="mb-0">Bắt buộc giáo viên</label>
                              <span className="switchs">
                                <label>
                                  <input
                                    type="checkbox"
                                    name="required"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    checked={values.required}
                                  />
                                  <span></span>
                                </label>
                              </span>
                            </div>
                          </Popover.Body>
                          <div className="font-weight-bold d-flex justify-content-between py-2 px-3 border-top">
                            <button className="btn btn-success py-1 font-size-sm">
                              Lưu giáo viên
                            </button>
                          </div>
                        </Popover>
                      }
                    >
                      <button className="btn btn-success btn-xss" type="button">
                        Thêm GV
                      </button>
                    </OverlayTrigger>
                  </div>
                  <div className="text-muted font-size-sm">
                    Chưa có giáo viên phụ.
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onHide}>
                  Đóng
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={`btn btn-primary ${btnLoading &&
                    "spinner spinner-white spinner-right"} w-auto h-auto`}
                  disabled={btnLoading}
                >
                  Thêm mới
                </Button>
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
