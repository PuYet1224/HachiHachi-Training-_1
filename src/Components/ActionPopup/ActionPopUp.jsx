// ActionPopUp.jsx
import React from "react";
import "./ActionPopUp.css";
import send_icon from "../../Assets/share.png";
import approve_icon from "../../Assets/check.png";
import hide_icon from "../../Assets/traffic-signal.png";
import return_icon from "../../Assets/turn-back.png";
import delete_icon from "../../Assets/delete.png";
import close_icon from "../../Assets/close.png";

const ActionPopUp = ({
  selectedCount,
  statuses,
  onSend,
  onApprove,
  onHide,
  onReturn,
  onDelete,
  onClose,
}) => {
  const canShowSend = statuses.some((status) =>
    ["Đang soạn thảo", "Trả về"].includes(status)
  );
  const canShowApprove = statuses.some((status) =>
    ["Gửi duyệt", "Ngừng áp dụng"].includes(status)
  );
  const canShowHide = statuses.includes("Duyệt áp dụng");
  const canShowReturn = statuses.some((status) =>
    ["Gửi duyệt", "Ngừng áp dụng"].includes(status)
  );

  return (
    <div className="action-popup">
      <div className="selected-count">
        <span>{selectedCount}</span>
        <span>Đã chọn</span>
      </div>
      {canShowSend && (
        <button className="popup-button" onClick={onSend}>
          <img src={send_icon} alt="Gửi duyệt" />
          <span>Gửi duyệt</span>
        </button>
      )}
      {canShowReturn && (
        <button className="popup-button" onClick={onReturn}>
          <img src={return_icon} alt="Trả về" />
          <span>Trả về</span>
        </button>
      )}
      {canShowApprove && (
        <button className="popup-button" onClick={onApprove}>
          <img src={approve_icon} alt="Phê duyệt" />
          <span>Duyệt áp dụng</span>
        </button>
      )}
      {canShowHide && (
        <button className="popup-button" onClick={onHide}>
          <img src={hide_icon} alt="Ngừng áp dụng" />
          <span>Ngừng áp dụng</span>
        </button>
      )}
      <button className="popup-button delete" onClick={onDelete}>
        <img src={delete_icon} alt="Xóa câu hỏi" />
        <span>Xóa câu hỏi</span>
      </button>
      <button className="popup-button close" onClick={onClose}>
        <img src={close_icon} alt="Close" />
      </button>
    </div>
  );
};

export default ActionPopUp;
