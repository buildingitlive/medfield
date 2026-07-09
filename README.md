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

## Architecture & UI Screens
- **`/` (Home)**: Asymmetric Bento CTAs, mobile-first address selector, delivery banner, reorder carousel, and trust strip.
- **`/search`**: Catalog directory with live search, price sorting, and inline quantity stepper (`- 1 +`).
- **`/medicine/:id`**: Product formulation detail with composition specs and sticky Add-to-Cart bar.
- **`/login` & `/otp`**: Mobile number OTP login flow with trust badges.
- **`/cart` & `/checkout`**: Cart review with delivery estimate and checkout with structured delivery address and payment methods.
- **`/orders` & `/orders/:id`**: Ongoing vs Past order tabs and real-time cold-chain courier tracking.
- **`/profile`, `/addresses`, `/settings`, `/prescription-upload`**: Full clinical member management suite.
