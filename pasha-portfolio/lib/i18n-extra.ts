import type { Lang } from './i18n'

// teks untuk fitur baru (form kontak, AI, publish). Dipisah biar i18n.ts tidak membengkak.
const id = {
  contact: {
    sending: 'Mengirim...',
    sent: 'Terkirim ✓',
    ok: 'Pesan terkirim. Terima kasih, nanti aku balas ke email kamu.',
    fast: 'Terlalu cepat, coba lagi sebentar lagi.',
    rate: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.',
    invalid: 'Cek lagi isi form kamu (email valid, pesan minimal 5 huruf, maksimal 3 link).',
    fail: 'Pesan gagal terkirim. Coba lagi atau kirim lewat email langsung.'
  },
  ai: {
    title: 'Asisten AI',
    explain: 'Jelasin kode',
    explainHint: 'Baris per baris, untuk tab yang sedang dibuka',
    fix: 'Perbaiki error',
    fixHint: 'AI membaca kode dan panel Console',
    genLabel: 'Bikinin dari deskripsi',
    genPlaceholder: 'contoh: bikin game ular neon',
    genBtn: 'Buat kode',
    apply: 'Terapkan perbaikan',
    applied: 'Sudah diterapkan ke editor.',
    generated: 'Kode sudah muncul di editor. Klik tab HTML, CSS, dan JavaScript untuk melihat, lalu minta AI jelasin kalau ada yang belum paham.',
    working: 'AI sedang bekerja...',
    close: 'Tutup',
    empty: 'Tab ini masih kosong.',
    confirmReplace: 'Kode AI akan menggantikan kode kamu sekarang. Lanjut?',
    errors: {
      not_configured: 'Fitur AI belum diaktifkan di server (GEMINI_API_KEY belum diisi).',
      rate: 'Terlalu banyak permintaan. Tunggu semenit ya.',
      busy: 'Layanan AI sedang sibuk. Coba lagi sebentar.',
      default: 'AI gagal menjawab. Coba lagi.'
    }
  },
  pub: {
    btn: 'Publish',
    title: 'Publish ke web',
    pageTitle: 'Publish situs kamu',
    pageKicker: 'Mini hosting',
    pageLead: 'Upload satu file HTML atau zip (harus ada index.html), dapat link publik. Hanya file statis, maksimal 2 MB, tanpa login.',
    name: 'Judul',
    file: 'Pilih file .html atau .zip',
    publish: 'Publish',
    publishing: 'Mengunggah...',
    done: 'Berhasil dipublish!',
    link: 'Link publik',
    secret: 'Kode rahasia edit',
    secretWarn: 'Simpan kode ini. Ini satu-satunya cara mengubah atau menghapus situsmu, dan tidak bisa dilihat lagi.',
    copy: 'Salin',
    copied: 'Tersalin',
    mine: 'Dari perangkat ini',
    manage: 'Kelola situs',
    siteId: 'ID situs (mis. k7x2ab)',
    secretIn: 'Kode rahasia',
    update: 'Update dengan file',
    remove: 'Hapus situs',
    confirmDel: 'Hapus situs ini permanen?',
    updated: 'Situs diperbarui.',
    deleted: 'Situs dihapus.',
    open: 'Buka',
    report: 'Laporkan halaman',
    reportWhy: 'Kenapa dilaporkan? (opsional)',
    reportSend: 'Kirim laporan',
    reportDone: 'Laporan diterima. Terima kasih.',
    fromLab: 'Publish dari Code Lab',
    labNote: 'HTML, CSS, dan JavaScript kamu digabung jadi satu halaman.',
    errors: {
      not_configured: 'Fitur publish belum diaktifkan di server (Supabase belum diisi).',
      too_big: 'File terlalu besar (maksimal 2 MB).',
      rate: 'Terlalu banyak publish. Coba lagi nanti.',
      no_file: 'Pilih file dulu.',
      file_type: 'Tipe file tidak diizinkan. Hanya HTML, CSS, JS, gambar, font, JSON, dan teks.',
      no_index: 'Di dalam zip harus ada index.html.',
      zip_invalid: 'Zip tidak bisa dibaca.',
      zip_too_big: 'Isi zip terlalu besar.',
      zip_too_many: 'Terlalu banyak file di dalam zip (maks 60).',
      auth: 'ID atau kode rahasia salah.',
      default: 'Gagal. Coba lagi.'
    }
  }
}

const en: typeof id = {
  contact: {
    sending: 'Sending...',
    sent: 'Sent ✓',
    ok: "Message sent. Thanks, I'll reply to your email.",
    fast: 'Too fast, please try again in a moment.',
    rate: 'Too many attempts. Try again in a few minutes.',
    invalid: 'Please check the form (valid email, message of 5+ characters, at most 3 links).',
    fail: "The message couldn't be sent. Try again or email me directly."
  },
  ai: {
    title: 'AI assistant',
    explain: 'Explain code',
    explainHint: 'Line by line, for the tab you have open',
    fix: 'Fix errors',
    fixHint: 'AI reads your code and the Console panel',
    genLabel: 'Build from a description',
    genPlaceholder: 'e.g. make a neon snake game',
    genBtn: 'Generate code',
    apply: 'Apply fix',
    applied: 'Applied to the editor.',
    generated: 'The code is now in the editor. Open the HTML, CSS and JavaScript tabs to look, then ask the AI to explain anything unclear.',
    working: 'AI is working...',
    close: 'Close',
    empty: 'This tab is empty.',
    confirmReplace: 'AI code will replace your current code. Continue?',
    errors: {
      not_configured: 'AI is not enabled on the server yet (GEMINI_API_KEY missing).',
      rate: 'Too many requests. Wait a minute.',
      busy: 'The AI service is busy. Try again shortly.',
      default: 'The AI could not answer. Try again.'
    }
  },
  pub: {
    btn: 'Publish',
    title: 'Publish to the web',
    pageTitle: 'Publish your site',
    pageKicker: 'Mini hosting',
    pageLead: 'Upload one HTML file or a zip (needs index.html) and get a public link. Static files only, 2 MB max, no login.',
    name: 'Title',
    file: 'Choose an .html or .zip file',
    publish: 'Publish',
    publishing: 'Uploading...',
    done: 'Published!',
    link: 'Public link',
    secret: 'Secret edit code',
    secretWarn: 'Save this code. It is the only way to update or delete your site and it cannot be shown again.',
    copy: 'Copy',
    copied: 'Copied',
    mine: 'From this device',
    manage: 'Manage a site',
    siteId: 'Site ID (e.g. k7x2ab)',
    secretIn: 'Secret code',
    update: 'Update with file',
    remove: 'Delete site',
    confirmDel: 'Delete this site permanently?',
    updated: 'Site updated.',
    deleted: 'Site deleted.',
    open: 'Open',
    report: 'Report this page',
    reportWhy: 'Why are you reporting it? (optional)',
    reportSend: 'Send report',
    reportDone: 'Report received. Thank you.',
    fromLab: 'Publish from Code Lab',
    labNote: 'Your HTML, CSS and JavaScript are combined into one page.',
    errors: {
      not_configured: 'Publishing is not enabled on the server yet (Supabase missing).',
      too_big: 'File too large (2 MB max).',
      rate: 'Too many publishes. Try again later.',
      no_file: 'Choose a file first.',
      file_type: 'File type not allowed. Only HTML, CSS, JS, images, fonts, JSON and text.',
      no_index: 'The zip must contain index.html.',
      zip_invalid: 'The zip could not be read.',
      zip_too_big: 'The zip contents are too large.',
      zip_too_many: 'Too many files in the zip (60 max).',
      auth: 'Wrong ID or secret code.',
      default: 'Failed. Try again.'
    }
  }
}

export const xt: Record<Lang, typeof id> = { id, en }

// ubah kode error dari server jadi kalimat
export function errText(map: Record<string, string>, code?: string) {
  if (!code) return map.default
  return map[code.split(':')[0]] || map.default
}
