  # 🧵 Loomly

  **A modern, high-performance, full-stack e-commerce experience.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](#)

  [Explore Features](#-key-features) • [Installation](#-getting-started) • [Tech Stack](#-tech-stack) • [Admin Features](#%EF%B8%8F-admin-dashboard)
</div>

---

## 📖 Overview

Loomly is a premium, full-stack e-commerce web application built using the **MERN stack** (MongoDB, Express, React, Node.js). Optimized with Vite and styled with Tailwind CSS, Loomly delivers a seamless and lightning-fast shopping experience, from product discovery to secure checkout.

---

## ✨ Key Features

### 🛍️ Customer Experience
- **🔐 Authentication**: Secure JWT-based authentication with support for local login and social providers.
- **🔍 Product Discovery**: Advanced product search, debounced filtering, pagination, and dynamic category-based browsing.
- **🛒 Cart & Wishlist**: Manage items, update quantities, select size variants, and curate a list of favorite products.
- **💳 Secure Checkout**: Seamless and robust payment processing powered by **Stripe**.
- **👤 User Dashboard**: Comprehensive profile management, order tracking timeline, address book management.
- **⭐ Reviews**: Users can leave product reviews with ratings, and manage/delete their own reviews.

### 🛡️ Admin Dashboard
A dedicated, powerful control center to manage the entire platform:
- **📦 Order Management**: View all platform orders and dynamically update shipping statuses (*Processing, Shipped, Delivered, Cancelled*).
- **👥 User Management**: Monitor registered users, view their roles, and manage access.
- **🗂️ Catalog & Categories**: Dynamically create and manage product categories.
- **👕 Product Uploads**: Seamlessly upload new products with multiple images (via **Cloudinary**), setup sizing variants, pricing, stock, and descriptions.

---

## 💻 Tech Stack

| Frontend 🎨 | Backend ⚙️ | Services & Tools 🛠️ |
| :--- | :--- | :--- |
| **React** (Vite) | **Node.js** | **MongoDB Atlas** (Database) |
| **Tailwind CSS** | **Express.js** | **Cloudinary** (Image Hosting) |
| **Framer Motion** | **Mongoose** | **Stripe API** (Payments) |
| **Context API** | **JWT Authentication** | **Git / GitHub** |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have the following installed and set up:
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)
* [Cloudinary Account](https://cloudinary.com/)
* [Stripe Account](https://stripe.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheManUnderTheHood/Loomly.git
   cd Loomly
   ```

2. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Environment Variables**  
   Create a `.env` file in the `Backend` directory and configure your secrets:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   ```

5. **Run the Backend Server**
   ```bash
   npm run dev
   ```

---

<div align="center">
  <i>Built with ❤️ for the modern web.</i>
</div>
