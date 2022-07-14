import React from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import "../../_assets/sass/pages/_calendar-teacher.scss";
import BodyCalendar from "./BodyCalendar";


function CalendarTeacher(props) {
    return (
      
        <div className="calendar-teacher">
          <div
            className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}
          >
            <div className="hpanel">
              <div className="panel-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="text-uppercase font-size-h3 mb-0">
                    Bảng lịch giáo viên
                  </h2>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 mb-30px">
              <BodyCalendar />
            </div>
          </div>
        </div>
      
    );
}

export default CalendarTeacher;
