# Store Rating Platform

A full-stack web application that allows users to discover stores, submit ratings (1–5 stars), and manage the platform through role-based dashboards. Built as a solution for the **FullStack Intern Coding Challenge**.

**Live stack:** React · Express.js · MySQL · JWT Authentication

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [How to Run](#how-to-run)
- [Default Login Credentials](#default-login-credentials)
- [User Roles & Capabilities](#user-roles--capabilities)
- [API Endpoints](#api-endpoints)
- [Form Validation Rules](#form-validation-rules)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Demo Workflow](#demo-workflow)

---

## Features

### Authentication
- Single login system for all user roles
- JWT-based session management
- Normal user self-registration
- Password update for all logged-in users
- Protected routes based on role

### System Administrator
- Dashboard with total users, stores, and ratings
- Create users (Admin, Normal User, Store Owner)
- Create and assign stores to store owners
- View, filter, and sort users and stores
- View detailed user profiles (including store rating for owners)
- Quick-action cards for common admin tasks

### Normal User
- Register with name, email, address, and password
- Browse all registered stores
- Search stores by name and address
- View overall store rating and personal rating
- Submit and update ratings (1–5 stars) with interactive star UI
- Change password after login

### Store Owner
- Dashboard showing store name, average rating, and total ratings
- List of users who rated their store (sortable table)
- Change password after login

### UI / UX
- Modern responsive design with Inter font
- Split-screen login and registration pages
- Sortable tables with filters on all listings
- Role badges, rating pills, and toast notifications
- Mobile-friendly layout

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, React Router, Axios, CSS3 |
| Backend    | Node.js, Express.js |
| Database   | MySQL 8 |
| Auth       | JSON Web Tokens (JWT), bcryptjs |
| Validation | Server-side regex + client-side utilities |
| Dev Tools  | Nodemon, Create React App |

---

## Project Structure

```
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & env config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # JWT auth & role guard
│   │   ├── routes/          # API route definitions
│   │   └── index.js         # Server entry point
│   └── .env.example         # Environment template
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # Navbar, StatCard, StarRating, etc.
│       ├── context/         # Auth context
│       ├── pages/           # Admin, User, Owner, Auth pages
│       ├── services/        # Axios API client
│       └── utils/           # Form validation helpers
├── database/
│   └── schema.sql           # Tables + seed admin user
├── package.json             # Backend scripts & dependencies
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** 18 or higher — [nodejs.org](https://nodejs.org)
- **MySQL** 8 or higher — [mysql.com](https://www.mysql.com)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/manthanrane77/store-rating-platform.git
cd store-rating-platform
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs packages for both the backend (root) and frontend.

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating

PORT=5001
JWT_SECRET=your_super_secret_key_min_32_chars_here
JWT_EXPIRES_IN=7d
```

> **Note:** Port `5001` is used instead of `5000` because macOS reserves port 5000 for AirPlay.

### 4. Create the database

Run the schema file to create tables and seed the default admin user:

```bash
mysql -u root -p < database/schema.sql
```

Or open `database/schema.sql` in MySQL Workbench / any SQL client and execute it manually.

---

## How to Run

You need **two terminal windows** — one for the backend and one for the frontend.

### Terminal 1 — Start the backend API

```bash
npm run dev
```

Backend runs at: **http://localhost:5001**

### Terminal 2 — Start the React frontend

```bash
npm run frontend
```

Frontend runs at: **http://localhost:3000**

Open your browser and go to **http://localhost:3000**

### Available npm scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install backend + frontend dependencies |
| `npm run dev` | Start backend with nodemon (auto-reload) |
| `npm start` | Start backend without nodemon |
| `npm run frontend` | Start React development server |
| `npm run db:setup` | Run database schema (requires MySQL CLI) |

---

## Default Login Credentials

A default admin account is created when you run `database/schema.sql`:

| Role  | Email             | Password      |
|-------|-------------------|---------------|
| Admin | `admin@store.com` | `Admin@12345` |

> Change this password after first login in a production environment.

---

## User Roles & Capabilities

| Feature | Admin | Normal User | Store Owner |
|---------|:-----:|:-----------:|:-----------:|
| Login | ✅ | ✅ | ✅ |
| Register | — | ✅ | — |
| Dashboard stats | ✅ | — | ✅ |
| Manage users | ✅ | — | — |
| Manage stores | ✅ | — | — |
| Browse & rate stores | — | ✅ | — |
| View store raters | — | — | ✅ |
| Change password | ✅ | ✅ | ✅ |
| Filter & sort tables | ✅ | ✅ | ✅ |

---

## API Endpoints

Base URL: `http://localhost:5001/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register as normal user |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `PATCH` | `/auth/password` | Authenticated | Update password |
| `GET` | `/admin/stats` | Admin | Dashboard statistics |
| `GET` | `/admin/users` | Admin | List/filter users |
| `POST` | `/admin/users` | Admin | Create a new user |
| `GET` | `/admin/users/:id` | Admin | Get user details |
| `GET` | `/admin/stores` | Admin | List/filter stores |
| `POST` | `/admin/stores` | Admin | Create a new store |
| `GET` | `/stores` | Normal User | Browse stores with ratings |
| `POST` | `/ratings` | Normal User | Submit a rating |
| `PATCH` | `/ratings/:id` | Normal User | Update existing rating |
| `GET` | `/owner/dashboard` | Store Owner | Store stats and raters list |

All protected routes require the header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Email | Valid email format |
| Password | 8–16 characters, at least 1 uppercase letter and 1 special character |
| Address | Maximum 400 characters |
| Rating | Integer between 1 and 5 |

Validation is enforced on both the **frontend** (instant feedback) and **backend** (security).

---

## Database Schema

Three main tables:

| Table | Purpose |
|-------|---------|
| `users` | All accounts with roles: `ADMIN`, `NORMAL_USER`, `STORE_OWNER` |
| `stores` | Store details linked to a store owner, with cached `avg_rating` |
| `ratings` | User-to-store ratings (1–5), one rating per user per store |

Relationships:
- A **Store Owner** (`users`) owns one or more **Stores**
- A **Normal User** submits **Ratings** for stores
- Average rating is recalculated automatically on each rating submit/update

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | Database name | `store_rating` |
| `PORT` | Backend server port | `5001` |
| `JWT_SECRET` | Secret key for signing tokens | `min_32_char_secret` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |

---

## Demo Workflow

Follow these steps to test the full application:

1. **Login as Admin** (`admin@store.com` / `Admin@12345`)
2. Go to **Add New User** → create a **Store Owner** account
3. Go to **Add New Store** → assign it to the store owner
4. **Logout** → **Register** a new normal user (name must be 20+ characters)
5. **Login as Normal User** → browse stores → click stars to rate
6. **Logout** → **Login as Store Owner** → view dashboard and raters list

---

## Author

**Manthan Rane** — [github.com/manthanrane77](https://github.com/manthanrane77)

---

## License

This project was built as a coding challenge submission. Feel free to use it for learning and portfolio purposes.
