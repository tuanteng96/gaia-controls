import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import LessonCrud from "../../../Lesson/_redux/LessonCrud";
import { Button, Modal, Nav, Tab, Table } from "react-bootstrap";
import { FieldArray, Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import { AsyncPaginate } from "react-select-async-paginate";
import SchoolManageCrud from "../../../SchoolManage/_redux/SchoolManageCrud";
import AsyncSelectSchool from "../../../../components/Selects/AsyncSelectSchool";

ModalAdditional.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  LessonList: [],
};

function ModalAdditional({
  show,
  onHide,
  onAddEdit,
  btnLoading,
  defaultValues,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [Key, setKey] = useState("");
  const [ListLevel, setListLevel] = useState([]);
  const [LoadingLevel, setLoadingLevel] = useState([]);

  useEffect(() => {
    if (defaultValues) {
      if (!defaultValues.Levels || !ListLevel || ListLevel.length === 0) return;
      const Levels = ListLevel.filter(
        (o) => o.ID === Number(defaultValues.Levels)
      )[0].ClassList.split(",");
      setKey(`level-${Levels[0]}`);
      const newInitial = {
        ScheduleID: defaultValues.ID,
        AddonList:
          defaultValues.Addons && defaultValues.Addons.length > 0
            ? defaultValues.Addons.map((o) => ({
                LessonList:
                  o.LessonList &&
                  o.LessonList.map((x) => ({
                    ...x,
                    Lessons:
                      x.Lessons && x.Lessons.length > 0
                        ? x.Lessons.map((less) => ({
                            ...less,
                            ID: { value: less.ID, label: less.Title },
                            Title: { value: less.ID, label: less.Title },
                            SchoolID: {
                              value: less.SchoolID,
                              label: less.SchoolTitle,
                            },
                            SchoolTitle: {
                              value: less.SchoolID,
                              label: less.SchoolTitle,
                            },
                          }))
                        : [
                            {
                              ID: "",
                              Title: "",
                              From: "",
                              To: "",
                              SchoolID: "",
                              SchoolTitle: "",
                            },
                          ],
                  })),
              }))
            : [
                {
                  LessonList: Levels.map((x) => ({
                    Level: Number(x),
                    Lessons: [
                      {
                        ID: "",
                        Title: "",
                        From: "",
                        To: "",
                        SchoolID: "",
                        SchoolTitle: "",
                      },
                    ],
                  })),
                },
              ],
      };
      setInitialValues(newInitial);
    } else {
      setInitialValues({});
    }
  }, [defaultValues, ListLevel]);

  useEffect(() => {
    if (show) {
      getAllLevel();
    }
  }, [show]);

  const getAllLevel = () => {
    setLoadingLevel(true);
    SchoolManageCrud.getAllLevel()
      .then(({ data }) => {
        const newData =
          data &&
          data.map((item) => ({
            ...item,
            label: item.Title,
            value: item.ID,
          }));
        setListLevel(newData);
        setLoadingLevel(false);
      })
      .catch((error) => console.log(error));
  };

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
    <Modal show={show} onHide={onHide} size="xl" scrollable={true}>
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
                <Modal.Title>Cập nhập bài bổ sung</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tab.Container activeKey={Key}>
                  <Nav
                    as="ul"
                    className="nav nav-tabs"
                    onSelect={(_key) => setKey(_key)}
                  >
                    {values.AddonList &&
                      values.AddonList[0].LessonList &&
                      values.AddonList[0].LessonList.map((item, index) => (
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
                    {values.AddonList &&
                      values.AddonList[0].LessonList &&
                      values.AddonList[0].LessonList.map((item, index) => (
                        <Tab.Pane
                          eventKey={`level-${item.Level}`}
                          className="p-0"
                          key={index}
                        >
                          <Table bordered responsive className="mb-0 mt-3">
                            <thead>
                              <tr>
                                <th className="w-300px">Bài giảng</th>
                                <th>Trường</th>
                                <th className="w-180px">Thời gian bắt đầu</th>
                                <th className="w-180px">Thời gian kết thúc</th>
                                <th className="w-50px">#</th>
                              </tr>
                            </thead>
                            <tbody>
                              <FieldArray
                                name={`AddonList[0].LessonList[${index}].Lessons`}
                                render={(arrayHelpers) => (
                                  <Fragment>
                                    {values.AddonList[0].LessonList[
                                      index
                                    ].Lessons.map((lesson, idx) => (
                                      <tr key={idx}>
                                        <td className="w-300px">
                                          <AsyncPaginate
                                            className="select-control"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            name={`AddonList[0].LessonList[${index}].Lessons[${idx}].ID`}
                                            loadOptions={getAllLesson}
                                            menuPosition="fixed"
                                            placeholder="Chọn bài giảng"
                                            value={lesson.ID}
                                            onChange={(option) => {
                                              setFieldValue(
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].ID`,
                                                option,
                                                false
                                              );
                                              setFieldValue(
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].Title`,
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
                                          <AsyncSelectSchool
                                            menuPosition="fixed"
                                            placeholder="Chọn trường"
                                            noOptionsMessage={() =>
                                              "Không có trường"
                                            }
                                            className={`select-control`}
                                            value={lesson.SchoolID}
                                            onChange={(option) => {
                                              setFieldValue(
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].SchoolID`,
                                                option,
                                                false
                                              );
                                              setFieldValue(
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].SchoolTitle`,
                                                option,
                                                false
                                              );
                                            }}
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
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].From`,
                                                date,
                                                false
                                              )
                                            }
                                            name={`AddonList[0].LessonList[${index}].Lessons[${idx}].From`}
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
                                                `AddonList[0].LessonList[${index}].Lessons[${idx}].To`,
                                                date,
                                                false
                                              )
                                            }
                                            name={`AddonList[0].LessonList[${index}].Lessons[${idx}].To`}
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
                                          {values.AddonList[0].LessonList[index]
                                            .Lessons.length -
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
                                          {values.AddonList[0].LessonList[index]
                                            .Lessons.length -
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
                                    ))}
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

export default ModalAdditional;
