# MedField PWA — Design System & Reference UI Specification

## 1. Core Color Palette & Design System (`Field-to-Pharmacy System`)
- **Primary Brand**: `#004c25` (Deep Clinical Emerald)
- **Primary Container**: `#006634` (Vibrant Emerald Action)
- **Secondary**: `#506354` / Secondary Container: `#d2e8d5`
- **Surface**: `#f6fbf3` / Surface Container Lowest: `#ffffff`
- **Dynamic Theme Architecture**: CSS variables (`--color-*`) configured in `index.css` for both Light and Dark modes so all semantic tokens (`on-surface-variant`, `outline`, etc.) automatically invert accurately without contrast issues.

## 2. Reference Screen Compliance Matrix (All 16 Screens Complete)
1. **Home Screen (`/`)**: Mobile-first Address Sub-header, Delivery Banner (`Order before 6:00 PM...`), Inline Search trigger, Asymmetric Bento CTAs, Reorder Carousel, and Trust Strip.
2. **Catalog Search (`/search`)**: Price Sorting (`Low to High`, `High to Low`), Category Chips, OTC/Rx filter pills, strikethrough MRP pricing badges (`Save 20%`), India-centric INR (`₹`) currency, and inline stepper controls (`- 1 +`).
3. **Medicine Detail (`/medicine/:id`)**: Composition & Pack Size block (`15 Capsules / Strip`), dynamic Indian MRP pricing (`Save ₹...`), and sticky Add-to-Cart bottom bar.
4. **Authentication (`/login`, `/otp`)**: Mobile number OTP flow with bottom trust badges (`Genuine Medicines • Same-Day Delivery • Pay on Delivery`).
5. **Cart & Checkout (`/cart`, `/checkout`)**: Delivery estimate row (`Arrives today by 9 PM`), structured Delivery Address card with PIN Code, selectable COD & QR payment cards, and sticky Place Order bar.
6. **Orders & Tracking (`/orders`, `/orders/:id`)**: Ongoing vs Past order tabs, contextual action buttons (`Track Delivery`, `Reorder`), Courier Profile card (`Alex Mercer — MedField Courier`), and completed vs pending timeline step indicators.
7. **Clinical Account & Settings (`/profile`, `/addresses`, `/settings`)**: Menu-list layout with `Sarah Jenkins` profile card, grouped Settings sections (`Notifications`, `Appearance`, `Preferences`, `About`), and radio-selectable Delivery Addresses.
8. **Prescription Upload (`/prescription-upload`)**: 3-step progress indicator (`1 Upload -> 2 Review -> 3 Confirmed`), Clarity Checklist (`Well-lit and easily readable`), and sticky bottom Submit button.
9. **Onboarding (`/onboarding`)**: Full-bleed circular medical hero illustrations per slide.

## 3. Responsive Navigation, PWA Prompt & Micro-Interactions
- **Mobile Viewport**: Persistent bottom navigation bar (`BottomNav.tsx`).
- **Desktop Viewport (`lg+`)**: Dedicated fixed left navigation drawer (`DesktopSidebar.tsx`) displaying profile summary and navigation items.
- **PWA Installation Prompt Modal (`InstallAppPopup.tsx`)**: Frosted glassmorphism modal (`useInstallPrompt.ts`) detecting iOS Safari 3-step instructions or native Chrome/Edge `beforeinstallprompt` trigger.
- **Floating Toast Feedback (`ToastNotification.tsx`)**: Auto-dismissing floating visual confirmations on cart additions and order submissions.

## 4. Upcoming Geolocation & Mapping Features
- **Smart Address Capture**: Modals for parsing Google Maps sharing links and utilizing the native HTML5 Geolocation API (`navigator.geolocation`) to auto-fill latitude/longitude.
- **Geofence Zone Tags**: Admin UI styling for zone categorization (e.g. `North`, `South`) utilizing localized color pills for high-contrast routing visualization.
