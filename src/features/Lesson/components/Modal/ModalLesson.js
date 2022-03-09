import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Select from "react-select";

ModalLesson.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValues = {
  Name: "",
  Count: "",
};

const lessonSchema = Yup.object().shape({
  Name: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalLesson({ show, onHide, onAddEdit }) {
  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max2-sm">
      <Formik
        initialValues={initialValues}
        validationSchema={lessonSchema}
        onSubmit={onAddEdit}
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
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Thêm mới bài giảng</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên bài giảng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Name && touched.Name
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Name"
                    placeholder="Nhập tên bài giảng"
                    autoComplete="off"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Mã</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Name && touched.Name
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Name"
                    placeholder="Mã bài giảng"
                    autoComplete="off"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <Select
                    className="select-control"
                    classNamePrefix="select"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={false}
                    isSearchable={true}
                    name="color"
                    options={[{ value: "1", label: "Mỹ phẩm 1" }]}
                    placeholder="Chọn danh mục"
                  />
                </div>
                <div className="form-group">
                  <label>Link Online</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                    />
                    <label className="custom-file-label" for="customFile">
                      Chọn file Online
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Giáo án</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                    />
                    <label className="custom-file-label" for="customFile">
                      Chọn file giáo án
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>File Mã hóa</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                    />
                    <label className="custom-file-label" for="customFile">
                      Chọn file Mã hóa
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Hình ảnh</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                    />
                    <label className="custom-file-label" for="customFile">
                      Chọn file hình ảnh
                    </label>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  className="btn btn-primary spinner spinner-white spinner-right w-auto h-auto"
                  disabled={true}
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

export default ModalLesson;
