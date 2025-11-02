# 🧾 Invosmart+ — Multi-Tenant SaaS Invoice & Payment Management Platform

Invosmart+ is a **modern FinTech-grade business finance suite** built for small and medium businesses to automate **invoicing, payment tracking, expense management**, and **financial analytics** — all under one clean dashboard.

It features **multi-tenant architecture**, **role-based access control**, **live analytics**, and **Razorpay-powered subscriptions**, making it a perfect SaaS portfolio project demonstrating advanced backend, automation, and UI skills.

---

## 🚀 Features

### 💼 Core Modules

- **Smart Invoicing:** Create, edit, and send professional invoices with real-time status tracking (Paid, Pending, Overdue).
- **Expense Management:** Add and categorize business expenses with receipt uploads.
- **Customer CRM:** Track client balances, payment history, and outstanding dues.
- **Payment Tracking:** Manage received payments, partial settlements, and link them to invoices.
- **Cashflow & Profit Overview:** Visual analytics for income vs expenses, profit margin, and top customers.

### ⚙️ Automation

- Auto email/WhatsApp payment reminders.
- Scheduled monthly financial summary reports.
- Export data to CSV or PDF with one click.

### 🧠 AI Insights

- Smart summaries: “Your highest-paying customer this month is X.”
- Expense trend detection and business health insights.
- Predictive due tracking and follow-up suggestions.

### 🔐 Role-Based Access

- Admin, Accountant, and Staff roles with fine-grained permissions.
- Activity logging for edits, payments, and logins.

### 💳 Subscription System

- Razorpay integration for subscription tiers (Free / Pro).
- Automated plan enforcement with usage limits.

### 📊 Analytics Dashboard

- Income vs Expense charts
- Top 5 customers by revenue
- Outstanding dues overview
- Expense category breakdown

---

## 🧱 Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| **Frontend**   | Next.js 14 (App Router), TypeScript, TailwindCSS |
| **Backend**    | tRPC, Express-style routes                       |
| **ORM**        | Drizzle ORM (PostgreSQL)                         |
| **Database**   | PostgreSQL                                       |
| **Payments**   | Razorpay API                                     |
| **Auth**       | NextAuth.js (JWT, OAuth ready)                   |
| **Charts**     | Recharts / Chart.js                              |
| **Deployment** | Vercel (frontend), Railway / Render (backend DB) |

---

## 📂 Project Structure

invosmart/
├── app/ # Next.js app router pages
│ ├── dashboard/ # Main dashboard and analytics
│ ├── invoices/ # Invoice CRUD + view + PDF
│ ├── customers/ # Customer management
│ ├── payments/ # Payment records
│ ├── expenses/ # Expense management
│ ├── ai-insights/ # AI-powered insights
│ └── settings/ # Profile, roles, subscription
├── server/
│ ├── trpc/ # tRPC routers (invoice, user, payment)
│ ├── drizzle/ # ORM schema & migrations
│ ├── jobs/ # Scheduled tasks (reminders)
│ └── utils/ # Helper and validation functions
├── public/ # Static assets (logos, icons)
└── README.md

---

## ⚡ Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/invosmart.git
cd invosmart
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000
to view it in your browser.

🧠 Environment Variables

Create a .env.local file and add:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/invosmart
NEXTAUTH_SECRET=your_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

🧰 Database & Migrations

Generate and apply migrations using Drizzle:

```bash
pnpm drizzle:generate
pnpm drizzle:push
```

🧪 Development Notes

Modular structure for scalability.

Fully type-safe end-to-end (Next.js + tRPC + Drizzle).

Role-based access & tenant separation implemented at DB level.

Dynamic charts and reports powered by live database aggregation.

## 🧾 Key Pages Overview

| Page             | Description                                       |
| ---------------- | ------------------------------------------------- |
| **Dashboard**    | Overview of all metrics and activities            |
| **Invoices**     | Create/manage invoices and track payments         |
| **Customers**    | Manage customer data and dues                     |
| **Payments**     | Record payments with mode and reference           |
| **Expenses**     | Track daily and recurring expenses                |
| **Analytics**    | Visualize revenue, expense, and profit trends     |
| **Automation**   | Manage reminders and scheduled reports            |
| **AI Insights**  | AI-powered business performance summaries         |
| **Team / Roles** | Manage access levels and permissions              |
| **Settings**     | Business profile, notifications, and subscription |
