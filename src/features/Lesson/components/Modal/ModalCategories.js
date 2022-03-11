import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import NumberFormat from "react-number-format";

ModalCategories.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValue = {
  Title: "",
  Order: "",
};

const categoriesSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalCategories({ show, onHide, onAddEdit, loading, defaultValues }) {
  const [initialValues, setInitialValues] = useState(initialValue);

  useEffect(() => {
    if (show && defaultValues.ID) {
      setInitialValues((prev) => ({
        ...prev,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        Order: defaultValues.Order,
      }));
    } else {
      setInitialValues(initialValue);
    }
  }, [defaultValues, show]);

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
                <Modal.Title>
                  {!values.ID ? "Thêm mới nhóm" : "Chỉnh sửa nhóm"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên nhóm <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Title && touched.Title
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Title"
                    placeholder="Nhập tên nhóm"
                    autoComplete="off"
                    value={values.Title}
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
                    name="Order"
                    placeholder={"Nhập vị trí"}
                    className={`form-control`}
                    isNumericString={true}
                    //thousandSeparator={true}
                    value={values.Order}
                    onValueChange={(val) => {
                      setFieldValue(
                        `Order`,
                        val.floatValue ? val.floatValue : val.value
                      );
                    }}
                    onBlur={handleBlur}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onHide}>
                  Đóng
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={`btn btn-primary ${
                    loading
                      ? "spinner spinner-white spinner-right w-auto h-auto"
                      : ""
                  }`}
                  disabled={loading}
                >
                  {!values.ID ? "Thêm mới" : "Lưu thay đổi"}
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
