import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import NumberFormat from "react-number-format";

ModalCategories.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValues = {
  Name: "",
  Count: "",
};

const categoriesSchema = Yup.object().shape({
  Name: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalCategories({ show, onHide, onAddEdit }) {
  
  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max2-sm">
      <Formik
        initialValues={initialValues}
        validationSchema={categoriesSchema}
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
                <Modal.Title>Thêm mới nhóm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên nhóm <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Name && touched.Name
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Name"
                    placeholder="Nhập tên nhóm"
                    autoComplete="off"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group mb-0">
                  <label>Vị trí</label>
                  <NumberFormat
                    type="text"
                    autoComplete="off"
                    allowNegative={false}
                    name={`Count`}
                    placeholder={"Nhập vị trí"}
                    className={`form-control`}
                    isNumericString={true}
                    //thousandSeparator={true}
                    value={values.Count}
                    onValueChange={(val) => {
                      setFieldValue(
                        `Count`,
                        val.floatValue ? val.floatValue : val.value
                      );
                    }}
                    onBlur={handleBlur}
                  />
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

export default ModalCategories;
