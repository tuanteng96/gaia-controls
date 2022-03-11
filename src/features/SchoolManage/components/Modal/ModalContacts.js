import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";

ModalContacts.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  Title: "",
  Phone: "",
  Email: "",
  Address: "",
  City: null,
  District: null,
  Contacts: [],
  Levels: null,
};

const contactsSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalContacts({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Formik
        initialValues={initialValues}
        validationSchema={contactsSchema}
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
                  {values.ID ? "Chỉnh sửa bài giảng" : "Thêm mới bài giảng"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table className="mb-0" bordered responsive>
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Chức vụ</th>
                      <th>Điện thoại</th>
                      <th>Email</th>
                      <th className="text-center w-60px">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr> */}
                  </tbody>
                </Table>
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
                  {values.ID ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalContacts;
