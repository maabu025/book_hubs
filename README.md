# 📚 Book Hub — React Discovery App

A full-stack book discovery application built with **React + TypeScript + Redux** (frontend) and **Node.js + Express + MongoDB** (backend).

##  Features

### For Users
- 🔍 **Search & Filter** — search by title/author/keyword, filter by genre, author, rating, publication year
-  **Browse Books** — paginated book grid with sort options (date, rating, popularity, title)
-  **Book Details** — rich detail page with description, stats, and metadata
-  **Track Reads** — mark books as read (increments global read count)
-  **Auth** — register and login with JWT tokens

### For Admins
-  **Create Books** — add new books with full metadata
-  **Edit Books** — update any book's information
-  **Delete Books** — remove books from the library
-  **Analytics Dashboard:**
  - Total books and total reads across all books
  - Average reads per book
  - **Top 5 most-read books**
  - **Bottom 5 least-read books** (worst performers)
  - **Recently added books**
  - Read count per book (visual bar chart)
  - Genre statistics (count, reads, avg rating)

##  Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| State — Auth | React Context API |
| State — Filtering | Redux Toolkit |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

##  Quick Start

### Prerequisites
- Node.js v16+
- MongoDB running locally (or Atlas URI)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bookhub
```

### 2. Backend setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET

# Seed the database (24 books + 2 test users)
npm run seed

# Start the API server
npm run dev   # → http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev   # → http://localhost:3000
```

> The frontend Vite dev server proxies `/api` requests to `localhost:5000` automatically.

---

##  Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@bookhub.com | admin123 |
| Reader | reader@bookhub.com | reader123 |

The **Login page** has "Fill Admin" / "Fill Reader" buttons for convenience.

---

##  Project Structure

```
bookhub/
├── backend/
│   ├── models/
│   │   ├── User.js          # Mongoose user schema, bcrypt hashing
│   │   └── Book.js          # Mongoose book schema, text index
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   ├── books.js         # GET/POST/PUT/DELETE /books, GET /genres, GET /authors
│   │   └── admin.js         # GET /admin/insights (admin-only)
│   ├── middleware/
│   │   └── auth.js          # protect (JWT verify) + adminOnly middleware
│   ├── server.js            # Express app, MongoDB connection
│   ├── seed.js              # Database seeder
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/
        │   └── client.ts        # Axios instance with token interceptor
        ├── context/
        │   └── AuthContext.tsx  # React Context — login, logout, register
        ├── store/
        │   ├── index.ts         # Redux store config
        │   ├── hooks.ts         # Typed useAppDispatch / useAppSelector
        │   └── booksSlice.ts    # All filter/search/sort/pagination state
        ├── components/
        │   ├── Navbar.tsx
        │   ├── BookCard.tsx
        │   ├── FilterSidebar.tsx  # Redux-connected
        │   ├── Pagination.tsx     # Redux-connected
        │   ├── BookForm.tsx       # Admin create/edit modal
        │   ├── StarRating.tsx
        │   └── ProtectedRoute.tsx # Context-based route guard
        ├── pages/
        │   ├── Home.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── BookDetail.tsx
        │   └── admin/
        │       ├── Dashboard.tsx   # Analytics dashboard
        │       └── ManageBooks.tsx # Book CRUD table
        ├── types/index.ts    # All TypeScript interfaces
        ├── App.tsx           # Router with protected routes
        └── index.css         # Complete design system
```

---

##  API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | Bearer | Get current user |

### Books
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/books` | — | List books (filter/sort/paginate) |
| GET | `/api/books/genres` | — | All distinct genres |
| GET | `/api/books/authors` | — | All distinct authors |
| GET | `/api/books/:id` | — | Single book |
| POST | `/api/books/:id/read` | User | Increment read count |
| POST | `/api/books` | Admin | Create book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |

**GET /api/books query params:** `page`, `limit`, `search`, `genre`, `author`, `sortBy`, `sortOrder`, `minRating`, `startYear`, `endYear`

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/insights` | Admin | Full analytics dashboard data |

---

##  Architecture Decisions

### Why Redux for Filtering?
All search, filter, sort, and pagination state lives in **Redux** (`booksSlice.ts`). This means:
- Filter state persists when navigating between pages
- `FilterSidebar` and `Pagination` are fully decoupled — both dispatch actions to the same store
- Easy to add more filters in the future

### Why React Context for Auth?
Authentication state (user, token, login/logout functions) is managed with **React Context** (`AuthContext.tsx`). `ProtectedRoute` reads from Context directly to decide whether to render children or redirect.

---

##  Deployment

### Backend (e.g. Railway / Render)
1. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`
2. Start command: `npm start`

### Frontend (e.g. Vercel / Netlify)
1. Build: `npm run build`
2. Set `VITE_API_URL` env variable to your backend URL
3. Update `client.ts` baseURL: `import.meta.env.VITE_API_URL || '/api'`

---

##  Screenshots

> Add screenshots here after running the app locally.

---

##  License

MIT
