import { Code, FolderOpen, Mail, Milestone, Sparkles, Terminal, User, Wrench, type LucideIcon } from 'lucide-react'
import type { PageKey } from '../lib/data'

export const pageIcons: Record<PageKey, LucideIcon> = {
  home: Sparkles,
  about: User,
  projects: FolderOpen,
  skills: Wrench,
  experience: Milestone,
  contact: Mail,
  terminal: Terminal,
  lab: Code
}
