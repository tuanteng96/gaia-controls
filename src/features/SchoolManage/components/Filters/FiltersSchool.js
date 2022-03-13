import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SchoolManageCrud from "../../_redux/SchoolManageCrud";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Form, Formik } from "formik";

FiltersSchool.propTypes = {
  onSubmit: PropTypes.func,
};

const initialValue = {
  _key: "",
  PID: null,
  DID: null,
  Levels: null,
};

function FiltersSchool({ onSubmit, loading }) {
  const [initialValues, ] = useState(initialValue);
  const [ListCity, setListCity] = useState([]);
  const [LoadingCity, setLoadingCity] = useState(false);
  const [LoadingDistrict, setLoadingDistrict] = useState(false);
  const [ListLevel, setListLevel] = useState([]);
  const [LoadingLevel, setLoadingLevel] = useState([]);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    getAllCity();
    getAllLevel();
  }, []);

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
          data.map((item) => ({
            ...item,
            label: item.Title,
            value: item.ID,
          }));
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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const { values, handleChange, handleBlur, setFieldValue } = formikProps;
        return (
          <Form>
            <div className="mb-4 d-flex">
              <div className="w-400px position-relative me-3">
                <input
                  name="_key"
                  type="text"
                  className="form-control pr-50px"
                  placeholder="Nhập tên trường ..."
                  value={values._key}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="position-absolute top-12px right-15px pointer-events-none">
                  <i className="far fa-search"></i>
                </div>
              </div>
              <div className="w-250px me-3">
                <Select
                  className="select-control"
                  classNamePrefix="select"
                  isDisabled={LoadingCity}
                  isLoading={LoadingCity}
                  isClearable={true}
                  isSearchable={true}
                  name="PID"
                  options={ListCity}
                  placeholder="Chọn tỉnh / thành phố"
                  value={values.PID}
                  onChange={(option, triggeredAction) => {
                    if (triggeredAction.action === "clear") {
                      setFieldValue("DID", null, false);
                    }
                    setFieldValue("PID", option, false);
                  }}
                  onBlur={handleBlur}
                />
              </div>
              <div className="w-250px me-3">
                <AsyncSelect
                  key={values?.PID?.value}
                  className="select-control"
                  classNamePrefix="select"
                  cacheOptions
                  loadOptions={(inputValue, callback) =>
                    getAllDistrict(inputValue, callback, values?.PID?.value)
                  }
                  isClearable={true}
                  isLoading={LoadingDistrict}
                  isDisabled={!values?.PID?.value}
                  defaultOptions
                  placeholder="Chọn quận / huyện"
                  value={values.DID}
                  onChange={(option) => {
                    setFieldValue("DID", option, false);
                  }}
                  onBlur={handleBlur}
                />
              </div>
              <div className="w-250px me-3">
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
              <div>
                <button
                  type="submit"
                  className={`btn btn-primary m-0 ${loading &&
                    "spinner spinner-white spinner-right"} w-auto h-auto`}
                  disabled={loading}
                >
                  Lọc
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default FiltersSchool;
