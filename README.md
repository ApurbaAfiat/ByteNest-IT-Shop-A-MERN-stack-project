# ByteNest — Modern MERN Stack IT Shop

ByteNest is a polished, feature-rich portfolio e-commerce application built using the full MERN stack. Designed with premium visual aesthetics and micro-interactions, it is inspired by the user experience patterns of leading online electronics outlets.

🚀 **Live Portfolio Demonstration** — Built for showcasing full-stack capabilities, clean code architectures, and premium responsive web design.

---

## 🛠️ Tech Stack & Architecture

- **Database:** MongoDB (Mongoose schemas)
- **Backend:** Express.js, Node.js (REST API architecture)
- **Frontend:** React.js, Vite (Fast build system)
- **Styling:** Tailwind CSS v3 (Custom UI theme, Dark Mode support)
- **State Management:** Redux Toolkit + RTK Query (Data fetching, caching, and local persistence)
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-Only cookies
- **Compression:** Gzip compression enabled for high performance

---

## ✨ Key Features

### 💻 1. Premium UI/UX & Responsive Layouts
- Full **Dark Mode** toggle system integrated with system preferences and local storage persistence.
- Glassmorphism header navbar and micro-animations for high-fidelity engagement.
- Advanced skeleton loaders built for all product lists and details panels to ensure layout stability during fetch.

### 🔎 2. Hardware Catalog & Advanced Filtering
- Built-in database seeding for **55 realistic products** across 4 key categories (20 Laptops, 15 Earbuds, 10 Smartwatches, 10 Accessories).
- Side drawer filters on catalog list allowing simultaneous sorting (price, rating, newness, name) and matching range lookups (category, brand, price min/max).
- Spec-sheet tables dynamically adapted for each product category (e.g. GPU/RAM specs for laptops, battery/ANC for earbuds).

### 🏷️ 3. Cart, Checkout, and Coupons
- Free shipping threshold logic (free over ৳5,000, otherwise ৳100 flat rate).
- Automatic 5% VAT tax calculation.
- Mock coupon discount code applicator (e.g. apply code `SAVE10` to get 10% off purchases above ৳5,000).
- Simplified **Cash on Delivery (COD)** checkout flow.

### 📊 4. Admin Dashboard Control Panel
- Interactive month-by-month sales area graph using **Recharts**.
- Quick overview metrics cards (Revenue, orders, product counts, registered users).
- Complete CRUD controls to add/modify catalog products, manage custom categories, update shipment states (Pending, Processing, Shipped, Delivered, Cancelled), and manage/block user accounts.

---

## 🚦 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB installation

### 2. Configuration Setup
Create a `.env` file in the project **root** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Installation
Install root and frontend dependencies:
```bash
# Install root package modules
npm install

# Install client packages
npm install --prefix frontend
```

### 4. Seed Database
Seed the database with 55 initial tech products, categories, coupons, and mock accounts:
```bash
npm run data:import
```

### 5. Running the Application
Start the backend and frontend dev servers concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 👥 Mock Testing Accounts

You can test user flows using these pre-seeded accounts:

- **Admin Account (Full Dashboard Access):**
  - **Email:** `admin@bytenest.com`
  - **Password:** `admin123`
- **Customer Account:**
  - **Email:** `rahim@example.com`
  - **Password:** `user123`
