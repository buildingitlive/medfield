# MedField PWA — Project Context & Status

## Project Overview
MedField is a progressive web application (PWA) delivering verified clinical-grade botanicals and pharmaceuticals directly from certified field labs to patients with cold-chain tracking.

## Current Project Phase
- **Frontend / PWA UI Phase**: **100% COMPLETE**
- All 16 screens implemented in React 18 + TypeScript + Vanilla Tailwind CSS matching `stitch_medfield_medicine_pwa_prompt_pack`.
- Built and verified via `npm run build` (`tsc -b && vite build`) with zero errors.
- **PWA Native Install Modal (`InstallAppPopup.tsx`)**: Added intelligent install popup detecting iOS Safari instructions and Android/Chrome `beforeinstallprompt` installation workflows.
- **Supabase Backend Integration Phase**: **100% COMPLETE & LIVE**
  - Live PostgreSQL database mapped with RLS policies in `supabase/schema.sql` and seeded with 15 top Indian medicines via `supabase/seed.sql`.
  - Authentication powered by `AuthContext.tsx` with Supabase Auth.
  - Data hooks implemented for Prescriptions (`usePrescriptions`), Addresses (`useAddresses`), Orders (`useOrders`), Favorites (`useFavorites`), and Products (`useProducts`).
  - Prescription upload integrated with Supabase Storage buckets (`prescriptions`).
  - Offline resilience built in via `localStorage` caching patterns.
- **India Localization & Polish Phase**: **100% COMPLETE**
  - All pricing across all screens converted to Indian Rupees (`₹`).
  - Address forms localized to Indian `PIN Code`.
  - Dynamic dark mode CSS custom properties configured in `index.css` for perfect contrast.
  - Deployed to production on Vercel.

## Next Phase / Ongoing Maintenance
- **Post-Launch Enhancements**:
  - **Geofencing & Smart Dispatch**: Integrate Geolocation API to capture precise coordinates during checkout and map them against partner locations to auto-tag regional zones (e.g., North, South) for optimized delivery routing.
  - **Dynamic Medicine Dataset Growth**: When the admin confirms an order and manually enters medicine names, companies, and prices, save these unique entries to a database table to organically grow the medicine dataset. In the future, this will allow for an autofill/dropdown experience when typing medicine names in the admin panel. If an admin enters a new MRP for an existing autofilled medicine, update that record's MRP in the database automatically.
  - Monitoring live Supabase analytics & Vercel deployment metrics.
  - Ongoing PWA manifest optimization for app store submissions.

## Recent Updates
- **Prescription-First Ordering Flow**: The old cart-based flow has been completely replaced with a 3-step prescription upload and medicine request flow. The old 254k-row medicine catalog was deleted in favor of a self-growing `admin_products` table built organically via the admin's Confirm Order panel.
- **Pricing & Discounts**: Implemented accurate MRP display pulling from the database (`product.mrp`), and added a visual-only delivery fee discount (₹50 crossed out to FREE) in the PWA for marketing, while keeping actual `delivery_fee` cleanly as 0 in the backend.
- **Admin Layout**: Locked global app widths to prevent mobile horizontal scroll overflow (`overflow-x: hidden`).
- **Revenue Tracking**: Updated admin Dashboard revenue calculation to use `updated_at` to correctly attribute revenue to the day orders are delivered.
- **Form Fixes**: Ensured `image_url` handles empty string inputs safely when inserting new products to avoid NOT NULL constraint violations.

## Production Checklist
- [x] Ensure PWA `manifest.json` and service workers are correctly caching assets.
- [x] Verify all RLS policies (Products, Orders, Profiles, Partners) are correctly applied in the live Supabase SQL editor.
- [x] Ensure the `updated_at` column and its auto-update trigger function are active on the `orders` table.
- [x] Run full end-to-end user flows (Login -> Upload Prescription -> Request Meds -> Place Order -> Admin Confirm).
- [x] Validate cross-browser responsive design (Desktop, Tablet, Mobile) without horizontal overflows.
- [x] Test production build step (`npm run build`) runs without TypeScript or Rolldown errors.
