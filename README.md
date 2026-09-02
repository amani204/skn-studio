<div align="center">

# SKN Studio

### Full-Stack E-Commerce Platform for Guest-Only Skincare Retail

A production-ready platform built for a real client — guest checkout with Cash on Delivery,
wilaya-based shipping, and WhatsApp ordering, purpose-built for the Algerian market.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-4ade80?style=for-the-badge)](https://skn-studio-project.vercel.app/)<br>
![Performance](https://img.shields.io/badge/Performance-100%2F100-brightgreen?style=flat-square)
![Accessibility](https://img.shields.io/badge/Accessibility-90%2F100-brightgreen?style=flat-square)
![Best Practices](https://img.shields.io/badge/Best%20Practices-100%2F100-brightgreen?style=flat-square)
![SEO](https://img.shields.io/badge/SEO-100%2F100-brightgreen?style=flat-square)

</div>

---

## Overview

SKN Studio is a guest-only e-commerce storefront — there are no customer accounts anywhere in the system. Every purchase is a Cash on Delivery order, placed either through standard checkout or via a pre-filled WhatsApp message, a pattern that's very common and expected for e-commerce in Algeria. The admin manages the entire catalog, order pipeline, and shipping rates from a fully protected dashboard — the only authenticated role in the whole platform.

- **Customers** browse the catalog, add to cart, and check out as a guest — no signup, no login
- **Admin** manages products, stock, orders, delivery pricing per wilaya, and review moderation

---
---

## 📸 Admin Dashboard Screenshots

### Login Page
![Admin Login](https://user-images.githubusercontent.com/your-username/xxxxx/admin-dashboard.png)

### Dashboard Overview
![Admin Dashboard](https://user-images.githubusercontent.com/your-username/xxxxx/admin-dashboard.png)

### Product Management
![Product Management](https://user-images.githubusercontent.com/your-username/xxxxx/admin-products.png)

### Reviews Management
![Reviews Management](https://user-images.githubusercontent.com/your-username/xxxxx/admin-orders.png)

### Settings Management
![Settings Management](https://user-images.githubusercontent.com/your-username/xxxxx/admin-orders.png)

---
## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- React Context (cart state)
- lucide-react (icons)
- Zod (client + server validation)

</td>
<td valign="top" width="50%">

**Backend**
- Next.js API routes (Node runtime)
- Prisma ORM + PostgreSQL (Supabase)
- NextAuth.js (admin-only role auth)
- bcrypt (password hashing)
- Cloudinary / Vercel Blob (image uploads)

</td>
</tr>
</table>

---

## Features

### Customer Storefront
- Responsive homepage — hero, featured products, categories
- Product catalog with search and filters (category, price range)
- Product detail pages — image gallery, description, reviews, related products
- Client-side shopping cart, no login required
- Guest checkout — name, phone, wilaya, delivery method
- Cash on Delivery only, no payment gateway
- Automatic shipping cost calculation by wilaya (home delivery vs. desk pickup)
- "Order via WhatsApp" — pre-filled `wa.me` deep link as an alternative to standard checkout
- Site-wide floating WhatsApp contact widget
- Product reviews, open to any visitor, held for admin approval before going public
- Fully responsive, single language (French)

### Admin Dashboard
- Protected admin login — the only authentication in this system, server-verified on every request
- Product management — create/edit/delete, multi-image gallery, pricing, stock, featured flag
- Featured products capped at 4, enforced server-side, not just in the UI
- Automatic stock decrement on order — prevents overselling
- Order management with status pipeline (Pending → Processing → Shipped → Delivered / Cancelled)
- Customer/order list, derived from orders since there are no customer accounts
- Delivery rate management — add/edit home and desk pickup pricing per wilaya
- Review moderation queue

### Technical
- Server-side price, stock, and shipping recomputation at checkout — client-submitted values are never trusted or persisted
- Prisma transaction wraps stock decrement + order creation, preventing overselling under concurrent checkouts
- Order line items snapshot product name and price at time of purchase, so later catalog edits never rewrite order history
- Prisma client singleton to prevent connection exhaustion on Vercel's serverless functions
- Zod schemas shared between client-side pre-submit checks and server-side API validation
- Business rules (max featured products, `oldPrice` must exceed `price`) enforced in the service layer, not just the form — so they can't be bypassed via direct API calls

---

## Project Structure

```
sknstudio/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Homepage
│   │   ├── produits/
│   │   │   ├── page.tsx                      # Catalog (search + filters)
│   │   │   └── [slug]/page.tsx               # Product detail page
│   │   ├── categorie/[slug]/page.tsx         # Products by category
│   │   ├── panier/page.tsx                   # Cart
│   │   ├── commande/
│   │   │   ├── page.tsx                      # Checkout
│   │   │   └── confirmation/[orderNumber]/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── products/                     # Product management
│   │   │   ├── orders/                       # Order management
│   │   │   └── delivery/                     # Wilaya rate management
│   │   └── api/
│   │       ├── products/route.ts             # GET catalog (search/filter)
│   │       ├── products/[slug]/route.ts      # GET single product
│   │       ├── categories/route.ts           # GET categories
│   │       ├── wilayas/route.ts              # GET delivery rates
│   │       ├── checkout/route.ts             # POST create order (server-computed totals)
│   │       └── admin/
│   │           ├── products/new/route.ts     # POST create product
│   │           └── products/[id]/route.ts    # PUT/DELETE product
│   ├── components/
│   │   └── storefront/                       # Product cards, cart, reviews
│   ├── context/
│   │   └── CartContext.tsx                   # Client-side cart state
│   └── lib/
│       ├── prisma.ts                         # Prisma client singleton
│       ├── products.ts                       # Storefront data access (published-only)
│       ├── admin/
│       │   ├── products.ts                   # Admin product CRUD, business rules
│       │   └── upload.ts                     # Vercel Blob image upload
│       ├── validation/
│       │   └── product.ts                    # Zod schemas (create/update product)
│       └── errors.ts                         # AppError class
│
└── prisma/
    └── schema.prisma
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (PostgreSQL, free tier is fine)
- Cloudinary and/or Vercel Blob account for image uploads

### 1. Clone

```bash
git clone https://github.com/amani204/sknstudio.git
cd sknstudio
```

### 2. Install

```bash
npm install
```

### 3. Environment variables

Create `.env`:

```env
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
BLOB_READ_WRITE_TOKEN=""
```

### 4. Database

```bash
npx prisma migrate dev --name init
npx prisma studio      # optional — inspect the DB visually
```

### 5. Run

```bash
npm run dev   # runs on http://localhost:3000
```

---

## Deployment

Hosted on **Vercel**, database on **Supabase**.

Key steps:
1. Push to GitHub, import the repo into Vercel
2. Set every `.env` value in **Vercel → Project → Settings → Environment Variables** — local `.env` alone is not enough
3. Use Supabase's **pooled connection string** (port 6543, `pgbouncer=true`) for `DATABASE_URL`, and the **direct connection** (port 5432) for `DIRECT_URL`
4. Run `npx prisma migrate deploy` against production — never `db push` on prod
5. Confirm security headers (CSP, X-Frame-Options, X-Content-Type-Options) are set via `next.config.js`

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Client-submitted price/total tampering | All totals recomputed server-side inside a Prisma transaction at checkout — client values never persisted |
| Overselling under concurrent checkouts | Stock decrement and order creation wrapped in the same transaction |
| Product edits rewriting old order history | Order line items snapshot `productName` and `price` at time of purchase |
| Serverless DB connection exhaustion on Vercel | Prisma client singleton, pooled connection string via Supabase PgBouncer |
| Supabase free tier auto-pause after 7 days idle | Documented restore flow; considered for a lightweight keep-alive ping |
| Silent 400s from admin form validation | Mirrored Zod business rules (description length, `oldPrice` > `price`) as live client-side hints |

---

## Known Limitations

- Order numbers use a random 6-digit suffix — not collision-proof at high volume; a DB sequence or UUID would remove the (small) risk
- No direct courier API integration (e.g. Yalidine/NOEST) — shipping is calculated from an internal wilaya pricing table only, not synced automatically
- Supabase free tier database pauses after 7 days of inactivity, causing a brief outage on the next visit until restored
- No customer accounts by design — order lookup/tracking for a guest customer would require a phone-number-based lookup flow, not yet built

---

## Author

*Amani*

[![GitHub](https://img.shields.io/badge/GitHub-amani204-181717?style=flat-square&logo=github)](https://github.com/amani204)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-amani-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/amani-a-810721390/)
