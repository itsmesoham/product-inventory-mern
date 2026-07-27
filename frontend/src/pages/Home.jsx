import React, { useCallback, useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { fetchCategories, fetchProducts, createProduct, deleteProduct } from '../api/api';

const LIMIT = 10;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const showToast = (type, message) => setToast({ type, message });

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategories]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data.data);
    } catch (err) {
      showToast('error', 'Could not load categories. Is the backend running?');
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        categories: selectedCategories,
      });
      setProducts(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      showToast('error', 'Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await createProduct(payload);
      showToast('success', `"${payload.name}" was added successfully`);
      setPage(1);
      await loadProducts();
      return { success: true };
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) {
        const fieldErrors = {};
        res.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        showToast('error', res.message || 'Please fix the highlighted fields');
        return { success: false, fieldErrors };
      }
      showToast('error', res?.message || 'Failed to add product');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      showToast('success', 'Product deleted successfully');
      // If we just deleted the last item on a page beyond page 1, step back
      if (products.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await loadProducts();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 pt-10 pb-20">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className="mb-10">
        <p className="text-[12.5px] font-medium tracking-wide text-gray-400 mb-2.5">— Inventory Overview</p>
        <h1 className="font-display text-[34px] font-semibold mb-2 text-ink">Product Inventory</h1>
        <p className="text-sm text-gray-400">Manage your product catalog, stock levels, and categories in one place.</p>
      </section>

      <section>
        <ProductForm categories={categories} onSubmit={handleCreate} submitting={submitting} />

        <div className="flex items-center justify-between flex-wrap gap-4 mb-4.5 pb-4.5 border-b border-gray-200 mb-4 pb-4">
          <h2 className="text-[13px] font-semibold tracking-wide uppercase text-ink whitespace-nowrap">
            All Products <span className="text-gray-400 font-normal normal-case tracking-normal">({total})</span>
          </h2>
          <Filters
            categories={categories}
            search={search}
            onSearchChange={setSearch}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </div>

        <ProductList products={products} loading={loading} onDelete={handleDelete} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  );
};

export default Home;
