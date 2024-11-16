import React, { useState } from "react";
import "./FilterHeader.css";
import filter_icon from "../../Assets/funnel.png";
import search_icon from "../../Assets/glass.png";

const FilterHeader = ({ onSearch, isDisabled, onReset }) => {
  const [searchText, setSearchText] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(searchText);
    }
  };

  const resetSearch = () => {
    setSearchText("");
    onSearch(""); // Thực hiện tìm kiếm với chuỗi rỗng để reset kết quả tìm kiếm
  };

  return (
    <div id="FilterHeader" className={isDisabled ? "disabled" : ""}>
      <div className="above-filter">
        <div>
          <img src={filter_icon} alt="Filter Icon" />
          <p>LỌC DỮ LIỆU</p>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            resetSearch();
            onReset(); // Gọi hàm onReset để reset trạng thái từ Toolbar
          }}
          style={{
            pointerEvents: isDisabled ? "none" : "auto",
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          Reset bộ lọc
        </a>
      </div>
      <div className="under-filter">
        <div className="search-container">
          <label className="search-label">Tìm kiếm</label>
          <div className="input-group">
            <div className="input-wrapper">
              <img src={search_icon} alt="Search Icon" className="search-icon" />
              <input
                type="text"
                placeholder="Tìm theo mã và câu hỏi"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isDisabled}
              />
            </div>
            <button
              type="button"
              className="search-button"
              onClick={() => onSearch(searchText)}
              disabled={isDisabled}
            >
              <img src={search_icon} alt="Search Icon" className="button-icon" />
              Tìm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
