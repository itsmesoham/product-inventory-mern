import React, { useState } from 'react';

const initialState = { name: '', description: '', quantity: '', categories: [] };

const inputBase =
  'border rounded px-3 py-2.5 text-[13.5px] text-gray-700 bg-white outline-none resize-y transition-colors focus:border-ink';

const ProductForm = ({ categories, onSubmit, submitting }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    else if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';

    if (!form.description.trim()) next.description = 'Description is required';

    if (form.quantity === '' || form.quantity === null) next.quantity = 'Quantity is required';
    else if (Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity)))
      next.quantity = 'Quantity must be a non-negative whole number';

    if (form.categories.length === 0) next.categories = 'Select at least one category';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const toggleCategory = (id) => {
    setForm((f) => {
      const has = f.categories.includes(id);
      return { ...f, categories: has ? f.categories.filter((c) => c !== id) : [...f.categories, id] };
    });
    setErrors((e) => ({ ...e, categories: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      categories: form.categories,
    });

    if (result?.success) {
      setForm(initialState);
      setOpen(false);
    } else if (result?.fieldErrors) {
      setErrors((e) => ({ ...e, ...result.fieldErrors }));
    }
  };

  return (
    <div className="mb-7">
      <button
        className="px-5 py-3 bg-ink text-white border-none rounded text-[13.5px] font-medium tracking-wide hover:bg-black"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Cancel' : '+ Add New Product'}
      </button>

      {open && (
        <form
          className="mt-4.5 p-6 border border-gray-200 rounded bg-gray-50 flex flex-col gap-4.5 mt-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex gap-4.5 gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="name" className="text-[12.5px] font-medium text-ink tracking-wide">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Wireless Mouse"
                className={`${inputBase} ${errors.name ? 'border-rose-500' : 'border-gray-200'}`}
              />
              {errors.name && <span className="text-xs text-rose-600">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1.5 flex-none w-40">
              <label htmlFor="quantity" className="text-[12.5px] font-medium text-ink tracking-wide">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0"
                className={`${inputBase} ${errors.quantity ? 'border-rose-500' : 'border-gray-200'}`}
              />
              {errors.quantity && <span className="text-xs text-rose-600">{errors.quantity}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-[12.5px] font-medium text-ink tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Short description of the product..."
              className={`${inputBase} ${errors.description ? 'border-rose-500' : 'border-gray-200'}`}
            />
            {errors.description && <span className="text-xs text-rose-600">{errors.description}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-medium text-ink tracking-wide">Categories</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.length === 0 && (
                <p className="text-[13px] text-gray-400">No categories found — run the category seeder first.</p>
              )}
              {categories.map((cat) => {
                const active = form.categories.includes(cat._id);
                return (
                  <label
                    key={cat._id}
                    className={`flex items-center gap-1.5 px-3 py-[7px] border rounded-full text-[12.5px] cursor-pointer transition-colors ${
                      active
                        ? 'bg-accent-soft border-accent text-accent-dark font-medium'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <input type="checkbox" checked={active} onChange={() => toggleCategory(cat._id)} className="hidden" />
                    {cat.name}
                  </label>
                );
              })}
            </div>
            {errors.categories && <span className="text-xs text-rose-600">{errors.categories}</span>}
          </div>

          <button
            type="submit"
            className="self-start px-6 py-2.5 bg-accent text-white border-none rounded text-[13.5px] font-medium hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
