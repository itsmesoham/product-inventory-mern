import React, { useMemo } from 'react';

// Builds a compact page list like: 1 2 3 … 8 9 10 … 42
const buildPageList = (current, total) => {
  const pages = [];
  const add = (p) => pages.push(p);
  const windowSize = 1;

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) add(i);
    return pages;
  }

  add(1);
  if (current - windowSize > 2) add('…');
  for (let i = Math.max(2, current - windowSize); i <= Math.min(total - 1, current + windowSize); i += 1) {
    add(i);
  }
  if (current + windowSize < total - 1) add('…');
  add(total);
  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  const baseBtn =
    'min-w-[34px] h-[34px] px-2 border border-gray-200 bg-white rounded text-[13px] text-gray-700 transition-colors hover:border-ink disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-gray-200';

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-9 mb-2" aria-label="Product list pagination">
      <button className={baseBtn} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        ‹
      </button>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} className="text-gray-400 px-1 text-[13px]">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${baseBtn} ${p === page ? '!bg-ink !border-ink !text-white' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button className={baseBtn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        ›
      </button>
    </nav>
  );
};

export default Pagination;
