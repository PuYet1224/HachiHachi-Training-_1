import React from "react";
import "./Notification.css";
import delete_icon from "../../Assets/x-mark.png";
import success_icon from "../../Assets/check.png";

const Notification = ({ message, type, onClose }) => (
  <div className={`notification-popup ${type}`}>
    <button onClick={onClose}>
      <img src={type === "success" ? success_icon : delete_icon} alt="" />
    </button>
    <p>{message}</p>
  </div>
);

export default Notification;
