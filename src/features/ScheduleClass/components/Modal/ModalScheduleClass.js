import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import ScheduleGenerator from "../../ScheduleGenerator";

ModalScheduleClass.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  ClassList: [],
};

function ModalScheduleClass({
  show,
  onHide,
  onAddEdit,
  defaultValues,
  btnLoading,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);

  const onGeneratorBook = (val) => {
    setInitialValues((prevState) => ({
      ...prevState,
      ClassList: val.School.ClassList || [],
    }));
  };

  return (
    <Modal show={show} onHide={onHide} scrollable={true} size="xl">
      <Formik
        initialValues={initialValues}
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
            <Form
              className="d-flex flex-column overflow-hidden align-items-stretch"
              onSubmit={formikProps.handleSubmit}
            >
              {console.log(values)}
              <Modal.Header closeButton>
                <Modal.Title>Tạo mới lịch học</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ScheduleGenerator onSubmit={onGeneratorBook} />
                <div className="mt-4">
                  <div className="border-top border-left border-right text-center font-weight-bold text-uppercase h-50px d-flex justify-content-center align-items-center font-size-md">
                    Trường Lê Quý Đôn - Từ ngày đến
                  </div>
                  <div className="d-flex position-relative">
                    <div className="border border-end-0 w-150px">
                      <div className="p-2 h-40px d-flex align-items-center justify-content-center min-w-150px border-right text-uppercase font-weight-bold">
                        Lớp
                      </div>
                      <div>
                        {values.ClassList &&
                          values.ClassList.map((item, index) => (
                            <div
                              className="border-top px-2 h-40px d-flex align-items-center justify-content-center"
                              key={index}
                            >
                              {item.Title}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border flex-1 overflow-auto">
                      {/* Header */}
                      <div className="d-flex">
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 2
                          </div>
                        </div>
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 3
                          </div>
                        </div>
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 4
                          </div>
                        </div>
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 5
                          </div>
                        </div>
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 6
                          </div>
                        </div>
                        <div className="flex-1 border-right min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            Thứ 7
                          </div>
                        </div>
                        <div className="flex-1 min-w-200px">
                          <div className="h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                            CN
                          </div>
                        </div>
                      </div>
                      {/* End Header */}

                      {values.ClassList &&
                        values.ClassList.map((item, index) => (
                          <div className="d-flex" key={index}>
                            {Array(7)
                              .fill()
                              .map((o, idx) => (
                                <div
                                  className={`flex-1 h-40px border-top ${idx !==
                                    6 && "border-right"} min-w-200px`}
                                  key={idx}
                                >
                                  a
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
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

export default ModalScheduleClass;
