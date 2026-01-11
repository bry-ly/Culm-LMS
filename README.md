# Culm LMS - The Modern Learning Management System

![Project Preview](https://github.com/user-attachments/assets/placeholder)

## 🚀 Overview

**Culm LMS** is a robust, scalable, and modern Learning Management System (SaaS) built with Next.js 16 (App Router), Prisma/PostgreSQL, Better Auth, Stripe payments, and S3 storage. It is designed to empower educators and institutions with the tools they need to deliver high-quality digital education.

## 🎯 Our Goal

Our mission is to bridge the gap between education and technology by providing a platform that is not only powerful for administrators and teachers but also intuitive and engaging for students.

## ✨ Key Features

- **Robust Course Builder**: Create rich, multi-chapter courses with ease.
- **Dynamic Content Management**: Upload lessons, videos, and manage thumbnails with integrated S3 storage.
- **Secure Auth**: Modern authentication powered by Better Auth with Google/GitHub OAuth + email OTP.
- **Frictionless Payments**: Secure enrollment via Stripe integration.
- **Bot Protection**: Layered security with Arcjet integration.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma](https://www.prisma.io) with PostgreSQL
- **Authentication**: [Better Auth](https://better-auth.com)
- **Security**: [Arcjet](https://arcjet.com)
- **Payments**: [Stripe](https://stripe.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com), [Lucide Icons](https://lucide.dev), & [Shadcn UI](https://ui.shadcn.com/)
- **Rich Text Editing**: [Tiptap](https://tiptap.dev)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (Recommended)
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bry-ly/Fullbright-College-LMS.git
   cd lms-saas
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory based on `.env.example`.

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

- `app/`: Next.js App Router (Pages, Layouts, Actions, Data fetching)
- `components/`: UI Components (Shadcn/UI, Radix, Tiptap, S3 Uploader)
- `hooks/`: Custom React Hooks
- `lib/`: Utility functions, clients (Prisma, Stripe, S3, Auth), and config
- `prisma/`: Database schema and migrations

## 📄 License

This project is [Private/Proprietary]. All rights reserved.

---

Built with ❤️ by the **Culm Team**.
