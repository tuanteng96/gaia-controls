import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import AsyncSelectTeachers from "../../../../components/Selects/AsyncSelectTeachers";
import AsyncSelect from "react-select/async";
import CalendarSchoolCrud from "../../_redux/CalendarSchoolCrud";

ModalChangesTeacher.propTypes = {
  show: PropTypes.bool,
};

const AddSchema = Yup.object().shape({
  FromTeacherID: Yup.object()
    .nullable()
    .required("Vui lòng chọn giáo viên"),
  ToTeacherID: Yup.object()
    .nullable()
    .required("Vui lòng chọn giáo viên"),
});

const filterData = (inputValue, data) => {
  return data.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

function ModalChangesTeacher({ show, onHide, onSubmit, loadingBtn }) {
  const [initialValues] = useState({
    FromTeacherID: "",
    ToTeacherID: "",
  });
  const [loading, setLoading] = useState(false);
  const [useKey, setUseKey] = useState(0);

  const typingTimeoutRef = useRef(null);

  const loadOptions = (inputValue, parameter) => {
    return new Promise((resolve) => {
      if (parameter.ID) {
        setLoading(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(async () => {
          const newValues = {
            FromTeacherID: parameter.ID,
          };
          const data = await CalendarSchoolCrud.previewChangesTeacher(
            newValues
          );
          let newAvaiList = [];
          if (data && data.AvaiList && data.AvaiList.length > 0) {
            newAvaiList = data.AvaiList.map((o) => ({
              ...o,
              label: o.FullName,
              value: o.ID,
            }));
          } else if (data.NotList && data.NotList.length > 0) {
            newAvaiList = data.NotList.map((o) => ({
              ...o,
              label: o.FullName,
              value: o.ID,
            }));
          }
          setLoading(false);
          resolve(filterData(inputValue, newAvaiList));
        }, 300);
      } else {
        resolve([]);
      }
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
      enforceFocus={false}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={AddSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            setFieldValue,
          } = formikProps;

          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>Thay đổi giáo viên</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>Giáo viên hiện tại</label>
                  <AsyncSelectTeachers
                    className={`select-control ${
                      errors?.FromTeacherID && touched?.FromTeacherID
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    placeholder="Chọn giáo viên"
                    name="FromTeacherID"
                    menuPosition="fixed"
                    value={values?.FromTeacherID}
                    onChange={(option) => {
                      setFieldValue("FromTeacherID", option, false);
                      setFieldValue("ToTeacherID", "", false);
                      setUseKey((prevState) => prevState + 1);
                    }}
                    onBlur={handleBlur}
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue
                        ? "Danh sách giáo viên trống"
                        : "Không tìm thấy giáo viên phù hợp."
                    }
                  />
                </div>
                <div className="form-group mb-0">
                  <label>Giáo viên thay thế</label>
                  <AsyncSelect
                    key={useKey}
                    classNamePrefix="select"
                    cacheOptions
                    loadOptions={(inputValue) =>
                      loadOptions(inputValue, values.FromTeacherID)
                    }
                    defaultOptions
                    className={`select-control ${
                      errors?.ToTeacherID && touched?.ToTeacherID
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    placeholder="Chọn giáo viên"
                    name="ToTeacherID"
                    menuPosition="fixed"
                    value={values?.ToTeacherID}
                    onChange={(option) => {
                      setFieldValue("ToTeacherID", option, false);
                    }}
                    onBlur={handleBlur}
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue
                        ? "Danh sách giáo viên trống"
                        : "Không tìm thấy giáo viên phù hợp."
                    }
                    disabled={!values.FromTeacherID}
                    isLoading={values.FromTeacherID && loading}
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
                  className={`btn btn-primary ${loadingBtn &&
                    "spinner spinner-white spinner-right mt-0"} w-auto h-auto`}
                  disabled={loadingBtn}
                >
                  Thực hiện
                </Button>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalChangesTeacher;
