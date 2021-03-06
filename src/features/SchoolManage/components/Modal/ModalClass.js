import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import { Form, Formik, FieldArray } from "formik";
import Select from "react-select";

ModalClass.propTypes = {
  show: PropTypes.bool,
};

const Khoi = [
  {
    label: "Khối 1",
    value: 1,
  },
  {
    label: "Khối 2",
    value: 2,
  },
  {
    label: "Khối 3",
    value: 3,
  },
  {
    label: "Khối 4",
    value: 4,
  },
  {
    label: "Khối 5",
    value: 5,
  },
  {
    label: "Khối 6",
    value: 6,
  },
  {
    label: "Khối 7",
    value: 7,
  },
  {
    label: "Khối 8",
    value: 8,
  },
  {
    label: "Khối 9",
    value: 9,
  },
  {
    label: "Khối 10",
    value: 10,
  },
  {
    label: "Khối 11",
    value: 11,
  },
  {
    label: "Khối 12",
    value: 12,
  },
];

const initialValue = {
  ClassList: [
    {
      Order: 1,
      Title: "",
      SchoolID: null,
      Level: null,
    },
  ],
};

function ModalClass({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);

  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues((prevState) => ({
        ...prevState,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        ClassList:
          defaultValues.ClassList && defaultValues.ClassList.length > 0
            ? defaultValues.ClassList.map((item) => ({
                ...item,
                Level: item.Level
                  ? {
                      label: `Khối ${item.Level}`,
                      value: item.Level,
                    }
                  : null,
              }))
            : initialValue.ClassList.map((item) => ({
                ...item,
                SchoolID: defaultValues.ID,
              })),
      }));
    }
  }, [defaultValues]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Formik
        initialValues={initialValues}
        onSubmit={onAddEdit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            setFieldValue,
            handleChange,
            handleBlur,
          } = formikProps;
          return (
            <Form>
              {console.log(values)}
              <Modal.Header closeButton>
                <Modal.Title>Danh sách lớp - {defaultValues.Title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table className="mb-0" bordered responsive>
                  <thead>
                    <tr>
                      <th className="w-70px text-center">STT</th>
                      <th>Tên lớp</th>
                      <th className="w-180px">Khối</th>
                      <th className="w-300px">Trường</th>
                      <th className="text-center w-60px">#</th>
                    </tr>
                  </thead>
                  <FieldArray
                    name="ClassList"
                    render={(arrayHelpers) => (
                      <tbody>
                        {values.ClassList &&
                          values.ClassList.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  name={`ClassList.${index}.Order`}
                                  placeholder="STT"
                                  autoComplete="off"
                                  value={item.Order}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name={`ClassList[${index}].Title`}
                                  placeholder="Nhập tên"
                                  autoComplete="off"
                                  value={item.Title}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <Select
                                  isClearable
                                  className="select-control"
                                  classNamePrefix="select"
                                  name={`ClassList[${index}].Level`}
                                  options={Khoi}
                                  placeholder="Chọn khối"
                                  value={item.Level}
                                  onChange={(option) => {
                                    setFieldValue(
                                      `ClassList[${index}].Level`,
                                      option,
                                      false
                                    );
                                  }}
                                  menuPosition="fixed"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Nhập chức vụ"
                                  autoComplete="off"
                                  value={values.Title}
                                  disabled={true}
                                />
                              </td>
                              <td className="text-center">
                                {values.ClassList.length - 1 === index && (
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                      arrayHelpers.push({
                                        Title: "",
                                        SchoolID: values.ID,
                                        Order: values.ClassList.length + 1,
                                      })
                                    }
                                  >
                                    <i className="far fa-plus pe-0 icon-1x"></i>
                                  </button>
                                )}
                                {values.ClassList.length - 1 !== index && (
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

export default ModalClass;
