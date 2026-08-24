# MyInfraHub — Complete Project Record

**Project name:** MyInfraHub (briefly referred to as "EcoNest" in one prompt cycle)
**Type:** Real estate listing + lead-generation platform for the Hyderabad market
**Lovable project ID:** 3d215850-6844-4f4f-94ba-7a5a35bcd69c
**Supabase project ref:** uboovmbxjjrywxgxbvxy
**Development window:** 10 September 2025 → 24 August 2026 (307 chat messages)
**Admin account:** myinfrahub.com@gmail.com
**Public business contact used site-wide:** +91 9866123350 / myinfrahub.com@gmail.com

---

## 1. Chronological development timeline

### Phase A — Initial build (10–11 Sep 2025)
- **10 Sep** — Initial request: build a real estate site called MyInfraHub, blue theme, animations everywhere, opening hero animation of rectangular buildings rising, all core pages, search filters, EMI calculator. First version generated with pages, search filters, EMI calculator, blue theme.
- **10 Sep** — Follow-up: "add animation to everything, every small detail". Global animation system added to `src/index.css` and `tailwind.config.ts` (page transitions, stagger animations, hover effects, button/form animations) and applied across Navbar, property cards and pages.
- **11 Sep** — Build error: extra closing brace at end of `index.css` (line 585). Fixed.
- **11 Sep** — Request for consistent page-route transitions (fade/slide/scale) across Home, Properties, About, Contact.
- **11 Sep** — Bug: blank contact box on Contact page and blank EMI calculator block on homepage. Both fixed; animated scroll-up statistics counters added to the homepage.

### Phase B — Filtering, uploads, auth-aware navbar (13–16 Sep 2025)
- **13 Sep** — Live filtering in the properties section (results update while typing), heart/favourite icon removed from property cards, button-visibility fixes.
- **13 Sep** — Fix: homepage EMI block and About-page section only appeared on hover (opacity/animation issue).
- **15 Sep** — Price field made user-friendly with shorthand ("1.25 cr"); `src/utils/priceFormatter.ts` created. Image upload for property posting added via `src/hooks/useImageUpload.tsx`. Navbar updated for authentication state.
- **16 Sep** — Admin-only backend panel requested for the admin Gmail. `useAuth.tsx` gained an `isAdmin` flag; `AdminRoute.tsx`, `AdminDashboard.tsx`, `AdminProperties.tsx` created.

### Phase C — Security hardening (1 Oct 2025)
- Security finding: **profiles table publicly readable**. "Profiles are viewable by everyone" policy dropped; replaced with own-profile + admin-only read policies.
- Security finding: **poster_email / poster_phone exposed** on approved properties. A `properties_public` view was created (`security_invoker=on`) and the sensitive columns were eventually removed from the view entirely; `can_view_property_contact()` security-definer function added; properties RLS tightened.
- **Admin email typo corrected**: `myinfrapub.com@gmail.com` → `myinfrahub.com@gmail.com` everywhere (code + RLS + DB functions).

### Phase D — Approval workflow, email, media (3 Oct – 19 Oct 2025)
- **3 Oct** — "permission denied for table users" on property submit; missing admin UPDATE policies added for `properties` and `contact_submissions`.
- **4 Oct** — Approval/rejection flow fixes: `rejection_reason` column added, rejection dialog in admin panel, email notification to owner, property images shown in admin "View Details", public pages restricted to approved properties, `contact_submissions` admin section.
- **4 Oct** — Email delivery: user rejected Resend initially and asked for built-in SMTP. SMTP secrets (`SMTP_HOST/PORT/USER/PASSWORD/FROM_EMAIL`) added, `supabase/functions/send-email` created using denomailer.
- **7 Oct** — RLS policies that queried `auth.users` directly caused "permission denied for table users". Replaced with the security-definer `is_admin()` function; policies rebuilt for `properties`, `contact_submissions`, `profiles`.
- **10 Oct** — Contact button on property cards wired to the Contact page; live filtering repaired (filter key mismatch between `SearchFilters` and pages); `.single()` → `.maybeSingle()` on PropertyDetails; budget default range `[0, 10000000]` was silently filtering out every property — fixed with a `budgetChanged` flag.
- **10 Oct** — Animated statistics counters repaired (IntersectionObserver threshold 0.3 → 0.1, `rootMargin`, run-once guard); also applied to the About page.
- **15 Oct** — "Mark as Sold Out" added: `sold_out_date` column, `sold_out` status, SOLD OUT badge, auto-hide after 3 days (later extended to 7).
- **15 Oct** — "Delete Property" with confirmation dialog added to admin panel. **All count-up stats sections removed** from Index and About pages at user request.
- **18 Oct** — Logo work: uploaded logo added, then reduced to just the building icon (`logo-icon-hq.png` generated), then text-only wordmark ("MyInfra" white + "Hub" yellow). Navbar background switched to the primary blue (`bg-primary`) with white text/icons.
- **19 Oct** — Sign In and Sign Out buttons invisible on the blue navbar (outline variant background) → `bg-transparent border-white`.
- **19 Oct** — Video support: `media_type` column on `property_images`, `useMediaUpload.tsx` hook, mixed image/video gallery with hover autoplay, admin media delete controls.

### Phase E — Four-phase feature expansion (1–5 Nov 2025)
A large multi-feature prompt was split into phases.
- **Phase 1 (critical fixes)** — RLS policy so the public can see approved + recently sold-out properties, fully clickable property cards, SOLD OUT badge without the black overlay, 7-day retention window for sold-out listings, admin access to all media.
- **Phase 2 (AI features)** — `OPENAI_API_KEY` secret added; `appointment_requests` table created; edge functions `generate-description` and `ai-chat` created; `AppointmentDialog.tsx` and `AIChatBubble.tsx` components created and wired into App/PropertyDetails/PostProperty.
- **Phase 3 (all remaining)** — Critical security fix: **roles moved out of `profiles` into a dedicated `user_roles` table** with the `app_role` enum plus `has_role()` and `is_admin()` functions and an auto-assign trigger. Email templates for appointment confirmation/notification and contact notification. New admin pages `AdminContacts.tsx` and `AdminAppointments.tsx`; dashboard stats expanded; Contact page wired to the database.
- **3 Nov** — Post Property opened to all logged-in users (admin auto-approve, others pending); Buy/Rent/Sell buttons added above the search bar; Schedule Visit on cards and detail pages.
- **3 Nov** — Navbar restructured: "Properties" removed, Buy / Rent / Sell added, Appointments page created (`/appointments`), Buy/Rent/Sell buttons removed from the hero again, Post Property made visible to guests with sign-in redirect and return-to-form behaviour.
- **4 Nov** — Appointments page gained a full booking form (name, email, phone, date, time, message) writing to `appointment_requests` with `pending` status; admin confirm/cancel.
- **4 Nov** — "Remember Me" fixed; property types temporarily changed to Flat/Plot; `BudgetInput.tsx` created for human-readable budgets ("2 Lakhs", "1 Cr"); Buy/Rent URL-parameter filtering.
- **4–5 Nov** — Admin recognition moved from a hardcoded email check to the `user_roles` table; admin role row inserted for the admin account.
- **5 Nov** — `send-email` failed with "failed to lookup address information" (SMTP DNS). Switched to Resend, then reverted to SMTP at the user's request, and an `email_logs` table was created to record every send. New-property-to-admin and appointment-status-update notifications wired in.

### Phase F — Visual polish era (6–11 Nov 2025)
- **6 Nov** — `ldrs` Quantum Loader integrated site-wide (`QuantumLoader.tsx`), animated gradient borders on property cards, `PropertyImageCarousel.tsx` built on embla-carousel with autoplay/dots/counter.
- **8 Nov** — Property cards became invisible because of the animated-border pseudo-element stacking. First fixed with z-index/isolation and a brighter dark card colour; then, at the user's insistence, the **animated border was removed entirely** in favour of a clean 1px border with scale + shadow hover.
- **8 Nov** — Location autocomplete in the search bar (local array matching, case-insensitive, max 8 suggestions, click-outside close, 300px scroll box, Clear Filters).
- **8 Nov** — Filter bar compacted; budget range moved inline; "More Filters" trimmed; flexible budget parsing ("10L", "1Cr", "50K", plain numbers); Post Free Property button glow/flicker removed and restyled with an orange gradient.
- **9 Nov** — Major theme decision: **dark mode only, navy blue instead of black**. `index.css` palette rewritten, `.dark` overrides removed, `ThemeProvider` set to `forcedTheme="dark"`, `DarkModeToggle` removed from the navbar. Search bar compacted, Furnishing (with "Under Construction") moved to the top row, Min Budget removed, "More Filters" deleted. WhatsApp button (`https://wa.me/919866123350`) added inside the chatbot.
- **9 Nov** — Multi-location tagging: typed areas become removable chips, alphabetical suggestions, multiple areas filter simultaneously. Search section centred with a snug `w-fit` container.
- **9 Nov** — `property_for` column added (`rent` / `sell`) after the "could not find the 'property_for' column" error; Buy/Rent listing separation implemented; submission message stripped of all "24–48 hours" wording.
- **9 Nov** — Contact page text colours brightened (`#FFD580`) for legibility on navy.
- **10 Nov** — "No matching properties found" empty state; drag-and-drop media upload; `ContactInfoDialog` created; Call Now / Send Email wired to `tel:` and `mailto:`; chatbot quick actions (WhatsApp / Call / Email).
- **10 Nov** — Auto-approval removed: **every** property now submits as `pending`.
- **10 Nov** — Admin "Add Image/Video" (10 images / 3 videos cap), property-card hover animation (scale 1.03, glow, title lift), "wind sweep" page transition keyframes.
- **10 Nov** — Navbar compacted with orange (`#FFA500`) hover underline; hero background lightened `#0E234B` → `#142C5A`; card buttons arranged in a 2×2 grid with Schedule Visit centred below.
- **11 Nov** — Glass rounded Sign In button; pre-launch QA checklist verified.
- **11 Nov** — Supabase accident recovery #1: test data cleanup migration, admin role re-assertion, instant login (no email verification), navbar centring.

### Phase G — Backend rebuild and admin recovery (12 Nov 2025)
- Email verification disabled; signup logs the user in instantly.
- **Full backend rebuild from scratch**: all tables, functions, triggers and RLS policies dropped and recreated (`user_roles`, `profiles`, `properties`, `property_images`, `appointment_requests`, `contact_submissions`, `email_logs`).
- Admin login troubleshooting → `handle_admin_user()` trigger created so `myinfrahub.com@gmail.com` always receives the admin role automatically. Admin redirected to `/admin` after sign-in.
- Foreign keys re-added (`property_images.property_id`, `appointment_requests.property_id`); temporary TS assertions used while `types.ts` regenerated.
- **Forgot Password / Reset Password** pages created with Zod validation and Supabase `resetPasswordForEmail` / `updateUser`.

### Phase H — Listing metadata and privacy (13–16 Nov 2025)
- **13 Nov** — `poster_type` (owner / agent / builder) column and form field; property cards switched to showing only the business phone/email; "Pragatinagar" added; typo prevention on locations; animated admin greeting ("👋 Welcome back, Mr. Khan!").
- **13 Nov** — Owner/Agent/Builder moved to the very top of the posting form; location field converted to a strict autocomplete dropdown.
- **14 Nov** — **Property codes**: `property_code` column, `generate_property_code()` + `set_property_code()` (security definer, `search_path=public`) and a trigger producing `MIH-0001`, `MIH-0002`… Also: "N/A" options for BHK / bathrooms / furnishing / age, auto-N/A for land types, dynamic sq ft vs sq yd unit, and the full ~150-area Hyderabad location list.
- **14 Nov** — 18 property types restored (Flat/Apartment, Studio, Penthouse, Independent House, Independent Building, Duplex, Villa, Residential Plot, Commercial Building, Office Space, Retail/Showroom, Shop, Commercial Plot, Hostel, Industrial Shed, Warehouse, Farmhouse, Agricultural Land); Shamshabad added.
- **14 Nov** — `send-email` SMTP DNS failure again → switched permanently to **Resend**.
- **14 Nov** — `area_unit` column added with auto-selection (SY for land, SQFT for buildings) and manual override in posting form, edit form and admin panel; property details scroll-reset; admin media upload refresh fixed.
- **14 Nov** — Czech Colony and Sanathnagar added to locations. Customer email/phone hidden from property details; video upload restricted to admin; static business contact shown instead.
- **14 Nov** — Confirmed property deletion is a **hard delete**; fixed the orphaned-storage bug so `handleDelete` and `handleDeleteMedia` now remove files from the `property-images` bucket first.
- **14 Nov** — Location field made freeform-with-suggestions again (users can type unknown areas).
- **16 Nov** — Eleven-item mega-prompt: `contact_requests` table created; Contact / Call Now / Send Email removed from cards and details in favour of **Send Contact Request**; new admin page `/admin/contact-requests`; property code surfaced everywhere user-facing; `AppointmentDialog.tsx` and `ContactInfoDialog.tsx` deleted; safe cleanup of unused code.
- **16 Nov** — WhatsApp column in admin contact requests with phone sanitisation (`replace(/\D/g,'')`); `success` button variant added.
- **16 Nov** — Button renamed to **"Request a Call Back"**; requester phone collected via a dialog when missing; phone also saved to `profiles` at signup; email-confirmation message removed from signup; requester vs property-owner information split into two separate sections in the admin details popup.

### Phase I — Simplification and AI restoration (31 Mar – 14 May 2026)
- **31 Mar 2026** — Review of everything built so far; confirmation that no backend changes followed a reversion.
- **31 Mar / 5 Apr** — Sustainability cleanup: dropped `solar_panels`, `rainwater_harvesting`, `energy_efficiency_rating`, `waste_management`, `green_certified`, `eco_rating`. Added **Basic Facilities** columns (`water_supply`, `power_backup`, `power_backup_type`, `parking_available`, `lift_available`). Amenities trimmed to 9 items. PropertyDetails restructured into Basic Facilities cards + Amenities badges + a **Nearby Facilities** section (schools/hospitals/supermarkets) driven by a predefined mapping for ~17 Hyderabad locations. Explicitly no eco-score / AI scoring.
- **7 Apr 2026** — OpenAI quota exhausted (429). Both AI edge functions switched to the **Lovable AI Gateway** using `google/gemini-3-flash-preview` and `LOVABLE_API_KEY`; deployed and verified.
- **7 Apr 2026** — UI/UX pass: Appointments empty state + prominent Book Appointment button, "No Image Available" card placeholder, centred navbar with animated Buy/Sell dropdowns, gradient hero, **Admin Slideshow Mode** (`/admin/slideshow`, auto-rotate, keyboard controls), scroll-to-top on navigation.
- **14 May 2026** — Academic simplification #1: AI chat bubble and AI description button hidden, slideshow route removed, Quantum Loader replaced by a `Loader2` spinner, heavy page transitions stripped. Backend and files kept recoverable.
- **14 May 2026** — Academic simplification #2: navbar reduced to Home / Properties / Post Property / EMI Calculator / Contact; property types reduced to Apartment, Villa, Plot, Commercial; hero minimised (BuildingAnimation removed); "Why Choose Us" and CTA sections deleted from the homepage; EMI calculator trimmed to inputs + result.

### Phase J — Mobile, demo data, final fixes (10 Jun – 24 Aug 2026)
- **10 Jun 2026** — Mobile responsiveness pass for 360–430px: hero height/typography halved, full-width search with thumb-friendly filters, redesigned hamburger menu with slide-down animation and active highlighting, taller card images with tighter padding, reduced vertical rhythm on Index and Properties.
- **18 Jun 2026** — Six demo properties inserted with two Unsplash images each (Gachibowli, Jubilee Hills, Madhapur, Shankarpally, HITEC City, Kondapur), all `approved`.
- **~Jul 2026** — AI chatbot and AI description generator re-enabled (`AIChatBubble` back in `App.tsx`, "Generate with AI" back in the posting form).
- **Jul 2026** — Request to revert the site to 17 Nov 2025; explained that this must be done through the platform's History tab, not through code.
- **31 Jul / Aug 2026** — Property upload glitch fixed: explicit `supabase.auth.getSession()` check with sign-in redirect, strict validation of the Rent/Sell modal and all dropdowns, numeric guards on price/area, media-upload completeness check, `poster_type` included in the insert. Verified end-to-end in a browser session with a throwaway test account.
- **24 Aug 2026 (current)** — Demo-data teardown started (delete of `contact_requests`, `appointment_requests`, `property_images`, `properties`) — **this deletion was interrupted and has not completed**; see §12.

---

## 2. Every feature added, removed or modified

### Added and still present
Authentication (sign up / sign in / sign out / forgot password / reset password), instant login without email verification, phone captured at signup, role-based admin detection, property browsing, property details page, property image/video carousel with lightbox, live search with location autocomplete and multi-location chips, filters (location, type, BHK, budget, furnishing, rent/sell), property posting with rent/sell modal, owner/agent/builder classification, drag-and-drop media upload, auto property codes (MIH-XXXX), auto/manual area unit (SQFT/SY), N/A handling for land types, Basic Facilities, Amenities, Nearby Facilities mapping, Request a Call Back lead capture, appointments booking, EMI calculator, contact form, admin dashboard, admin property approve/reject/sold-out/delete with storage cleanup, admin media add/delete, admin appointments, admin contact submissions, admin contact requests with WhatsApp deep links, email notifications via Resend with `email_logs`, AI chatbot, AI description generator, "No Image Available" placeholder, mobile-optimised layouts, dark navy theme.

### Added then removed / hidden
- Light mode and `DarkModeToggle` — removed (dark-only navy theme).
- Animated count-up statistics ("Trusted by Thousands") — built, debugged three times, then removed from all pages.
- Animated gradient card borders — built, then removed for breaking card visibility.
- Buy/Rent/Sell buttons above the hero — added, then removed as duplicates.
- Navbar Buy / Rent / Sell / Appointments links and Buy/Sell hover dropdowns — added, later removed in the academic simplification.
- `AppointmentDialog.tsx`, `ContactInfoDialog.tsx` — deleted when the callback system replaced them.
- Contact / Call Now / Send Email buttons on cards and detail pages — replaced by Request a Call Back.
- Poster phone/email on the public site — removed permanently (privacy rule).
- Auto-approval for admin-posted properties — removed; everything is `pending`.
- Sustainability columns (eco rating, solar panels column, rainwater harvesting, energy efficiency, waste management, green certified) — dropped.
- Quantum Loader (`ldrs`) — replaced by a simple spinner (component still exists as a wrapper).
- "Wind sweep" page transitions, BuildingAnimation, Why Choose Us, homepage CTA — removed.
- Admin Slideshow route — file kept (`src/pages/admin/AdminSlideshow.tsx`) but unrouted.
- OpenAI as the AI provider — replaced by the Lovable AI Gateway.
- SMTP mail sending — replaced by Resend (SMTP secrets remain configured but unused).
- 18 property types → 4 (Apartment, Villa, Plot, Commercial).
- Min Budget field and "More Filters" button — removed.

---

## 3. Current pages, routes, components

### Routes (`src/App.tsx`)
| Route | Page |
|---|---|
| `/` | `Index` — hero, search, property listings |
| `/properties` | `Properties` — full listing with filters, buy/rent URL params |
| `/property/:id` | `PropertyDetails` |
| `/post-property` | `PostProperty` |
| `/emi-calculator` | `EMICalculator` |
| `/about` | `About` |
| `/contact` | `Contact` |
| `/sign-in` | `SignIn` |
| `/sign-up` | `SignUp` |
| `/forgot-password` | `ForgotPassword` |
| `/reset-password` | `ResetPassword` |
| `/appointments` | `Appointments` |
| `/privacy-policy` | `PrivacyPolicy` |
| `/admin` | `AdminDashboard` (guarded) |
| `/admin/properties` | `AdminProperties` (guarded) |
| `/admin/appointments` | `AdminAppointments` (guarded) |
| `/admin/contacts` | `AdminContacts` (guarded) |
| `/admin/contact-requests` | `AdminContactRequests` (guarded) |
| `*` | `NotFound` |

Not routed: `src/pages/admin/AdminSlideshow.tsx` (kept for recovery).

### Components (`src/components`)
`Navbar` (centred flat nav + mobile slide-down menu), `Footer`, `HeroSection`, `SearchFilters` (autocomplete, chips, compact filter row), `PropertyCard` (code, price, placeholder, Request a Call Back, phone dialog), `PropertyImageCarousel` (embla + autoplay), `ImageLightbox`, `BudgetInput` (lakh/crore parsing), `AIChatBubble`, `AdminRoute`, `PageTransition`, `QuantumLoader` (now a simple spinner), `BuildingAnimation` (unused), `DarkModeToggle` (unused), plus the full shadcn/ui set under `components/ui`.

### Hooks / utils
`useAuth.tsx` (session, `isAdmin` from `user_roles`, signup profile write), `useMediaUpload.tsx`, `useImageUpload.tsx`, `useAnimatedCounter.tsx` (unused), `use-mobile.tsx`, `use-toast.ts`, `utils/priceFormatter.ts`, `data/mockProperties.ts` (legacy).

---

## 4. Tech stack

**Frontend:** React 18.3, TypeScript 5.8, Vite 5.4 (`@vitejs/plugin-react-swc`), React Router 6.30, TanStack React Query 5.83, Tailwind CSS 3.4 + `tailwindcss-animate` + `@tailwindcss/typography`, shadcn/ui on Radix UI primitives, lucide-react icons, next-themes (forced dark), react-hook-form + zod + `@hookform/resolvers`, embla-carousel + autoplay, recharts, sonner + Radix toast, date-fns, cmdk, vaul, input-otp, react-day-picker, react-resizable-panels, class-variance-authority / clsx / tailwind-merge, `ldrs` (legacy loader), lovable-tagger (dev).

**Backend / platform:** Supabase — PostgreSQL, Auth (email/password), Storage (`property-images` bucket, public), Edge Functions (Deno). Row Level Security on every table plus security-definer helper functions.

**Edge functions:** `send-email` (Resend), `generate-description` (Lovable AI Gateway), `ai-chat` (Lovable AI Gateway). All three run with `verify_jwt = false` per `supabase/config.toml`.

**AI:** Lovable AI Gateway, model `google/gemini-3-flash-preview`, authenticated with `LOVABLE_API_KEY`.

**Email:** Resend API (previously Gmail/domain SMTP via denomailer).

**Third-party / external:** WhatsApp deep links (`wa.me`), `tel:` / `mailto:` handlers, Unsplash image URLs for demo data, Lovable hosting/preview.

**Hosting:** Lovable (preview at `https://id-preview--3d215850-6844-4f4f-94ba-7a5a35bcd69c.lovable.app`). **Not yet published to a production URL; no custom domain connected.**

---

## 5. Database schema

### `properties`
`id`, `user_id`, `title`, `description`, `price` (numeric), `area` (int), `area_unit` (SQFT/SY), `location`, `bedrooms`, `bathrooms`, `furnishing`, `property_type`, `property_for` (rent/sell, default rent), `amenities` (text[]), `age`, `poster_name`, `poster_phone`, `poster_email`, `poster_type` (owner/agent/builder), `status` (pending/approved/rejected/sold_out), `rejection_reason`, `sold_out_date`, `property_code` (MIH-XXXX), `water_supply`, `power_backup`, `power_backup_type`, `parking_available`, `lift_available`, `created_at`, `updated_at`.

### `property_images`
`id`, `property_id` → `properties.id`, `image_url`, `media_type` (image/video), `display_order`, `created_at`.

### `profiles`
`id`, `user_id`, `display_name`, `avatar_url`, `phone`, `created_at`, `updated_at`.

### `user_roles`
`id`, `user_id`, `role` (`app_role` enum: admin | user), `created_at`, unique(user_id, role).

### `contact_requests` (callback leads)
`id`, `property_id` → `properties.id`, `property_code`, `property_title`, `property_location`, `user_id`, `user_name`, `user_email`, `user_phone`, `status`, `created_at`, `updated_at`.

### `appointment_requests`
`id`, `property_id` → `properties.id`, `visitor_name`, `visitor_email`, `visitor_phone`, `preferred_date`, `preferred_time`, `message`, `status`, `created_at`, `updated_at`.

### `contact_submissions`
`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`.

### `email_logs`
`id`, `to_email`, `subject`, `message`, `status`, `error_message`, `created_at`.

### Relationships
`properties` 1—N `property_images`, `properties` 1—N `contact_requests`, `properties` 1—N `appointment_requests`. Users are referenced by `user_id` (never a FK to `auth.users`), with `profiles` and `user_roles` keyed on the same id.

### Database functions
`has_role(uuid, app_role)`, `is_admin()`, `can_view_property_contact(uuid)`, `generate_property_code()`, `set_property_code()` (trigger), `handle_new_user()` (creates a profile), `handle_new_user_role()` (assigns the `user` role), `handle_admin_user()` (auto-assigns `admin` to the admin email), `update_updated_at_column()`. All security-definer with `search_path = public` except the timestamp helper.

### Backend logic highlights
- Property codes are generated in the database, not the client.
- Public visibility policy: `status = 'approved'` OR (`status = 'sold_out'` AND `sold_out_date >= now() - 7 days`).
- Poster contact fields are readable only by the owner and admins.
- 27 migration files under `supabase/migrations/` (15 Sep 2025 → 5 Apr 2026).

---

## 6. Authentication, roles, permissions

- Email/password Supabase Auth; email confirmation disabled, so signup logs the user straight in.
- Signup writes `display_name` and `phone` into `profiles`.
- Forgot/reset password via `resetPasswordForEmail` and `updateUser`.
- "Remember Me" persists the session.
- Roles live in the separate `user_roles` table (deliberately never in `profiles`) with the `app_role` enum. `useAuth` derives `isAdmin` from a database query, not a client-side email comparison.
- `myinfrahub.com@gmail.com` receives the admin role automatically via the `handle_admin_user()` trigger; admins are redirected to `/admin` after sign-in.
- `AdminRoute` guards all `/admin/*` routes; the Admin link only renders for admins.
- Guests can browse and view details but must sign in to post a property or request a callback (redirect back to the intended page after sign-in).
- Video upload is admin-only.

**Admin panel capabilities:** dashboard stats and animated greeting; properties (approve, reject with reason + email, mark sold out, delete with storage cleanup, edit fields, add/delete media up to 10 images / 3 videos, view poster type/code/area unit); appointments (confirm/cancel + email); contact submissions; contact requests (view requester and property-owner sections separately, WhatsApp deep link, mark contacted, delete).

---

## 7. Design decisions, UI/UX and branding

- **Brand:** "MyInfra" (white) + "Hub" (yellow/orange accent) wordmark; logo image experiments abandoned in favour of text.
- **Theme evolution:** bright blue with heavy animation → dark mode option → **dark-only navy** (`#0E234B`, lightened to `#142C5A`) with orange (`#FFA500`, gradient `#FF8C00 → #FFB84D`) accents → simplified minimal academic look.
- **Colour tokens** live in `src/index.css` / `tailwind.config.ts`; contact text on navy uses bright values (`#FFD580` era) for contrast.
- **Animation arc:** maximal ("animate everything", wind sweeps, pixel assembly, glowing borders, quantum loader) → progressively stripped for legibility, performance and an academic presentation tone. Remaining motion: subtle hover scale/shadow, dropdown and mobile-menu transitions.
- **Navbar arc:** blue background with white text → orange hover underline → glass rounded Sign In → Buy/Sell dropdowns → final centred flat five-link bar.
- **Cards:** clean border, hover scale, 2×2 button grid era → single "Request a Call Back" CTA, property code, price emphasis, "No Image Available" placeholder.
- **Search:** full-width → compact centred `w-fit` box → mobile-first full width with large tap targets; multi-location chips; alphabetical, typo-resistant suggestions.
- **Mobile:** optimised for 360–430px, thumb-friendly controls, content above the fold.
- **Privacy as a design rule:** only the business phone/email ever appear publicly.

---

## 8. Bugs and fixes (summary)

| Issue | Fix |
|---|---|
| `index.css` stray closing brace broke the build | Removed the extra brace |
| Blank Contact box / EMI block; hover-only visibility | Rebuilt sections, fixed animation opacity |
| Live filtering not working | Aligned filter key names between `SearchFilters` and pages |
| All properties filtered out on load | Budget default range guarded with a `budgetChanged` flag |
| Count-up stats never animated | IntersectionObserver threshold/rootMargin + DOM-ready + run-once (section later deleted) |
| PropertyDetails crash when no row | `.single()` → `.maybeSingle()` |
| "permission denied for table users" (twice) | Removed `auth.users` lookups from RLS; introduced `is_admin()` security-definer |
| Profiles publicly readable | Own-profile + admin-only policies |
| Poster email/phone exposed | Columns removed from the public view; contact hidden site-wide |
| Missing admin UPDATE/DELETE policies | Added for properties, images, contacts |
| `property_for` column not in schema cache | Column added by migration |
| `poster_type` / `area_unit` TS errors before type regeneration | Temporary type assertions |
| Property cards invisible after border animation | z-index/isolation fix, then animation removed |
| Sign In / Sign Out invisible on blue navbar | `bg-transparent` + white border |
| Sold-out cards turned black | Badge overlay without the black layer |
| Delete button vanished for sold-out items | Visible for the 7-day window |
| Admin media upload reported success but stored nothing | Insert into `property_images` + dialog close + query invalidation |
| Property images/videos orphaned in storage after delete | Storage `remove()` before DB delete in `handleDelete` / `handleDeleteMedia` |
| Property details opened mid-scroll | `window.scrollTo(0,0)` on id change and on navigation |
| `send-email` 500 "failed to lookup address information" | SMTP → Resend |
| AI features returning "service unavailable" (OpenAI 429) | Switched to Lovable AI Gateway / Gemini |
| WhatsApp button missing in admin | `user_phone` was NULL — collected via dialog, plus `profiles` fallback |
| Signup still showed "check your email" | Message removed, confirmation disabled |
| Admin panel disappeared after Supabase resets | Backend rebuilt; admin-role trigger added |
| Location dropdown rejected unknown areas | Freeform input with suggestions |
| Property upload failing (Aug 2026) | Session revalidation, strict field validation, numeric guards, media-upload verification, `poster_type` in payload |
| `NaN` rendered in PropertyCard (current console warning) | **Open** — see §12 |

---

## 9. Deployment and hosting

- Hosted and previewed on Lovable; every chat change auto-commits to the linked repo.
- Preview: `https://id-preview--3d215850-6844-4f4f-94ba-7a5a35bcd69c.lovable.app`
- **Published URL: none. Custom domain: none.** Publishing is a one-click action in Lovable when ready.
- Edge functions deploy automatically to Supabase; `supabase/config.toml` sets `verify_jwt = false` for `send-email`, `generate-description`, `ai-chat`.
- Vite dev server on port 8080 (`vite.config.ts`), `@` alias → `./src`.
- Build scripts: `dev`, `build`, `build:dev`, `lint`, `preview`.
- SEO in `index.html`: title "MyInfraHub - Premier Real Estate in Hyderabad", meta description, Open Graph and Twitter card tags, favicon.

---

## 10. Environment variables and configuration

**Frontend (`.env`, publishable — safe in the client):**
`VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key). The Supabase client also hardcodes the URL/anon key in `src/integrations/supabase/client.ts` with `persistSession` and `autoRefreshToken` enabled.

**Server-side secrets (names only, values never exposed):**
`LOVABLE_API_KEY`, `OPENAI_API_KEY` (legacy, unused), `RESEND_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL` (all legacy/unused), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`.

**Other configuration:** `tailwind.config.ts` (design tokens, keyframes), `components.json` (shadcn, slate base, CSS variables), `tsconfig*.json` (loose strictness: `strict: false`, `noImplicitAny: false`), `eslint.config.js`, `postcss.config.js`. Storage bucket `property-images` is public. Supabase Auth: email confirmations off; "leaked password protection" remains **disabled** (a standing security recommendation).

---

## 11. Architecture overview

```text
                          ┌────────────────────────────┐
   Browser (React SPA)    │  Vite + React 18 + TS      │
   ───────────────────────│  React Router routes       │
                          │  TanStack Query caching    │
                          │  Tailwind + shadcn/ui       │
                          └────────────┬───────────────┘
                                       │ supabase-js (anon key, JWT session)
                 ┌─────────────────────┼───────────────────────────┐
                 │                     │                           │
        ┌────────▼────────┐   ┌────────▼─────────┐      ┌──────────▼──────────┐
        │ Supabase Auth   │   │ Postgres + RLS   │      │ Supabase Storage    │
        │ email/password  │   │ 8 public tables  │      │ property-images     │
        │ session refresh │   │ security-definer │      │ (public bucket)     │
        └────────┬────────┘   │ fns + triggers   │      └─────────────────────┘
                 │            └────────┬─────────┘
     triggers:   │                     │ invoked from client
 handle_new_user │                     │
 handle_new_user_role                  │
 handle_admin_user            ┌────────▼──────────────────────────┐
                              │ Edge Functions (Deno)             │
                              │  send-email  ──► Resend API       │
                              │  ai-chat     ──► Lovable AI GW    │
                              │  generate-description ──► Gemini  │
                              └───────────────────────────────────┘
```

**Request flow — posting a property:** sign-in check → session revalidation → rent/sell modal → validated form → media uploaded to Storage → `properties` insert with `status='pending'` (trigger assigns `MIH-XXXX`) → `property_images` rows inserted → `send-email` notifies the admin → property invisible publicly until an admin approves.

**Request flow — a lead:** visitor opens a property → "Request a Call Back" → phone dialog if missing → row in `contact_requests` (property code/title/location + user identity) → admin sees it at `/admin/contact-requests` with a WhatsApp deep link, plus the separate property-owner block.

**Authorisation model:** the client never decides permissions. Every read/write passes RLS; admin capability comes from `is_admin()` → `has_role()` → `user_roles`.

---

## 12. Limitations, pending tasks and recommendations

**Pending right now**
1. **Demo-data teardown is incomplete.** The database still holds 12 properties (6 Unsplash demo listings + 6 QA/test rows), 15 property images, 1 contact submission, 10 email logs, 9 profiles. The delete was interrupted mid-run. Say the word and I will finish clearing `contact_requests`, `appointment_requests`, `property_images`, `properties` and the leftover storage files.
2. **Console warning:** `Received NaN for the children attribute` in `PropertyCard.tsx` — a numeric field (likely area or price on a plot/N-A record) renders as NaN. Needs a numeric guard.
3. **Leaked-password protection is off** in Supabase Auth settings — a one-toggle manual fix.
4. **Not published.** No production URL or custom domain yet.

**Known limitations**
- Nearby Facilities is a hardcoded map for ~17 Hyderabad areas; anything else shows "Data not available".
- Property types are limited to 4 (the 18-type list exists only in git history).
- No map view, no favourites/wishlist, no property comparison, no user "My Properties" dashboard, no analytics.
- No pagination — listings fetch under Supabase's 1000-row default.
- Search/filtering is client-side over the fetched set.
- Emails come from Resend's default sender unless a domain is verified.
- `poster_email`/`poster_phone` are still stored on `properties` (hidden by RLS, not removed).
- Dead code retained on purpose: `AdminSlideshow.tsx`, `BuildingAnimation.tsx`, `DarkModeToggle.tsx`, `useAnimatedCounter.tsx`, `useImageUpload.tsx`, `mockProperties.ts`, `QuantumLoader` wrapper, unused SMTP/OpenAI secrets.
- TypeScript strictness is disabled, so type errors can slip through.
- No automated test suite.

**Recommended next steps**
1. Finish the data cleanup and fix the NaN warning, then publish.
2. Verify a sending domain in Resend so emails come from `@myinfrahub` rather than the default.
3. Enable leaked-password protection and consider Google OAuth.
4. Add pagination or server-side filtering before the catalogue grows.
5. Add a user "My Properties" dashboard with edit/resubmit.
6. Expand the Nearby Facilities dataset or swap in a real places API.
7. Delete the retained dead files once the academic presentation is over, or restore the richer feature set from history if going commercial.
8. Add favourites, comparison and a map view as the next feature tier.
