import React from "react";

const Popup = (props) => {
  return (
    <div className="popup-box">
      <div id="btn-back">
        <img src="/arrowleft.png" onClick={props.handleBack} />
      </div>
      <div className="box">
        <button className="btn-close" onClick={props.handleClose}>
          x
        </button>
        {props.content}
      </div>
      <div id="btn-nxt">
        <img src="/arrow.png" onClick={props.handleNext} />
      </div>
    </div>
  );
};

export default Popup;
