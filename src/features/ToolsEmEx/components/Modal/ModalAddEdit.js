import React, { useState, useEffect, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import { AsyncPaginate } from "react-select-async-paginate";
import TeacherCrud from "../../../Teacher/_redux/TeacherCrud";
import ToolsEmExCrud from "../../_redux/ToolsEmExCrud";
import ToolsTeacherCrud from "../../../ToolsTeacher/_redux/ToolsTeacherCrud";
import NumberFormat from "react-number-format";

ModalAddEdit.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValue = {
  Title: "",
  Desc: "",
  Code: "",
  TeacherID: "",
  TeacherTitle: "",
  IsOut: true, // false Nhập vào - true XUất ra
  Items: [],
};

const ToolsSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên."),
  Code: Yup.string().required("Vui lòng nhập Code."),
  TeacherID: Yup.object()
    .nullable()
    .required("Vui lòng chọn danh mục giáo cụ."),
});

function ModalAddEdit({ show, onAddEdit, onHide, btnLoading, defaultValues }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loadingCode, setLoadingCode] = useState(false);
  const typingTimeoutRef = useRef(null);
  useEffect(() => {
    if (show) {
      if (defaultValues.ID) {
        setInitialValues({
          ID: defaultValues.ID,
          Title: defaultValues.Title,
          Desc: defaultValues.Desc,
          Code: defaultValues.Code,
          TeacherID: defaultValues.TeacherID
            ? {
                label: defaultValues.TeacherTitle,
                value: defaultValues.TeacherID,
              }
            : null,
          TeacherTitle: defaultValues.TeacherTitle,
          IsOut: defaultValues.IsOut,
          Items:
            defaultValues.Items && defaultValues.Items.length > 0
              ? defaultValues.Items.map((item) => ({
                  ...item,
                  TeachingItemID: item.TeachingItemID
                    ? {
                        label: item.TeachingItemTitle,
                        value: item.TeachingItemID,
                      }
                    : null,
                }))
              : [],
        });
      } else {
        setInitialValues({ ...initialValue, IsOut: defaultValues.IsOut });
      }
    }
  }, [show, defaultValues]);

  const getAllTeacher = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 1,
      _orders: {
        Id: true,
      },
      _appends: {
        IsSchoolTeacher: 1,
      },
      _ignoredf: ["Status"],
    };

    const { list, pcount } = await TeacherCrud.getAllTeacher(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({
            ...item,
            label: item.FullName,
            value: item.ID,
          }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };

  const getAllTools = async (search, loadedOptions, { page }) => {
    const newPost = {
      Type: 0,
      _pi: 1,
      _ps: 10,
      _key: "",
    };

    const { list, pcount } = await ToolsTeacherCrud.getAllTools(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({
            ...item,
            label: item.Title,
            value: item.ID,
          }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };

  const setCodeFech = (value, setFieldValue) => {
    setLoadingCode(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        ToolsEmExCrud.randomCode({
          Title: value,
        })
          .then((result) => {
            setFieldValue(
              "Code",
              defaultValues.IsOut ? result[result.length - 1] : result[0]
            );
            setLoadingCode(false);
          })
          .catch((error) => {
            console.log(error);
            setLoadingCode(false);
          });
      } else {
        setFieldValue("");
      }
    }, 800);
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max-md">
      <Formik
        initialValues={initialValues}
        validationSchema={ToolsSchema}
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
                  {values.ID
                    ? `Chỉnh sửa ${
                        values.IsOut ? "đơn xuất" : "đơn nhập"
                      } giáo cụ`
                    : `${
                        values.IsOut ? "Tạo đơn xuất" : "Tạo đơn nhập"
                      } giáo cụ`}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Title && touched.Title
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Title"
                    placeholder="Nhập tên"
                    autoComplete="off"
                    value={values.Title}
                    onChange={(evt) => {
                      setFieldValue("Title", evt.target.value, false);
                      setCodeFech(evt.target.value, setFieldValue);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Mã <span className="text-danger">*</span>
                  </label>
                  <div
                    className={`${loadingCode &&
                      "spinner spinner-primary spinner-right"} w-auto h-auto m-0`}
                  >
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Code && touched.Code
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      name="Code"
                      placeholder="Mã đơn"
                      autoComplete="off"
                      value={values.Code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Mô tả <span className="text-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    className={`form-control`}
                    name="Desc"
                    placeholder="Nhập mô tả"
                    autoComplete="off"
                    value={values.Desc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Giáo viên</label>
                  <div>
                    <AsyncPaginate
                      className="select-control"
                      classNamePrefix="select"
                      isClearable={true}
                      name="TeacherID"
                      loadOptions={getAllTeacher}
                      placeholder="Chọn giáo viên"
                      value={values.TeacherID}
                      onChange={(option) =>
                        setFieldValue("TeacherID", option, false)
                      }
                      additional={{
                        page: 1,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th className="w-300px max-w-300px">Loại giáo cụ</th>
                        <th className="w-80px max-w-80px text-center">SL</th>
                        <th>Ghi chú</th>
                        <th className="w-50px max-w-50px text-center">#</th>
                      </tr>
                    </thead>
                    <tbody>
                      <FieldArray
                        name="Items"
                        render={(arrayHelpers) => (
                          <Fragment>
                            {values.Items && values.Items.length > 0 ? (
                              values.Items.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <AsyncPaginate
                                      className="select-control"
                                      classNamePrefix="select"
                                      isClearable={true}
                                      name={`Items[${index}].TeachingItemID`}
                                      loadOptions={getAllTools}
                                      placeholder="Chọn giáo cụ"
                                      value={item.TeachingItemID}
                                      onChange={(option) =>
                                        setFieldValue(
                                          `Items[${index}].TeachingItemID`,
                                          option
                                        )
                                      }
                                      additional={{
                                        page: 1,
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <NumberFormat
                                      type="text"
                                      autoComplete="off"
                                      allowNegative={false}
                                      name={`Items[${index}].Qty`}
                                      placeholder="SL"
                                      className="form-control text-center"
                                      isNumericString={true}
                                      //thousandSeparator={true}
                                      value={item.Qty}
                                      onValueChange={(val) => {
                                        setFieldValue(
                                          `Items[${index}].Qty`,
                                          val.floatValue
                                            ? val.floatValue
                                            : val.value
                                        );
                                      }}
                                      onBlur={handleBlur}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control`}
                                      name={`Items[${index}].Desc`}
                                      placeholder="Nhập ghi chú"
                                      autoComplete="off"
                                      value={item.Desc}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div
                                      className="w-30px h-30px d-flex align-items-center justify-content-center cursor-pointer"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <i className="fas fa-trash text-danger"></i>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="text-center" colSpan={4}>
                                  Chưa có giáo cụ.
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan={4} className="text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      TeachingItemID: "",
                                      Desc: "",
                                      Qty: "",
                                    })
                                  }
                                  className="btn btn-success btn-xs"
                                >
                                  <i className="fas fa-layer-plus"></i>
                                  Thêm giáo cụ
                                </button>
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      />
                    </tbody>
                  </Table>
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

export default ModalAddEdit;
