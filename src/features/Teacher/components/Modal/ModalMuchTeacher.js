import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Table } from 'react-bootstrap'
import { FieldArray, Form, Formik } from 'formik'
import AsyncSelectSchool from '../../../../components/Selects/AsyncSelectSchool'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'

const initialValue = {
  SchoolID: '',
  CountCreate: 5,
  users: [],
}

function ModalMuchTeacher({ show, onHide, onSubmit, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialValue)
  return (
    <Modal
      show={show}
      onHide={onHide}
      //dialogClassName="modal-max2-sm"
      scrollable={true}
      enforceFocus={false}
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        //validationSchema={AddSchema}
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
          } = formikProps
          
          return (
            <Form className="d-flex flex-column overflow-hidden align-items-stretch">
              <Modal.Header closeButton>
                <Modal.Title>Thêm mới nhiều giáo viên</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="p-15px d-flex align-items-end">
                  <div className="w-350px">
                    <label className="mb-2px font-weight-bolder text-muted">
                      Trường
                    </label>
                    <AsyncSelectSchool
                      isClearable={false}
                      menuPosition="fixed"
                      placeholder="Chọn trường"
                      noOptionsMessage={() => 'Không có trường'}
                      className={`select-control ${
                        errors?.SchoolID && touched?.SchoolID
                          ? 'is-invalid solid-invalid'
                          : ''
                      }`}
                      onChange={(option) => {
                        setFieldValue('SchoolID', option)
                      }}
                    />
                  </div>
                  <div className="w-150px ml-12px">
                    <label className="mb-2px font-weight-bolder text-muted">
                      Số lượng giáo viên
                    </label>
                    <NumberFormat
                      type="text"
                      autoComplete="off"
                      //allowNegative={false}
                      name="CountCreate"
                      placeholder="Nhập số lượng"
                      className="form-control"
                      isNumericString={true}
                      //thousandSeparator={true}
                      value={values.CountCreate}
                      onValueChange={(val) => {
                        setFieldValue(
                          `CountCreate`,
                          val.floatValue ? val.floatValue : val.value,
                        )
                      }}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="ml-12px">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (!values.SchoolID) {
                          toast.error('Vui lòng chọn trường.', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1500,
                          })
                          return
                        }
                        if (!values.CountCreate) {
                          toast.error(
                            'Vui lòng chọn số lượng giáo viên cần tạo.',
                            {
                              position: toast.POSITION.TOP_RIGHT,
                              autoClose: 1500,
                            },
                          )
                          return
                        }

                        setFieldValue(
                          'users',
                          Array(values.CountCreate)
                            .fill()
                            .map(() => ({
                              ho_ten: '',
                              email: '',
                              sdt: '',
                              cap_lop: '',
                              pwd: 1234,
                            })),
                        )
                      }}
                    >
                      Tạo danh sách
                    </button>
                  </div>
                </div>
                {values.users && values.users.length > 0 && (
                  <div className="px-15px">
                    <FieldArray
                      name="users"
                      render={(arrayHelpers) => (
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th className="px-10px py-12px">Họ tên</th>
                              <th className="px-10px py-12px">Email</th>
                              <th className="px-10px py-12px">Số điện thoại</th>
                              <th className="px-10px py-12px">Cấp lớp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.users.map((teacher, index) => (
                              <tr key={index}>
                                <td className="px-10px py-12px">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name={`users[${index}].ho_ten`}
                                    placeholder="Họ tên giáo viên"
                                    value={teacher.ho_ten}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </td>
                                <td className="px-10px py-12px">
                                  <input
                                    autoComplete="off"
                                    type="text"
                                    className="form-control"
                                    name={`users[${index}].email`}
                                    placeholder="Email"
                                    value={teacher.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </td>
                                <td className="px-10px py-12px">
                                  <input
                                    autoComplete="off"
                                    type="text"
                                    className="form-control"
                                    name={`users[${index}].sdt`}
                                    placeholder="Số điện thoại"
                                    value={teacher.sdt}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </td>
                                <td className="px-10px py-12px">
                                  <input
                                    autoComplete="off"
                                    type="text"
                                    className="form-control"
                                    name={`users[${index}].cap_lop`}
                                    placeholder="Cấp lớp"
                                    value={teacher.cap_lop}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    />
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onHide}>
                  Đóng
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={`btn btn-primary ${
                    btnLoading && 'spinner spinner-white spinner-right mt-0'
                  } w-auto h-auto`}
                  disabled={btnLoading}
                >
                  Thêm mới
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

ModalMuchTeacher.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
}

export default ModalMuchTeacher
