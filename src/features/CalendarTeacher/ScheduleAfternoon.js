import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArraysChildren } from "../../helpers/ArrayHelpers";
import clsx from "clsx";
import { ClassTeacherGenerator } from "../../helpers/ClassHelpers";
import { getStyleHiliday, getStyleSchool } from "../../helpers/DateTimeHelpers";
import { OverlayTrigger, Popover } from "react-bootstrap";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ScheduleAfternoon.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleAfternoon({ ScheduleDay, Teacher, HolidaySchedule }) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarTeachers }) => ({
    HourSchool: calendarTeachers.HourSchool,
  }));
  useEffect(() => {
    setScheduleItem(getArraysChildren(ScheduleDay, "C", HourSchool));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ScheduleDay, HourSchool]);

  return (
    <Fragment>
      {ScheduleItem &&
        ScheduleItem.map((item, index) => (
          <div
            className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center h-100 min-h-100 ${ClassTeacherGenerator(
              item,
              Teacher
            )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
            style={getStyleSchool(item, "C", HourSchool, null)}
            key={index}
          >
            <OverlayTrigger
              rootClose={true}
              trigger="click"
              placement="top"
              popperConfig={{ strategy: "fixed" }}
              overlay={
                <Popover id={item.ID} className="min-w-350px">
                  <Popover.Header className="pt-10px font-weight-bold text-uppercase">
                    Tiết {item.Index}
                    <span className="pl-5px">
                      (
                      <span className="pl-2px">
                        {moment(item.From).format("HH:mm")}
                      </span>
                      <span className="px-4px">-</span>
                      <span className="pr-2px">
                        {moment(item.To).format("HH:mm")}
                      </span>
                      )
                    </span>
                  </Popover.Header>
                  <Popover.Body className="p-0 max-h-250px overflow-auto">
                    <div className="p-15px border-bottom">
                      <div className="text-uppercase font-weight-bold mb-8px">
                        <i className="fas fa-info-circle pr-5px"></i>
                        Thông tin
                      </div>
                      <div className="d-flex justify-content-between mb-5px">
                        <div className="text-muted font-weight-500">Ngày</div>
                        <div className="font-weight-bold">
                          {moment(item.Date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-5px">
                        <div className="text-muted font-weight-500">Trường</div>
                        <div className="font-weight-bold">
                          {item.SchoolTitle}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-5px">
                        <div className="text-muted font-weight-500">Lớp</div>
                        <div className="font-weight-bold">
                          {item.ClassTitle} - Tiết {item.Index}
                          <span className="pl-5px">
                            (
                            <span className="pl-2px">
                              {moment(item.From).format("HH:mm")}
                            </span>
                            <span className="px-4px">-</span>
                            <span className="pr-2px">
                              {moment(item.To).format("HH:mm")}
                            </span>
                            )
                          </span>
                        </div>
                      </div>
                      {item.MajorID > 0 && (
                        <div className="d-flex justify-content-between mb-5px">
                          <div className="text-muted font-weight-500">
                            Chuyên đề
                          </div>
                          <div className="font-weight-bold">
                            {item.MajorTitle}
                          </div>
                        </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <div className="text-muted font-weight-500">
                          Giáo viên
                        </div>
                        <div className="font-weight-bold">
                          {item.TeacherTitle}
                        </div>
                      </div>
                    </div>
                    <div className="p-15px">
                      <div
                        className="text-uppercase font-weight-bold mb-8px"
                        onClick={() => console.log(item)}
                      >
                        <i className="fas fa-users pr-5px"></i>
                        Giáo viên phụ
                      </div>
                      {item.TeacherJoins && item.TeacherJoins.length > 0 ? (
                        <div className="list-assistant">
                          {item.TeacherJoins.map((teacher, idx) => (
                            <div className="list-assistant__item" key={idx}>
                              <div className="flex-1">
                                <div className="font-weight-500">
                                  {teacher.TeacherTitle}
                                  {teacher.IsRequire && (
                                    <i className="text-danger fas fa-badge-check pl-5px"></i>
                                  )}
                                </div>
                                <div className="text-muted">
                                  {teacher.SkillTitle} -{" "}
                                  {teacher.Desc || "Không có ghi chú"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted font-size-sm">
                          Chưa có giáo viên phụ.
                        </div>
                      )}
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              <span className="text-white font-size-xs font-weight-border w-100 h-100 min-h-100 d-flex align-items-center justify-content-center">
                {item.Index}
              </span>
            </OverlayTrigger>
          </div>
        ))}
      {HolidaySchedule &&
        HolidaySchedule.map((o, index) => (
          <div
            key={index}
            style={getStyleHiliday(o, "S", HourSchool, null)}
            className="bg-stripes position-absolute zindex-6 h-100 min-h-100 cursor-not-allowed"
          ></div>
        ))}
    </Fragment>
  );
}

export default ScheduleAfternoon;
