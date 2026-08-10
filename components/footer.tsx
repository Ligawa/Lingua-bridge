import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail as MailIcon, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-50 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%206%2C%202026%2C%2003_08_50%20PM-90soxHyLHqGFp3wNGrmkrGydAqqFzT.png" alt="LinguaBridge logo" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-lg">LinguaBridge</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              Urgent translation services and practical short courses connecting people, work, and opportunity across languages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/programs" className="text-slate-400 hover:text-white transition">Programs</Link></li>
              <li><Link href="/faq" className="text-slate-400 hover:text-white transition">FAQ</Link></li>
              <li><Link href="/verify" className="text-slate-400 hover:text-white transition">Verify Certificate</Link></li>
              <li><Link href="/auth/login" className="text-slate-400 hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/certificates" className="text-slate-400 hover:text-white transition">My Certificates</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Staff Portal */}
          <div>
            <h4 className="font-semibold mb-4">Staff Portal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="text-slate-400 hover:text-white transition">Staff Portal</Link></li>
              <li><Link href="/admin/programs" className="text-slate-400 hover:text-white transition">Staff Programs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-slate-400">United Kingdom</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <a href="tel:+447846909616" className="text-slate-400 hover:text-white transition">+44 7846 909616</a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <a href="mailto:info@linguab.com" className="text-slate-400 hover:text-white transition">info@linguab.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Links */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Instagram className="h-5 w-5" /></a>
          </div>
          <p className="text-slate-500 text-sm">© 2024 LinguaBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
