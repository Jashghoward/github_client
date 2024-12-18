import React from 'react';

/**
 * Pagination component provides controls for navigating between pages
 * @param {Object} props
 * @param {Object} props.pagination - Pagination state object
 * @param {Function} props.onPreviousPage - Handler for previous page
 * @param {Function} props.onNextPage - Handler for next page
 */
const Pagination = ({
  pagination,
  onPreviousPage,
  onNextPage
}) => {
  if (!pagination.totalPages) return null;

  return (
    <div className="pagination-controls">
      <button
        onClick={onPreviousPage}
        disabled={!pagination.hasPreviousPage}
      >
        Previous
      </button>
      <span>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={!pagination.hasNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 