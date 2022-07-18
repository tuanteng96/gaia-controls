import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import AsyncSelectTeachers from '../../../../components/Selects/AsyncSelectTeachers';

const initialValue = {
    rootId: "",
    TeacherId: "", //Giáo viên
    desc: "", // Mô tả
    required: true, // Bắt buộc
};

const AddSchema = Yup.object().shape({
    TeacherId: Yup.object()
        .shape({
            value: Yup.string(),
            label: Yup.string(),
        })
        .nullable()
        .required('Vui lòng chọn giáo viên')
});

function ModalAddTeacher({ show, onHide, onSubmit, defaultValues, btnLoading }) {
    const [initialValues, setInitialValues] = useState(initialValue);
    if(!defaultValues) return <Fragment></Fragment>;
    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName="modal-max2-sm"
            scrollable={true}
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
                        handleChange,
                        handleBlur,
                        setFieldValue,
                    } = formikProps;
                    return (
                        <Form className="d-flex flex-column overflow-hidden align-items-stretch">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Thêm mới giáo viên phụ
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>Giáo viên</label>
                                    <AsyncSelectTeachers
                                        className={`select-control ${errors.TeacherId && touched.TeacherId ? "is-invalid solid-invalid" : ""}`}
                                        placeholder="Chọn giáo viên"
                                        name="TeacherId"
                                        menuPosition="fixed"
                                        value={values.SchoolList}
                                        onChange={(option) => {
                                            setFieldValue("TeacherId", option, false);
                                        }}
                                        onBlur={handleBlur}
                                        additional={{
                                            page: 1,
                                        }}
                                        noOptionsMessage={({ inputValue }) =>
                                            !inputValue
                                                ? "Danh sách giáo viên trống"
                                                : "Không tìm thấy giáo viên phù hợp."
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        name="desc"
                                        value={values.desc}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Nhập mô tả" />
                                </div>
                                <div className="form-group mb-0 d-flex justify-content-between align-items-center">
                                    <label className="mb-0">Bắt buộc giáo viên</label>
                                    <span className="switchs">
                                        <label>
                                            <input type="checkbox" name="required" onChange={handleChange} onBlur={handleBlur} checked={values.required} />
                                            <span></span>
                                        </label>
                                    </span>
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
                                    Thêm mới
                                </Button>
                            </Modal.Footer>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    )
}

ModalAddTeacher.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func
}

export default ModalAddTeacher
