import React from "react";
import "./CustomPagination.css";
import right_arrow from '../../Assets/right-chevron.png'
import left_arrow from '../../Assets/left-chevron.png'

const CustomPagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage,
}) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);

  const handleFirst = () => {
    if (currentPage > 1) onChangePage(1);
  };

  const handleLast = () => {
    if (currentPage < totalPages) onChangePage(totalPages);
  };

  const handlePrev = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onChangePage(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => onChangePage(1)}
          className={currentPage === 1 ? "active" : ""}
        >
          1
        </button>
      );

      if (currentPage > 2) {
        pages.push(<span key="start-ellipsis">...</span>);
      }

      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(
          <button key={currentPage} onClick={() => onChangePage(currentPage)} className="active">
            {currentPage}
          </button>
        );
      }

      if (currentPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis">...</span>);
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onChangePage(totalPages)}
          className={currentPage === totalPages ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="custom-pagination">
      <div className="left-c">
        <span>Hiển thị mỗi trang</span>
        <select 
          value={rowsPerPage}
          onChange={(e) => onChangeRowsPerPage(Number(e.target.value))}
        >
          {[25, 50, 75, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="right-c">
        <button onClick={handleFirst} disabled={currentPage === 1} className="arrow-button first-last-button">
          Đầu
        </button>
        <button onClick={handlePrev} disabled={currentPage === 1} className="arrow-button">
          <img src={left_arrow} alt="" />
        </button>
        {renderPageNumbers()}
        <button onClick={handleNext} disabled={currentPage === totalPages} className="arrow-button">
          <img src={right_arrow} alt="" />
        </button>
        <button onClick={handleLast} disabled={currentPage === totalPages} className="arrow-button first-last-button">
          Cuối
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
