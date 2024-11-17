import React, { useState, useEffect, useRef } from "react";
import "./FilterBar.css";
import filter_icon from "../../Assets/funnel.png";
import search_icon from "../../Assets/glass.png";
import debounce from "lodash.debounce"; 

const FilterBar = ({ onSearch, isDisabled, onReset }) => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useRef(
    debounce((query) => {
      onSearch(query.trim());
    }, 500) 
  ).current;

  useEffect(() => {
    debouncedSearch(searchText);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);


  const resetSearch = () => {
    setSearchText("");
    onSearch(""); 
    onReset(); 
  };

  return (
    <div id="FilterBar" className={isDisabled ? "disabled" : ""}>
      <div className="above-filter">
        <div className="filter-title">
          <img src={filter_icon} alt="Filter Icon" className="filter-icon" />
          <p>LỌC DỮ LIỆU</p>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            resetSearch();
          }}
          className={`reset-link ${isDisabled || searchText === "" ? "disabled-link" : ""}`}
          aria-label="Reset Filters"
        >
          Reset bộ lọc
        </a>
      </div>
      <div className="under-filter">
        <div className="search-container">
          <label htmlFor="search-input" className="search-label">
            Tìm kiếm
          </label>
          <div className="input-group">
            <div className="input-wrapper">
              <img src={search_icon} alt="Search Icon" className="search-icon" />
              <input
                id="search-input"
                type="text"
                placeholder="Tìm theo mã và câu hỏi"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                disabled={isDisabled}
                aria-label="Search Input"
              />
            </div>
            <button
              type="button"
              className="search-button"
              onClick={() => onSearch(searchText.trim())}
              disabled={isDisabled || searchText.trim() === ""}
              aria-label="Search"
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

export default FilterBar;
