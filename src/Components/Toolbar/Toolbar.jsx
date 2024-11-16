import React, { useState, useEffect, useRef } from "react";
import "./Toolbar.css";
import upload_icon from "../../Assets/upload (1).png";
import download_icon from "../../Assets/download.png";
import plus_icon from "../../Assets/plus.png";

const Toolbar = ({ onFilterChange, isDisabled, onReset }) => {
  const items = ["Đang soạn thảo", "Gửi duyệt", "Đã duyệt", "Ngừng áp dụng"];
  const [checkedStates, setCheckedStates] = useState([true, false, false, false]);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const toolbarRef = useRef(null);

  const handleCheckboxChange = (index) => {
    if (isDisabled) return;
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

  // Hàm reset các bộ lọc
  const resetFilters = () => {
    const initialStates = [true, false, false, false];
    setCheckedStates(initialStates);
    onFilterChange(items.filter((_, index) => initialStates[index]));
    if (onReset) {
      onReset();
    }
  };

  return (
    <div
      id="Toolbar"
      ref={toolbarRef}
      className={`${isOverflowing ? "overflowing" : ""} ${
        isDisabled ? "disabled" : ""
      }`.trim()}
    >
      <div className="left-t">
        {items.map((label, index) => (
          <div
            key={index}
            style={{
              border: checkedStates[index]
                ? "2px solid #008000"
                : "0px solid #959db3",
            }}
          >
            <a>{label}</a>
            <input
              type="checkbox"
              checked={checkedStates[index]}
              onChange={() => handleCheckboxChange(index)}
              disabled={isDisabled}
            />
          </div>
        ))}
      </div>
      <div className="right-t">
        <div>
          <img src={upload_icon} alt="Upload" />
        </div>
        <div>
          <img src={download_icon} alt="Download" />
          <a>Template</a>
        </div>
        <div>
          <img src={plus_icon} alt="Add New" />
          <a>THÊM MỚI</a>
        </div>
        <div>
          <button onClick={resetFilters} disabled={isDisabled}>
            Reset bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
