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
      {ScheduleItem &&
        ScheduleItem.map((item, index) => (
          <Fragment key={index}>
            <div
              className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center ${ClassSchoolGenerator(
                item
              )} ${clsx({ "opacity-70": item.IsAutoSet })}`}
              style={getStyleSchool(item, "S", HourSchool, HourScheduleList)}
            >
              <span className="text-white font-size-xs font-weight-border">
                {item.Index}
              </span>
            </div>
            {item.TeacherTitle && (
              <div className="shadow h-20px w-100 position-absolute bottom-0 text-center font-size-xs pt-2px text-truncate px-3">
                {item.TeacherTitle}
              </div>
            )}
          </Fragment>
        ))}
    </Fragment>
  );
}

export default ScheduleMorning;
