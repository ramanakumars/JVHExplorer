import React, { FC } from "react";
import "./css/loading.css";

interface LoadingPageProps {
  enabled: boolean;
  text: string;
}

export const LoadingPage: FC<LoadingPageProps> = ({ enabled, text }) => {
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