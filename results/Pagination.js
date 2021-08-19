import React, { useEffect, useState } from "react";

import "./Pagination.scss";

// Create a range from start to end.
const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

const Pagination = ({
  numPages,
  numNeighbours = 2,
  onPageChange = () => {},
  forcePage = 0,
}) => {
  const [currentPage, setCurrentPage] = useState(forcePage ? forcePage : 0);

  const handlePageClick = (page) => {
    onPageChange(page);
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(forcePage);
  }, [forcePage]);

  return (
    <nav>
      <ul className="pagination">
        <li
          key={0}
          className={`page-item${currentPage === 0 ? " active" : ""}`}
        >
          <a
            className="page-link"
            role="button"
            tabIndex="0"
            href="/#"
            onClick={() => handlePageClick(0)}
          >
            1
          </a>
        </li>
        {currentPage > 1 && (
          <li key="prev" className="page-item">
            <a
              className="page-link"
              role="button"
              tabIndex="0"
              href="/#"
              onClick={() => handlePageClick(currentPage - 1)}
            >
              &laquo;
            </a>
          </li>
        )}
        {range(
          Math.max(1, currentPage - numNeighbours),
          Math.min(numPages - 2, currentPage + numNeighbours)
        ).map((pageNum) => (
          <li
            key={pageNum}
            className={`page-item${currentPage === pageNum ? " active" : ""}`}
          >
            <a
              className="page-link"
              role="button"
              tabIndex="0"
              href="/#"
              onClick={() => handlePageClick(pageNum)}
            >
              {pageNum + 1}
            </a>
          </li>
        ))}
        {currentPage < numPages - 2 && numNeighbours < numPages && (
          <li key="next" className="page-item">
            <a
              className="page-link"
              role="button"
              tabIndex="0"
              href="/#"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              &raquo;
            </a>
          </li>
        )}
        {numPages > 1 && (
          <li
            key={numPages - 1}
            className={`page-item${
              currentPage === numPages - 1 ? " active" : ""
            }`}
          >
            {" "}
            <a
              className="page-link"
              role="button"
              tabIndex="0"
              href="/#"
              onClick={() => handlePageClick(numPages - 1)}
            >
              {numPages}
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
