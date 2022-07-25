import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowSize from "../../hooks/useWindowSize";
import clsx from "clsx";
import ScheduleItem from "./ScheduleItem";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

BodyCalendar.propTypes = {
  filters: PropTypes.object,
};

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
          <div className="border calendar-teacher__user" ref={refBodyScroll}>
            <div className="top--user border-bottom text-uppercase font-weight-bold d-flex align-items-center px-3">
              Danh sách Giáo viên
            </div>
            <ScrollSyncPane>
              <div className="list--user border-bottom" id="scrollableUser">
                <InfiniteScroll
                  dataLength={Lists.length}
                  hasMore={options.hasMore}
                  scrollableTarget="scrollableUser"
                >
                  <div ref={refScroll}>
                    {Lists &&
                      Lists.map((item, index) => (
                        <div
                          className={`h-40px px-3 d-flex align-items-center ${clsx(
                            {
                              "border-bottom":
                                HeightScroll >= HeightBodyScroll
                                  ? Lists.length - 1 !== index
                                  : true,
                            }
                          )}`}
                          key={index}
                        >
                          <div
                            className="text-uppercase font-size-sm font-weight-bold text-truncate"
                            data-id={item?.teacher.TeacherID}
                          >
                            {item?.teacher?.TeacherTitle}
                          </div>
                        </div>
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            </ScrollSyncPane>
          </div>
          <div className="border-top border-bottom border-right calendar-teacher__weeks position-relative">
            <ScrollSyncPane>
              <div className="top--weeks border-bottom">
                {Array(7)
                  .fill()
                  .map((item, index) => (
                    <div
                      className={`top--weeks_gird ${clsx({
                        "border-right": index !== 6,
                      })}`}
                      key={index}
                    >
                      <div className="flex-grow-1 border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">
                        {moment(filters.From)
                          .add(index, "days")
                          .format("ddd, ll")}
                      </div>
                      <div className="d-flex flex-grow-1">
                        <div className="flex-1 border-right d-flex align-items-center justify-content-center">
                          Sáng
                        </div>
                        <div className="flex-1 d-flex align-items-center justify-content-center">
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
                  style={{ width: `${250 * 7}px` }}
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
                          Lists.map(({ list, teacher }, index) => (
                            <div
                              className={`h-40px d-flex position-relative ${clsx(
                                {
                                  "border-bottom":
                                    HeightScroll >= HeightBodyScroll
                                      ? Lists.length - 1 !== index
                                      : true,
                                }
                              )}`}
                              key={index}
                            >
                              <div className="flex-1 border-right"></div>
                              <div className="flex-1"></div>
                              <ScheduleItem
                                ScheduleDay={getScheduleList(
                                  moment(filters.from)
                                    .add(indexDay, "days")
                                    .format("DD-MM-YYYY"),
                                  list
                                )}
                                Teacher={teacher}
                              />
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
