# Product Inventory System (MERN)

A full-stack Product Inventory System built with MongoDB, Express, React, and Node.js.

## Project structure

```
product-inventory-mern/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/                   Product, Category (Mongoose schemas)
│   ├── controllers/               Business logic for products & categories
│   ├── routes/                    Express routers
│   ├── middleware/                Validation (express-validator) & error handler
│   ├── seeder/categorySeeder.js   One-time category seed script
│   └── server.js                  App entry point
└── frontend/
    ├── tailwind.config.js       Tailwind theme (accent color, fonts, radius)
    ├── postcss.config.js
    └── src/
        ├── index.css              Font import + @tailwind directives only
        ├── api/api.js             Axios client
        ├── components/            Navbar, ProductForm, ProductList, Filters,
        │   (.jsx, Tailwind         Pagination, Tag, Toast — styled entirely
        │    utility classes)       with Tailwind classes, no separate CSS files
        └── pages/Home.jsx         Wires everything together
```

Styling uses **Tailwind CSS**, with all classes written directly in each `.jsx` file — there are no per-component `.css` files. `tailwind.config.js` defines the shared design tokens (the `ink`/`accent` colors, `display`/`body` fonts) so components stay consistent without repeating hex codes.

## Prerequisites

- Node.js 18+
- A MongoDB instance (local install, or a free MongoDB Atlas cluster)

## 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env if your MongoDB URI is different from the default
npm install
npm run seed     # seeds the category collection (run once)
npm run dev       # starts the API on http://localhost:5000
```

`.env` variables:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_inventory
CLIENT_URL=http://localhost:3000
```

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm start          # starts React on http://localhost:3000
```

The frontend is pre-configured (via the `proxy` field in `frontend/package.json`) to forward `/api/*` calls to `http://localhost:5000`, so no extra config is needed in development.
