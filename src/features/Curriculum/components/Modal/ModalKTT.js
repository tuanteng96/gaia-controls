import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Select from "react-select";
import SchoolManageCrud from "../../../SchoolManage/_redux/SchoolManageCrud";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import ModalKTTLessons from "./ModalKTTLessons";
import UploadFile from "../../../../_shared/files/UploadFile";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ModalKTT.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  Title: "",
  Desc: "",
  Status: null, //1
  Levels: null,
  LessonList: [],
  SchoolList: [],
  PDF: "",
};

const kttSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalKTT({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [ListLevel, setListLevel] = useState([]);
  const [LoadingLevel, setLoadingLevel] = useState([]);
  const [VisibleModal, setVisibleModal] = useState(false);
  const [ValuesCurrent, setValuesCurrent] = useState(null);
  const { ListStatus } = useSelector(({ curriculum }) => ({
    ListStatus: curriculum.Status,
  }));

  useEffect(() => {
    if (show) {
      getAllLevel();
    }
  }, [show]);

  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues((prevState) => ({
        ...defaultValues,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        Desc: defaultValues.Desc,
        PDF: defaultValues.PDF,
        Status: defaultValues.Status
          ? ListStatus.filter((item) => item.Status === defaultValues.Status)[0]
          : null,
        SchoolList: defaultValues.SchoolList.map((item) => ({
          ...item,
          label: item.Title,
          value: item.ID,
        })),
        LessonList: defaultValues.LessonList,
        Levels:
          ListLevel &&
          ListLevel.filter(
            (item) => item.ID === Number(defaultValues.Levels)
          )[0],
      }));
    } else {
      setInitialValues(() => ({
        ...initialValue,
        Status: ListStatus[1],
      }));
    }
  }, [defaultValues, ListStatus, ListLevel]);

  useEffect(() => {
    if (show && defaultValues.isLesson) {
      setVisibleModal(defaultValues.isLesson);
      setValuesCurrent(initialValues);
    }
  }, [defaultValues, show, initialValues]);

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

  const getAllSchool = async (search, loadedOptions, { page }, level) => {
    const newPost = {
      _key: search,
      _pi: page,
      _ps: 10,
      _orders: {
        Id: true,
      },
    };

    if (level) {
      newPost.LevelJson = `~${level.value}`;
    }

    const { list, pcount } = await SchoolManageCrud.getAllSchool(newPost);
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

  const onOpenModal = (values) => {
    setValuesCurrent(values);
    setVisibleModal(true);
  };

  const onHideModal = () => {
    setValuesCurrent(null);
    setVisibleModal(false);
  };

  const UpdateLesson = ({ LessonList }, callback) => {
    const newLessonList = LessonList.map((item) => ({
      ...item,
      Lessons: item.Lessons.filter(
        (lesson) => lesson.ID && lesson.From && lesson.To
      ).map((lesson) => ({
        ...lesson,
        ID: lesson.ID ? lesson.ID.value : "",
        Title: lesson.Title ? lesson.ID.label : "",
        From: lesson.From ? moment(lesson.From).format("YYYY/MM/DD HH:mm") : "",
        To: lesson.From ? moment(lesson.To).format("YYYY/MM/DD HH:mm") : "",
      })),
    }));
    callback("LessonList", newLessonList, false);
    onHideModal();
  };

  const RenderCountLess = (lessons) => {
    if (lessons && lessons.length === 0) {
      return <span className="text-muted">Chưa có bài giảng</span>;
    }
    if (lessons && lessons.length > 0) {
      var total = 0;
      for (var lesson of lessons) {
        total += lesson.Lessons.length;
      }
      return <span className="text-muted">Tổng có {total} bài giảng</span>;
    }
  };

  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={onHide}
        dialogClassName="modal-max2-sm"
        scrollable={true}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={kttSchema}
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
              <Form className="d-flex flex-column overflow-hidden align-items-stretch">
                <Modal.Header closeButton>
                  <Modal.Title>
                    {values.ID
                      ? "Chỉnh sửa Khung chương trình"
                      : "Thêm mới Khung chương trình"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-group">
                    <label>
                      Tên Khung chương trình{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Title && touched.Title
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      name="Title"
                      placeholder="Nhập tên Khung chương trình"
                      autoComplete="off"
                      value={values.Title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group position-relative zindex-4">
                    <label>Cấp</label>
                    <Select
                      menuPosition="fixed"
                      className={`select-control ${
                        errors.Levels && touched.Levels
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      isDisabled={LoadingLevel}
                      isLoading={LoadingLevel}
                      isClearable={true}
                      isSearchable={true}
                      name="Levels"
                      options={ListLevel}
                      placeholder="Chọn cấp"
                      value={values.Levels}
                      onChange={(option, triggeredAction) => {
                        if (triggeredAction.action === "clear") {
                          setFieldValue("SchoolList", [], false);
                        }
                        setFieldValue("Levels", option, false);
                      }}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group position-relative zindex-3">
                    <label>Trường</label>
                    <AsyncPaginate
                      key={values.Levels?.value}
                      isDisabled={!values.Levels}
                      className={`select-control ${
                        errors.SchoolList && touched.SchoolList
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      isClearable={true}
                      name="SchoolList"
                      loadOptions={(search, loadedOptions, { page }) =>
                        getAllSchool(
                          search,
                          loadedOptions,
                          { page },
                          values.Level
                        )
                      }
                      menuPosition="fixed"
                      placeholder="Chọn trường"
                      value={values.SchoolList}
                      onChange={(option) => {
                        setFieldValue("SchoolList", option, false);
                      }}
                      onBlur={handleBlur}
                      additional={{
                        page: 1,
                      }}
                      isMulti
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Danh sách trường trống"
                          : "Không tìm thấy trường phù hợp."
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Bài giảng</label>
                    <div className="border rounded h-40px d-flex align-items-center pl-10px position-relative">
                      {!values.Levels?.value && (
                        <span className="text-danger">
                          Vui lòng chọn cấp (*)
                        </span>
                      )}
                      {values.Levels?.value && (
                        <Fragment>
                          {RenderCountLess(values.LessonList)}
                        </Fragment>
                      )}
                      {values.Levels?.value && (
                        <button
                          className="btn btn-success position-absolute right-10px rounded-left btn-xs"
                          type="button"
                          onClick={() => onOpenModal(values)}
                        >
                          {values.LessonList.length > 0 ? "Chỉnh sửa" : "Thêm"}
                        </button>
                      )}
                    </div>
                    <ModalKTTLessons
                      show={VisibleModal}
                      onHide={onHideModal}
                      ValuesCurrent={ValuesCurrent}
                      onAddEdit={(values) =>
                        UpdateLesson(values, setFieldValue)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>File PDF</label>
                    <UploadFile
                      name="PDF"
                      onChange={(file) => setFieldValue("PDF", file, false)}
                      value={values.PDF}
                      arrowProps={{
                        Placeholder: "Chọn file PDF",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                      rows={3}
                      type="text"
                      className="form-control"
                      name="Desc"
                      placeholder="Nhập mô tả"
                      autoComplete="off"
                      value={values.Desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label>Trạng thái</label>
                    <Select
                      menuPosition="fixed"
                      className="select-control"
                      classNamePrefix="select"
                      isClearable={false}
                      isSearchable={false}
                      name="Status"
                      options={ListStatus}
                      placeholder="Chọn trạng thái"
                      value={values.Status}
                      onChange={(option) => {
                        setFieldValue("Status", option, false);
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
    </React.Fragment>
  );
}

export default ModalKTT;
