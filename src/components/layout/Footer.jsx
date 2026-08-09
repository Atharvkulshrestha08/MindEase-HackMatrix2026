import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden bg-[#08060d] text-white">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Top Section: Newsletter & Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Ready for a clearer mind?
            </h2>
            <p className="text-lg text-white/60 max-w-md">
              Join our newsletter for weekly mindfulness tips, updates, and community highlights.
            </p>
            <div className="relative max-w-md mt-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 outline-none focus:border-white/30 transition-colors backdrop-blur-md"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-white text-black w-10 flex items-center justify-center rounded-xl hover:bg-gray-200 transition-colors">
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-white tracking-wide uppercase text-xs opacity-50">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/app/companion" className="text-white/70 hover:text-white transition-colors">AI Companion</Link></li>
                <li><Link to="/app/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/app/journal" className="text-white/70 hover:text-white transition-colors">Journal</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white tracking-wide uppercase text-xs opacity-50">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/app/activities" className="text-white/70 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/app/community" className="text-white/70 hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/app/data-explorer" className="text-white/70 hover:text-white transition-colors">Statistics</Link></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white tracking-wide uppercase text-xs opacity-50">Legal</h4>
              <ul className="space-y-3 flex sm:block gap-6">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li className="hidden sm:block"><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Watermark */}
        <div className="w-full flex justify-center mb-16 overflow-hidden">
          <h1 className="text-[12vw] font-black tracking-tighter leading-none select-none" 
              style={{ 
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: 0.8
              }}>
            MINDEASE
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} MindEase Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
