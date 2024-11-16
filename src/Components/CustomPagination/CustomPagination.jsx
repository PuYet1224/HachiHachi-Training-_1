import React from "react";
import "./CustomPagination.css";
import right_arrow from '../../Assets/right-chevron.png';
import left_arrow from '../../Assets/left-chevron.png';

const CustomPagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage,
}) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  const groupSize = 3; 

  const groupNumber = Math.floor((currentPage - 1) / groupSize) + 1;
  const firstPageInGroup = (groupNumber - 1) * groupSize + 1;
  const lastPageInGroup = Math.min(firstPageInGroup + groupSize - 1, totalPages);

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

  const handleEllipsis = (type) => {
    if (type === 'left') {
      const targetPage = firstPageInGroup - 1;
      onChangePage(targetPage >= 1 ? targetPage : 1);
    } else if (type === 'right') {
      const targetPage = lastPageInGroup + 1;
      onChangePage(targetPage <= totalPages ? targetPage : totalPages);
    }
  };

  const renderPageNumbers = () => {
    const pages = getPageNumbers(currentPage, totalPages, groupSize);

    return pages.map((page, index) => {
      if (page === 'left-ellipsis') {
        return (
          <button
            key={`left-ellipsis-${index}`}
            onClick={() => handleEllipsis('left')}
            className="ellipsis-button"
          >
            ...
          </button>
        );
      }

      if (page === 'right-ellipsis') {
        return (
          <button
            key={`right-ellipsis-${index}`}
            onClick={() => handleEllipsis('right')}
            className="ellipsis-button"
          >
            ...
          </button>
        );
      }

      return (
        <button
          key={page}
          onClick={() => onChangePage(page)}
          className={`page-button ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      );
    });
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
        <button 
          onClick={handleFirst} 
          disabled={currentPage === 1} 
          className="arrow-button first-last-button"
        >
          Đầu
        </button>
        <button 
          onClick={handlePrev} 
          disabled={currentPage === 1} 
          className="arrow-button"
        >
          <img src={left_arrow} alt="Trang Trước" />
        </button>
        {renderPageNumbers()}
        <button 
          onClick={handleNext} 
          disabled={currentPage === totalPages} 
          className="arrow-button"
        >
          <img src={right_arrow} alt="Trang Tiếp Theo" />
        </button>
        <button 
          onClick={handleLast} 
          disabled={currentPage === totalPages} 
          className="arrow-button first-last-button"
        >
          Cuối
        </button>
      </div>
    </div>
  );
};

const getPageNumbers = (currentPage, totalPages, groupSize = 3) => {
  const pages = [];

  const groupNumber = Math.floor((currentPage - 1) / groupSize) + 1;
  const firstPageInGroup = (groupNumber - 1) * groupSize + 1;
  const lastPageInGroup = Math.min(firstPageInGroup + groupSize - 1, totalPages);

  if (firstPageInGroup > 1) {
    pages.push('left-ellipsis');
  }

  for (let i = firstPageInGroup; i <= lastPageInGroup; i++) {
    pages.push(i);
  }

  if (lastPageInGroup < totalPages) {
    pages.push('right-ellipsis');
  }

  return pages;
};

export default CustomPagination;
