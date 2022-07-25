import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildren } from "../../helpers/ArrayHelpers";
import clsx from "clsx";
import { ClassTeacherGenerator } from "../../helpers/ClassHelpers";
import { getStyleSchool } from "../../helpers/DateTimeHelpers";
import { OverlayTrigger, Popover } from "react-bootstrap";

ScheduleAfternoon.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleAfternoon({ ScheduleDay }) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarTeachers }) => ({
    HourSchool: calendarTeachers.HourSchool,
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
            className={`cursor-pointer position-absolute top-1px zindex-5 d-flex align-items-center justify-content-center h-100 min-h-100 ${ClassTeacherGenerator(
              item
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
                <Popover id={item.ID}>
                  <Popover.Header as="h3">{item.From}</Popover.Header>
                  <Popover.Body>
                    And here's some <strong>amazing</strong> content. It's very
                    engaging. right?
                  </Popover.Body>
                </Popover>
              }
            >
              <span className="text-white font-size-xs font-weight-border h-100 min-h-100 d-flex align-items-center">
                {item.Index}
              </span>
            </OverlayTrigger>
          </div>
        ))}
    </Fragment>
  );
}

export default ScheduleAfternoon;
