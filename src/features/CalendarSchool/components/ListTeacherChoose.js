import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import PerfectScrollbar from "react-perfect-scrollbar";

import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

function ListTeacherChoose({
  item,
  name,
  valueClassTeacherID,
  onUpdate,
}) {
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (first) {
      setFirst(false);
    } else {
      onUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueClassTeacherID]);

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
              <Field name={name} value={teacher.ID}>
                {({ field, form }) => (
                  <input
                    type="checkbox"
                    {...field}
                    onChange={async (e) => {
                      const { checked } = e.target;
                      form.setFieldValue(name, checked ? teacher.ID : "");
                    }}
                    checked={valueClassTeacherID === teacher.ID}
                    data-value={teacher.ID}
                  />
                )}
              </Field>
              <span />
              <div className="d-flex flex-column flex-1 align-items-baseline">
                <div className="text">{teacher?.FullName}</div>
                {/* <span className="location">
                  Khoảng {formatSeconds(teacher?.DurationValue)}
                </span>
                <span className="location">{teacher?.Text}</span> */}
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
