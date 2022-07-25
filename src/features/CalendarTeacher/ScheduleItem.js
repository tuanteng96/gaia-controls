import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getArrayChildrenAll } from "../../helpers/ArrayHelpers";
import clsx from "clsx";
import { ClassTeacherGenerator } from "../../helpers/ClassHelpers";
import { getStyleTeacher } from "../../helpers/DateTimeHelpers";
import { OverlayTrigger, Popover } from "react-bootstrap";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ScheduleItem.propTypes = {
  ScheduleDay: PropTypes.array,
};

function ScheduleItem({ ScheduleDay }) {
  const [ScheduleItem, setScheduleItem] = useState([]);
  const { HourSchool } = useSelector(({ calendarTeachers }) => ({
    HourSchool: calendarTeachers.HourSchool,
  }));
  useEffect(() => {
    setScheduleItem(getArrayChildrenAll(ScheduleDay, HourSchool));
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
            style={getStyleTeacher(item, HourSchool)}
            key={index}
          >
            <OverlayTrigger
              rootClose={true}
              trigger="click"
              placement="top"
              popperConfig={{ strategy: "fixed" }}
              overlay={
                <Popover id={item.ID}>
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
                  <Popover.Body>
                    And here's some <strong onClick={() => {console.log(item)}}>amazing</strong> content. It's very
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

export default ScheduleItem;
