import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import PerfectScrollbar from "react-perfect-scrollbar";

import moment from "moment";
import "moment/locale/vi";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

moment.locale("vi");

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

function ListTeacherChoose({
  item,
  name,
  nameHolder,
  valueClassTeacherID,
  valueHolder,
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

  const formatSeconds = (seconds) => {
    if (seconds > -1) {
      if (seconds === 0) {
        return "--";
      } else {
        return moment.duration({ seconds: seconds }).humanize();
      }
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
              <Field name={name} value={teacher.ID}>
                {({ field, form }) => (
                  <input
                    type="checkbox"
                    {...field}
                    onChange={async (e) => {
                      const { checked } = e.target;
                      form.setFieldValue(nameHolder, "");
                      form.setFieldValue(name, checked ? teacher.ID : "");
                    }}
                    checked={valueClassTeacherID === teacher.ID}
                    data-value={teacher.ID}
                  />
                )}
              </Field>
              <span />
              <div className="d-flex flex-column flex-1">
                <div className="d-flex justify-content-between">
                  <span className="text">
                    {teacher?.FullName}
                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>{teacher.Text}</Tooltip>
                      }
                    >
                      <i className="fas fa-engine-warning pl-8px text-muted"></i>
                    </OverlayTrigger>
                  </span>
                  {valueClassTeacherID === teacher.ID && (
                    <Field name={nameHolder}>
                      {({ field, form }) => (
                        <span className="switch switch-icon">
                          <label>
                            <input
                              {...field}
                              type="checkbox"
                              onChange={async (e) => {
                                const { checked } = e.target;
                                form.setFieldValue(
                                  nameHolder,
                                  checked ? teacher.ID : ""
                                );
                              }}
                              checked={valueHolder === teacher.ID}
                              disabled={valueClassTeacherID !== teacher.ID}
                            />
                            <span></span>
                          </label>
                        </span>
                      )}
                    </Field>
                  )}
                </div>
                <span className="location">
                  Khoảng {formatSeconds(teacher?.DurationValue)}
                </span>
                {/* <span className="location">{teacher?.Text}</span> */}
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
