import React, { useState } from "react";
import "./FilterHeader.css";
import filter_icon from "../../Assets/funnel.png";
import search_icon from "../../Assets/glass.png";

const FilterHeader = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(searchText);
    }
  };

  return (
    <div id="FilterHeader">
      <div className="above-filter">
        <div>
          <img src={filter_icon} alt="" />
          <p>LỌC DỮ LIỆU</p>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault(); // Ngăn hành động mặc định của thẻ `a`
            window.location.reload(); // Làm mới toàn bộ trang
          }}
        >
          Refresh bộ lọc
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
                onKeyPress={handleKeyPress} // Gọi khi nhấn Enter
              />
            </div>
            <button
              type="button"
              className="search-button"
              onClick={() => onSearch(searchText)} // Gọi khi nhấn nút Tìm
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
