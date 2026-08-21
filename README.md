# Grow With Me

> Grow Your Business. Build Your Brand. Get Noticed.

A premium, full-stack creative agency portfolio and content management platform for **Grow With Me**, a digital creative service company helping businesses build a professional online presence since 2020.

The project combines a highly animated public-facing portfolio with a secure admin CMS so the business owner can manage portfolio projects, images, videos, services, homepage content and enquiries without changing source code.

## Project Goals

- Build a premium creative-agency portfolio experience.
- Showcase posters, reels, advertisements, social media creatives and websites.
- Provide advanced CSS, GSAP and 3D interactions without sacrificing usability.
- Provide a secure admin dashboard for content management.
- Allow non-technical users to upload and replace images and videos.
- Store media through a dedicated cloud media service rather than Git.
- Keep the architecture scalable, maintainable and production-ready.
- Prioritize responsive design, accessibility, SEO and performance.

## Features

### Public Website

- Premium responsive agency website
- Hero section with interactive creative visuals
- Services showcase
- Featured portfolio
- Portfolio categories and filtering
- Project/case-study pages
- Industries section
- Animated workflow/process section
- About section
- Contact and enquiry form
- WhatsApp and email CTAs
- Advanced scroll animations
- Magnetic interactions and micro-interactions
- Custom cursor interactions
- Selective 3D experiences
- Smooth scrolling
- Responsive/mobile-first behavior
- Reduced-motion support

### Admin CMS

- Secure admin authentication
- Dashboard overview
- Portfolio CRUD
- Project drafts and publishing
- Featured-project control
- Project ordering/reordering
- Image uploads
- Video uploads
- Media library
- Service management
- Industry management
- Homepage content management
- Contact/enquiry management
- Site settings
- Preview-before-publish workflow

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- GSAP
- GSAP React
- Motion
- Lenis
- Three.js
- React Three Fiber
- Drei
- React Router
- Lucide React
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT-based authentication
- Password hashing
- Cloudinary
- Multer
- Helmet
- CORS
- Rate limiting
- Zod validation

## Architecture

```text
Grow-With-Me/
│
├── client/                         # React frontend + admin application
│   ├── public/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── videos/
│   │   └── models/
│   │
│   └── src/
│       ├── admin/                  # Admin dashboard and CMS UI
│       ├── animations/             # GSAP and motion orchestration
│       ├── assets/                 # Frontend assets
│       ├── components/             # Reusable UI components
│       ├── data/                   # Static/default data
│       ├── hooks/                  # Reusable React hooks
│       ├── lib/                    # Libraries and shared utilities
│       ├── pages/                  # Public pages
│       ├── services/               # API clients/services
│       ├── styles/                 # Global styling and design system
│       ├── App.jsx
│       └── main.jsx
│
├── server/                         # Node.js + Express API
│   └── src/
│       ├── config/                 # Database, Cloudinary and environment config
│       ├── controllers/            # Request/business controllers
│       ├── middleware/             # Auth, upload, validation, errors, etc.
│       ├── models/                 # Mongoose models
│       ├── routes/                 # REST API routes
│       ├── services/               # External/internal services
│       ├── utils/                  # Server utilities
│       ├── app.js
│       └── server.js
│
├── .env.example                   # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Core Content Model

The CMS is designed around manageable content entities such as:

- Admin users
- Portfolio projects
- Media assets
- Services
- Industries
- Homepage content
- Testimonials
- Contact messages
- Site settings

A portfolio project can contain a title, slug, description, client, category, year, cover image, multiple images, videos, services, featured status, publication status and display order.

## Media Management

Images and videos are intended to be stored using **Cloudinary** rather than committed to the repository. The application stores the relevant media metadata and delivery URLs in MongoDB.

This allows the owner to:

1. Upload new media.
2. Attach media to projects.
3. Replace existing media.
4. Organize portfolio content.
5. Publish changes without redeploying the frontend for every content update.

## Environment Variables

Copy the example environment file before local development:

```bash
cp .env.example .env
```

The project uses environment variables for API configuration, MongoDB, authentication and Cloudinary credentials.

**Never commit `.env` or production secrets.**

## Local Development

### Requirements

- Node.js LTS
- npm
- MongoDB / MongoDB Atlas account
- Cloudinary account for media management

### Install dependencies

From the repository root:

```bash
npm run install:all
```

### Configure environment

Create the required environment files from `.env.example` and provide local credentials.

### Start development servers

```bash
npm run dev
```

The frontend and backend can also be started independently from their respective directories when needed.

## Development Philosophy

### Animation

Animation is treated as part of the design system rather than decoration.

- **GSAP + ScrollTrigger** for major scroll-driven sequences and cinematic timelines.
- **GSAP Flip** for portfolio layout/filter transitions.
- **Motion** for lightweight React UI interactions.
- **CSS 3D transforms** for performant card and image depth effects.
- **Three.js / React Three Fiber** only where actual 3D adds meaningful visual value.
- **Lenis** for smooth scrolling.

Three.js will be used selectively so the site remains performant on mobile and lower-powered devices.

### Performance

The project will prioritize:

- Lazy loading of heavy 3D features
- Responsive image delivery
- Modern image formats
- Optimized video delivery
- Code splitting
- Reduced-motion support
- Minimal unnecessary JavaScript
- Good Core Web Vitals

## Security

The backend is designed to include:

- HTTP-only authentication cookies where applicable
- Password hashing
- JWT authentication
- Protected admin routes
- Input validation
- File type and size validation
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

**Initial architecture and repository setup.**

The project will be developed incrementally, starting with the full-stack foundation and CMS, followed by the public visual experience, advanced animation, 3D interactions, security, performance optimization and deployment.

## License

This project is proprietary to Grow With Me unless otherwise stated. Do not reuse client assets, branding, media or private business content without permission.
