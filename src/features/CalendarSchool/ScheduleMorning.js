import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import { ClassSchoolGenerator } from "../../helpers/ClassHelpers";
import { getStyleSchool } from "../../helpers/DateTimeHelpers";
import clsx from "clsx";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ScheduleMorning.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleMorning({
  ScheduleDay,
  HourScheduleList,
  itemAdd,
  onOpenModalAdd,
}) {
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
      {ScheduleItem && ScheduleItem.length > 0 ? (
        ScheduleItem.map((item, index) => (
          <Fragment key={index}>
            <div
              className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center ${ClassSchoolGenerator(
                item
              )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
              style={getStyleSchool(item, "S", HourSchool, HourScheduleList)}
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
                    ClassID: {
                      ...itemAdd.Class,
                      label: itemAdd.Class.Title,
                      value: itemAdd.Class.ID,
                    },
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
            {item.TeacherTitle && index === 0 && (
              <div className="shadow h-20px w-100 position-absolute bottom-0 text-center font-size-xs pt-2px text-truncate px-3">
                {item.TeacherTitle}
              </div>
            )}
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

export default ScheduleMorning;
