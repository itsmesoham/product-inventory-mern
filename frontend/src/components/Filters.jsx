import React, { useEffect, useRef, useState } from 'react';

const Filters = ({ categories, search, onSearchChange, selectedCategories, onCategoriesChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== id));
    } else {
      onCategoriesChange([...selectedCategories, id]);
    }
  };

  const selectedNames = categories.filter((c) => selectedCategories.includes(c._id)).map((c) => c.name);

  return (
    <div className="flex gap-3 flex-wrap items-start">
      <div className="flex items-center gap-2 border border-gray-200 rounded px-3 h-[42px] min-w-[260px] flex-1 basis-[260px] text-gray-400 bg-white focus-within:border-ink focus-within:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-none outline-none text-[13.5px] w-full text-gray-700 bg-transparent"
        />
      </div>

      <div className="relative flex-none" ref={dropdownRef}>
        <button
          className="h-[42px] px-3.5 border border-gray-200 bg-white rounded text-[13.5px] text-gray-700 flex items-center gap-2 min-w-[200px] justify-between whitespace-nowrap hover:border-ink"
          onClick={() => setOpen((o) => !o)}
        >
          {selectedNames.length === 0
            ? 'All Categories'
            : `${selectedNames.length} Categor${selectedNames.length > 1 ? 'ies' : 'y'} selected`}
          <span className={`text-gray-400 text-[15px] transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
        </button>

        {open && (
          <div className="absolute top-[calc(100%+6px)] left-0 min-w-[240px] max-h-[280px] overflow-y-auto bg-white border border-gray-200 rounded shadow-lg p-2 z-50">
            {categories.length === 0 && <p className="p-2.5 text-[13px] text-gray-400">No categories available</p>}
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  className="accent-accent w-[15px] h-[15px]"
                />
                <span>{cat.name}</span>
              </label>
            ))}
            {selectedCategories.length > 0 && (
              <button
                className="w-full mt-1.5 py-2 border-t border-gray-100 bg-transparent text-xs font-medium text-accent-dark hover:bg-accent-soft"
                onClick={() => onCategoriesChange([])}
              >
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
