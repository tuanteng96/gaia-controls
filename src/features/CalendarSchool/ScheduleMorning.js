import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import { ClassSchoolGenerator } from "../../helpers/ClassHelpers";
import { getStyleSchool } from "../../helpers/DateTimeHelpers";
import clsx from "clsx";
import {
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import AsyncSelectTeachers from "../../components/Selects/AsyncSelectTeachers";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ScheduleMorning.propTypes = {
  ScheduleDay: PropTypes.array,
  onOpenModalAdd: PropTypes.func,
};

function ScheduleMorning({ ScheduleDay, onOpenModalAdd, onChangeTeacher }) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarSchool }) => ({
    HourSchool: calendarSchool.HourSchool,
  }));

  useEffect(() => {
    setScheduleItem(getArrayChildren(ScheduleDay, "S", HourSchool));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ScheduleDay, HourSchool]);

  return (
    <Fragment>
      {ScheduleItem &&
        ScheduleItem.map((item, index) => (
          <Fragment key={index}>
            <OverlayTrigger
              rootClose
              trigger="click"
              key="top"
              placement="top"
              overlay={
                <Popover
                  id={`popover-positioned-top`}
                >
                  <Popover.Header className="text-uppercase font-weight-bold d-flex justify-content-between py-3">
                    <span className="pt-1 d-block">
                      Tiết {item.Index}
                      <span className="pl-2px">
                        ({moment(item.From).format("HH:mm")} - {moment(item.To).format("HH:mm")})
                      </span>
                    </span>
                    {/* {
                      <OverlayTrigger
                        rootClose
                        trigger="click"
                        key="top"
                        placement="auto"
                        overlay={
                          <Popover
                            id={`popover-positioned-top}`}
                          >
                            <Popover.Body className="p-0">
                              {period.AutoList &&
                                period.AutoList
                                  .length > 0 ? (
                                period.AutoList.map(
                                  (
                                    isAuto,
                                    autoIx
                                  ) => (
                                    <div
                                      className="border-bottom border-bottom py-2 px-3"
                                      key={
                                        autoIx
                                      }
                                    >
                                      {
                                        isAuto.Text
                                      }
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="border-bottom border-bottom py-2 px-3">
                                  Không có
                                </div>
                              )}
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <i
                          className={`fas fa-engine-warning pt-2 cursor-pointer icon-md ${period.IsAutoSet &&
                            "opacity-60"}`}
                        ></i>
                      </OverlayTrigger>
                    } */}
                  </Popover.Header>
                  <Popover.Body>
                    <div className="mb-10px">
                      <label>Giáo viên</label>
                      <AsyncSelectTeachers
                        className="select-control"
                        placeholder="Chọn giáo viên"
                        value={item.TeacherID ? {
                          value:
                            item.TeacherID,
                          label:
                            item.TeacherTitle
                        } : null}
                        onChange={(otp) => onChangeTeacher(otp, item)}
                      />
                    </div>
                    <div>
                      <label className="w-100 d-flex justify-content-between align-items-end">
                        <span>Trợ giảng</span>
                        <button type="button"
                          onClick={() => {
                            document.body.click();
                            onOpenModalAdd(item);
                          }}
                          className="btn btn-success btn-xss">
                          Thêm
                        </button>
                      </label>
                      <div className="text-muted">
                        Chưa có trợ giảng
                      </div>
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              <div>
                <div
                  className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center ${ClassSchoolGenerator(
                    item
                  )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
                  style={getStyleSchool(item, "S", HourSchool)}
                >
                  <span className="text-white font-size-xs font-weight-border">
                    {item.Index}
                  </span>
                </div>
                {
                  item.TeacherTitle && (
                    <div className="shadow h-20px w-100 position-absolute bottom-0 text-center font-size-xs pt-2px text-truncate px-3">
                      {item.TeacherTitle}
                    </div>
                  )
                }
              </div>
            </OverlayTrigger>
          </Fragment>
        ))}
    </Fragment>
  );
}

export default ScheduleMorning;
