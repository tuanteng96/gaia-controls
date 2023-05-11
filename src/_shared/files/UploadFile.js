import React, { useState } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import LessonCrud from "../../features/Lesson/_redux/LessonCrud";
import { toAbsoluteUrl } from "../../helpers/AssetsHelpers";

UploadFile.propTypes = {
  onChange: PropTypes.func,
  arrowProps: PropTypes.object,
};

UploadFile.defaultProps = {
  arrowProps: {
    Placeholder: "",
    Type: "",
  },
};

function UploadFile({ onChange, value, name, arrowProps }) {
  const [loading, setLoading] = useState(false);

  const onFileChange = async (event) => {
    setLoading(true);
    if (event.target.files && event.target.files[0]) {
      const { name } = event.target.files[0];
      try {
        value && (await LessonCrud.deleteCate(value));
        const { name: nameFile } = await LessonCrud.uploadFile(
          name,
          event.target.files[0]
        );
        setLoading(false);
        onChange(nameFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await LessonCrud.deleteCate(value);
      setLoading(false);
      onChange("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`custom-file ${value && "custom-file-show"} ${loading &&
        "loading"}`}
    >
      <input
        type="file"
        className="custom-file-input"
        id="customFile"
        name={name}
        onChange={onFileChange}
        title={"Chọn File"}
        value={""}
      />
      <label className="custom-file-label" htmlFor="customFile">
        <span>{arrowProps.Placeholder}</span>
      </label>
      <div className="custom-file-current">
        {arrowProps.Type === "image" ? (
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={
              <Tooltip className="tooltip-image" id={`tooltip-top`}>
                <img
                  className="w-100"
                  src={toAbsoluteUrl(`/upload/image/${value}`)}
                  alt={value}
                />
              </Tooltip>
            }
          >
            <span
              onClick={() =>
                window.open(toAbsoluteUrl(`/upload/image/${value}`))
              }
            >
              {value}
            </span>
          </OverlayTrigger>
        ) : (
          <span
            onClick={() => window.open(toAbsoluteUrl(`/upload/image/${value}`))}
          >
            {value}
          </span>
        )}

        <i
          onClick={onDelete}
          className="ki ki-bold-close icon-xs text-muted"
        ></i>
      </div>
      <div className="custom-file-loading spinner spinner-white spinner-primary spinner-right w-auto h-auto m-0 text-muted">
        Đang tải ...
      </div>
    </div>
  );
}

export default UploadFile;
