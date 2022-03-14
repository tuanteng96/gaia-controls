import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { Form, Formik } from "formik";
import SchoolManageCrud from "../../../SchoolManage/_redux/SchoolManageCrud";
import { useSelector } from "react-redux";

FiltersTeacher.propTypes = {
  onSubmit: PropTypes.func,
};

const initialValue = {
  _key: "",
  Status: null,
  SchoolID: null,
};

function FiltersTeacher({ onSubmit, loading }) {
  const [initialValues] = useState(initialValue);
  const { ListStatus } = useSelector(({ teacher }) => ({
    ListStatus: teacher.Status,
  }));
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
                  placeholder="Nhập tên giáo viên ..."
                  value={values._key}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="position-absolute top-12px right-15px pointer-events-none">
                  <i className="far fa-search"></i>
                </div>
              </div>
              <div className="w-250px me-3">
                <AsyncPaginate
                  className="select-control"
                  classNamePrefix="select"
                  isClearable={true}
                  name="SchoolID"
                  loadOptions={getAllSchool}
                  placeholder="Chọn trường"
                  value={values.SchoolID}
                  onChange={(option) => {
                    setFieldValue("SchoolID", option, false);
                  }}
                  onBlur={handleBlur}
                  additional={{
                    page: 1,
                  }}
                />
              </div>
              <div className="w-250px me-3">
                <Select
                  className="select-control"
                  classNamePrefix="select"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isSearchable={true}
                  name="Status"
                  options={ListStatus}
                  placeholder="Trạng thái"
                  value={values.Status}
                  onChange={(option) => {
                    setFieldValue("Status", option, false);
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

export default FiltersTeacher;
