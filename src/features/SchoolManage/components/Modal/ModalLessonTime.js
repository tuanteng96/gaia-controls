import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
//import DatePicker from "react-datepicker";
import { Modal, Button, Table } from "react-bootstrap";
import { Form, Formik, FieldArray } from "formik";
import TimeField from "react-simple-timefield";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ModalLessonTime.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  LessonListTime: [],
};

function ModalLessonTime({
  show,
  onHide,
  onSubmit,
  btnLoading,
  ValuesCurrent,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);

  useEffect(() => {
    const newInitial = [];
    var initialTime = moment({ h: 7, m: 10, s: 0 }).format("YYYY/MM/DD HH:mm");
    var TimeStart,
      TimeEnd = null;
    var LessonMinute = 40;
    var BreakTime = 5;
    for (var i = 1; i <= 12; i++) {
      
      if (!TimeEnd) {
        TimeStart = moment(initialTime)
          .add({ minute: BreakTime })
          .format("YYYY/MM/DD HH:mm");
        TimeEnd = moment(TimeStart)
          .add({ minute: LessonMinute })
          .format("YYYY/MM/DD HH:mm");
      } else {
        if (i === 7) {
          TimeEnd = moment({ h: 1, m: 25, s: 0 }).format("YYYY/MM/DD HH:mm");
        }
        TimeStart = moment(TimeEnd)
          .add({ minute: BreakTime })
          .format("YYYY/MM/DD HH:mm");
        TimeEnd = moment(TimeStart)
          .add({ minute: LessonMinute })
          .format("YYYY/MM/DD HH:mm");
      }
      
      newInitial.push({
        Title: `Tiết ${i}`,
        From: moment(TimeStart).format("HH:mm"),
        To: moment(TimeEnd).format("HH:mm"),
      });
    }
    setInitialValues(() => ({
      LessonListTime: newInitial,
    }));
  }, []);

  return (
    <Modal show={show} onHide={onHide} size="md" scrollable={true}>
      <Formik
        initialValues={initialValues}
        //validationSchema={kttSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            setFieldValue,
          } = formikProps;
          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>Cài đặt tiết học</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table bordered responsive className="mb-0 mt-3">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Tiết học</th>
                      <th className="w-160px">Thời gian bắt đầu</th>
                      <th className="w-160px">Thời gian kết thúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    <FieldArray
                      name={`LessonListTime`}
                      render={(arrayHelpers) => (
                        <Fragment>
                          {values.LessonListTime.map((lesson, index) => (
                            <tr key={index}>
                              {index === 0 && (
                                <td className="font-weight-bold" rowSpan={6}>
                                  Sáng
                                </td>
                              )}
                              {index === 6 && (
                                <td className="font-weight-bold"  rowSpan={6}>
                                  Chiều
                                </td>
                              )}
                              <td>{lesson.Title}</td>
                              <td>
                                <TimeField
                                  className="form-control w-100"
                                  value={lesson.From}
                                  onChange={(event, value) =>
                                    setFieldValue(
                                      `LessonListTime[${index}].From`,
                                      value,
                                      false
                                    )
                                  }
                                />
                                {/* <DatePicker
                                  popperProps={{
                                    positionFixed: true,
                                  }}
                                  popperClassName="react-datepicker-only-time"
                                  className="form-control"
                                  selected={lesson.From ? new Date() : null}
                                  onChange={(date) => {
                                    setFieldValue(
                                      `LessonListTime[${index}].From`,
                                      date,
                                      false
                                    );
                                  }}
                                  name={`LessonListTime[${index}].From`}
                                  popperPlacement="bottom-end"
                                  //shouldCloseOnSelect={false}
                                  dateFormat="dd/MM/yyyy"
                                  timeFormat="HH:mm"
                                  timeInputLabel="Thời gian"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  placeholderText="Thời gian bắt đầu"
                                  timeCaption="Chọn thời gian"
                                /> */}
                              </td>
                              <td>
                                <TimeField
                                  className="form-control w-100"
                                  value={lesson.To}
                                  onChange={(event, value) =>
                                    setFieldValue(
                                      `LessonListTime[${index}].To`,
                                      value,
                                      false
                                    )
                                  }
                                />
                                {/* <DatePicker
                                  popperProps={{
                                    positionFixed: true,
                                  }}
                                  popperClassName="react-datepicker-only-time"
                                  className="form-control"
                                  selected={
                                    lesson.To ? new Date(lesson.To) : null
                                  }
                                  onChange={(date) =>
                                    setFieldValue(
                                      `LessonListTime[${index}].To`,
                                      date,
                                      false
                                    )
                                  }
                                  name={`LessonListTime[${index}].To`}
                                  popperPlacement="bottom-end"
                                  //shouldCloseOnSelect={false}
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  timeInputLabel="Thời gian"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  placeholderText="Thời gian kết thúc"
                                  timeCaption="Chọn thời gian"
                                /> */}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )}
                    />
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

export default ModalLessonTime;
