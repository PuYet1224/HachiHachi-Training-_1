import React from "react";
import "./Item.css";
import option_icon from "../../Assets/option.png"

const Item = (props) => {
  return (
    <div id="Item">
      <input type="checkbox" />
      <div>
        <p className="question">{props.question}</p>
        <div>
          <p>{props.id}</p>
          <p>{props.type}</p>
        </div>
      </div>
      <div>{props.description}</div>
      <div>{props.duration}</div>
      <div>{props.status}</div>
      <img src={option_icon} alt="" />
    </div>
  );
};

export default Item;
