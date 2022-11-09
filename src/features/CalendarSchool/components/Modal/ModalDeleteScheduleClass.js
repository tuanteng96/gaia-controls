import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
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
  DeleteClassIDs: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string()
          .required()
          .label("value"),
      })
    )
    .min(1, "The error message if length === 0 | 1"),
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
    DeleteClassIDs: [],
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
        onSubmit={onSubmit}
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
                        errors?.DeleteClassIDs && touched?.DeleteClassIDs
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      name="DeleteClassIDs"
                      options={ListClass}
                      placeholder="Chọn lớp"
                      value={values.DeleteClassIDs}
                      onChange={(option) => {
                        setFieldValue("DeleteClassIDs", option);
                      }}
                      onBlur={handleBlur}
                      menuPosition="fixed"
                      isDisabled={!values.SchoolID}
                      noOptionsMessage={() => "Không có lớp"}
                    />
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
                  className={`btn btn-primary ${loadingBtn &&
                    "spinner spinner-white spinner-right mt-0"} w-auto h-auto`}
                  disabled={loadingBtn}
                >
                  Thực hiện
                </Button>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalDeleteScheduleClass;
