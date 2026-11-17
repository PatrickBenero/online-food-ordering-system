# Online Food Ordering System

This is a **frontend-only** web application that simulates a small restaurant/canteen ordering platform. It is built with plain HTML5, CSS3 and vanilla JavaScript and stores all data in `localStorage`.

## Features
- Customer registration & login (Customer ID)
- Admin login (demo credentials)
- Food menu with categories, search & filter
- Shopping cart with quantity management
- Checkout with coupon, GST, delivery fee calculations
- Order history for customers and admin order management
- Admin dashboard with statistics & simple reports
- Persistent data via `localStorage`
- Light & dark themes, responsive layout

## Project Structure
```
online-food-ordering-system/
│
├─ index.html                # Landing page – choose Customer or Admin
├─ README.md                 # This file
│
├─ customer/
│   ├─ register.html         # Customer registration
│   ├─ home.html             # Customer home page
│   ├─ menu.html             # Food menu & search
│   ├─ cart.html             # Shopping cart
│   ├─ checkout.html         # Checkout & billing
│   ├─ order-success.html    # Order placed confirmation
│   └─ my-orders.html        # Customer order history
│
├─ admin/
│   ├─ login.html            # Admin login page
│   ├─ dashboard.html        # Dashboard with stats
│   ├─ menu-management.html  # Manage food items
│   ├─ customers.html        # View customers
│   ├─ orders.html            # Manage orders & status flow
│   └─ reports.html          # Simple reports
│
├─ assets/
│   ├─ css/
│   │   ├─ style.css         # Global styles, themes
│   │   ├─ customer.css      # Customer‑specific styles
│   │   └─ admin.css         # Admin‑specific styles
│   ├─ js/
│   │   ├─ storage.js        # LocalStorage wrapper + sample data init
│   │   ├─ auth.js           # Login / registration logic
│   │   ├─ menu.js           # Render menu, search & filter
│   │   ├─ cart.js           # Cart operations
│   │   ├─ orders.js         # Order creation, validation, history
│   │   ├─ admin.js          # Admin dashboard & management UI
│   │   └─ app.js            # Application bootstrap & navigation helper
│   └─ images/                # Food images (use external URLs or placeholders)
```

## How to Run
1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Use the **Customer** flow:
   - Register a new customer (sample ID 501 / name Prasanna M is pre‑loaded).
   - Browse the menu, add items to the cart, checkout.
3. Use the **Admin** flow:
   - Login with **Username:** `admin` and **Password:** `admin123`.
   - Manage food items, view customers, update order status, view reports.

All data is stored locally in the browser; clearing site data will reset the app.

---
*Built for a second‑year engineering practical examination – simple, readable code, no external libraries.*