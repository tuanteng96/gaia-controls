import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import { Form, Formik, FieldArray } from "formik";

ModalContacts.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  Contacts: [
    {
      ten: "",
      sdt: "",
      email: "",
      chuc_vu: "",
    },
  ],
};

function ModalContacts({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);

  useEffect(() => {
    setInitialValues((prevState) => ({
      ...prevState,
      ID: defaultValues.ID,
      Title: defaultValues.Title,
      Phone: defaultValues.Phone,
      Email: defaultValues.Email,
      Address: defaultValues.Address,
      City: defaultValues.PID
        ? { value: defaultValues.PID, label: defaultValues.PTitle }
        : null,
      District: defaultValues.DID
        ? { value: defaultValues.DID, label: defaultValues.DTitle }
        : null,
      Contacts:
        defaultValues.Contacts && defaultValues.Contacts.length > 0
          ? defaultValues.Contacts
          : prevState.Contacts,
      Levels:
        defaultValues.LevelJson && JSON.parse(defaultValues.LevelJson)
          ? JSON.parse(defaultValues.LevelJson).map((item) => ({
              ...item,
              label: item?.Title,
              value: item?.ID,
            }))[0]
          : null,
    }));
  }, [defaultValues]);

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Formik
        initialValues={initialValues}
        onSubmit={onAddEdit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            handleChange,
            handleBlur,
          } = formikProps;
          return (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Người liên hệ - {defaultValues.Title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table className="mb-0" bordered responsive>
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th className="w-250px">Chức vụ</th>
                      <th className="w-250px">Điện thoại</th>
                      <th className="w-250px">Email</th>
                      <th className="text-center w-60px">#</th>
                    </tr>
                  </thead>

                  <FieldArray
                    name="Contacts"
                    render={(arrayHelpers) => (
                      <tbody>
                        {values.Contacts &&
                          values.Contacts.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name={`Contacts.${index}.ten`}
                                  placeholder="Nhập tên"
                                  autoComplete="off"
                                  value={item.ten}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name={`Contacts.${index}.chuc_vu`}
                                  placeholder="Nhập chức vụ"
                                  autoComplete="off"
                                  value={item.chuc_vu}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name={`Contacts.${index}.sdt`}
                                  placeholder="Nhập số điện thoại"
                                  autoComplete="off"
                                  value={item.sdt}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name={`Contacts.${index}.email`}
                                  placeholder="Nhập Email"
                                  autoComplete="off"
                                  value={item.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td className="text-center">
                                {values.Contacts.length - 1 === index && (
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                      arrayHelpers.push({
                                        ten: "",
                                        sdt: "",
                                        email: "",
                                        chuc_vu: "",
                                      })
                                    }
                                  >
                                    <i className="far fa-plus pe-0 icon-1x"></i>
                                  </button>
                                )}
                                {values.Contacts.length - 1 !== index && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    <i className="fas fa-trash pe-0 icon-sm"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    )}
                  />
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
                  Cập nhập
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
