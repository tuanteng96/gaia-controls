import React from 'react'
import PropTypes from 'prop-types'
import { Popover } from "react-bootstrap";
import AsyncSelectSkills from "../../../../components/Selects/AsyncSelectSkills";
import { Form, Formik } from "formik";
import AsyncSelectTeachers from '../../../../components/Selects/AsyncSelectTeachers';
import * as Yup from "yup";

const initialValue = {
    TeacherID: "",
    TeacherTitle: "",
    Desc: "",
    IsRequire: true,
    SkillID: "",
    SkillTitle: ""
};

const AddSchema = Yup.object().shape({
    TeacherID: Yup.object().nullable().required('Vui lòng chọn giáo viên'),
    SkillID: Yup.object().nullable().required('Vui lòng chọn kỹ năng')
});

function PopoverAddTeacher({ onSubmit }) {
    return (
        <Formik
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={AddSchema}
            enableReinitialize={true}>
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
                        <Popover.Header className="font-weight-bold d-flex justify-content-between py-2">
                            Thêm giáo viên phụ
                        </Popover.Header>
                        <Popover.Body>
                            <div className="form-group">
                                <label>Giáo viên</label>
                                <AsyncSelectTeachers
                                    className={`select-control ${errors?.TeacherID &&
                                        touched?.TeacherID
                                        ? "is-invalid solid-invalid"
                                        : ""
                                        }`}
                                    placeholder="Chọn giáo viên"
                                    name="TeacherID"
                                    value={values.TeacherID}
                                    onChange={(option) => {
                                        setFieldValue(
                                            "TeacherID",
                                            option,
                                            false
                                        );
                                    }}
                                    onBlur={handleBlur}
                                    noOptionsMessage={({ inputValue }) =>
                                        !inputValue
                                            ? "Danh sách giáo viên trống"
                                            : "Không tìm thấy giáo viên phù hợp."
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Kỹ năng</label>
                                <AsyncSelectSkills
                                    className={`select-control ${errors?.SkillID &&
                                        touched?.SkillID
                                        ? "is-invalid solid-invalid"
                                        : ""
                                        }`}
                                    placeholder="Chọn kỹ năng"
                                    name="SkillID"
                                    value={values.SkillID}
                                    onChange={(option) => {
                                        setFieldValue(
                                            "SkillID",
                                            option,
                                            false
                                        );
                                    }}
                                    onBlur={handleBlur}
                                    noOptionsMessage={({ inputValue }) =>
                                        !inputValue
                                            ? "Danh sách kỹ năng trống"
                                            : "Không tìm kỹ năng phù hợp."
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    rows={2}
                                    className="form-control"
                                    name="Desc"
                                    value={values.Desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Nhập mô tả"
                                />
                            </div>
                            <div className="form-group mb-0 d-flex justify-content-between align-items-center">
                                <label className="mb-0">Bắt buộc giáo viên</label>
                                <span className="switchs">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="IsRequire"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            checked={values.IsRequire}
                                        />
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                        </Popover.Body>
                        <div className="font-weight-bold d-flex justify-content-between py-10px px-3 border-top">
                            <button type="submit" className="btn btn-success py-1 font-size-sm">
                                Lưu giáo viên
                            </button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    )
}

PopoverAddTeacher.propTypes = {
    onSubmit: PropTypes.func
}

export default PopoverAddTeacher
