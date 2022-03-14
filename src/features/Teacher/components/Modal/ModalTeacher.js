import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import SchoolManageCrud from "../../../SchoolManage/_redux/SchoolManageCrud";
import { useSelector } from "react-redux";
import TeacherCrud from "../../_redux/TeacherCrud";

ModalTeacher.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  FullName: "",
  Phone: "",
  Email: "",
  UserName: "",
  Password: "1234",
  SchoolID: null,
  SchoolTitle: null,
  Status: null,
  IsSchoolTeacher: true,
};

const teachSchema = Yup.object().shape({
  FullName: Yup.string().required("Vui lòng nhập tên danh mục."),
  Password: Yup.string().required("Vui lòng nhập mật khẩu."),
  SchoolID: Yup.object().required("Vui lòng chọn trường.").nullable(),
});

function ModalTeacher({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loadingUser, setLoadingUser] = useState(false);
  const { ListStatus } = useSelector(({ teacher }) => ({
    ListStatus: teacher.Status,
  }));
  const typingTimeoutRef = useRef(null);
  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues((prevState) => ({
        ...prevState,
        ID: defaultValues.ID,
        FullName: defaultValues.FullName,
        Phone: defaultValues.Phone,
        Email: defaultValues.Email,
        UserName: defaultValues.UserName,
        Password: defaultValues.Password,
        SchoolID: {
          label: defaultValues.SchoolID,
          value: defaultValues.SchoolTitle
        },
        SchoolTitle: {
          label: defaultValues.SchoolID,
          value: defaultValues.SchoolTitle
        },
        Status: ListStatus.filter(item => item.value === Number(defaultValues.Status))[0],
        IsSchoolTeacher: true,
      }));
    } else {
      setInitialValues(() => ({
        ...initialValue,
        Status: ListStatus[1],
      }));
    }
  }, [defaultValues, ListStatus]);

  const getAllSchool = async (search, loadedOptions, { page }) => {
    const newPost = {
      _key: search,
      _pi: page,
      _ps: 10,
      _orders: {
        Id: true,
      },
    };

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

  const suggestUser = (FullName, setFieldValue) => {
    if (!FullName || defaultValues.ID) return;
    setLoadingUser(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      TeacherCrud.getSuggestUser({
        name: "UserName",
        start: FullName,
        top: 1,
      })
        .then(({ data }) => {
          setFieldValue("UserName", data[0], false);
          setLoadingUser(false);
        })
        .catch((error) => console.log(error));
    }, 500);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={teachSchema}
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
                  {values.ID ? "Chỉnh sửa giáo viên" : "Thêm mới giáo viên"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên giáo viên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.FullName && touched.FullName
                      ? "is-invalid solid-invalid"
                      : ""
                      }`}
                    name="FullName"
                    placeholder="Nhập giáo viên"
                    autoComplete="off"
                    value={values.FullName}
                    onChange={(evt) => {
                      setFieldValue("FullName", evt.target.value, false);
                      suggestUser(evt.target.value, setFieldValue);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Phone"
                    placeholder="Nhập số điện thoại"
                    autoComplete="off"
                    value={values.Phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Email"
                    placeholder="Nhập Email"
                    autoComplete="off"
                    value={values.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Trường</label>
                  <AsyncPaginate
                    className={`select-control ${errors.FullName && touched.FullName
                      ? "is-invalid solid-invalid"
                      : ""
                      }`}
                    classNamePrefix="select"
                    isClearable={true}
                    name="SchoolID"
                    loadOptions={getAllSchool}
                    menuPosition="fixed"
                    placeholder="Chọn trường"
                    value={values.SchoolID}
                    onChange={(option) => {
                      setFieldValue("SchoolID", option, false);
                      setFieldValue("SchoolTitle", option, false);
                    }}
                    onBlur={handleBlur}
                    additional={{
                      page: 1,
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <Select
                    className="select-control"
                    classNamePrefix="select"
                    name="Status"
                    options={ListStatus}
                    placeholder="Trạng thái"
                    value={values.Status}
                    onChange={(option) => {
                      setFieldValue("Status", option, false);
                    }}
                    onBlur={handleBlur}
                    menuPosition="fixed"
                  />
                </div>
                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <div
                    className={`${loadingUser &&
                      "spinner spinner-primary spinner-right"} m-0 w-auto h-auto`}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên đăng nhập"
                      autoComplete="off"
                      value={values.UserName}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="form-group mb-0">
                  <label>
                    Mật khẩu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.Password && touched.Password
                      ? "is-invalid solid-invalid"
                      : ""
                      }`}
                    name="Password"
                    placeholder="Nhập mật khẩu"
                    autoComplete="off"
                    value={values.Password}
                    onChange={handleChange}
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
  );
}

export default ModalTeacher;
