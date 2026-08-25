# Restore MyInfraHub to the 16 November 2025 feature set

Same project, same Supabase backend, same storage bucket. No schema resets, no policy or auth changes.

## Audit report

### Existing and correct (keep untouched)
- Auth: sign up, sign in, sign out, forgot password, reset password, remember me, instant login (no email verification), profile + phone creation.
- Roles: `user_roles` table with `app_role` enum, `has_role()`, `is_admin()`, `handle_admin_user()` trigger for myinfrahub.com@gmail.com, `AdminRoute` guard.
- Admin pages: dashboard, properties (approve / reject with reason / mark sold out / delete with storage cleanup / add & delete media), appointments, contact submissions, contact requests with WhatsApp deep links.
- Property system: rent/sell, `MIH-XXXX` codes via DB trigger, owner/agent/builder, pending-approval workflow, sold-out 7-day window, media uploads, carousel, lightbox, "No Image Available" placeholder.
- Search: live filtering, location autocomplete over the ~150-area Hyderabad dataset, multi-location chips, budget parsing.
- Lead generation: Request a Call Back into `contact_requests`, contact form, appointment booking.
- AI: chat bubble + description generator, both on the Lovable AI Gateway (`google/gemini-3-flash-preview`).
- Email: `send-email` edge function via Resend, `email_logs`.
- Database: all eight documented tables present with RLS and grants; 12 properties, 15 images currently stored.
- Post-16-Nov work being preserved deliberately: Basic Facilities + Nearby Facilities sections, trimmed amenities, upload-session/validation fixes, storage cleanup on delete, scroll-to-top on navigation, mobile responsiveness pass, security fixes.

### Missing versus 16 Nov 2025 (restore)
1. Property types cut from 18 to 4. Restore the full 18: Flat/Apartment, Studio, Penthouse, Independent House, Independent Building, Duplex, Villa, Residential Plot, Commercial Building, Office Space, Retail/Showroom, Shop, Commercial Plot, Hostel, Industrial Shed, Warehouse, Farmhouse, Agricultural Land — in both the posting form and the search filter (existing rows keep their stored values).
2. Navbar reduced to five flat links. Restore the 16 Nov layout: centred compact bar with Home, Buy, Rent, Sell, Appointments, Post Property, EMI Calculator, Contact, orange (#FFA500) hover underline, glass rounded Sign In, admin link for admins, and the existing mobile slide-down menu kept.
3. Quantum Loader replaced by a plain spinner. Restore the `ldrs` quantum loader inside `QuantumLoader.tsx` (dependency is already installed), so all four call sites get it back without edits.
4. Page transitions stripped. Restore the wind-sweep enter/exit transition in `PageTransition` (keyframes already exist in `tailwind.config.ts`), keeping the scroll-to-top behaviour.
5. Hero minimised. Restore the building-rise hero animation (`BuildingAnimation`, `buildingRise` keyframes already present) over the navy gradient, with the search bar and Browse / EMI actions.
6. Homepage sections deleted. Restore "Why Choose Us" and the closing call-to-action band below the listings.
7. EMI calculator trimmed. Restore the full page: principal / interest / tenure inputs, EMI + total interest + total payment summary, and the recharts payment-distribution breakdown.

### Extra versus 16 Nov 2025 (remove)
- `src/pages/admin/AdminSlideshow.tsx` — Apr 2026 addition, unrouted. Delete.
- `src/data/mockProperties.ts` — legacy mock data, unreferenced. Delete.
- `src/hooks/useAnimatedCounter.tsx` — belongs to the deleted stats sections. Delete.
- `src/components/DarkModeToggle.tsx` — dark-only theme, unreferenced. Delete.
- `src/hooks/useImageUpload.tsx` — superseded by `useMediaUpload`, unreferenced. Delete.

Nothing is removed from Supabase: no tables, functions, policies, buckets or edge functions are dropped. `contact_submissions`, `email_logs` and all three edge functions stay in the documented feature set.

### Database changes needed
Data only — finish the interrupted demo-data teardown:
- Delete the 6 June-2026 demo listings (MIH-0004 … MIH-0009), the 4 QA rows (MIH-0010 … MIH-0013) and the 2 older test rows (MIH-0002, MIH-0003), plus their `property_images` rows and any linked contact/appointment rows.
- Remove the corresponding files from the `property-images` bucket (the demo rows point at Unsplash URLs and leave nothing behind; uploaded files are cleaned up).
- Schema, policies, grants, triggers and functions are untouched.

### Bug fix included
- `PropertyCard` renders `NaN` when a listing has a null/zero price or area. Guard the price formatter and the area line so they fall back to "Price on request" / "N/A".

## Verification
Run the app in a browser session and check: homepage hero animation + Why Choose Us + CTA, navbar links and Buy/Rent/Sell filtering, search with location chips, the 18 property types in both the filter and the posting form, EMI calculator maths and chart, quantum loader on the loading states, a property posting end-to-end with media, admin approve/reject, Request a Call Back, appointment booking, and the AI chatbot and description generator. Confirm no console errors and empty-state copy where no properties exist.

## Technical notes
- The 16 Nov visual code no longer exists in the working tree; the loader, wind-sweep transition, hero animation, homepage sections and EMI chart are rebuilt against the tokens still present in `src/index.css` and `tailwind.config.ts` rather than recovered verbatim.
- All colours stay on the existing navy/orange semantic tokens — no hardcoded hex in components beyond the existing accent usage.
- Data deletion uses the data-change SQL tool; no migration is required.
