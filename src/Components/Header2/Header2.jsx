import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "./Header2.css";
import upload_icon from "../../Assets/upload (1).png";
import download_icon from "../../Assets/download.png";
import plus_icon from "../../Assets/plus.png";

  const Header2 = forwardRef(({ onFilterChange, isDisabled }, ref) => {
  const items = ["Đang soạn thảo", "Gửi duyệt", "Đã duyệt", "Ngừng áp dụng"];
  const [checkedStates, setCheckedStates] = useState([true, false, false, false]);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const header2Ref = useRef(null);

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

  const resetFilters = () => {
    const initialStates = [true, false, false, false];
    setCheckedStates(initialStates);
    onFilterChange(items.filter((_, index) => initialStates[index]));
  };

  useImperativeHandle(ref, () => ({
    resetFilters,
  }));

  const checkOverflow = () => {
    if (header2Ref.current) {
      const { scrollWidth, clientWidth } = header2Ref.current;
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
    <div
      id="Header2"
      ref={header2Ref}
      className={`${isOverflowing ? "overflowing" : ""} ${isDisabled ? "disabled" : ""}`.trim()}
    >
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
      </div>
    </div>
  );
});

export default Header2;
