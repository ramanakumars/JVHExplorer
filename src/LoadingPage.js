import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./css/loading.css";

export const LoadingPage = ({ enabled, text }) => {
  if (!enabled) {
    return <div className="not-loading">&nbsp;</div>;
  } else {
    return (
      <div className="loading-page-container">
        <div className="loading-frame">
          <div className="loading-spin">&nbsp;</div>
          <span>{text}</span>
        </div>
      </div>
    );
  }
};
