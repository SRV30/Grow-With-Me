# Grow With Me

> **Grow Your Business. Build Your Brand. Get Noticed.**

Grow With Me is a full-stack creative-agency portfolio and CMS platform for managing portfolio projects, media, services, homepage content and enquiries.

## Features

### Public Website

- Responsive creative-agency website
- Services and featured portfolio
- Portfolio categories and filtering
- Project/case-study pages
- Industries and process sections
- Contact/enquiry form
- WhatsApp and email CTAs
- GSAP, Motion, Lenis and selective Three.js experiences
- Reduced-motion support
- SEO and sitemap generation

### Admin CMS

- Admin authentication
- Portfolio CRUD
- Draft/publish workflow
- Featured and ordering controls
- Image/video uploads
- Cloudinary media library
- Service management
- Homepage content management
- Enquiry management

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Animation | GSAP, Motion, Lenis, Three.js, React Three Fiber |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcryptjs |
| Media | Cloudinary, Multer |
| Security | Helmet, CORS, rate limiting, Zod |
| Deployment | Vercel (separate frontend + backend projects) |

## Project Structure

```text
Grow-With-Me/
├── client/                  # React/Vite frontend
│   ├── public/
│   ├── scripts/
│   ├── src/
│   │   ├── admin/
│   │   ├── animations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── .env.example
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── index.js             # Vercel backend entry point
│   ├── vercel.json          # Vercel backend configuration
│   ├── package.json
│   └── .env.example
│
├── package.json             # Local workspace commands
├── package-lock.json
└── .env.example
```

## Vercel Deployment

Grow With Me uses the same deployment pattern as `samridhi-enterprises`: **two Vercel projects from the same GitHub repository**.

### 1. Backend

Create a Vercel project from this repository.

```text
Root Directory: server
Framework Preset: Other
```

The `server/vercel.json` file configures `server/index.js` as the Node function.

Set these backend environment variables:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your-long-random-secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=Growwithme
```

After deployment, verify:

```text
GET https://your-backend.vercel.app/
GET https://your-backend.vercel.app/api/health
```

### 2. Frontend

Create a second Vercel project using the same repository.

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Set:

```env
VITE_SITE_URL=https://your-frontend.vercel.app
VITE_BACKEND_URL=https://your-backend.vercel.app/api
```

Deploy the frontend.

### 3. CORS

After the frontend URL is known, make sure the backend has:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Then redeploy the backend.

The request flow is:

```text
Browser
   │
   ▼
Vercel Frontend
   │
   │ HTTPS /api/*
   ▼
Vercel Backend
   │
   ├── MongoDB Atlas
   └── Cloudinary
```

## Environment Variables

### Frontend: `client/.env`

```env
VITE_SITE_URL=https://your-frontend.vercel.app
VITE_BACKEND_URL=https://your-backend.vercel.app/api
```

### Backend: `server/.env`

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URL=
JWT_SECRET=
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=Growwithme
```

Never commit real `.env` files or production secrets.

## Local Development

Requirements: Node.js 22+, npm, MongoDB/Atlas and Cloudinary.

From the repository root:

```bash
npm install
npm run dev
```

This starts:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

The Vite development server proxies `/api/*` to the local backend.

You can also run each application separately:

```bash
cd server
npm install
npm run dev
```

and:

```bash
cd client
npm install
npm run dev
```

## API

```text
GET  /api/health
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/projects
GET  /api/projects/:slug
GET  /api/services
GET  /api/homepage
POST /api/enquiries
```

Admin endpoints are under `/api/admin/*` and require authentication.

## Media

Uploaded images and videos are stored in Cloudinary. MongoDB stores their metadata and delivery URLs. The Vercel filesystem is not used for persistent uploads.

## SEO

The frontend build runs `client/scripts/generate-seo.mjs` after Vite finishes. It generates `sitemap.xml` and `robots.txt`, and adds published project routes when the backend URL is available.

The HTML uses an absolute placeholder canonical URL so Vite does not interpret `/` as a local directory during the production build.

## Security

- JWT authentication
- HTTP-only authentication cookie
- Secure/SameSite cookie configuration in production
- Password hashing
- Zod validation
- Helmet security headers
- Restricted CORS
- Request rate limiting
- Upload type/size validation
- Centralized error handling
- Environment-based secrets

## Status

The repository is structured for separate Vercel frontend/backend deployment while retaining the full Grow With Me application features.

## License

This project is proprietary to Grow With Me unless otherwise stated. Do not reuse client assets, branding, media or private business content without permission.
