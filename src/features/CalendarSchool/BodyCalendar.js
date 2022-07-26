import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import InfiniteScroll from "react-infinite-scroll-component";
import { clsx } from "clsx";
import useWindowSize from "../../hooks/useWindowSize";
import ScheduleMorning from "./ScheduleMorning";
import ScheduleAfternoon from "./ScheduleAfternoon";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

BodyCalendar.propTypes = {
  filters: PropTypes.object,
};

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

function BodyCalendar({ filters, options, onChange, Lists }) {
  const [HeightScroll, setHeightScroll] = useState(0);
  const [HeightBodyScroll, setHeightBodyScroll] = useState(0);

  const refScroll = useRef("");
  const refBodyScroll = useRef("");
  const { width } = useWindowSize();

  useEffect(() => {
    setHeightScroll(refScroll?.current?.clientHeight || 0);
  }, [refScroll, Lists, width]);

  useEffect(() => {
    setHeightBodyScroll(refBodyScroll?.current?.clientHeight - 80 || 0);
  }, [refBodyScroll, Lists, width]);

  const getScheduleList = (DayCurrent, Dates) => {
    let ScheduleLists = [];
    const indexDay =
      Dates &&
      Dates.findIndex(
        (item) => moment(item.Date).format("DD-MM-YYYY") === DayCurrent
      );
    if (indexDay > -1) {
      ScheduleLists = Dates[indexDay].IndexList ?? [];
    }
    return ScheduleLists;
  };

  return (
    <ScrollSync>
      <div className="h-650px calendar-teacher__body">
        <div className="d-flex h-100">
          <div className="border calendar-school__name" ref={refBodyScroll}>
            <div className="top--name border-bottom text-uppercase font-weight-bold d-flex align-items-center px-3">
              DS Trường / Lớp
            </div>
            <ScrollSyncPane>
              <div className={`list--school ${clsx({"border-bottom" : getScrollbarWidth() > 0})}`} id="scrollableSchool">
                <InfiniteScroll
                  dataLength={Lists.length}
                  hasMore={options.hasMore}
                  scrollableTarget="scrollableSchool"
                >
                  <div ref={refScroll}>
                    {Lists &&
                      Lists.map(({ School, ClassList }, index) => (
                        <div
                          className={`${clsx({
                            "border-bottom":
                              HeightScroll >= HeightBodyScroll
                                ? Lists.length - 1 !== index
                                : true,
                          })}`}
                          key={index}
                        >
                          <div className="d-flex school-item">
                            <div
                              className="school-title flex-1 text-uppercase font-weight-bold p-3 py-0 text-center d-flex align-items-center justify-content-center"
                              data-school={School.ID}
                            >
                              <div
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  WebkitLineClamp:
                                    ClassList.length > 0 ? ClassList.length : 1,
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {School.Title}
                              </div>
                            </div>
                            <div className="school-class border-left">
                              {ClassList &&
                                ClassList.length > 0 &&
                                ClassList.map(({ Class }, idx) => (
                                  <div
                                    className={`class-title h-40px d-flex align-items-center justify-content-center text-uppercase font-weight-bolder ${clsx(
                                      {
                                        "border-bottom":
                                          ClassList.length - 1 !== idx,
                                      }
                                    )}`}
                                    data-class={Class.ID}
                                    key={idx}
                                  >
                                    {Class.Title}
                                  </div>
                                ))}
                              {(!ClassList || ClassList.length === 0) && (
                                <div className="bg-stripes class-title h-40px"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            </ScrollSyncPane>
          </div>
          <div className="border-top border-bottom border-right calendar-school__weeks position-relative">
            <ScrollSyncPane>
              <div className="top--weeks border-bottom">
                {Array(7)
                  .fill()
                  .map((item, index) => (
                    <div
                      className={`top--weeks_gird ${clsx({"border-right" : index !== 6})}`}
                      key={index}
                    >
                      <div className="flex-grow-1 border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                        {moment(filters.from)
                          .add(index, "days")
                          .format("ddd, ll")}
                      </div>
                      <div className="d-flex flex-grow-1">
                        <div className="h-100 min-h-100 flex-1 border-right d-flex align-items-center justify-content-center">
                          Sáng
                        </div>
                        <div className="h-100 min-h-100 flex-1 d-flex align-items-center justify-content-center">
                          Chiều
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane>
              <div className="list--weeks" id="scrollableWeeks">
                <InfiniteScroll
                  dataLength={Lists.length}
                  next={options.loadMoreData}
                  hasMore={options.hasMore}
                  loader={
                    <div className="element-loader">
                      <div className="blockui">
                        <span>Đang tải ...</span>
                        <span>
                          <div className="spinner spinner-primary"></div>
                        </span>
                      </div>
                    </div>
                  }
                  scrollableTarget="scrollableWeeks"
                  className="d-flex"
                  style={{ minWidth: `${220 * 7}px` }}
                >
                  {Array(7)
                    .fill()
                    .map((o, indexDay) => (
                      <div
                        className={`list--weeks_gird ${clsx({
                          "border-right": indexDay !== 6,
                        })}`}
                        key={indexDay}
                      >
                        {Lists &&
                          Lists.map(({ ClassList, School }, index) => (
                            <div
                              className={`${clsx({
                                "border-bottom":
                                  HeightScroll >= HeightBodyScroll
                                    ? Lists.length - 1 !== index
                                    : true,
                              })}`}
                              data-school={School.ID}
                              key={index}
                            >
                              {ClassList &&
                                ClassList.map(({ Class, Dates }, idx) => (
                                  <div
                                    className={`h-40px d-flex ${clsx({
                                      "border-bottom":
                                        ClassList.length - 1 !== idx,
                                    })}`}
                                    key={idx}
                                  >
                                    <div className="list--weeks_item position-relative flex-1 border-right">
                                      <ScheduleMorning
                                        itemAdd={{
                                          Date: moment(filters.from)
                                            .add(indexDay, "days")
                                            .toString(),
                                          Class: Class,
                                          School: School,
                                        }}
                                        ScheduleDay={getScheduleList(
                                          moment(filters.from)
                                            .add(indexDay, "days")
                                            .format("DD-MM-YYYY"),
                                          Dates
                                        )}
                                        onChangeTeacher={
                                          onChange.onChangeTeacher
                                        }
                                        onOpenModalAdd={onChange.onOpenModalAdd}
                                        HourScheduleList={
                                          School?.HourScheduleList
                                        }
                                      />
                                    </div>
                                    <div className="list--weeks_item position-relative flex-1">
                                      <ScheduleAfternoon
                                        itemAdd={{
                                          Date: moment(filters.from)
                                            .add(indexDay, "days")
                                            .toString(),
                                          Class: Class,
                                          School: School,
                                        }}
                                        ScheduleDay={getScheduleList(
                                          moment(filters.from)
                                            .add(indexDay, "days")
                                            .format("DD-MM-YYYY"),
                                          Dates
                                        )}
                                        onChangeTeacher={
                                          onChange.onChangeTeacher
                                        }
                                        onOpenModalAdd={onChange.onOpenModalAdd}
                                        HourScheduleList={
                                          School?.HourScheduleList
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              {(!ClassList || ClassList.length === 0) && (
                                <div className="bg-stripes class-title h-40px"></div>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                </InfiniteScroll>
              </div>
            </ScrollSyncPane>
            {options.loading && (
              <div className="element-loader">
                <div className="blockui">
                  <span>Đang tải ...</span>
                  <span>
                    <div className="spinner spinner-primary"></div>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollSync>
  );
}

export default BodyCalendar;
