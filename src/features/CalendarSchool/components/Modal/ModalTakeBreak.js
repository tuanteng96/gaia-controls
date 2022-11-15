import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FieldArray, Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import AsyncSelectTeachers from "../../../../components/Selects/AsyncSelectTeachers";
import clsx from "clsx";
import moment from "moment";
import "moment/locale/vi";
import CalendarSchoolCrud from "../../_redux/CalendarSchoolCrud";
import ListTeacherChoose from "../ListTeacherChoose";
import { toast } from "react-toastify";

moment.locale("vi");

ModalTakeBreak.propTypes = {
  show: PropTypes.bool,
};

const AddSchema = Yup.object().shape({
  From: Yup.string()
    .nullable()
    .required("Vui lòng chọn ngày"),
  To: Yup.string()
    .nullable()
    .required("Vui lòng chọn ngày"),
  TeacherID: Yup.object()
    .nullable()
    .required("Vui lòng chọn giáo viên"),
});

const initialValue = {
  TeacherID: "",
  From: "",
  To: "",
  Changes: [],
};

function ModalTakeBreak({ show, onHide, onSubmit, loadingBtn, AllInitial }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [TabCurrent, setTabCurrent] = useState("Info");
  const [loadingBtnNext, setLoadingBtnNext] = useState(false);

  useEffect(() => {
    setTabCurrent("Info");
  }, [show]);

  useEffect(() => {
    if (AllInitial && show) {
      setLoadingBtnNext(true);
      const newValue = {
        From: AllInitial.From
          ? moment(AllInitial.From).format("DD-MM-YYYY HH:mm")
          : "",
        To: AllInitial.To
          ? moment(AllInitial.To).format("DD-MM-YYYY HH:mm")
          : "",
        TeacherIDs: AllInitial.TeacherID ? [AllInitial.TeacherID] : [],
        Items: [],
      };

      CalendarSchoolCrud.previewTakeBreak(newValue)
        .then((response) => {
          if (response.Items) {
            if (response.Items.length === 0) {
              toast.warning("Giáo viên không có lịch.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
              setInitialValues((initialValues) => ({
                ...initialValues,
                TeacherID: {
                  value: AllInitial?.TeacherID,
                  label: AllInitial?.TeacherName,
                },
                From: AllInitial?.From,
                To: AllInitial?.To,
              }));
            } else {
              const newList = [];
              for (let item of response.Items) {
                let IndexClass = item.Result.Previews.findIndex(
                  (preview) => preview.ClassID === item.DayItem.ClassID
                );
                const newobj = {
                  ID: item.DayItem?.ID,
                  Date: item.DayItem?.Date,
                  SchoolTitle: item.DayItem?.SchoolTitle,
                  ClassTitle: item.DayItem?.ClassTitle,
                  IndexTitle: item.DayItem?.IndexTitle,
                  AvaiList: item.Result.Previews[IndexClass].AvaiList,
                  ClassTeacherID: "",
                  From: item.DayItem?.From,
                  To: item.DayItem?.To,
                };
                newList.push(newobj);
              }
              setInitialValues((initialValues) => ({
                ...initialValues,
                Changes: newList,
              }));
              setTabCurrent("Teacher");
            }
            setLoadingBtnNext(false);
            localStorage.removeItem("teacher_resigns");
          }
        })
        .catch((error) => console.log(error));
    }
    else {
      setInitialValues(initialValue);
    }
  }, [AllInitial, show]);

  const onNextTeacher = ({ setFieldValue, values }, onButton) => {
    setLoadingBtnNext(true);
    const newValue = {
      From: values.From ? moment(values.From).format("DD-MM-YYYY HH:mm") : "",
      To: values.To ? moment(values.To).format("DD-MM-YYYY HH:mm") : "",
      TeacherIDs: values.TeacherID?.value ? [values.TeacherID?.value] : [],
      Items: [],
    };
    CalendarSchoolCrud.previewTakeBreak(newValue)
      .then((response) => {
        if (response.Items) {
          if (onButton && response.Items.length === 0) {
            toast.warning("Giáo viên không có lịch.", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
          } else {
            const newList = [];
            for (let item of response.Items) {
              let IndexClass = item.Result.Previews.findIndex(
                (preview) => preview.ClassID === item.DayItem.ClassID
              );
              let indexTeacherID = values.Changes.findIndex(
                (o) => o?.ID === item.DayItem?.ID
              );
              const newobj = {
                ID: item.DayItem?.ID,
                Date: item.DayItem?.Date,
                SchoolTitle: item.DayItem?.SchoolTitle,
                ClassTitle: item.DayItem?.ClassTitle,
                IndexTitle: item.DayItem?.IndexTitle,
                AvaiList: item.Result.Previews[IndexClass].AvaiList,
                ClassTeacherID:
                  indexTeacherID > -1
                    ? values.Changes[indexTeacherID].ClassTeacherID
                    : "",
                From: item.DayItem?.From,
                To: item.DayItem?.To,
              };
              newList.push(newobj);
            }
            setFieldValue("Changes", newList, false);
            setTabCurrent("Teacher");
          }
          setLoadingBtnNext(false);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName={clsx(
        TabCurrent === "Info" && "modal-max2-sm",
        TabCurrent === "Teacher" && "modal-xxl"
      )}
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
                <Modal.Title>Xin nghỉ</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                {TabCurrent === "Info" && (
                  <div className="p-15px positon-relative">
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
                    <div className="form-group mb-0">
                      <label>Giáo viên</label>
                      <AsyncSelectTeachers
                        className={`select-control ${
                          errors?.TeacherID && touched?.TeacherID
                            ? "is-invalid solid-invalid"
                            : ""
                        }`}
                        placeholder="Chọn giáo viên"
                        name="TeacherID"
                        menuPosition="fixed"
                        value={values?.TeacherID}
                        onChange={(option) => {
                          setFieldValue("TeacherID", option, false);
                        }}
                        onBlur={handleBlur}
                        noOptionsMessage={({ inputValue }) =>
                          !inputValue
                            ? "Danh sách giáo viên trống"
                            : "Không tìm thấy giáo viên phù hợp."
                        }
                      />
                    </div>
                    <div
                      className={clsx(
                        "element-loader",
                        !loadingBtnNext && "hide"
                      )}
                      style={{ top: "0", height: "100%" }}
                    >
                      <div className="blockui">
                        <span>Đang tải ...</span>
                        <span>
                          <div className="spinner spinner-primary"></div>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {TabCurrent === "Teacher" && (
                  <div className="p-15px">
                    <div className="table-responsive-x">
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              {values.Changes &&
                                values.Changes.map((item, index) => (
                                  <th
                                    className={clsx(
                                      "min-w-265px w-265px h-45px text-center"
                                    )}
                                    key={index}
                                  >
                                    {moment(item.Date).format("ddd, ll")}
                                  </th>
                                ))}
                            </tr>
                            <tr>
                              {values.Changes &&
                                values.Changes.map((item, index) => (
                                  <th
                                    className={clsx(
                                      "min-w-265px w-265px h-45px text-center"
                                    )}
                                    key={index}
                                  >
                                    {item.SchoolTitle}
                                    <div>
                                      Lớp {item.ClassTitle} - {item.IndexTitle}{" "}
                                      ( {moment(item.From).format("HH:mm")} -{" "}
                                      {moment(item.To).format("HH:mm")})
                                    </div>
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            <FieldArray
                              name={`Changes`}
                              render={(arrayHelpers) => (
                                <tr>
                                  {values.Changes &&
                                    values.Changes.map((item, index) => (
                                      <td
                                        className="min-w-265px w-265px p-0"
                                        key={index}
                                      >
                                        <ListTeacherChoose
                                          item={item}
                                          name={`Changes[${index}].ClassTeacherID`}
                                          valueClassTeacherID={
                                            values.Changes[index].ClassTeacherID
                                          }
                                          onUpdate={() => {
                                            onNextTeacher(
                                              {
                                                values: values,
                                                setFieldValue: setFieldValue,
                                              },
                                              true
                                            );
                                          }}
                                          formikProps={formikProps}
                                        />
                                      </td>
                                    ))}
                                </tr>
                              )}
                            />
                          </tbody>
                        </table>
                      </div>

                      <div
                        className={clsx(
                          "element-loader",
                          !loadingBtnNext && "hide"
                        )}
                        style={{ top: "51px" }}
                      >
                        <div className="blockui">
                          <span>Đang tải ...</span>
                          <span>
                            <div className="spinner spinner-primary"></div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    {TabCurrent === "Teacher" && (
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => setTabCurrent("Info")}
                      >
                        <i className="far fa-chevron-left font-size-xs mr-2"></i>
                        Quay lại
                      </Button>
                    )}
                  </div>
                  <div>
                    <Button type="button" variant="secondary" onClick={onHide}>
                      Đóng
                    </Button>
                    {TabCurrent === "Teacher" && (
                      <Button
                        type="submit"
                        variant="primary"
                        className={`btn btn-primary ${loadingBtn &&
                          "spinner spinner-white spinner-right mt-0"} w-auto h-auto`}
                        disabled={loadingBtn}
                      >
                        Thực hiện
                      </Button>
                    )}
                    {TabCurrent === "Info" && (
                      <Button
                        type="button"
                        variant="primary"
                        className={`btn btn-primary mt-0 ${loadingBtnNext &&
                          "spinner spinner-white spinner-right"} w-auto h-auto`}
                        onClick={() => onNextTeacher(formikProps, true)}
                        disabled={loadingBtnNext}
                      >
                        Tiếp tục
                        <i className="far fa-chevron-right font-size-xs ms-2"></i>
                      </Button>
                    )}
                  </div>
                </div>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalTakeBreak;
