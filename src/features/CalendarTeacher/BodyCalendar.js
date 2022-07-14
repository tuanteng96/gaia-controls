import React, { useState } from "react";
import PropTypes from "prop-types";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import InfiniteScroll from "react-infinite-scroll-component";

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
    }, 1500);
  };
  return (
    <ScrollSync>
      <div className="h-650px calendar-teacher__body">
        <div className="d-flex h-100">
          <div className="border calendar-teacher__user">
            <div className="top--user border-bottom"></div>
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
                      <div className="h-100px" key={index}>
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
                <div className="w-2000px h-50px"></div>
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane>
              <div className="list--weeks" id="scrollableWeeks">
                <InfiniteScroll
                  dataLength={Items.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableWeeks"
                  className="w-2000px"
                >
                  {Items &&
                    Items.map((item, index) => (
                      <div className="w-2000px h-100px" key={index}>
                        div - #{index}
                      </div>
                    ))}
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
