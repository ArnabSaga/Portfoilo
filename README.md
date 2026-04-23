# ArnabSaga Portfolio
### A premium, high-performance digital experience built with Next.js 16 and GSAP.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

[**Live Demo**](https://arnabsaga.vercel.app/) • [**Documentation**](#-project-architecture--workflow) • [**Report Bug**](https://github.com/ArnabSaga/Portfoilo/issues)

</div>

---

## 🖼️ Project Preview

![Portfolio Hero Banner](./public/preview.png)
> *A glimpse into the fluid, motion-rich interface of ArnabSaga Portfolio.*

<div align="center">
  <img src="./public/dashboard-preview.png" width="48%" alt="Projects Showcase" />
  <img src="./public/mobile-preview.png" width="48%" alt="Mobile Responsive View" />
</div>

---

## 📌 Project Overview

**ArnabSaga Portfolio** is a production-grade, highly polished personal brand platform designed to showcase engineering excellence and aesthetic precision. It transcends the typical "portfolio" mold by implementing advanced motion orchestration, high-performance rendering, and a boutique UI/UX.

This project solves the challenge of presenting complex technical skills through a medium that is as impressive as the work it contains. It is built for **recruiters, technical partners, and collaborators** who value attention to detail, performance, and modern web standards.

**What makes it technically interesting?**
- **Motion Orchestration:** Seamlessly combining GSAP for scroll-driven narratives and Framer Motion for micro-interactions.
- **Performance First:** Optimized LCP (Largest Contentful Paint) targets and zero-layout-shift design.
- **Modern Stack:** Early adoption of Next.js 16 and React 19 features including Server Components and advanced hooks.

---

## 💎 Core Value / Why This Project Matters

In an era of generic templates, this project stands as a testament to **bespoke engineering**. It represents the intersection of high-end design and robust architecture.

1. **Engineering Quality:** Every component is built with a focus on stability, reusability, and clean state management.
2. **Visual Narrative:** The use of `GSAP ScrollTrigger` and `Lenis` smooth scrolling creates a cinematic flow that guides the user through the professional journey.
3. **Accessibility & Performance:** Despite heavy animations, the site maintains high Lighthouse scores, respects "Reduced Motion" settings, and ensures keyboard navigability.

---

## 🛠️ Tech Stack

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | Leveraged for App Router, SSR, and zero-config deployment. |
| **UI Library** | **React 19** | Utilizing latest concurrency features for fluid UI updates. |
| **Core Animation** | **GSAP** | The industry standard for complex, scroll-linked interactive storytelling. |
| **Micro-Interactions** | **Framer Motion** | Used for layout transitions and subtle UI feedback loops. |
| **Smooth Scrolling** | **Lenis** | Standardizing the scrolling experience across all browsers and devices. |
| **Styling** | **Tailwind CSS v4** | Next-gen utility-first styling with high-performance CSS processing. |
| **Language** | **TypeScript** | Ensuring type-safety and developer productivity at scale. |

---

## 🏗️ Project Architecture & Workflow

The system follows a **Decoupled Frontend / Serverless Backend** architecture, optimized for immediate hydration and lightning-fast interactions.

### Request Lifecycle
1. **Client Layer:** User interactions are captured by React 19 components.
2. **Motion Controller:** `gsap.context()` ensures all animations are properly scoped and cleaned up during navigation.
3. **API Logic:** Contact forms and dynamic data fetching are handled via Next.js Route Handlers.
4. **Data Persistence:** (Planned) Integration with PostgreSQL/Supabase for analytics and lead management.

```mermaid
graph TD
    A[User Client] -->|Scroll/Click| B[Motion Orchestrator - GSAP]
    B -->|Interactive State| C[React 19 Hooks]
    C -->|API Request| D[Next.js Route Handlers]
    D -->|Persistence| E[App Database]
    E -->|Success/Error| C
    C -->|Feedback| A
```

---

## 🔌 API Endpoints & Data Flow

While primarily a frontend showcase, the project implements structured data flow for interactive modules like the **Contact System**.

### Communication APIs

| Method | Endpoint | Group | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Contact Systems | Submits user inquiries via SES or Resend. |
| `GET` | `/api/projects` | Content Delivery | Retrieves dynamically updated project metadata. |
| `GET` | `/api/analytics` | Tracking | (Planned) Custom view tracking and engagement metrics. |

**Data Flow Sequence:**
- **Capture:** `Contact.tsx` captures user data via controlled React state.
- **Validate:** Inputs are sanitized on the client and re-validated on the server.
- **Transmit:** Next.js Server Actions or Route Handlers process the payload.
- **Feedback:** Fluid UI states (`idle` → `submitting` → `success`) provide instant user gratification.

---

## ✨ Key Features

- **🚀 Dynamic Tagline Rotation:** A sophisticated word-reveal animation in the Hero section that cycles through brand messages.
- **🌀 Advanced Scroll Orchestration:** Parallax backgrounds and staggered reveals powered by GSAP ScrollTrigger.
- **✨ Smooth Motion Architecture:** Integrated Lenis scrolling for a unified, high-end feel across desktop and mobile.
- **📱 Responsive Excellence:** A fluid design system that adapts seamlessly from ultra-wide monitors to mobile devices.
- **🌑 Dark Mode Aesthetic:** A curated, low-fatigue color palette designed for premium professional environments.

---

## 📂 Folder Structure

```bash
src/
 ┣ app/            # Next.js App Router (Layouts, Pages, APIs)
 ┣ components/     # Atomic UI components and feature-specific sections
 ┣ lib/            # Shared configurations (GSAP setup, motion tokens)
 ┣ hooks/          # Custom React hooks (useMousePosition, useScrollDirection)
 ┣ services/       # External API integrations (Contact form, Email)
 ┣ types/          # Global TypeScript definitions
 ┗ utils/          # Helper functions (CN, formatting, math)
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js 20+ 
- pnpm (recommended) or npm

### Setup Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ArnabSaga/Portfoilo.git
   cd Portfoilo
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root:
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   RESEND_API_KEY=your_key_here
   ```

4. **Run Development Server:**
   ```bash
   pnpm dev
   ```

---

## 🔑 Environment Variables

| Variable | Purpose | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata and absolute links | `https://arnabsaga.com` |
| `RESEND_API_KEY` | API key for the contact form service | `re_123456789` |
| `DATABASE_URL` | Connection string for database interactions | `postgres://user:pass@host` |

---

<div align="center">

Built with 🖤 by [ArnabSaga](https://github.com/ArnabSaga)

</div>
