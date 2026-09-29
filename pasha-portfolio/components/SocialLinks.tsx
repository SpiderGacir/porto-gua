import { Github, Instagram, Mail } from 'lucide-react'
import { socials } from '../lib/data'

export default function SocialLinks({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <div className={className}>
      <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={size} /></a>
      <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={size} /></a>
      <a href={socials.email} aria-label="Email"><Mail size={size} /></a>
    </div>
  )
}
