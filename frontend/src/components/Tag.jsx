import React from 'react';

const Tag = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-accent-dark bg-accent-soft border border-accent-border rounded-full whitespace-nowrap">
    {children}
  </span>
);

export default Tag;
