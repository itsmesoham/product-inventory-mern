import React, { useState } from 'react';
import Tag from './Tag';

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const ProductList = ({ products, loading, onDelete }) => {
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="py-16 px-5 text-center text-gray-400 text-[13.5px] border border-dashed border-gray-200 rounded">
        <p>Loading products…</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 px-5 text-center text-gray-400 text-[13.5px] border border-dashed border-gray-200 rounded">
        <p>No products found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold tracking-wider uppercase text-gray-400 border-b border-gray-200">
              Product Name
            </th>
            <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold tracking-wider uppercase text-gray-400 border-b border-gray-200">
              Categories
            </th>
            <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold tracking-wider uppercase text-gray-400 border-b border-gray-200">
              Added On
            </th>
            <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold tracking-wider uppercase text-gray-400 border-b border-gray-200 w-40">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
              <td className="px-5 py-4 text-[13.5px] font-medium text-ink align-middle">{p.name}</td>
              <td className="px-5 py-4 align-middle">
                <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                  {p.categories.map((c) => (
                    <Tag key={c._id}>{c.name}</Tag>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4 text-[13.5px] text-gray-400 whitespace-nowrap align-middle">{formatDate(p.createdAt)}</td>
              <td className="px-5 py-4 align-middle">
                {confirmId === p._id ? (
                  <div className="flex gap-1.5">
                    <button
                      className="px-3 py-[7px] border-none bg-rose-600 text-white rounded text-xs font-medium whitespace-nowrap disabled:opacity-60"
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                    >
                      {deletingId === p._id ? 'Deleting…' : 'Confirm'}
                    </button>
                    <button
                      className="px-3 py-[7px] border border-gray-200 bg-white text-gray-700 rounded text-xs"
                      onClick={() => setConfirmId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-3.5 py-[7px] border border-gray-200 bg-white text-rose-600 rounded text-[12.5px] font-medium whitespace-nowrap hover:border-rose-600 hover:bg-red-50"
                    onClick={() => setConfirmId(p._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
