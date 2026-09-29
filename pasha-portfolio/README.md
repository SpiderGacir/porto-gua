# Pasha Portfolio

Portofolio pribadi Rafi Pasha. Next.js 14, TypeScript, Framer Motion, Lucide.

## Struktur
- `app/` halaman (`/`, `/about`, `/projects`, `/skills`, `/experience`, `/contact`)
- `components/` Shell (header + menu hamburger + footer), pengganti bahasa, dll
- `lib/i18n.ts` semua teks Indonesia dan Inggris
- `lib/data.ts` link sosmed, daftar halaman, proyek, skill
- `public/pasha.jpg` foto

## Jalankan lokal
`npm install` lalu `npm run dev`, buka http://localhost:3000

## Edit isi
- Ganti link sosmed di `lib/data.ts` (bagian `socials`)
- Ganti teks di `lib/i18n.ts` (edit versi `en` dan `id` sekaligus)
- Tambah proyek di array `projects` di `lib/data.ts`

## Fitur server (baru)
Semua rahasia ada di environment variable, lihat `.env.example`. Salin jadi `.env.local` (lokal) dan isi juga di hosting.
1. Buat project Supabase, jalankan `supabase/schema.sql` di SQL Editor.
2. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` (service role hanya di server, jangan diawali NEXT_PUBLIC).
3. Isi `GEMINI_API_KEY` (Google AI Studio) untuk fitur AI di Code Lab.
4. Form kontak: pesan masuk ke tabel `messages`; kalau `RESEND_API_KEY` + `CONTACT_TO` diisi, juga dikirim ke email.
5. `npm install` (ada dependency baru: fflate) lalu `npm run dev`.

Endpoint: `/api/contact`, `/api/ai`, `/api/publish` (POST/DELETE), `/api/report`. Situs publish: `/s/<id>`, halaman kelola: `/publish`.
Rate limit di `lib/server.ts` disimpan di memori server; untuk serverless (Vercel) publish juga dibatasi lewat database.
Subdomain terpisah: isi `SITES_HOST=s.domain.com` dan `NEXT_PUBLIC_SITES_URL=https://s.domain.com`, arahkan domain itu ke deployment yang sama (`middleware.ts` yang mengurus).

## Roadmap
Fase 2: halaman Terminal. Fase 3: Code Lab dengan live preview. Fase 4: poles.
