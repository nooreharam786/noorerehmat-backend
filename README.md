# Sacred Journey Production System

This workspace contains a new production-grade backend and premium admin dashboard that integrate with the existing Sacred Journey frontend without rebuilding it.

## Project Structure

```text
backend/
  prisma/
    schema.prisma
    seed.ts
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    utils/
admin/
  src/
    app/
    lib/
    types/
```

## One-Command Development

From the workspace root:

```bash
npm run dev
```

This starts:

```text
Backend API: http://localhost:4000/api
Admin UI:    http://localhost:3000
```

The Vite customer frontend is in a separate project folder. Start it only when you are working on the customer-facing site.

## Backend

Stack: Node.js, Express, TypeScript, Prisma, Neon PostgreSQL, JWT, bcrypt, nodemailer, Zod.

### Run

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

API runs at `http://localhost:4000/api`.

### Key Endpoints

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/applications
GET  /api/applications/me
PATCH /api/applications/me/payment
GET  /api/payments/imb-link
GET  /api/admin/stats
GET  /api/admin/users
GET  /api/admin/applicants
POST /api/admin/draw/run
GET  /api/admin/draw/history
GET  /api/admin/settings
PATCH /api/admin/settings
```

Admin endpoints require `Authorization: Bearer <admin-token>`.

## Admin Dashboard

Stack: Next.js, Tailwind, Framer Motion, Sonner toasts, Lucide icons.

### Run

```bash
cd admin
npm install
copy .env.example .env.local
npm run dev
```

Admin runs at `http://localhost:3000`.

## Single-Server Production Option

For production, the admin dashboard is exported as static files and the Express backend serves it from `/admin`.

```bash
npm run build
npm run start
```

Then use:

```text
API:   http://localhost:4000/api
Admin: http://localhost:4000/admin
```

Seeded admin defaults:

```text
Email: admin@sacredjourney.com
Password: Admin@12345
```

## Sample API Responses

### Register

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx_user_1",
      "name": "Aamir Khan",
      "email": "aamir@example.com",
      "role": "user",
      "createdAt": "2026-05-05T16:45:00.000Z"
    },
    "token": "jwt.token.value"
  }
}
```

### Admin Stats

```json
{
  "success": true,
  "data": {
    "totalUsers": 1280,
    "totalApplicants": 430,
    "paidUsers": 312,
    "selectedUsers": 125,
    "lastDraw": {
      "id": "clx_draw_1",
      "totalUsers": 312,
      "selectedCount": 125,
      "percentage": null,
      "createdAt": "2026-05-05T17:00:00.000Z"
    }
  }
}
```

### Run Lucky Draw

```json
{
  "success": true,
  "data": {
    "id": "clx_draw_2",
    "totalUsers": 10000,
    "selectedCount": 125,
    "percentage": null,
    "createdAt": "2026-05-05T17:20:00.000Z"
  }
}
```

Percentage mode request:

```json
{
  "mode": "percentage",
  "percentage": 1.25
}
```

Fixed mode request:

```json
{
  "mode": "fixed",
  "fixedCount": 125
}
```

## Test Flow

1. Register a user with `POST /api/auth/register`.
2. Login with `POST /api/auth/login` and store the token.
3. Apply for the lucky draw with `POST /api/applications`.
4. Fetch the IMB link from `GET /api/payments/imb-link`.
5. Mark payment paid with `PATCH /api/applications/me/payment` or via the admin callback endpoint.
6. Login as admin at `http://localhost:3000/login`.
7. Open Draw Control and run fixed `125` or percentage `1.25`.
8. Review winners in Lucky Draw Applicants and the latest result in Dashboard.

## Frontend Integration

Use the existing frontend as-is and point form actions to this API.

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sj_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post("/auth/register", payload);
  localStorage.setItem("sj_token", data.data.token);
  return data.data.user;
}

export async function applyForLuckyDraw(phone: string) {
  const { data } = await api.post("/applications", { phone });
  return data.data;
}

export async function openPayment() {
  const { data } = await api.get("/payments/imb-link");
  window.location.href = data.data.url;
}

export async function markPaymentPaid() {
  const { data } = await api.patch("/applications/me/payment");
  return data.data;
}
```

## Lucky Draw Logic

The backend fetches only paid applications, calculates the winner count as either `fixedCount` or `Math.ceil(total * percentage / 100)`, shuffles with Fisher-Yates using `crypto.randomInt`, updates selected winners to `selected`, updates the rest of paid applicants to `not_selected`, and stores a `DrawResult`.

## Security Notes

Passwords are hashed with bcrypt. Password rules require uppercase, lowercase, number, special character, and at least 8 characters. Admin routes use JWT auth plus role checks. API inputs are validated with Zod, and Express uses Helmet, CORS allow-listing, JSON size limits, and rate limiting.
