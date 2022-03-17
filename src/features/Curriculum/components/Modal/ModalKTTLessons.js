import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Tab, Nav, Table } from "react-bootstrap";
import { Form, Formik, FieldArray } from "formik";
import { AsyncPaginate } from "react-select-async-paginate";
import LessonCrud from "../../../Lesson/_redux/LessonCrud";
import DatePicker from "react-datepicker";

ModalKTTLessons.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  LessonList: [],
};

function ModalKTTLessons({
  show,
  onHide,
  onAddEdit,
  btnLoading,
  ValuesCurrent,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [Key, setKey] = useState("");
  useEffect(() => {
    console.log(ValuesCurrent);
    if (
      show &&
      ValuesCurrent &&
      ValuesCurrent.Levels &&
      ValuesCurrent.LessonList.length === 0
    ) {
      const { Levels } = ValuesCurrent;
      const newLessonList = Levels.ClassList.split(",").map((item) => ({
        Level: Number(item),
        Lessons: [
          {
            ID: null,
            Title: "",
            From: "",
            To: "", //yyyy-mm-dd HH:mm
          },
        ],
      }));
      setKey(`level-${newLessonList[0].Level}`);
      setInitialValues((prevState) => ({
        ...prevState,
        LessonList: newLessonList,
      }));
    } else if (
      show &&
      ValuesCurrent &&
      ValuesCurrent.Levels &&
      ValuesCurrent.LessonList.length > 0
    ) {
      const newLessonList = ValuesCurrent.LessonList.map((item) => ({
        Level: Number(item.Level),
        Lessons:
          item.Lessons && item.Lessons.length > 0
            ? item.Lessons.map((lesson) => ({
                ...lesson,
                ID: { value: lesson.ID, label: lesson.Title },
                Title: { value: lesson.ID, label: lesson.Title },
              }))
            : [
                {
                  ID: null,
                  Title: "",
                  From: "",
                  To: "", //yyyy-mm-dd HH:mm
                },
              ],
      }));
      setKey(`level-${newLessonList[0].Level}`);
      setInitialValues((prevState) => ({
        ...prevState,
        LessonList: newLessonList,
      }));
    } else {
      setInitialValues(initialValue);
    }
  }, [ValuesCurrent, show]);

  const getAllLesson = async (search, loadedOptions, { page }) => {
    const newPost = {
      _key: search,
      _pi: page,
      _ps: 10,
      _orders: {
        Id: true,
      },
    };

    const { list, pcount } = await LessonCrud.getListLesson(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({ ...item, label: item.Title, value: item.ID }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };
  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable={true}>
      <Formik
        initialValues={initialValues}
        //validationSchema={kttSchema}
        onSubmit={onAddEdit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const { values, handleBlur, setFieldValue } = formikProps;
          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>Cập nhập bài giảng</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tab.Container activeKey={Key}>
                  <Nav
                    as="ul"
                    className="nav nav-tabs"
                    onSelect={(_key) => setKey(_key)}
                  >
                    {values.LessonList &&
                      values.LessonList.map((item, index) => (
                        <Nav.Item className="nav-item" as="li" key={index}>
                          <Nav.Link
                            eventKey={`level-${item.Level}`}
                            className={`nav-link font-weight-boldest show ${
                              Key === `level-${item.Level}` ? "active" : ""
                            }`}
                          >
                            Khối {item.Level}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                  </Nav>
                  <Tab.Content className="tab-content">
                    {values.LessonList &&
                      values.LessonList.map((item, index) => (
                        <Tab.Pane
                          eventKey={`level-${item.Level}`}
                          className="p-0"
                          key={index}
                        >
                          <Table bordered responsive className="mb-0 mt-3">
                            <thead>
                              <tr>
                                <th>Bài giảng</th>
                                <th className="w-180px">Thời gian bắt đầu</th>
                                <th className="w-180px">Thời gian kết thúc</th>
                                <th className="w-50px">#</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name={`LessonList[${index}].Lessons`}
                                render={(arrayHelpers) => (
                                  <Fragment>
                                    {values.LessonList[index].Lessons.map(
                                      (lesson, idx) => (
                                        <tr key={idx}>
                                          <td>
                                            <AsyncPaginate
                                              className="select-control"
                                              classNamePrefix="select"
                                              isClearable={true}
                                              name={`LessonList[${index}].Lessons[${idx}].ID`}
                                              loadOptions={getAllLesson}
                                              menuPosition="fixed"
                                              placeholder="Chọn bài giảng"
                                              value={lesson.ID}
                                              onChange={(option) => {
                                                setFieldValue(
                                                  `LessonList[${index}].Lessons[${idx}].ID`,
                                                  option,
                                                  false
                                                );
                                                setFieldValue(
                                                  `LessonList[${index}].Lessons[${idx}].Title`,
                                                  option,
                                                  false
                                                );
                                              }}
                                              onBlur={handleBlur}
                                              additional={{
                                                page: 1,
                                              }}
                                              noOptionsMessage={({
                                                inputValue,
                                              }) =>
                                                !inputValue
                                                  ? "Danh sách trường trống"
                                                  : "Không tìm thấy trường phù hợp."
                                              }
                                            />
                                          </td>
                                          <td>
                                            <DatePicker
                                              popperProps={{
                                                positionFixed: true,
                                              }}
                                              className="form-control"
                                              selected={
                                                lesson.From
                                                  ? new Date(lesson.From)
                                                  : null
                                              }
                                              onChange={(date) =>
                                                setFieldValue(
                                                  `LessonList[${index}].Lessons[${idx}].From`,
                                                  date,
                                                  false
                                                )
                                              }
                                              name={`LessonList[${index}].Lessons[${idx}].From`}
                                              popperPlacement="bottom-end"
                                              shouldCloseOnSelect={false}
                                              dateFormat="dd/MM/yyyy HH:mm"
                                              timeFormat="HH:mm"
                                              timeInputLabel="Thời gian"
                                              showTimeSelect
                                              timeIntervals={15}
                                              placeholderText="Ngày bắt đầu"
                                            />
                                          </td>
                                          <td>
                                            <DatePicker
                                              popperProps={{
                                                positionFixed: true,
                                              }}
                                              className="form-control"
                                              selected={
                                                lesson.To
                                                  ? new Date(lesson.To)
                                                  : null
                                              }
                                              onChange={(date) =>
                                                setFieldValue(
                                                  `LessonList[${index}].Lessons[${idx}].To`,
                                                  date,
                                                  false
                                                )
                                              }
                                              name={`LessonList[${index}].Lessons[${idx}].To`}
                                              minDate={
                                                lesson.From
                                                  ? new Date(lesson.From)
                                                  : null
                                              }
                                              popperPlacement="bottom-end"
                                              shouldCloseOnSelect={false}
                                              dateFormat="dd/MM/yyyy HH:mm"
                                              timeFormat="HH:mm"
                                              timeInputLabel="Thời gian"
                                              showTimeSelect
                                              timeIntervals={15}
                                              placeholderText="Ngày kết thúc"
                                            />
                                          </td>
                                          <td>
                                            {values.LessonList[index].Lessons
                                              .length -
                                              1 ===
                                              idx && (
                                              <button
                                                type="button"
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                  arrayHelpers.push({
                                                    ID: null,
                                                    Title: "",
                                                    From: "",
                                                    To: "",
                                                  })
                                                }
                                              >
                                                <i className="far fa-plus pe-0 icon-1x"></i>
                                              </button>
                                            )}
                                            {values.LessonList[index].Lessons
                                              .length -
                                              1 !==
                                              idx && (
                                              <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                  arrayHelpers.remove(idx)
                                                }
                                              >
                                                <i className="fas fa-trash pe-0 icon-sm"></i>
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </Fragment>
                                )}
                              />
                            </tbody>
                          </Table>
                        </Tab.Pane>
                      ))}
                  </Tab.Content>
                </Tab.Container>
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

export default ModalKTTLessons;
