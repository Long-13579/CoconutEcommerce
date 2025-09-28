**🛒 E-commerce REST API (Django + DRF)**

# Overview

This is a backend e-commerce REST API built with Django and Django REST Framework, using PostgreSQL as the database. It is designed to be scalable, secure, and production-ready, with Stripe integrated for payment processing.

# Features

**User authentication and management**
  - Register, login, password reset, and account management.
  - Extendable user model for different roles (buyer/seller).

**Product and category listing**
  - Manage product categories.
  - List products with details such as name, description, price, stock, and image.

**Cart functionality (add, update, delete items)**
  - Add products to the cart.
  - Update product quantity or remove items from the cart.

**Wishlist functionality (add, delete, check existence)**
  - Add products to the wishlist.
  - Remove items and check if a product already exists in the wishlist.

**Product search**
  - Search products by name, description, or other criteria.

**Order processing with Stripe checkout**
  - Place orders and process payments securely using Stripe Checkout.


# Installation

  **1. Clone the repository:**
  ```bash
  git clone <repository_url>
  cd project_directory
  ```
  **2. Create a virtual environment and activate it:**
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
  ```
  **3. Install dependencies:**
  ```bash 
  pip install -r requirements.txt
  ```
  **4. Set up environment variables in .env:**
  - Rename the file env.example to .env.
  - Change and assign your own value.
  ```bash
  MYSQL_DB_NAME = "Your Database Name"
  MYSQL_PASSWORD = "Your Database Password"
  ```
  **5. Apply migrations and run the development server:**
  ```bash
  python manage.py migrate
  python manage.py init_data
  python manage.py runserver
  ```
