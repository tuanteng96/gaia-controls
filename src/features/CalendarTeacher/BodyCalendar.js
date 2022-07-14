import React, { useState } from "react";
import PropTypes from "prop-types";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import InfiniteScroll from "react-infinite-scroll-component";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

BodyCalendar.propTypes = {};

window.IsCall = false;

function BodyCalendar(props) {
  const [Items, setItems] = useState(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    if (window.IsCall) return;
    if (Items.length > 50) {
      setHasMore(false);
      return;
    }
    window.IsCall = true;
    setTimeout(() => {
      setItems((prevState) => prevState.concat(Array.from({ length: 20 })));
      window.IsCall = false;
    }, 150000);
  };
  return (
    <ScrollSync>
      <div className="h-650px calendar-teacher__body">
        <div className="d-flex h-100">
          <div className="border calendar-teacher__user">
            <div className="top--user border-bottom text-uppercase font-weight-bold d-flex align-items-center px-3">
              Danh sách Giáo viên
            </div>
            <ScrollSyncPane>
              <div className="list--user" id="scrollableUser">
                <InfiniteScroll
                  dataLength={Items.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableUser"
                >
                  {Items &&
                    Items.map((item, index) => (
                      <div className={`h-40px ${Items.length - 1 !== index ? "border-bottom" : ""}`} key={index}>
                        div - #{index}
                      </div>
                    ))}
                </InfiniteScroll>
              </div>
            </ScrollSyncPane>
          </div>
          <div className="border-top border-bottom border-right calendar-teacher__weeks">
            <ScrollSyncPane>
              <div className="top--weeks border-bottom">
                {
                  Array(7).fill().map((item, index) => (
                    <div className={`top--weeks_gird ${index !== 6 ? "border-right" : ""}`} key={index}>
                      <div className="flex-grow-1 border-bottom d-flex align-items-center justify-content-center text-uppercase font-weight-bold">{moment("11-07-2022", "DD-MM-YYYY").add(index, 'days').format("ddd, ll")}</div>
                      <div className="d-flex flex-grow-1">
                        <div className="flex-1 border-right d-flex align-items-center justify-content-center">Sáng</div>
                        <div className="flex-1 d-flex align-items-center justify-content-center">Chiều</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane>
              <div className="list--weeks position-relative" id="scrollableWeeks">
                <InfiniteScroll
                  dataLength={Items.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={(
                    <div>
                      <div className="blockui">
                        <span>Đang tải ...</span>
                        <span>
                          <div className="spinner spinner-primary"></div>
                        </span>
                      </div>
                    </div>
                  )}
                  scrollableTarget="scrollableWeeks"
                  className="d-flex"
                  style={{ width: `${250 * 7}px` }}
                >
                  {
                    Array(7).fill().map((o, idx) => (
                      <div className={`list--weeks_gird ${idx !== 6 ? "border-right" : ""}`} key={idx}>
                        {Items &&
                          Items.map((item, index) => (
                            <div className={`h-40px d-flex ${Items.length - 1 !== index ? "border-bottom" : ""}`} key={index}>
                              <div className="flex-1 border-right">div - #{index}</div>
                              <div className="flex-1"></div>
                            </div>
                          ))}
                      </div>
                    ))
                  }

                </InfiniteScroll>
              </div>
            </ScrollSyncPane>
          </div>
        </div>
      </div>
    </ScrollSync>
  );
}

export default BodyCalendar;
