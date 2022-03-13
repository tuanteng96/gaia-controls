import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SchoolManageCrud from "../../_redux/SchoolManageCrud";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css";

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
};

const schoolSchema = Yup.object().shape({
  Title: Yup.string().required("Vui lòng nhập tên danh mục."),
});

function ModalSchool({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [ListCity, setListCity] = useState([]);
  const [LoadingCity, setLoadingCity] = useState(false);
  const [LoadingDistrict, setLoadingDistrict] = useState(false);
  const [ListLevel, setListLevel] = useState([]);
  const [LoadingLevel, setLoadingLevel] = useState([]);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue
  } = usePlacesAutocomplete();

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = (val) => {
    setValue(val, false);
  };

  const renderSuggestions = () => {
    const suggestions = data.map(({ place_id, description }) => (
      <ComboboxOption key={place_id} value={description} />
    ));

    return (
      <>
        {suggestions}
        <li className="logo">
          <img
            src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
            alt="Powered by Google"
          />
        </li>
      </>
    );
  };

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
        City: defaultValues.PID
          ? { value: defaultValues.PID, label: defaultValues.PTitle }
          : null,
        District: defaultValues.DID
          ? { value: defaultValues.DID, label: defaultValues.DTitle }
          : null,
        Contacts: [],
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
        _key: `~${inputValue}`,
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

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-max2-sm">
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
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>
                  {values.ID ? "Chỉnh sửa bài giảng" : "Thêm mới bài giảng"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Tên trường <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.Title && touched.Title
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
                  <label>Địa chỉ</label>
                  <Combobox onSelect={handleSelect} aria-labelledby="demo">
                    <ComboboxInput
                      style={{ width: 300, maxWidth: "90%" }}
                      value={value}
                      onChange={handleInput}
                      disabled={!ready}
                    />
                    <ComboboxPopover>
                      <ComboboxList>{status === "OK" && renderSuggestions()}</ComboboxList>
                    </ComboboxPopover>
                  </Combobox>
                  <textarea
                    rows="3"
                    type="text"
                    className="form-control"
                    name="Address"
                    placeholder="Nhập địa chỉ"
                    autoComplete="off"
                    value={values.Address}
                    onChange={handleChange}
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
                    placeholder="Nhập số điện thoại"
                    autoComplete="off"
                    value={values.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Tỉnh / Thành phố</label>
                  <Select
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
                    className="select-control"
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
