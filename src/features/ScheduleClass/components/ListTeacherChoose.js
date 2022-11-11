import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import PerfectScrollbar from "react-perfect-scrollbar";

import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

function ListTeacherChoose({ item, name, valueClassTeacherID, onUpdate }) {
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (first) {
      setFirst(false);
    } else {
      onUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueClassTeacherID]);

  const formatSeconds = (seconds) => {
    if (seconds > -1) {
      return moment.duration({ seconds: seconds }).humanize();
    }
    return "không xác định.";
  };

  return (
    <PerfectScrollbar
      options={perfectScrollbarOptions}
      className="scroll h-400px p-15px"
      style={{ position: "relative" }}
    >
      {item?.AvaiList && item?.AvaiList.length > 0 ? (
        <div className="checkbox-list">
          {item?.AvaiList.map((teacher, index) => (
            <label className="radio" key={index}>
              <FastField name={name} value={teacher.ID}>
                {({ field, form }) => (
                  <input
                    type="checkbox"
                    {...field}
                    onChange={async (e) => {
                      const { checked } = e.target;
                      form.setFieldValue(name, checked ? teacher.ID : "");
                    }}
                    checked={valueClassTeacherID === teacher.ID}
                  />
                )}
              </FastField>
              <span />
              <div className="d-flex flex-column">
                <span className="text">{teacher?.FullName}</span>
                <span className="location">
                  Khoảng {formatSeconds(teacher?.DurationValue)}
                </span>
                <span className="location">
                  {teacher?.Text}
                </span>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div>Không có giáo viên phù hợp.</div>
      )}
    </PerfectScrollbar>
  );
}

ListTeacherChoose.propTypes = {
  item: PropTypes.object,
};

export default ListTeacherChoose;
