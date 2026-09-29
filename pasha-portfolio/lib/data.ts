export const socials = {
  instagram: 'https://instagram.com/apiwwsyududu_',
  github: 'https://github.com/SpiderGacir/',
  linkedin: 'https://linkedin.com/',
  email: 'mailto:rafipashawildan1@gmail.com'
}

export type PageKey = 'home' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'terminal' | 'lab'

// soon = halamannya belum ada (Terminal menyusul)
export const pages: { key: PageKey; href: string; soon?: boolean }[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'skills', href: '/skills' },
  { key: 'experience', href: '/experience' },
  { key: 'contact', href: '/contact' },
  { key: 'terminal', href: '/terminal', soon: true },
  { key: 'lab', href: '/lab' }
]

export type Project = {
  name: string
  cat: 'Web' | 'AI' | 'Creative'
  status: 'building' | 'concept' | 'ongoing'
  tech: string[]
  desc: { id: string; en: string }
}

export const projects: Project[] = [
  {
    name: 'RafzDeploy', cat: 'Web', status: 'building', tech: ['Next.js', 'Supabase', 'Vercel', 'JavaScript'],
    desc: {
      en: 'A personal web deployment experiment designed to upload and publish static websites through a simple workflow.',
      id: 'Eksperimen deployment web pribadi untuk mengunggah dan mempublikasikan website statis lewat alur yang sederhana.'
    }
  },
  {
    name: 'SnapStudy AI', cat: 'AI', status: 'concept', tech: ['AI', 'Web', 'Database'],
    desc: {
      en: 'An experimental concept for an AI-powered study assistant to help students learn and organize study materials.',
      id: 'Konsep eksperimental asisten belajar berbasis AI untuk membantu pelajar belajar dan merapikan materi.'
    }
  },
  {
    name: 'Mandarin AI Tutor', cat: 'AI', status: 'concept', tech: ['AI', 'Language Learning', 'Web'],
    desc: {
      en: 'An experimental AI learning concept for practicing Mandarin through interactive conversations.',
      id: 'Konsep pembelajaran AI eksperimental untuk berlatih bahasa Mandarin lewat percakapan interaktif.'
    }
  },
  {
    name: 'Personal Creative Projects', cat: 'Creative', status: 'ongoing', tech: ['Photo Editing', 'Design', 'AI Tools'],
    desc: {
      en: 'Visual experiments, photo editing, digital concepts, and other creative projects.',
      id: 'Eksperimen visual, edit foto, konsep digital, dan proyek kreatif lainnya.'
    }
  }
]

export const skillGroups: { key: 'tech' | 'creative' | 'ai' | 'business'; items: string[] }[] = [
  { key: 'tech', items: ['HTML', 'CSS', 'JavaScript', 'Next.js', 'GitHub', 'Supabase', 'Vercel'] },
  { key: 'creative', items: ['Photo Editing', 'Visual Design', 'Content Creation', 'UI/UX Exploration'] },
  { key: 'ai', items: ['AI Tools', 'Prompt Engineering', 'AI-assisted Development'] },
  { key: 'business', items: ['Digital Business', 'E-commerce', 'Digital Marketing', 'Product Thinking'] }
]
