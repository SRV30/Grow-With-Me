# Grow With Me

> **Grow Your Business. Build Your Brand. Get Noticed.**

A premium full-stack creative-agency portfolio and content management platform for **Grow With Me**, a digital creative service company helping businesses build a professional online presence since 2020.

The application combines an animated React portfolio with a secure CMS so the business owner can manage portfolio projects, images, videos, services, homepage content and enquiries without changing source code.

## Goals

- Premium creative-agency portfolio experience.
- Showcase posters, reels, advertisements, social media creatives and websites.
- Advanced CSS, GSAP and selective 3D interactions.
- Secure admin CMS for non-technical content management.
- Cloud-based image/video management through Cloudinary.
- MongoDB-backed content and media metadata.
- Responsive, accessible, SEO-friendly and performance-conscious implementation.
- Deploy the complete application from this repository on Vercel.

## Features

### Public Website

- Premium responsive landing page
- Interactive hero visuals
- Services showcase
- Featured portfolio
- Portfolio categories and filtering
- Project/case-study pages
- Industries section
- Animated process section
- About section
- Contact/enquiry form
- WhatsApp and email CTAs
- Advanced scroll animation
- Magnetic interactions and micro-interactions
- Custom cursor interactions
- Selective 3D experiences
- Smooth scrolling
- Reduced-motion support

### Admin CMS

- Secure admin authentication
- Dashboard
- Portfolio CRUD
- Draft/preview/publish workflow
- Featured-project control
- Project ordering
- Image uploads
- Video uploads
- Media library
- Service management
- Industry management
- Homepage content management
- Contact/enquiry management
- Site settings

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- GSAP + ScrollTrigger + Flip
- `@gsap/react`
- Motion
- Lenis
- Three.js
- React Three Fiber
- Drei
- React Router
- Lucide React
- Axios
- React Hook Form
- Zod

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cloudinary
- Multer
- Helmet
- CORS
- Express Rate Limit
- Cookie Parser
- Zod

## Vercel Architecture

The repository is intentionally structured as an **npm workspace monorepo** so Vercel can build the frontend and serve the Express API from the same deployment.

```text
                         VERCEL
                           │
             ┌─────────────┴─────────────┐
             │                           │
        React/Vite                    API Function
       client/dist                    /api/*
             │                           │
             │                    server/src/app.js
             │                           │
             └─────────────┬─────────────┘
                           │
                     MongoDB Atlas
                           │
                       Cloudinary
```

### Repository structure

```text
Grow-With-Me/
│
├── api/
│   └── index.js                 # Vercel serverless entry point
│
├── client/
│   ├── public/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── videos/
│   │   └── models/
│   │
│   └── src/
│       ├── admin/               # Admin dashboard and CMS UI
│       ├── animations/          # GSAP/motion orchestration
│       ├── assets/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── services/            # API clients
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js               # Express application
│       └── server.js            # Local development server
│
├── .env.example
├── .gitignore
├── package.json                 # npm workspace root
└── vercel.json                  # Vercel build/routing configuration
```

## Vercel Deployment

The project is configured so the **repository root** can be imported directly into Vercel.

### Vercel project settings

Use:

```text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: client/dist
Install Command: npm install
```

`vercel.json` already contains the build/output configuration and SPA fallback.

The `/api/*` endpoints are handled by `api/index.js`, which exports the Express application from `server/src/app.js`.

### Environment variables

Configure these in the Vercel project settings:

```text
VITE_API_URL=/api
NODE_ENV=production
CLIENT_URL=https://your-domain.com
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Do **not** commit production secrets.

## Local Development

### Requirements

- Node.js 22+
- npm
- MongoDB / MongoDB Atlas
- Cloudinary account

### Install everything

From the repository root:

```bash
npm install
```

The root package uses npm workspaces for `client` and `server`, so one install handles all dependencies.

### Environment

```bash
cp .env.example .env
```

Fill in the MongoDB, JWT and Cloudinary values.

### Start both applications

```bash
npm run dev
```

This starts:

```text
Frontend → http://localhost:5173
API      → http://localhost:5000
```

The Vite development server proxies `/api/*` requests to the local Express server.

### Build frontend

```bash
npm run build
```

Output:

```text
client/dist/
```

### Local production API

```bash
npm run start
```

## API

The first health endpoint is:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "grow-with-me-api"
}
```

Future CMS endpoints will live under `/api/*`.

## CMS Content Model

Planned managed entities:

- Admin users
- Portfolio projects
- Media assets
- Services
- Industries
- Homepage content
- Testimonials
- Contact messages
- Site settings

A portfolio project can contain title, slug, description, client, category, year, cover image, multiple images, videos, services, featured status, publication status and display order.

## Media Management

Images and videos should be stored in **Cloudinary**, not in Git or the Vercel filesystem. MongoDB stores the media metadata and delivery URLs.

This allows the owner to:

1. Upload new media.
2. Attach media to projects.
3. Replace media.
4. Organize the portfolio.
5. Publish content without editing source code.

## Animation Strategy

Animation is treated as part of the design system.

- **GSAP + ScrollTrigger** — major scroll-driven sequences.
- **GSAP Flip** — portfolio filtering/layout transitions.
- **Motion** — lightweight React UI interactions.
- **CSS 3D transforms** — performant depth and tilt effects.
- **Three.js / React Three Fiber** — selected true 3D experiences.
- **Lenis** — smooth scrolling.

Three.js will be lazy-loaded and used selectively to protect mobile performance.

## Performance

The project prioritizes:

- Lazy-loaded 3D
- Responsive image delivery
- AVIF/WebP where appropriate
- Optimized video delivery
- Code splitting
- Reduced-motion support
- Minimal unnecessary JavaScript
- Good Core Web Vitals
- Mobile performance

## Security

The backend will include:

- Protected admin routes
- JWT authentication
- Secure password hashing
- HTTP-only cookies where appropriate
- Input validation
- File type/size validation
- CORS restrictions
- Helmet security headers
- Rate limiting
- Centralized error handling
- Environment-based secrets

## Brand

**Grow With Me**

Creative digital solutions since 2020.

### Services

- Social Media Management
- Reels & Video Editing
- Graphic Designing
- Social Media Advertising
- Business Promotion
- Website Design

### Contact

- Phone: `8434305404`
- Email: `growithmeayush@gmail.com`

## Project Status

**Foundation configured for Vercel full-stack deployment.**

Next development stages:

1. Backend database configuration
2. Authentication
3. CMS APIs
4. Media upload system
5. Admin dashboard
6. Public website implementation
7. Advanced animation
8. 3D experiences
9. Security hardening
10. Performance/SEO optimization
11. Production deployment

## License

This project is proprietary to Grow With Me unless otherwise stated. Do not reuse client assets, branding, media or private business content without permission.
