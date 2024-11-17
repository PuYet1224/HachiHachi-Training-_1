import React from "react";
import "./Header1.css";
import glass_icon from "../../Assets/glass.png";
import bell_icon from "../../Assets/bell.png";
import avatar_icon from "../../Assets/avatar.png";

const Header1 = () => {
  return (
    <div id="Header1">
      <div className="left-h">
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <div className="hyphen-line">------------</div>
        <span className="vertical-line">|</span>
        <a className="ns">NHÂN SỰ</a>
      </div>
      <div className="right-h">
        <div>
          <img src={glass_icon} alt="Search" />
        </div>
        <div className="notification">
          <a>15</a>
          <img src={bell_icon} alt="Notifications" />
        </div>
        <div className="user">
          <a></a>
          <img src={avatar_icon} alt="User" />
        </div>
      </div>
    </div>
  );
};

export default Header1;
