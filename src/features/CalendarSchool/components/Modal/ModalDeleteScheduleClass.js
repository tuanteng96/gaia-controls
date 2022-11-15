import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import AsyncSelectSchool from "../../../../components/Selects/AsyncSelectSchool";
import Select from "react-select";

ModalDeleteScheduleClass.propTypes = {
  show: PropTypes.bool,
};

const AddSchema = Yup.object().shape({
  From: Yup.string()
    .nullable()
    .required("Vui lòng chọn ngày"),
  To: Yup.string()
    .nullable()
    .required("Vui lòng chọn ngày"),
  SchoolID: Yup.object()
    .nullable()
    .required("Vui lòng chọn trường"),
  // ClassIDs: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       value: Yup.string()
  //         .required()
  //         .label("value"),
  //     })
  //   )
  //   .min(1, "The error message if length === 0 | 1"),
});

function ModalDeleteScheduleClass({
  show,
  onHide,
  onSubmit,
  loadingBtn,
  AllInitial,
}) {
  const [initialValues] = useState({
    SchoolID: "",
    From: "",
    To: "",
    ClassIDs: [],
  });
  const [ListClass, setListClass] = useState([]);
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
        onSubmit={(values) => onSubmit(values, ListClass)}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            setFieldValue,
          } = formikProps;

          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>
                  {AllInitial?.TakeBreak && "Thông báo nghỉ buổi"}
                  {!AllInitial?.TakeBreak && "Xóa lịch cho lớp"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="p-15px">
                  <div className="form-group">
                    <label>Từ ngày</label>
                    <DatePicker
                      popperProps={{
                        positionFixed: true,
                      }}
                      className={`form-control ${
                        errors?.From && touched.From
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      selected={values?.From ? new Date(values?.From) : ""}
                      onChange={(date) => setFieldValue("From", date)}
                      // popperPlacement="bottom-end"
                      //shouldCloseOnSelect={false}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                      //onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group">
                    <label>Đến ngày</label>
                    <DatePicker
                      popperProps={{
                        positionFixed: true,
                      }}
                      className={`form-control ${
                        errors?.To && touched.To
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      selected={values?.To ? new Date(values?.To) : ""}
                      onChange={(date) => setFieldValue("To", date)}
                      // popperPlacement="bottom-end"
                      //shouldCloseOnSelect={false}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                    />
                  </div>
                  <div className="form-group">
                    <label>Trường</label>
                    <AsyncSelectSchool
                      menuPosition="fixed"
                      placeholder="Chọn trường"
                      noOptionsMessage={() => "Không có trường"}
                      className={`select-control ${
                        errors?.SchoolID && touched?.SchoolID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      onChange={(option) => {
                        if (option && option.ClassList) {
                          const newListClass = option.ClassList.map((x) => ({
                            ...x,
                            value: x.Title,
                            label: x.Title,
                          }));
                          setListClass(newListClass);
                        } else {
                          setListClass([]);
                        }
                        setFieldValue("SchoolID", option);
                      }}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label>Lớp</label>
                    <Select
                      isMulti
                      isClearable
                      className={`select-control ${
                        errors?.ClassIDs && touched?.ClassIDs
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      name="ClassIDs"
                      options={ListClass}
                      placeholder="Chọn lớp"
                      value={values.ClassIDs}
                      onChange={(option) => {
                        setFieldValue("ClassIDs", option);
                      }}
                      onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.SchoolID}
                      noOptionsMessage={() => "Không có lớp"}
                    />
                  </div>
                  {values.SchoolID && (
                    <span className="form-text text-muted d-inline-block mt-5px">
                      Nếu bạn không chọn lớp sẽ xóa tất cả lịch của lớp tại
                      trường.
                    </span>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <div>
                    {!AllInitial?.TakeBreak && (
                      <label className="radio">
                        <Field>
                          {({ field, form }) => (
                            <input
                              type="checkbox"
                              {...field}
                              onChange={(e) => {
                                const { checked } = e.target;
                                form.setFieldValue(
                                  "From",
                                  checked ? new Date("01/01/2000") : ""
                                );
                                form.setFieldValue(
                                  "To",
                                  checked ? new Date("01/01/2050") : ""
                                );
                              }}
                            />
                          )}
                        </Field>
                        <span />
                        <div className="d-flex flex-column">
                          <span className="text font-size-sm">
                            Xóa tất cả lịch
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                  <div>
                    <Button type="button" variant="secondary" onClick={onHide}>
                      Đóng
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className={`btn btn-primary ${loadingBtn &&
                        "spinner spinner-white spinner-right mt-0"} w-auto h-auto`}
                      disabled={loadingBtn}
                    >
                      Thực hiện
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

export default ModalDeleteScheduleClass;
