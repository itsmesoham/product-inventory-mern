import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const fetchCategories = () => api.get('/categories');

export const fetchProducts = ({ page = 1, limit = 10, search = '', categories = [] }) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (categories.length > 0) params.categories = categories.join(',');
  return api.get('/products', { params });
};

export const createProduct = (payload) => api.post('/products', payload);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export default api;
