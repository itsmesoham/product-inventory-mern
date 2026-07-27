require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(mongoSanitize()); // strips $ / . operators from user input to prevent NoSQL injection

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
