# Product Inventory System (MERN)

A full-stack Product Inventory System built with MongoDB, Express, React, and Node.js.

## Features

- Add products with name (unique), description, quantity, and multiple categories
- Paginated product listing (numbered pagination) showing categories as tag/bubbles and the date added
- Delete products with a confirm step
- Search products by name (debounced, server-side)
- Multi-select category filter — a product matches if it belongs to **any** selected category
- Client-side + server-side validation, with duplicate-name protection (case-insensitive, both at the DB index level and app level)
- Central error handling, input sanitization against NoSQL injection, indexed queries for pagination/filtering at scale

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

## API Reference

| Method | Endpoint                        | Description                                      |
|--------|----------------------------------|---------------------------------------------------|
| GET    | `/api/categories`                | List all categories                               |
| GET    | `/api/products`                  | List products — query: `page`, `limit`, `search`, `categories` (comma-separated ids) |
| POST   | `/api/products`                  | Create a product — body: `name`, `description`, `quantity`, `categories[]` |
| DELETE | `/api/products/:id`              | Delete a product                                  |

## Design notes

- Duplicate names are rejected at three layers: client-side check on submit, a friendly 409 from the controller, and a case-insensitive unique index as the final safety net at the database level.
- Category filtering and pagination both use indexed fields (`categories`, and Mongo's default `_id`/`createdAt` sort) so the listing query stays fast as the catalog grows — `skip/limit` combined with `countDocuments` keeps pagination numbers accurate without loading the full collection.
- The category multi-select uses `$in`, so a product shows up if it belongs to *any* of the selected categories, per the spec.
- Visual design (typography, spacing, the pink accent, minimal bordered cards) mirrors the reference screenshots provided.

## Next steps you may want to add later

- Authentication for the admin actions (add/delete)
- Edit-product support
- Image upload per product
- Automated tests (Jest + Supertest for the API, React Testing Library for the UI)
