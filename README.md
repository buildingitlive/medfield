# MedField — Progressive Web App (Field-to-Pharmacy System)

MedField PWA provides seamless ordering, cold-chain delivery tracking, and prescription management for verified pharmaceutical and botanical formulations.

## Development Setup

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

## Features & UI Architecture
- **PWA Installation Modal (`InstallAppPopup.tsx`)**: Prompts users to install the PWA on Android/Chrome or iOS Safari with step-by-step instructions.
- **`/` (Home)**: Asymmetric Bento CTAs, mobile-first address selector, delivery banner, reorder carousel, and trust strip.
- **`/search`**: Catalog directory with live search, price sorting, and inline quantity stepper (`- 1 +`).
- **`/medicine/:id`**: Product formulation detail with composition specs and Order Now CTA.
- **`/login` & `/otp`**: Mobile number OTP login flow with trust badges.
- **`/place-order` & `/prescriptions`**: 3-step prescription upload and medicine request flow, along with a dedicated Prescription History tab for instant reordering.
- **`/orders` & `/orders/:id`**: Ongoing vs Past order tabs and real-time cold-chain courier tracking.
- **`/profile`, `/addresses`, `/settings`, `/prescription-upload`**: Full clinical member management suite.

## Supabase & Live Backend Integration
- **Auth**: Fully integrated Supabase OTP / Magic Link flow via `AuthContext`.
- **Database**: 9 tables with Row-Level Security (RLS) policies defined in `supabase/schema.sql`.
- **India Catalog Seed**: 15 top Indian clinical medicines (Dolo 650, Azithral, Pan-D, Shelcal, Augmentin, etc.) seeded via `supabase/seed.sql`.
- **Hooks**: Data-fetching wrapped in robust custom React hooks (`useProducts`, `usePrescriptions`, `useAddresses`, `useOrders`, `useFavorites`) with optimistic updates and caching.
- **Storage**: Prescription image upload directly to Supabase Storage bucket (`prescriptions`).

## Localization & Production Deployment
- **India Localization**: All prices formatted in Indian Rupees (`₹`), with PIN Code structured address verification and India-friendly COD & QR payment support.
- **Dynamic Theme System**: CSS custom properties for semantic colors (`on-surface-variant`, `outline`, etc.) ensuring crisp contrast across Light and Dark themes.
- **Production Deployment**: Live and deployed on Vercel.
