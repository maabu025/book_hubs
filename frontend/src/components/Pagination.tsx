import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPage } from '../store/booksSlice';

const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagination } = useAppSelector((s) => s.books);
  const { currentPage, totalPages, totalBooks, limit } = pagination;

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    dispatch(setPage(p));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page number array with ellipsis
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalBooks);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {start}–{end} of {totalBooks} books
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => goTo(currentPage - 1)}
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === currentPage ? 'active' : ''}`}
              onClick={() => goTo(p as number)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => goTo(currentPage + 1)}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
