import React from 'react';

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-[1180px] mx-auto px-8 py-[22px] flex items-baseline justify-between flex-wrap gap-2">
        <div className="font-display text-[22px] font-semibold tracking-wide text-ink">
          INVENTORY<span className="text-accent">.</span>
        </div>
        <p className="text-[13px] text-gray-500 tracking-wide">Product Inventory System</p>
      </div>
    </header>
  );
};

export default Navbar;
