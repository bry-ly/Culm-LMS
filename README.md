# Culm LMS

The Modern, Scalable Learning Management System for the Next Generation of Education.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-Private-red)

## Overview

Culm LMS is a comprehensive, production-ready Learning Management System designed for a seamless educational experience. It provides a powerful course builder, integrated video hosting, and secure payment processing to enable institutions to launch and manage their digital curriculum efficiently.

## Features

- **Course Builder**: Intuitive interface for creating courses with structured chapters and lessons.
- **Video and File Hosting**: Integrated S3 storage for high-performance video delivery and resource management.
- **Authentication**: Secure identity management using Better Auth with support for Google/GitHub OAuth and email OTP.
- **Payment Processing**: Integrated Stripe payments for course enrollments and subscription management.
- **Admin Dashboard**: Comprehensive management tools with analytics and student monitoring.
- **Progress Tracking**: Detailed tracking of student lesson completion and course advancement.
- **Advanced Security**: Real-time bot protection and rate limiting powered by Arcjet.

## Tech Stack

| Category      | Technology                                   |
| :------------ | :------------------------------------------- |
| Framework     | Next.js 16 (App Router)                      |
| Styling       | Tailwind CSS 4, Radix UI, Framer Motion      |
| Database      | Prisma with PostgreSQL                       |
| Auth          | Better Auth (Google/GitHub OAuth, Email OTP) |
| Payments      | Stripe                                       |
| Security      | Arcjet (Bot protection, Rate limiting)       |
| UI Components | Shadcn UI                                    |

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm package manager
- PostgreSQL database instance

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo/lms-saas.git
   cd lms-saas
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Copy the example environment file and fill in your credentials.

   ```bash
   cp .env.example .env
   ```

4. **Initialize the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

| Script         | Description                                             |
| :------------- | :------------------------------------------------------ |
| `dev`          | Starts the development server                           |
| `build`        | Creates an optimized production build                   |
| `start`        | Starts the production server                            |
| `lint`         | Runs ESLint to find code issues                         |
| `lint:fix`     | Runs ESLint and automatically fixes issues              |
| `format`       | Formats code using Prettier                             |
| `format:check` | Checks if code follows Prettier formatting              |
| `typecheck`    | Runs TypeScript compiler to check for types             |
| `db:generate`  | Generates Prisma client                                 |
| `db:push`      | Synchronizes the database schema with the Prisma schema |
| `db:studio`    | Opens Prisma Studio to view and edit data               |

## Environment Variables

| Variable                            | Description                      |
| :---------------------------------- | :------------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string     |
| `BETTER_AUTH_SECRET`                | Secret key for Better Auth       |
| `BETTER_AUTH_URL`                   | URL for Better Auth backend      |
| `GITHUB_CLIENT_ID`                  | GitHub OAuth client ID           |
| `GITHUB_CLIENT_SECRET`              | GitHub OAuth client secret       |
| `GOOGLE_CLIENT_ID`                  | Google OAuth client ID           |
| `GOOGLE_CLIENT_SECRET`              | Google OAuth client secret       |
| `NEXT_PUBLIC_BETTER_AUTH_URL`       | Public URL for Better Auth       |
| `RESEND_API_KEY`                    | API key for Resend email service |
| `ARCJET_KEY`                        | API key for Arcjet security      |
| `AWS_ACCESS_KEY_ID`                 | AWS access key for S3            |
| `AWS_SECRET_ACCESS_KEY`             | AWS secret access key for S3     |
| `AWS_ENDPOINT_URL_S3`               | S3 endpoint URL                  |
| `AWS_REGION`                        | AWS region for S3                |
| `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` | S3 bucket name for images        |
| `STRIPE_SECRET_KEY`                 | Stripe secret API key            |
| `STRIPE_WEBHOOK_SECRET`             | Stripe webhook signing secret    |

## Project Structure

```text
lms-saas/
├── app/                  # Next.js App Router (Pages, Layouts, Actions)
│   ├── (auth)/           # Authentication routes
│   ├── (public)/         # Publicly accessible pages
│   ├── admin/            # Administrative dashboard and course management
│   ├── api/              # API route handlers
│   ├── dashboard/        # Student dashboard and lesson player
│   └── data/             # Server-side data access layer
├── components/           # Reusable UI components
│   ├── ui/               # Base UI primitives (Shadcn/UI)
│   ├── file-uploader/    # S3 file upload components
│   └── rich-text-editor/ # Tiptap editor implementation
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities and third-party clients
└── prisma/               # Database schema and configuration
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is Private and Proprietary. All rights reserved. Reproduction or distribution of this software is strictly prohibited without prior written consent.
