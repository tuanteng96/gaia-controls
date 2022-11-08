import React, { useState } from "react";
import PropTypes from "prop-types";
import SchoolManageCrud from "../SchoolManage/_redux/SchoolManageCrud";
import { AsyncPaginate } from "react-select-async-paginate";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";

ScheduleGenerator.propTypes = {
  onSubmit: PropTypes.func,
};

const GeneratorSchema = Yup.object().shape({
  School: Yup.object()
    .required("Vui lòng nhập trường.")
    .nullable(),
});

function ScheduleGenerator({
  onSubmit,
  initialValues,
  ID,
  loading,
  onClearSchool,
  AllInitial,
}) {
  const [ListClass, setListClass] = useState([]);
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
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={GeneratorSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formikSubProps) => {
        const {
          values,
          handleBlur,
          setFieldValue,
          errors,
          touched,
        } = formikSubProps;
        return (
          <div className="d-flex form-group mb-0">
            <div className="w-350px me-3">
              <AsyncPaginate
                menuPosition="fixed"
                className={`select-control ${
                  errors.School && touched.School
                    ? "is-invalid solid-invalid"
                    : ""
                }`}
                classNamePrefix="select"
                isClearable={true}
                name="School"
                loadOptions={getAllSchool}
                placeholder="Chọn trường"
                value={values.School}
                onChange={(option) => {
                  if (!option) {
                    onClearSchool();
                    setListClass([]);
                  } else {
                    const newListClass = option.ClassList.map((x) => ({
                      ...x,
                      value: x.Title,
                      label: x.Title,
                    }));
                    setListClass(newListClass);
                  }
                  setFieldValue("School", option, false);
                }}
                onBlur={handleBlur}
                additional={{
                  page: 1,
                }}
              />
            </div>
            {AllInitial && AllInitial.isClassChoose && (
              <div className="flex-1 me-3">
                <Select
                  isMulti
                  isClearable
                  className={`select-control`}
                  classNamePrefix="select"
                  name="Class"
                  options={ListClass}
                  placeholder="Chọn lớp"
                  value={values.Class}
                  onChange={(option) => {
                    setFieldValue(`Class`, option, false);
                  }}
                  onBlur={handleBlur}
                  menuPosition="fixed"
                  isDisabled={!values.School}
                  noOptionsMessage={() => "Không có lớp"}
                />
              </div>
            )}

            <div className="w-250px me-3">
              <DatePicker
                popperProps={{
                  positionFixed: true,
                }}
                className="form-control"
                selected={values.From ? new Date(values.From) : values.From}
                onChange={(date) => setFieldValue("From", date, false)}
                popperPlacement="bottom-end"
                shouldCloseOnSelect={false}
                dateFormat="dd/MM/yyyy"
                placeholderText="Ngày bắt đầu"
              />
            </div>
            <div className="w-250px me-3">
              <DatePicker
                popperProps={{
                  positionFixed: true,
                }}
                className="form-control"
                selected={values.To ? new Date(values.To) : values.To}
                onChange={(date) => setFieldValue("To", date, false)}
                popperPlacement="bottom-end"
                shouldCloseOnSelect={false}
                dateFormat="dd/MM/yyyy"
                placeholderText="Ngày kết thúc"
              />
            </div>
            <div>
              <button
                type="button"
                className={`btn btn-primary m-0  w-auto h-auto ${loading &&
                  "spinner spinner-white spinner-right"}`} //spinner spinner-white spinner-right
                onClick={() => formikSubProps.handleSubmit()}
                disabled={loading}
              >
                {ID ? "Tạo mới bảng lịch" : "Tạo bảng lịch"}
              </button>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default ScheduleGenerator;
