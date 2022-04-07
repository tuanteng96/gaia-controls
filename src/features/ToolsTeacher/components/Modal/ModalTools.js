import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Select from "react-select";
import { useSelector } from "react-redux";
import UploadFile from "../../../../_shared/files/UploadFile";
import NumberFormat from "react-number-format";

ModalTools.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const initialValue = {
  Title: "",
  Type: null,
  Qty: "",
  Thumbnail: "",
};

const ToolsSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên giáo cụ."),
  Type: Yup.object()
    .nullable()
    .required("Vui lòng chọn danh mục giáo cụ."),
});

function ModalTools({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [arrCate, setArrCate] = useState([]);
  const { listCate, loading } = useSelector(({ toolTeacher }) => ({
    listCate: toolTeacher.listCate,
    loading: toolTeacher.loading,
  }));

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
        ...initialValue,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        Type: {
          value: defaultValues.Type,
          label: defaultValues.TypeName,
        },
        Thumbnail: defaultValues.Thumbnail,
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
                  {values.ID ? "Chỉnh sửa giáo cụ" : "Thêm mới giáo cụ"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên giáo cụ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Title && touched.Title
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Title"
                    placeholder="Nhập tên giáo cụ"
                    autoComplete="off"
                    value={values.Title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Số lượng <span className="text-danger">*</span>
                  </label>
                  <NumberFormat
                    type="text"
                    autoComplete="off"
                    allowNegative={false}
                    name={`Qty`}
                    placeholder="Nhập số lượng"
                    className="form-control"
                    isNumericString={true}
                    //thousandSeparator={true}
                    value={values.Qty}
                    onValueChange={(val) => {
                      setFieldValue(
                        `Qty`,
                        val.floatValue ? val.floatValue : val.value
                      );
                    }}
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
                <div className="form-group mb-0">
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

export default ModalTools;
