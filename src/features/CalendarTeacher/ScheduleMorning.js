import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import clsx from "clsx";
import { ClassTeacherGenerator } from "../../helpers/ClassHelpers";
import { getStyleSchool } from "../../helpers/DateTimeHelpers";

ScheduleMorning.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleMorning({ ScheduleDay }) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarTeachers }) => ({
    HourSchool: calendarTeachers.HourSchool,
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
            <div
              className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center h-100 min-h-100 ${ClassTeacherGenerator(
                item
              )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
              style={getStyleSchool(item, "S", HourSchool, null)}
            >
              <span className="text-white font-size-xs font-weight-border">
                {item.Index}
              </span>
            </div>
          </Fragment>
        ))}
    </Fragment>
  );
}

export default ScheduleMorning;
