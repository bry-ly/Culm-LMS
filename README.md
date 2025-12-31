# Culm LMS - The Modern Learning Management System

![Project Preview](https://github.com/user-attachments/assets/placeholder) <!-- Replace with actual screenshot when available -->

## 🚀 Overview

**Culm LMS** is a robust, scalable, and modern Learning Management System (SaaS) designed to empower educators and institutions with the tools they need to deliver high-quality digital education. Built with a focus on performance, security, and user experience, it provides a seamless environment for course creation, student management, and secure monetization.

## 🎯 Our Goal

Our mission is to bridge the gap between education and technology by providing a platform that is not only powerful for administrators and teachers but also intuitive and engaging for students. We aim to revolutionize the digital learning experience through a "student-first" design philosophy and a "teacher-empowering" featureset.

## ✨ Key Features

### 🛠️ For Educators & Administrators

- **Robust Course Builder**: Create rich, multi-chapter courses with ease.
- **Dynamic Content Management**: Upload lessons, videos, and manage thumbnails with integrated S3 storage.
- **Role-Based Access Control**: Secure management for Admins, Teachers, and Students.
- **Admin Dashboard**: Comprehensive overview of users, courses, and platform health.
- **Teacher Dashboard**: Specialized tools for managing your own courses and students.

### 🎓 For Students

- **Engaging Learning Experience**: Fluid navigation through courses and lessons.
- **Secure Payments**: Frictionless enrollment via Stripe integration.
- **Progress Tracking**: (Coming Soon) Visualize your learning journey.
- **Responsive Design**: Learn on the go with a mobile-optimized interface.

### 🛡️ Security & Performance

- **Bot Protection**: Layered security with Arcjet integration.
- **Secure Auth**: Modern authentication powered by Better Auth.
- **Optimized Performance**: Built on Next.js 16 for blazing-fast page loads.

## 🛠️ Tech Stack

<div align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,ts,prisma,postgres,stripe" />
</div>

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma](https://www.prisma.io) with PostgreSQL (Hosted on [Neon](https://neon.tech))
- **Authentication**: [Better Auth](https://better-auth.com)
- **Security**: [Arcjet](https://arcjet.com)
- **Payments**: [Stripe](https://stripe.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com) & [Lucide Icons](https://lucide.dev)
- **Rich Text Editing**: [Tiptap](https://tiptap.dev)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (Recommended)
- PostgreSQL database (e.g., Neon.tech)

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
   Create a `.env` file in the root directory and add your credentials (refer to `.env.example` if available).

4. **Initialize the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
lms-saas/
├── app/             # Next.js App Router (Pages, Layouts, Actions)
├── components/      # UI Components (Shadcn/UI, Custom)
├── hooks/           # Custom React Hooks
├── lib/             # Utility functions and shared logic
├── prisma/          # Database schema and migrations
└── public/          # Static assets
```

## 📄 License

This project is [Private/Proprietary]. All rights reserved.

---

Built with ❤️ by the **Culm Team**.
