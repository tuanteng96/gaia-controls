import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SchoolManageCrud from "../../_redux/SchoolManageCrud";
import MapContainer from "../Maps/MapContainer";
import ModalLessonTime from "../Modal/ModalLessonTime";

ModalSchool.propTypes = {
  show: PropTypes.bool,
};

const initialValue = {
  Title: "",
  Phone: "",
  Email: "",
  Address: "",
  City: null,
  District: null,
  Contacts: [],
  Levels: null,
  Lng: 0,
  Lat: 0,
};

const schoolSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
  Levels: Yup.object().required("Vui lòng chọn cấp."),
});

function ModalSchool({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [ListCity, setListCity] = useState([]);
  const [LoadingCity, setLoadingCity] = useState(false);
  const [LoadingDistrict, setLoadingDistrict] = useState(false);
  const [ListLevel, setListLevel] = useState([]);
  const [LoadingLevel, setLoadingLevel] = useState([]);
  const [VisibleLsTime, setVisibleLsTime] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (defaultValues.ID) {
      setInitialValues((prevState) => ({
        ...prevState,
        ID: defaultValues.ID,
        Title: defaultValues.Title,
        Phone: defaultValues.Phone,
        Email: defaultValues.Email,
        Address: defaultValues.Address,
        Lng: defaultValues.Lng,
        Lat: defaultValues.Lat,
        City: defaultValues.PID
          ? { value: defaultValues.PID, label: defaultValues.PTitle }
          : null,
        District: defaultValues.DID
          ? { value: defaultValues.DID, label: defaultValues.DTitle }
          : null,
        Contacts:
          defaultValues.Contacts && defaultValues.Contacts.length > 0
            ? defaultValues.Contacts
            : [],
        Levels:
          defaultValues.LevelJson && JSON.parse(defaultValues.LevelJson)
            ? JSON.parse(defaultValues.LevelJson).map((item) => ({
                ...item,
                label: item?.Title,
                value: item?.ID,
              }))[0]
            : null,
      }));
    } else {
      setInitialValues(initialValue);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (show) {
      getAllCity();
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

  const getAllCity = () => {
    setLoadingCity(true);
    SchoolManageCrud.getAllCity()
      .then(({ data }) => {
        const newData =
          data &&
          data.map((item) => ({ ...item, label: item.Title, value: item.ID }));
        setListCity(newData);
        setLoadingCity(false);
      })
      .catch((err) => console.log(err));
  };

  const getAllDistrict = (inputValue, callback, CityID) => {
    if (!CityID) {
      callback([]);
      return;
    }
    setLoadingDistrict(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      SchoolManageCrud.getAllDistrict({
        ProvinceID: CityID,
        _key: inputValue,
      })
        .then(({ data }) => {
          const newData =
            data &&
            data.map((item) => ({
              ...item,
              label: item.Title,
              value: item.ID,
            }));
          setLoadingDistrict(false);
          callback(newData);
        })
        .catch((err) => console.log(err));
    }, 500);
  };

  const OpenModalLsTime = () => {
    setVisibleLsTime(true);
  };
  const HideModalLsTime = () => {
    setVisibleLsTime(false);
  };

  const onSubmitTime = (values) => {
    console.log(values);
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={schoolSchema}
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
                  {values.ID ? "Chỉnh sửa trường" : "Thêm mới trường"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên trường <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.Title && touched.Title
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    name="Title"
                    placeholder="Nhập tên trường"
                    autoComplete="off"
                    value={values.Title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Tiết học</label>
                  <div className="border h-40px rounded d-flex align-items-center justify-content-between px-2">
                    12 tiết học trên ngày
                    <label
                      className="btn-primary text-white m-0 rounded cursor-pointer px-2 font-size-xs"
                      onClick={OpenModalLsTime}
                    >
                      Cấu hình
                    </label>
                  </div>
                  <ModalLessonTime
                    show={VisibleLsTime}
                    onHide={HideModalLsTime}
                    onSubmit={onSubmitTime}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <MapContainer
                    onChange={({ address, LatLng }) => {
                      setFieldValue("Address", address, false);
                      setFieldValue("Lat", LatLng.lat, false);
                      setFieldValue("Lng", LatLng.lng, false);
                    }}
                    initialValues={{
                      Address: values.Address,
                      LatLng: {
                        lat: values.Lat,
                        lng: values.Lng,
                      },
                    }}
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
                  <label>Tỉnh / Thành phố</label>
                  <Select
                    menuPosition="fixed"
                    className="select-control"
                    classNamePrefix="select"
                    isDisabled={LoadingCity}
                    isLoading={LoadingCity}
                    isClearable={true}
                    isSearchable={true}
                    name="City"
                    options={ListCity}
                    placeholder="Chọn tỉnh / thành phố"
                    value={values.City}
                    onChange={(option) => {
                      setFieldValue("City", option, false);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Quận / Huyện</label>
                  <AsyncSelect
                    menuPosition="fixed"
                    key={values?.City?.value}
                    className="select-control"
                    classNamePrefix="select"
                    cacheOptions
                    loadOptions={(inputValue, callback) =>
                      getAllDistrict(inputValue, callback, values?.City?.value)
                    }
                    isLoading={LoadingDistrict}
                    isDisabled={!values?.City?.value}
                    defaultOptions
                    placeholder="Chọn quận / huyện"
                    value={values.District}
                    onChange={(option) => {
                      setFieldValue("District", option, false);
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group mb-0">
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
                    onChange={(option) => {
                      setFieldValue("Levels", option, false);
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
  );
}

export default ModalSchool;
