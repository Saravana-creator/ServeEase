# ServeEase

A full-stack service marketplace where customers find and book local service providers (electricians, plumbers, cleaners, etc.), providers manage their listings, and admins moderate the platform.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (per-session token rotation) |

## Project Structure

```
ServeEase/
├── client/          # React frontend
└── server/          # Express backend
```

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd ServeEase
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/serveease
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

> Make sure your current IP is whitelisted in MongoDB Atlas → Network Access.

### 3. Install dependencies

```bash
# In server/
npm install

# In client/
cd ../client
npm install
```

### 4. Run the project

Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

## Roles

| Role | Capabilities |
|---|---|
| **Customer** | Browse services, send inquiries, book & pay |
| **Provider** | Create/manage services, read customer inquiries |
| **Admin** | Manage users, moderate services, approve categories |

## API Routes

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/profile` | Protected |

### Services
| Method | Route | Access |
|---|---|---|
| GET | `/api/services` | Public |
| GET | `/api/services/:id` | Public |
| GET | `/api/services/mine` | Provider |
| POST | `/api/services` | Provider |
| PUT | `/api/services/:id` | Provider / Admin |
| DELETE | `/api/services/:id` | Provider / Admin |

### Messages
| Method | Route | Access |
|---|---|---|
| POST | `/api/messages` | Customer |
| GET | `/api/messages` | Customer / Provider / Admin |

### Users
| Method | Route | Access |
|---|---|---|
| GET | `/api/users` | Admin |
| PUT | `/api/users/:id/role` | Admin |
| DELETE | `/api/users/:id` | Admin |

### Categories
| Method | Route | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin / Provider |
| PUT | `/api/categories/:id/approve` | Admin |
| DELETE | `/api/categories/:id` | Admin |
