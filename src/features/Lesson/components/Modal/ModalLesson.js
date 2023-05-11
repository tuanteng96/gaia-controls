import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import Select from "react-select";
import { useSelector } from "react-redux";
import UploadFile from "../../../../_shared/files/UploadFile";
import LessonCrud from "./../../_redux/LessonCrud";
import clsx from "clsx";

ModalLesson.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValue = {
  List: [
    {
      Title: "",
      Type: null,
      Thumbnail: "",
      GiaoAnPdf: "",
      LinkOnline: null,
      DynamicID: "",
      Version: "",
    },
  ],
};

const lessonSchema = Yup.object({
  List: Yup.array(
    Yup.object({
      Title: Yup.string().required(),
    })
  ),
});

const ListKHOI = () => {
  const List = [];
  for (let x = 1; x <= 12; x++) {
    List.push({
      label: "Khối " + x,
      value: x,
    });
  }
  return List;
};

function ModalLesson({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [arrCate, setArrCate] = useState([]);
  const { listCate, loading } = useSelector(({ lesson }) => ({
    listCate: lesson.listCate,
    loading: lesson.loading,
  }));
  const [PathFile, setPathFile] = useState({
    Online: [],
    Wow: [],
  });
  const [loadingPath, setLoadingPath] = useState(false);

  const getPathRoot = async () => {
    setLoadingPath(true);
    try {
      const PathWow = await LessonCrud.getRootFile("Upload/Ftp/Data/");
      const PathOnline = await LessonCrud.getRootFile("Upload/Ftp/LMS/");
      setPathFile(() => ({
        Online: PathOnline.map((item) => ({
          ...item,
          label: item.title,
          value: item.name,
        })),
        Wow: PathWow.map((item) => ({
          ...item,
          label: item.title,
          value: item.name,
        })),
      }));
      setLoadingPath(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPathRoot();
  }, []);

  useEffect(() => {
    setArrCate((prev) =>
      listCate
        ? listCate.map((item) => ({
            ...item,
            value: item.ID,
            label: item.Title,
          }))
        : []
    );
  }, [listCate]);

  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues(() => ({
        ID: defaultValues.ID,
        List: [
          {
            ...initialValue,
            ID: defaultValues.ID,
            Title: defaultValues.Title,
            Type: defaultValues.Type,
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
            Version: defaultValues.Version,
          },
        ],
      }));
    } else {
      if (defaultValues.Type) {
        setInitialValues(() => ({
          List: [{ ...initialValue, ...defaultValues }],
        }));
      } else {
        setInitialValues((prevState) => ({
          ...prevState,
          List: prevState.List.map((x) => ({
            Type: x.Type ? x.Type : listCate.length > 0 ? listCate[0].ID : "",
          })),
        }));
      }
    }
  }, [defaultValues, listCate]);

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable={true}>
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
            <Form
              className="h-100 flex-column"
              style={{
                display: "flex",
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {values.ID ? "Chỉnh sửa bài giảng" : "Thêm mới bài giảng"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <FieldArray
                  name="List"
                  render={(arrayHelpers) => (
                    <>
                      {values.List &&
                        values.List.map((item, index) => (
                          <div
                            className={clsx(
                              "p-15px",
                              values.List.length > 1 &&
                                values.List.length - 1 !== index &&
                                "border-bottom"
                            )}
                            key={index}
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div className="form-group">
                                <label>
                                  Tên bài giảng{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${
                                    errors.List &&
                                    errors.List[index] &&
                                    errors.List[index].Title &&
                                    touched.List &&
                                    touched.List[index]
                                      ? "is-invalid solid-invalid"
                                      : ""
                                  }`}
                                  name={`List[${index}].Title`}
                                  placeholder="Nhập tên bài giảng"
                                  autoComplete="off"
                                  value={item.Title}
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
                                  name={`List[${index}].Type`}
                                  options={arrCate}
                                  placeholder="Chọn danh mục"
                                  value={
                                    arrCate &&
                                    arrCate.filter(
                                      (x) => x.ID === Number(item.Type)
                                    )
                                  }
                                  onChange={(option) => {
                                    setFieldValue(
                                      `List[${index}].Type`,
                                      option ? option.value : "",
                                      false
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="form-group">
                                <label>Khối</label>
                                <Select
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className={`select-control`}
                                  classNamePrefix="select"
                                  isClearable
                                  isSearchable={true}
                                  name={`List[${index}].Version`}
                                  options={ListKHOI()}
                                  placeholder="Chọn khối"
                                  value={ListKHOI().filter(
                                    (x) => x.value === Number(item.Version)
                                  )}
                                  onChange={(option) => {
                                    setFieldValue(
                                      `List[${index}].Version`,
                                      option ? option.value : "",
                                      false
                                    );
                                  }}
                                  onBlur={handleBlur}
                                />
                              </div>
                              <div className="form-group">
                                <label>Giáo án</label>
                                <UploadFile
                                  name={`List[${index}].GiaoAnPdf`}
                                  onChange={(file) =>
                                    setFieldValue(
                                      `List[${index}].GiaoAnPdf`,
                                      file,
                                      false
                                    )
                                  }
                                  value={item.GiaoAnPdf}
                                  arrowProps={{
                                    Placeholder: "Chọn file giáo án",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="form-group mb-0">
                                <label>File Mã hóa</label>
                                <Select
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  isDisabled={loadingPath}
                                  isLoading={loadingPath}
                                  options={PathFile.Wow}
                                  isClearable
                                  name={`List[${index}].FileMaHoa`}
                                  value={item.FileMaHoa}
                                  onChange={(val) => {
                                    setFieldValue(
                                      `List[${index}].FileMaHoa`,
                                      val,
                                      false
                                    );
                                  }}
                                  className="select-control"
                                  classNamePrefix="select"
                                  placeholder="Chọn file"
                                  noOptionsMessage={() => "Không thấy file."}
                                />
                              </div>
                              <div className="form-group mb-0">
                                <label>Hình ảnh</label>
                                <UploadFile
                                  name={`List[${index}].Thumbnail`}
                                  onChange={(file) =>
                                    setFieldValue(
                                      `List[${index}].Thumbnail`,
                                      file,
                                      false
                                    )
                                  }
                                  value={item.Thumbnail}
                                  arrowProps={{
                                    Placeholder: "Chọn file hình ảnh",
                                    Type: "image",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-center mt-12px">
                              {values.List.length - 1 === index && (
                                <button
                                  className="btn btn-sm btn-primary mx-3px"
                                  type="button"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      Title: "",
                                      Type: defaultValues.Type
                                        ? defaultValues.Type
                                        : arrCate && arrCate.length > 0
                                        ? arrCate[0].ID
                                        : null,
                                      Thumbnail: "",
                                      GiaoAnPdf: "",
                                      LinkOnline: null,
                                      DynamicID: "",
                                      Version: "",
                                    })
                                  }
                                >
                                  <i
                                    className="far fa-plus pe-0"
                                    style={{ fontSize: "14px" }}
                                  ></i>
                                </button>
                              )}

                              {values.List.length > 1 && (
                                <button
                                  className="btn btn-sm btn-danger mx-3px"
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <i
                                    className="fas fa-trash icon-sm pe-0"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      {/* 
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
                */}

                      {/* 
                      <div className="form-group">
                  <label>Link Online</label>
                  <Select
                    isDisabled={loadingPath}
                    isLoading={loadingPath}
                    options={PathFile.Online}
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
                */}
                    </>
                  )}
                />
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
