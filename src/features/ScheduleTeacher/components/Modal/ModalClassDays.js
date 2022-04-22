import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { AsyncPaginate } from "react-select-async-paginate";
import TeacherCrud from "../../../Teacher/_redux/TeacherCrud";
import CalendarCrud from "../../../Calendar/_redux/CalendarCrud";
import { AlertError } from "../../../../helpers/AlertHelpers";

import moment from "moment";
import "moment/locale/vi";
import SpinnerMessage from "../../../../components/spinners/SpinnerMessage";
moment.locale("vi");

ModalClassDays.propTypes = {
  show: PropTypes.bool,
  retrieveSchedule: PropTypes.func,
};

function ModalClassDays({ show, onHide, defaultValues, retrieveSchedule }) {
  const [initialValues, setInitialValues] = useState(null);
  const [SpinnerShow, setSpinnerShow] = useState(false);

  useEffect(() => {
    if (show && defaultValues) {
      setInitialValues(defaultValues);
    } else {
      setInitialValues(null);
    }
  }, [show, defaultValues]);

  const getAllTeacher = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 0,
      _orders: {
        Id: true,
      },
      _appends: {
        IsSchoolTeacher: 0,
      },
      _ignoredf: ["Status"],
    };

    const { list, pcount } = await TeacherCrud.getAllTeacher(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({
            ...item,
            label: item.FullName,
            value: item.ID,
          }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };

  const onSubmitTeacher = (option, period) => {
    setSpinnerShow(true);
    const objSubmit = {
      ID: period.ID,
      UserID: option ? option.ID : 0,
      UserTitle: option ? option.FullName : "",
    };

    CalendarCrud.addTeacher(objSubmit)
      .then((response) => {
        if (response.error) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Không thể xếp lịch cho giáo viên này.",
            error: response.error,
          });
        } else {
          retrieveSchedule(true, () =>
            setTimeout(() => setSpinnerShow(false), 300)
          );
        }
      })
      .catch(({ response }) => {
        AlertError({
          title: "Xảy ra lỗi",
          errorTitle: "Không thể xếp lịch cho giáo viên này.",
          error: response.error,
        });
      });
  };

  if (!initialValues) return "";

  return (
    <Modal show={show} onHide={onHide} scrollable={true} size="xxl">
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="pe-1">Lịch học {initialValues.SchoolTitle} </span>
          {initialValues.From && (
            <Fragment>
              (
              {initialValues.From && initialValues.To && (
                <Fragment>
                  {moment(initialValues.From).format("ll")} -{" "}
                  {initialValues.To && moment(initialValues.To).format("ll")} )
                </Fragment>
              )}
              {initialValues.From &&
                !initialValues.To &&
                `Từ ngày ${moment(initialValues.From).format("ll")}`}
            </Fragment>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-4">
          <div className="d-flex position-relative align-items-start">
            <div className="border border-end-0 w-150px">
              <div className="p-2 h-55px d-flex align-items-center justify-content-center min-w-150px border-right text-uppercase font-weight-bold">
                Lớp
              </div>
              <div>
                {initialValues.CalendarList &&
                  initialValues.CalendarList.map((item, index) => (
                    <div
                      className="border-top px-2 h-80px d-flex align-items-center justify-content-center"
                      key={index}
                    >
                      {item.ClassTitle}
                    </div>
                  ))}
              </div>
            </div>

            <div className="border flex-1 overflow-auto">
              {/* Header */}
              <div className="d-flex">
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 2
                  </div>
                </div>
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 3
                  </div>
                </div>
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 4
                  </div>
                </div>
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 5
                  </div>
                </div>
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 6
                  </div>
                </div>
                <div className="flex-1 border-right min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    Thứ 7
                  </div>
                </div>
                <div className="flex-1 min-w-200px">
                  <div className="h-55px d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                    CN
                  </div>
                </div>
              </div>
              {/* End Header */}

              {initialValues.CalendarList &&
                initialValues.CalendarList.map((item, index) => (
                  <div className="d-flex" key={index}>
                    <Fragment>
                      {initialValues.CalendarList[index].Days.map(
                        (period, idx) => (
                          <Fragment key={idx}>
                            {period.Items && period.Items.length > 0 ? (
                              <div
                                className={`flex-1 p-2 h-80px border-top ${idx !==
                                  6 && "border-right"} min-w-200px`}
                              >
                                <div className="font-size-sm font-weight-bold mb-1">
                                  {period.Items[0].Title} ({" "}
                                  {period.Items[0].From &&
                                    moment(period.Items[0].From).format(
                                      "HH:mm"
                                    )}
                                  {period.Items[0].To &&
                                    `- ${moment(period.Items[0].To).format(
                                      "HH:mm"
                                    )}`}{" "}
                                  )
                                </div>
                                {period.Items.map((user, ix) => (
                                  <AsyncPaginate
                                    key={ix}
                                    menuPosition="fixed"
                                    className="select-control"
                                    classNamePrefix="select"
                                    isClearable={true}
                                    name="SchoolID"
                                    loadOptions={getAllTeacher}
                                    placeholder="Chọn giáo viên"
                                    value={
                                      user.UserID && user.UserTitle
                                        ? {
                                            value: user.UserID,
                                            label: user.UserTitle,
                                          }
                                        : null
                                    }
                                    onChange={(option) =>
                                      onSubmitTeacher(option, user)
                                    }
                                    additional={{
                                      page: 1,
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div
                                className={`flex-1 h-80px border-top ${idx !==
                                  6 &&
                                  "border-right"} min-w-200px line-not-box`}
                                key={idx}
                              ></div>
                            )}
                          </Fragment>
                        )
                      )}
                    </Fragment>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <Button type="button" variant="primary">
            Xếp lịch tự động
          </Button>
          <Button type="button" variant="secondary" onClick={onHide}>
            Đóng
          </Button>
        </div>
      </Modal.Footer>
      <SpinnerMessage isShow={SpinnerShow} text="Đang cập nhập ..." />
    </Modal>
  );
}

export default ModalClassDays;
