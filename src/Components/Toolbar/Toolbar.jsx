import React, { useState, useEffect, useRef } from "react";
import "./Toolbar.css";
import updload_icon from "../../Assets/upload (1).png";
import dowload_icon from "../../Assets/download.png";
import plus_icon from "../../Assets/plus.png";

const Toolbar = ({onFilterChange }) => {
  const items = ["Đang soạn thảo", "Gửi duyệt", "Đã duyệt", "Ngừng áp dụng"];
  const [checkedStates, setCheckedStates] = useState([true, false, false, false]); 
  const [isOverflowing, setIsOverflowing] = useState(false);
  const toolbarRef = useRef(null);

  const handleCheckboxChange = (index) => {
    setCheckedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      const selectedStatuses = items.filter((_, i) => newStates[i]);
      onFilterChange(selectedStatuses);
      
      return newStates;
    });
  };

  const checkOverflow = () => {
    if (toolbarRef.current) {
      const { scrollWidth, clientWidth } = toolbarRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  return (
    <div id="Toolbar" ref={toolbarRef} className={isOverflowing ? 'overflowing' : ''}>
      <div className="left-t">
        {items.map((label, index) => (
          <div
            key={index}
            style={{
              border: checkedStates[index] ? "2px solid #008000" : "0px solid #959db3",
            }}
          >
            <a>{label}</a>
            <input
              type="checkbox"
              checked={checkedStates[index]}
              onChange={() => handleCheckboxChange(index)}
            />
          </div>
        ))}
      </div>
      <div className="right-t">
        <div>
          <img src={updload_icon} alt="" />
        </div>
        <div>
          <img src={dowload_icon} alt="" />
          <a>Template</a>
        </div>
        <div>
          <img src={plus_icon} alt="" />
          <a>THÊM MỚI</a>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
