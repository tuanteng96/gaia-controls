import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Select from "react-select";
import { useSelector } from "react-redux";
import UploadFile from "../../../../_shared/files/UploadFile";
import LessonCrud from "./../../_redux/LessonCrud";

ModalLesson.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValue = {
  Title: "",
  Type: null,
  Thumbnail: "",
  GiaoAnPdf: "",
  LinkOnline: null,
  DynamicID: "",
};

const lessonSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
  Type: Yup.object()
    .nullable()
    .required("Vui lòng chọn danh mục."),
});

function ModalLesson({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [arrCate, setArrCate] = useState([]);
  const { listCate, loading } = useSelector(({ lesson }) => ({
    listCate: lesson.listCate,
    loading: lesson.loading,
  }));
  const [PathFile, setPathFile] = useState([]);
  const [loadingPath, setLoadingPath] = useState(false);

  const getPathRoot = () => {
    setLoadingPath(true);
    LessonCrud.getRootFile()
      .then((result) => {
        setPathFile(() =>
          result.map((item) => ({
            ...item,
            label: item.title,
            value: item.name,
          }))
        );
        setLoadingPath(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getPathRoot();
  }, []);

  useEffect(() => {
    setArrCate((prev) =>
      listCate.map((item) => ({ ...item, value: item.ID, label: item.Title }))
    );
  }, [listCate]);

  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues(() => ({
        ...initialValue,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        Type: {
          value: defaultValues.Type,
          label: defaultValues.TypeName,
        },
        Thumbnail: defaultValues.Thumbnail,
        GiaoAnPdf: defaultValues.GiaoAnPdf,
        LinkOnline: defaultValues.LinkOnline
          ? {
              value: defaultValues.LinkOnline,
              label: defaultValues.LinkOnline?.replace("Upload/data/", ""),
            }
          : "",
        FileMaHoa: defaultValues.FileMaHoa
          ? {
              value: defaultValues.FileMaHoa,
              label: defaultValues.FileMaHoa?.replace("Upload/data/", ""),
            }
          : "",
        DynamicID: defaultValues.DynamicID,
      }));
    } else {
      setInitialValues(() => ({
        ...initialValue,
        ...defaultValues,
      }));
    }
  }, [defaultValues]);

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max2-sm">
      <Formik
        initialValues={initialValues}
        validationSchema={lessonSchema}
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
                <div className="form-group">
                  <label>
                    Tên bài giảng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Title && touched.Title
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Title"
                    placeholder="Nhập tên bài giảng"
                    autoComplete="off"
                    value={values.Title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Mã</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.DynamicID && touched.DynamicID
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="DynamicID"
                    placeholder="Mã bài giảng"
                    autoComplete="off"
                    value={values.DynamicID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <Select
                    className={`select-control ${
                      errors.Type && touched.Type
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    classNamePrefix="select"
                    isDisabled={loading.fetchCate}
                    isLoading={loading.fetchCate}
                    isClearable={false}
                    isSearchable={true}
                    name="Type"
                    options={arrCate}
                    placeholder="Chọn danh mục"
                    value={values.Type}
                    onChange={(option) => {
                      setFieldValue("Type", option, false);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Link Online</label>
                  <Select
                    isDisabled={loadingPath}
                    isLoading={loadingPath}
                    options={PathFile}
                    isClearable
                    name="LinkOnline"
                    value={values.LinkOnline}
                    onChange={(val) => {
                      setFieldValue(`LinkOnline`, val, false);
                    }}
                    className="select-control"
                    classNamePrefix="select"
                    placeholder="Chọn file"
                    noOptionsMessage={() => "Không thấy file."}
                  />
                </div>
                <div className="form-group">
                  <label>Giáo án</label>
                  <UploadFile
                    name="GiaoAnPdf"
                    onChange={(file) => setFieldValue("GiaoAnPdf", file, false)}
                    value={values.GiaoAnPdf}
                    arrowProps={{
                      Placeholder: "Chọn file giáo án",
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>File Mã hóa</label>
                  <Select
                    isDisabled={loadingPath}
                    isLoading={loadingPath}
                    options={PathFile}
                    isClearable
                    name="FileMaHoa"
                    value={values.FileMaHoa}
                    onChange={(val) => {
                      setFieldValue(`FileMaHoa`, val, false);
                    }}
                    className="select-control"
                    classNamePrefix="select"
                    placeholder="Chọn file"
                    noOptionsMessage={() => "Không thấy file."}
                  />
                </div>
                <div className="form-group">
                  <label>Hình ảnh</label>
                  <UploadFile
                    name="Thumbnail"
                    onChange={(file) => setFieldValue("Thumbnail", file, false)}
                    value={values.Thumbnail}
                    arrowProps={{
                      Placeholder: "Chọn file hình ảnh",
                      Type: "image",
                    }}
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
  );
}

export default ModalLesson;
