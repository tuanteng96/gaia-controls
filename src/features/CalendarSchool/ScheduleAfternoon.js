import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import { ClassSchoolGenerator, getNameLast } from "../../helpers/ClassHelpers";
import { getStyleSchool } from "../../helpers/DateTimeHelpers";
import clsx from "clsx";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ScheduleAfternoon.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleAfternoon({
  ScheduleDay,
  HourScheduleList,
  itemAdd,
  onOpenModalAdd,
  onOpenModal,
}) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarSchool }) => ({
    HourSchool: calendarSchool.HourSchool,
  }));
  useEffect(() => {
    setScheduleItem(getArrayChildren(ScheduleDay, "C", HourSchool));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ScheduleDay, HourSchool]);

  return (
    <Fragment>
      {ScheduleItem && ScheduleItem.length > 0 ? (
        ScheduleItem.map((schedule, index) => (
          <Fragment key={index}>
            {schedule &&
              schedule.map((item, idx) => (
                <div
                  className="position-relative flex-grow-1 h-40px max-h-40px w-100"
                  key={idx}
                >
                  <div
                    className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center ${ClassSchoolGenerator(
                      item
                    )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
                    style={getStyleSchool(
                      item,
                      "C",
                      HourSchool,
                      HourScheduleList
                    )}
                    onClick={() => {
                      const initialValues = {
                        ...item,
                        IsThematic: item.MajorID ? true : false,
                        major: {
                          Title: item?.MajorTitle,
                        },
                        dayItem: {
                          Date: item.Date ?? itemAdd.Date,
                          ID: !item?.isCalendarItem ? item.ID : 0,
                          CalendarItemID: item?.isCalendarItem ? item.ID : 0,
                          SchoolID: {
                            ...itemAdd.School,
                            label: itemAdd.School.Title,
                            value: itemAdd.School.ID,
                          },
                          ClassID: itemAdd.Class
                            ? {
                                ...itemAdd.Class,
                                label: itemAdd.Class.Title,
                                value: itemAdd.Class.ID,
                              }
                            : null,
                          TeacherID: item.TeacherID
                            ? {
                                value: item.TeacherID,
                                label: item.TeacherTitle,
                              }
                            : "",
                          Index: item.MajorID
                            ? item?.MajorGroup &&
                              item?.MajorGroup?.Items &&
                              item?.MajorGroup?.Items.map((item) => ({
                                ...item,
                                label: item.IndexTitle,
                                value: item.Index,
                              }))
                            : [
                                {
                                  label: item.IndexTitle ?? item.Title,
                                  value: item.Index,
                                },
                              ],
                          MajorID: item?.MajorID ?? 0,
                        },
                        joins: item.TeacherJoins ?? [],
                      };
                      onOpenModalAdd(initialValues);
                    }}
                  >
                    <span className="text-white font-size-xs font-weight-border">
                      {item.Index}
                    </span>
                  </div>
                  {item.TeacherTitle && idx === 0 && (
                    <div
                      className="shadow h-20px w-100 position-absolute bottom-0 font-size-xs pt-2px text-capitalize px-2 cursor-pointer d-flex justify-content-between"
                      onClick={() => onOpenModal(item.ID)}
                    >
                      <div className="text-truncate flex-fill pr-10px">
                        {item?.TeacherCode} - {getNameLast(item.TeacherTitle)}
                      </div>
                      {item.TeacherJoins && item.TeacherJoins.length > 0 && (
                        <span className="text-danger font-weight-bolder">
                          {item.TeacherJoins.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </Fragment>
        ))
      ) : (
        <div
          className="w-100 min-h-100 max-h-100 cursor-pointer"
          onClick={() => {
            const initialValues = {
              dayItem: {
                Date: itemAdd.Date,
                SchoolID: {
                  ...itemAdd.School,
                  label: itemAdd.School.Title,
                  value: itemAdd.School.ID,
                },
                ClassID: {
                  ...itemAdd.Class,
                  label: itemAdd.Class.Title,
                  value: itemAdd.Class.ID,
                },
              },
            };
            onOpenModalAdd(initialValues);
          }}
        ></div>
      )}
    </Fragment>
  );
}

export default ScheduleAfternoon;
