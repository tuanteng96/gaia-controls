import React from "react";

export function NoData({text}) {
    return (
      <div className="no-data-default d-flex flex-direction-column justify-content-center">
        {text}
      </div>
    );
}