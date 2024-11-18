// Sidebar.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Sidebar.css";
import logo_hachi from "../../Assets/HachiLogo.svg";
import menu_icon from "../../Assets/bars-solid.svg";
import down_arrow from "../../Assets/chevron-down-solid.svg";
import up_arrow from "../../Assets/chevron-up-solid.svg";
import question_icon from "../../Assets/question-solid.svg";

const Sidebar = () => {
  const [isRating, setRating] = useState(true); 
  const [isHighlighted, setHighlighted] = useState(false); 

  const ToggleRating = () => {
    setRating((prev) => !prev); 
    if (!isRating) setHighlighted(false);
  };

  const ToggleQuestion = () => {
    setHighlighted((prev) => !prev); 
  };

  const portalElement = document.getElementById('sidebar-portal') || document.body;

  return ReactDOM.createPortal(
    <div id="sidebar-container">
      <div className="icon-container">
        <img src={logo_hachi} alt="Logo Hachi" />
        <img
          src={isRating ? up_arrow : down_arrow}
          alt="Toggle Rating"
          onClick={ToggleRating}
          className="black-icon"
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="topic">
        {isRating && (
          <div className={`option ${isHighlighted ? "highlighted" : ""}`}>
            <div
              className={`status-bar ${
                isHighlighted ? "visible-bar" : "hidden-bar"
              }`}
            ></div>
            <img
              src={menu_icon}
              alt="Menu Icon"
              className={`icon ${isHighlighted ? "green-icon" : "white-icon"}`} 
            />
            <h1 className={`title ${isHighlighted ? "green-title" : "white-title"}`}>
              ĐÁNH GIÁ NHÂN SỰ
            </h1>
            <img
              src={isHighlighted ? up_arrow : down_arrow}
              alt="Toggle Question"
              onClick={ToggleQuestion}
              className={`icon ${isHighlighted ? "green-icon" : "white-icon"}`} 
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        {isHighlighted && isRating && (
          <ul className="question">
            <div></div>
            <img
              src={question_icon}
              alt="Question Icon"
              className={`icon white-icon`}
            />
            <li className="question-title">Ngân hàng câu hỏi</li>
          </ul>
        )}
      </div>
    </div>,
    portalElement 
  );
};

export default Sidebar;
