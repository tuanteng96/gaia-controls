import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Formik, FieldArray } from "formik";
import { Button, Modal } from "react-bootstrap";
import ScheduleGenerator from "../../ScheduleGenerator";
import Select, { components } from "react-select";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ModalScheduleClass.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  SchoolID: null,
  SchoolTitle: "",
  From: "",
  To: "",
  CalendarList: [],
};

function ModalScheduleClass({
  show,
  onHide,
  onAddEdit,
  defaultValues,
  btnLoading,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);

  const dayGenerator = () => {
    const ListDay = [];
    for (var i = 0; i < 7; i++) {
      const obj = {
        DayOfWeek: i,
        Items: null,
      };
      ListDay.push(obj);
    }
    return ListDay;
  };

  const onGeneratorBook = ({ School, From, To }) => {
    const { ClassList, HourScheduleList } = School;
    if (!ClassList || (Array.isArray(ClassList) && ClassList.length === 0)) {
      return;
    }
    var newCalendarList = [];
    newCalendarList = ClassList.map((item) => ({
      ClassTitle: item.Title,
      ClassID: item.ID,
      Days: dayGenerator(),
    }));

    setInitialValues((prevState) => ({
      ...prevState,
      SchoolID: School.ID,
      SchoolTitle: School.Title,
      From: From,
      To: To,
      CalendarList: newCalendarList,
      HourScheduleList:
        HourScheduleList && HourScheduleList.length > 0
          ? HourScheduleList.map((item) => ({ ...item, label: item.Title }))
          : [],
    }));
  };

  const CustomOption = ({ children, innerRef, data, ...props }) => {
    return (
      <components.Option {...props}>
        {children}
        <span className="font-size-xs ps-2 text-muted">
          ( {moment(data.From, "HH:mm:ss").format("HH:mm")} -{" "}
          {moment(data.To, "HH:mm:ss").format("HH:mm")} )
        </span>
      </components.Option>
    );
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
            handleBlur,
            setFieldValue,
          } = formikProps;

          return (
            <Form
              className="d-flex flex-column overflow-hidden align-items-stretch"
              onSubmit={formikProps.handleSubmit}
            >
              <Modal.Header closeButton>
                <Modal.Title>Tạo mới lịch học</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ScheduleGenerator onSubmit={onGeneratorBook} />
                {values.SchoolID && (
                  <div className="mt-4">
                    <div className="border-top border-left border-right text-center font-weight-bold text-uppercase h-50px d-flex justify-content-center align-items-center font-size-md">
                      {values.SchoolTitle}{" "}
                      {values.From &&
                        `- Từ ngày ${moment(values.From).format("ll")}`}{" "}
                      {values.To && `đến ${moment(values.To).format("ll")}`}
                    </div>
                    <div className="d-flex position-relative">
                      <div className="border border-end-0 w-150px">
                        <div className="p-2 h-55px d-flex align-items-center justify-content-center min-w-150px border-right text-uppercase font-weight-bold">
                          Lớp
                        </div>
                        <div>
                          {values.CalendarList &&
                            values.CalendarList.map((item, index) => (
                              <div
                                className="border-top px-2 h-55px d-flex align-items-center justify-content-center"
                                key={index}
                              >
                                {item.ClassTitle}
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="border flex-1 overflow-auto">
                        {/* Header */}
                        <div className="d-flex">
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 2
                            </div>
                          </div>
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 3
                            </div>
                          </div>
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 4
                            </div>
                          </div>
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 5
                            </div>
                          </div>
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 6
                            </div>
                          </div>
                          <div className="flex-1 border-right min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              Thứ 7
                            </div>
                          </div>
                          <div className="flex-1 min-w-200px">
                            <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                              CN
                            </div>
                          </div>
                        </div>
                        {/* End Header */}

                        {values.CalendarList &&
                          values.CalendarList.map((item, index) => (
                            <div className="d-flex" key={index}>
                              <FieldArray
                                name={`CalendarList[${index}].Days`}
                                render={(arrayHelpers) => (
                                  <Fragment>
                                    {values.CalendarList[index].Days.map(
                                      (o, idx) => (
                                        <div
                                          className={`flex-1 p-2 h-55px border-top ${idx !==
                                            6 && "border-right"} min-w-200px`}
                                          key={idx}
                                        >
                                          <Select
                                            components={{
                                              Option: CustomOption,
                                            }}
                                            menuPosition="fixed"
                                            className="select-control"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            isSearchable={true}
                                            name={`CalendarList[${index}].Days[${idx}].Items`}
                                            options={values.HourScheduleList}
                                            placeholder="Chọn tiết học"
                                            value={o.Items}
                                            onChange={(option) => {
                                              setFieldValue(
                                                `CalendarList[${index}].Days[${idx}].Items`,
                                                option,
                                                false
                                              );
                                            }}
                                            onBlur={handleBlur}
                                          />
                                        </div>
                                      )
                                    )}
                                  </Fragment>
                                )}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onHide}>
                  Đóng
                </Button>
                {values.SchoolID && (
                  <Button
                    type="submit"
                    variant="primary"
                    className={`btn btn-primary ${btnLoading &&
                      "spinner spinner-white spinner-right"} w-auto h-auto`}
                    disabled={btnLoading}
                  >
                    {values.ID ? "Lưu thay đổi" : "Thêm mới"}
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalScheduleClass;
