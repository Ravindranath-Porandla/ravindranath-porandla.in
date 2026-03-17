# Portfolio API — FastAPI Backend

Production-ready CMS-like backend for a personal portfolio website. Built with **FastAPI**, **async SQLAlchemy**, **PostgreSQL**, and **JWT authentication**.

---

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.11+
- PostgreSQL database (local or Supabase)

### 2. Create a virtual environment

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
# Copy the template
cp .env.example .env

# Edit .env and fill in your values:
# - DATABASE_URL  (your PostgreSQL connection string)
# - SECRET_KEY    (random 32+ char string)
# - REFRESH_SECRET_KEY (another random 32+ char string)
```

> Generate secret keys with: `python -c "import secrets; print(secrets.token_hex(32))"`

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Seed sample data

```bash
python -m scripts.seed
```

This creates:
- Admin user: `admin@portfolio.com` / `Admin123!` (**change immediately**)
- 5 navigation items
- 7 site settings (bio, email, URLs, etc.)
- 4 skill categories with 22 skills
- 2 experience entries
- 3 posts (2 published, 1 draft)

### 7. Start the server

```bash
uvicorn main:app --reload --port 8000
```

API is now running at **http://localhost:8000**

### 8. Explore the docs

| URL | Description |
|---|---|
| http://localhost:8000/docs | Swagger UI (interactive) |
| http://localhost:8000/redoc | ReDoc documentation |
| http://localhost:8000/ | Health check |

---

## 🔐 Authentication

1. Go to `/docs`
2. Use `POST /auth/login` with `{"email": "admin@portfolio.com", "password": "Admin123!"}`
3. Copy the `access_token`
4. Click **Authorize** at the top of /docs and paste the token
5. All admin endpoints are now accessible

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/           # Config, DB, security, dependencies, exceptions
│   ├── models/         # SQLAlchemy ORM models
│   ├── schemas/        # Pydantic request/response schemas
│   ├── repositories/   # Database query layer
│   ├── services/       # Business logic layer
│   ├── routers/
│   │   ├── auth.py         # Auth endpoints
│   │   ├── public/         # Public (unauthenticated) endpoints
│   │   └── admin/          # Admin (JWT-protected) endpoints
│   └── middleware/     # Logging, rate limiting
├── alembic/            # Database migrations
├── scripts/            # Seed script
├── main.py             # App entry point
├── alembic.ini         # Alembic config
├── requirements.txt
└── .env.example
```

---

## 🌐 API Endpoints

### Public (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts` | Paginated list of published posts |
| GET | `/posts/{slug}` | Single post by slug |
| GET | `/skills` | All skill categories + skills |
| GET | `/experience` | All experience entries |
| GET | `/navigation` | Visible nav items (ordered) |
| GET | `/settings` | All site settings |
| POST | `/contact` | Submit contact message |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login → access + refresh tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current admin |
| POST | `/auth/logout` | Logout (client discards token) |

### Admin (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/admin/posts` | List all / create post |
| GET/PATCH/DELETE | `/admin/posts/{id}` | Manage single post |
| PATCH | `/admin/posts/{id}/publish` | Toggle publish |
| GET/POST | `/admin/navigation` | List all / create nav item |
| PATCH/DELETE | `/admin/navigation/{id}` | Update / delete nav |
| POST | `/admin/navigation/reorder` | Bulk reorder nav items |
| GET/PATCH | `/admin/settings` | List / upsert settings |
| GET/POST | `/admin/skills` | List / create skill |
| PATCH/DELETE | `/admin/skills/{id}` | Update / delete skill |
| POST/PATCH/DELETE | `/admin/skills/categories` | Manage categories |
| GET/POST | `/admin/experience` | List / create experience |
| PATCH/DELETE | `/admin/experience/{id}` | Update / delete |
| GET | `/admin/messages` | List contact messages |
| PATCH | `/admin/messages/{id}/read` | Mark as read |
| DELETE | `/admin/messages/{id}` | Delete message |

---

## 🔌 Frontend Integration

In your Next.js frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend `lib/api.ts` should call endpoints like:
- `${NEXT_PUBLIC_API_URL}/posts` for writing
- `${NEXT_PUBLIC_API_URL}/navigation` for dynamic header
- `${NEXT_PUBLIC_API_URL}/settings` for bio, email, etc.

---

## 🗃️ Alembic Migrations

```bash
# Apply all migrations
alembic upgrade head

# Create a new migration after model changes
alembic revision --autogenerate -m "add_new_field"

# Rollback one step
alembic downgrade -1
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL async URL | required |
| `SECRET_KEY` | JWT access token secret | required |
| `REFRESH_SECRET_KEY` | JWT refresh token secret | required |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `http://localhost:3000` |
| `ENVIRONMENT` | `development` or `production` | `development` |
