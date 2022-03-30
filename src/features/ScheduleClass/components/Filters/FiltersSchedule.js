import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AsyncPaginate } from "react-select-async-paginate";
import { Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import SchoolManageCrud from "../../../SchoolManage/_redux/SchoolManageCrud";

FiltersSchedule.propTypes = {
  onSubmit: PropTypes.func,
};

const initialValue = {
  _key: "",
  SchoolID: null,
  From: null,
  To: null,
};

function FiltersSchedule({ onSubmit, loading, filters }) {
  const [initialValues] = useState(initialValue);

  useEffect(() => {}, []);

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
        const { values, handleBlur, setFieldValue } = formikProps;
        return (
          <Form>
            <div className="mb-4 d-flex">
              <div className="w-350px me-3">
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
                <DatePicker
                  popperProps={{
                    positionFixed: true,
                  }}
                  name="From"
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
                  name="To"
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

export default FiltersSchedule;
