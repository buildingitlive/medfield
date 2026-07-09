# MedField PWA — Project Context & Status

## Project Overview
MedField is a progressive web application (PWA) delivering verified clinical-grade botanicals and pharmaceuticals directly from certified field labs to patients with cold-chain tracking.

## Current Project Phase
- **Frontend / PWA UI Phase**: **100% COMPLETE**
- All 16 screens implemented in React 18 + TypeScript + Vanilla Tailwind CSS matching `stitch_medfield_medicine_pwa_prompt_pack`.
- Built and verified via `npm run build` (`tsc -b && vite build`) with zero errors.

## Next Development Phase ("Real Things")
1. **Live Backend API Integration**:
   - Connecting `AuthScreen.tsx` to live mobile OTP service.
   - Connecting `SearchScreen.tsx` and `HomeScreen.tsx` to backend catalog endpoints (`/api/products`).
   - Connecting `CheckoutScreen.tsx` and `OrdersScreen.tsx` to order processing endpoints (`/api/orders`).
2. **Prescription Storage & Verification**:
   - Hooking up `PrescriptionUploadScreen.tsx` to cloud object storage (S3 / Supabase) and clinical verification workflows.
3. **PWA Offline Manifest**:
   - Registering production Service Worker (`vite-plugin-pwa`) and adding native install prompt assets.
