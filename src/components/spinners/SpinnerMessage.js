import React from "react";
import PropTypes from "prop-types";

SpinnerMessage.propTypes = {
  text: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
};
SpinnerMessage.defaultProps = {
  text: "",
  isShow: false,
};

function SpinnerMessage(props) {
  const { isShow, text } = props;
  if (isShow) {
    return (
      <div
        className="page-loader page-loader-base page-bg-rgba"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="blockui">
          {text && <span>{text}</span>}
          <span>
            <div className="spinner spinner-primary m-0 h-auto w-auto" />
          </span>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default SpinnerMessage;
