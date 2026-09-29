export type Lang = 'id' | 'en'

const en = {
  nav: { home: 'Home', about: 'About', projects: 'Projects', skills: 'Skills', experience: 'Experience', contact: 'Contact', terminal: 'Terminal', lab: 'Code Lab' },
  navDesc: {
    home: 'Back to the start',
    about: 'Who I am and what I care about',
    projects: 'Things I build and experiment with',
    skills: 'Tools, interests, and things I am learning',
    experience: 'The journey so far',
    contact: 'Say hi or start a conversation',
    terminal: 'A command-line playground',
    lab: 'Write code and preview it live'
  },
  ui: { menu: 'Menu', close: 'Close', soon: 'Soon', language: 'Language', follow: 'Find me' },
  hero: {
    eyebrow: 'Available for opportunities',
    based: 'Based in Indonesia 🇮🇩',
    hi: "Hi, I'm",
    title: 'I build digital things with curiosity, creativity, and code.',
    lead: "I'm a student and creative tech enthusiast exploring web development, digital business, AI, and visual design. I enjoy turning ideas into simple digital experiences.",
    work: 'View my work',
    connect: "Let's connect",
    tag1: 'Still learning.',
    tag2: 'Still building.',
    photoAlt: 'Portrait of Rafi Pasha',
    role: 'Student and creative tech enthusiast'
  },
  strip: ['Technology', 'Creativity', 'AI', 'Digital business', 'Web'],
  explore: { kicker: 'Everything in one place', title: 'Pick where to go.' },
  about: {
    kicker: 'A little about me',
    title: 'More than just a portfolio.',
    copy: "I'm exploring the intersection between technology, business, and creativity. I like learning by building things, experimenting with ideas, and figuring out how digital products actually work.",
    chips: ['Curious', 'Creative', 'Always learning', 'Problem solver', 'Tech explorer'],
    journey: [
      { y: '2024', text: 'Started exploring digital creativity.' },
      { y: '2025', text: 'Experimented with technology, AI and digital projects.' },
      { y: '2026', text: 'Studying Information Systems and exploring web development, business and technology.' }
    ],
    exploreKicker: "Things I'm curious about lately",
    exploreTitle: 'Currently exploring',
    exploring: ['Web development', 'Artificial intelligence', 'Digital business', 'Information systems', 'UI/UX', 'Mandarin', 'New digital ideas'],
    beyondKicker: 'Beyond the screen',
    beyondTitle: 'There is a life outside the browser.',
    beyondCopy: 'Outside of building things, I enjoy discovering new ideas, meeting people, exploring technology, editing visuals, listening to music, and figuring out what I want to build next.',
    tags: ['🎧 Music', '📸 Visuals', '💻 Tech', '🚀 Ideas', '🤝 People', '🌏 Learning']
  },
  projects: {
    kicker: "Some things I've been messing around with",
    title: "Things I've built.",
    filters: { All: 'All', Web: 'Web', AI: 'AI', Creative: 'Creative', Business: 'Business' },
    empty: 'Nothing here yet. Still building.',
    view: 'View project',
    tech: 'Technology',
    caseTitle: 'Case study',
    caseText: 'Overview, idea, challenges and what I learned will live here as this project develops. No made-up metrics and no fake screenshots.',
    status: { building: 'Building', concept: 'Concept', ongoing: 'Ongoing' }
  },
  skills: {
    kicker: 'What I work with',
    title: "Tools, interests, and things I'm learning.",
    groups: { tech: 'Technology', creative: 'Creative', ai: 'AI', business: 'Business' }
  },
  experience: {
    kicker: 'The journey so far',
    title: 'Still becoming.',
    items: [
      { y: '2026 to present', title: 'Information Systems student', text: 'Exploring technology, business, and digital systems.' },
      { y: '2026', title: 'Web & AI projects', text: 'Experimenting with personal digital products and AI concepts.' },
      { y: '2025', title: 'Creative & digital exploration', text: 'Started exploring design, editing, digital business, and technology.' }
    ]
  },
  contact: {
    kicker: 'Have an idea?',
    title: "Let's build something interesting.",
    copy: "Whether it's a project, collaboration, or just a good conversation, I'm open to interesting ideas.",
    name: 'Name',
    mail: 'Email',
    message: 'Message',
    send: 'Send message',
    sent: 'Message validated ✓',
    note: 'Frontend demo only. No email was sent because no backend is connected.'
  },
  lab: {
    kicker: 'Code playground',
    title: 'Try coding right here.',
    hint: 'Write HTML, CSS, and JavaScript and watch the result update live. Your code runs only in your browser and is saved on this device.',
    tabs: { html: 'HTML', css: 'CSS', js: 'JavaScript' },
    code: 'Code',
    result: 'Result',
    run: 'Run',
    auto: 'Auto-run',
    reset: 'Reset',
    download: 'Download .html',
    examples: 'Example',
    ex: { hello: 'Hello world', counter: 'Counter button', loop: 'Variables and loops' },
    console: 'Console',
    clear: 'Clear',
    consoleEmpty: 'Nothing logged yet. Use console.log() in JavaScript.',
    confirmReset: 'Replace your current code with the example?'
  },
  footer: { tagline: 'Building, learning, experimenting.', made: 'Built with curiosity.', by: 'Designed & built by Pasha.' },
  egg: 'you found the unnecessary button. congratulations.'
}

export type Dict = typeof en

const id: Dict = {
  nav: { home: 'Beranda', about: 'Tentang', projects: 'Proyek', skills: 'Skill', experience: 'Pengalaman', contact: 'Kontak', terminal: 'Terminal', lab: 'Code Lab' },
  navDesc: {
    home: 'Kembali ke awal',
    about: 'Siapa aku dan apa yang kusuka',
    projects: 'Yang kubangun dan kueksperimenkan',
    skills: 'Tools, minat, dan yang sedang kupelajari',
    experience: 'Perjalanan sejauh ini',
    contact: 'Sapa aku atau mulai ngobrol',
    terminal: 'Arena percobaan command-line',
    lab: 'Tulis kode dan lihat hasilnya langsung'
  },
  ui: { menu: 'Menu', close: 'Tutup', soon: 'Segera', language: 'Bahasa', follow: 'Temukan aku' },
  hero: {
    eyebrow: 'Terbuka untuk peluang',
    based: 'Berbasis di Indonesia 🇮🇩',
    hi: 'Hai, aku',
    title: 'Aku membangun hal-hal digital dengan rasa ingin tahu, kreativitas, dan kode.',
    lead: 'Aku mahasiswa dan penggemar teknologi kreatif yang sedang menjelajahi pengembangan web, bisnis digital, AI, dan desain visual. Aku suka mengubah ide jadi pengalaman digital yang sederhana.',
    work: 'Lihat karyaku',
    connect: 'Yuk ngobrol',
    tag1: 'Masih belajar.',
    tag2: 'Masih membangun.',
    photoAlt: 'Potret Rafi Pasha',
    role: 'Mahasiswa dan penggemar teknologi kreatif'
  },
  strip: ['Teknologi', 'Kreativitas', 'AI', 'Bisnis digital', 'Web'],
  explore: { kicker: 'Semua ada di satu tempat', title: 'Mau ke mana dulu?' },
  about: {
    kicker: 'Sedikit tentang aku',
    title: 'Lebih dari sekadar portofolio.',
    copy: 'Aku menjelajahi titik temu antara teknologi, bisnis, dan kreativitas. Aku belajar dengan membuat sesuatu, bereksperimen dengan ide, dan mencari tahu bagaimana produk digital sebenarnya bekerja.',
    chips: ['Penasaran', 'Kreatif', 'Selalu belajar', 'Pemecah masalah', 'Penjelajah teknologi'],
    journey: [
      { y: '2024', text: 'Mulai menjelajahi kreativitas digital.' },
      { y: '2025', text: 'Bereksperimen dengan teknologi, AI, dan proyek digital.' },
      { y: '2026', text: 'Kuliah Sistem Informasi sambil menjelajahi pengembangan web, bisnis, dan teknologi.' }
    ],
    exploreKicker: 'Yang lagi bikin penasaran belakangan ini',
    exploreTitle: 'Sedang dieksplorasi',
    exploring: ['Pengembangan web', 'Kecerdasan buatan', 'Bisnis digital', 'Sistem informasi', 'UI/UX', 'Mandarin', 'Ide digital baru'],
    beyondKicker: 'Di luar layar',
    beyondTitle: 'Ada kehidupan di luar browser.',
    beyondCopy: 'Di luar membangun sesuatu, aku suka menemukan ide baru, bertemu orang, menjelajahi teknologi, mengedit visual, mendengarkan musik, dan memikirkan apa yang mau kubangun berikutnya.',
    tags: ['🎧 Musik', '📸 Visual', '💻 Teknologi', '🚀 Ide', '🤝 Orang', '🌏 Belajar']
  },
  projects: {
    kicker: 'Beberapa hal yang lagi kuutak-atik',
    title: 'Yang sudah kubangun.',
    filters: { All: 'Semua', Web: 'Web', AI: 'AI', Creative: 'Kreatif', Business: 'Bisnis' },
    empty: 'Belum ada di sini. Masih dibangun.',
    view: 'Lihat proyek',
    tech: 'Teknologi',
    caseTitle: 'Studi kasus',
    caseText: 'Gambaran umum, ide, tantangan, dan hal yang kupelajari akan ada di sini seiring proyek ini berkembang. Tanpa metrik karangan dan tanpa screenshot palsu.',
    status: { building: 'Dibangun', concept: 'Konsep', ongoing: 'Berjalan' }
  },
  skills: {
    kicker: 'Yang kukerjakan',
    title: 'Tools, minat, dan hal yang sedang kupelajari.',
    groups: { tech: 'Teknologi', creative: 'Kreatif', ai: 'AI', business: 'Bisnis' }
  },
  experience: {
    kicker: 'Perjalanan sejauh ini',
    title: 'Masih terus berproses.',
    items: [
      { y: '2026 sampai sekarang', title: 'Mahasiswa Sistem Informasi', text: 'Menjelajahi teknologi, bisnis, dan sistem digital.' },
      { y: '2026', title: 'Proyek Web & AI', text: 'Bereksperimen dengan produk digital pribadi dan konsep AI.' },
      { y: '2025', title: 'Eksplorasi kreatif & digital', text: 'Mulai menjelajahi desain, editing, bisnis digital, dan teknologi.' }
    ]
  },
  contact: {
    kicker: 'Punya ide?',
    title: 'Yuk bikin sesuatu yang menarik.',
    copy: 'Entah itu proyek, kolaborasi, atau sekadar ngobrol seru, aku terbuka untuk ide-ide menarik.',
    name: 'Nama',
    mail: 'Email',
    message: 'Pesan',
    send: 'Kirim pesan',
    sent: 'Pesan tervalidasi ✓',
    note: 'Hanya demo frontend. Tidak ada email yang terkirim karena belum ada backend.'
  },
  lab: {
    kicker: 'Arena ngoding',
    title: 'Coba ngoding langsung di sini.',
    hint: 'Tulis HTML, CSS, dan JavaScript, hasilnya berubah langsung. Kodenya cuma jalan di browser kamu dan disimpan di perangkat ini.',
    tabs: { html: 'HTML', css: 'CSS', js: 'JavaScript' },
    code: 'Kode',
    result: 'Hasil',
    run: 'Jalankan',
    auto: 'Jalan otomatis',
    reset: 'Reset',
    download: 'Unduh .html',
    examples: 'Contoh',
    ex: { hello: 'Halo dunia', counter: 'Tombol counter', loop: 'Variable dan loop' },
    console: 'Console',
    clear: 'Bersihkan',
    consoleEmpty: 'Belum ada log. Pakai console.log() di JavaScript.',
    confirmReset: 'Ganti kode kamu sekarang dengan contoh ini?'
  },
  footer: { tagline: 'Membangun, belajar, bereksperimen.', made: 'Dibuat dengan rasa ingin tahu.', by: 'Didesain & dibangun oleh Pasha.' },
  egg: 'kamu nemu tombol yang gak penting. selamat.'
}

export const dict: Record<Lang, Dict> = { en, id }
