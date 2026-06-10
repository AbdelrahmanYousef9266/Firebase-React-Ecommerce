# ShopReact — Firebase React E-Commerce App

A full-featured e-commerce web application built with React, Vite, Redux Toolkit, and Firebase (Authentication + Cloud Firestore).

---

## Features

- **Firebase Authentication** — Register and login with email and password
- **User Profiles** — View, update name/address, and delete account
- **Firestore Product Management** — Full CRUD: create, read, update, delete products
- **Shopping Cart** — Add/remove items, update quantities, persisted in sessionStorage via Redux
- **Order History** — Checkout creates a real Firestore order; view all past orders and full details
- **Protected Routes** — Profile, product management, and order pages require login
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing |
| Redux Toolkit | Cart state management |
| Firebase Auth | Email/password authentication |
| Cloud Firestore | Product, user, and order database |
| Plain CSS | Styling (no CSS framework) |

---

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the steps
3. Once created, click **Web** (</>) to add a web app
4. Copy your Firebase config values

### 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable **Email/Password**

### 3. Enable Firestore

1. In Firebase Console → **Firestore Database** → **Create database**
2. Start in **test mode** (you can add security rules later)
3. Choose a region close to you

### 4. Firestore Security Rules (recommended for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Environment Variable Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> The `.env` file is already in `.gitignore` — your secrets will never be committed.

---

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## How to Use the App

### Register & Login
- Go to `/register` to create an account (name, email, address, password)
- Go to `/login` to sign in with your email and password

### Managing Products
- Log in, then click **Manage** in the navbar
- Click **+ Add Product** to create a product
- Click **Edit** or **Delete** on any product row
- Products are displayed on the Home page for all visitors

### Shopping
- Browse products on the Home page (`/`)
- Use the category dropdown to filter
- Click **Add to Cart** — the cart badge updates instantly
- Go to `/cart` to review items and adjust quantities

### Checkout & Orders
- Must be logged in to checkout
- Click **Checkout** in the cart — the order is saved to Firestore
- After checkout, click **View My Orders** or go to `/orders`
- Click any order to see the full breakdown at `/orders/:id`

### Profile
- Go to `/profile` to view and update your name and address
- Click **Logout** to sign out
- Click **Delete Account** to permanently remove your account and data

---

## Firestore Collections

| Collection | Description |
|---|---|
| `users` | One document per user (uid, name, email, address, createdAt) |
| `products` | Product catalog (title, price, category, description, image, rating, createdAt, updatedAt) |
| `orders` | One document per order (userId, userEmail, items[], totalItems, totalPrice, createdAt) |

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home — product listing |
| `/cart` | Public | Shopping cart |
| `/login` | Public | Login page |
| `/register` | Public | Register page |
| `/profile` | Protected | View & edit profile |
| `/products/manage` | Protected | Product management table |
| `/products/add` | Protected | Add new product |
| `/products/edit/:id` | Protected | Edit existing product |
| `/orders` | Protected | Order history |
| `/orders/:id` | Protected | Order details |

---

## Product Data Note

**Firestore is the primary product database.** All product reads, updates, deletes, cart operations, checkout, and order history are handled entirely through Firebase/Firestore. The app does not depend on any external API for normal usage.

The project includes an **optional one-time seed utility** for development and demo purposes, accessible from the Product Management page (requires login). The utility is safe to skip — products can also be added manually using the Add Product form.

### How the seed utility works

1. Clicking **Seed Demo Products** fetches 20 sample products from [FakeStore API](https://fakestoreapi.com/products) — a free public mock API used only for demo data.
2. Each product is written into the Firestore `products` collection using `addDoc`.
3. After seeding, all product reads, edits, deletes, and order operations use Firestore only.
4. The utility checks whether products already exist before running — if the `products` collection is non-empty, seeding is skipped automatically to prevent duplicates.

### Data source summary

| Feature | Data source |
|---|---|
| Seed Demo Products (one-time, optional) | FakeStore API → saved to Firestore |
| Home page product listing | Firestore only |
| Category filter | Derived from Firestore product data |
| Product Management (list, edit, delete) | Firestore only |
| Add Product form | Firestore `addDoc` |
| Edit Product form | Firestore `updateDoc` |
| Delete Product | Firestore `deleteDoc` |
| Cart and checkout | Cart in Redux/sessionStorage; order saved to Firestore `orders` |
| Order history and details | Firestore only |
| User profile | Firestore `users` collection |

FakeStore API is contacted **only** during the optional seed action, and only when the Firestore `products` collection is empty.

---

## Requirements Checklist

- [x] Firebase Authentication (email/password)
- [x] Register with name, email, address, password
- [x] Login and logout
- [x] User profile: read, update, delete
- [x] Firestore products collection (full CRUD)
- [x] Home page reads from Firestore
- [x] Category filter derived from product data
- [x] Cart with Redux Toolkit + sessionStorage persistence
- [x] Checkout creates Firestore order document
- [x] Cart cleared after successful checkout
- [x] Order history page (user-specific)
- [x] Order details page
- [x] Protected routes for auth-required pages
- [x] Navbar shows correct links based on auth state
- [x] Loading and error states throughout
- [x] Form validation on all forms
- [x] Environment variables for Firebase config
- [x] `.env` in `.gitignore`
- [x] `npm run dev` works
- [x] `npm run build` passes with no errors

---

## Author

**Abdelrahman Yousef**  
GitHub: [https://github.com/AbdelrahmanYousef9266](https://github.com/AbdelrahmanYousef9266)
