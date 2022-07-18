import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import { ClassSchoolGenerator } from "../../helpers/ClassHelpers";

ScheduleAfternoon.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleAfternoon({ ScheduleDay }) {
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
      {ScheduleItem &&
        ScheduleItem.map((item, index) => (
          <div
            className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center ${ClassSchoolGenerator(
              item
            )}`}
            key={index}
          >
            <span className="text-white font-size-xs font-weight-border">
              {item.Index} {item.From}
            </span>
          </div>
        ))}
    </Fragment>
  );
}

export default ScheduleAfternoon;
