import { NavLink, Outlet } from 'react-router-dom'
import {
  FiGrid,
  FiScissors,
  FiTag,
  FiUsers,
  FiMessageSquare,
  FiInfo,
  FiHome,
  FiPhone,
  FiExternalLink,
} from 'react-icons/fi'

const nav = [
  { to: '/', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/services', label: 'Services', icon: FiScissors },
  { to: '/offers', label: 'Offers', icon: FiTag },
  { to: '/team', label: 'Team', icon: FiUsers },
  { to: '/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/about', label: 'About Us', icon: FiInfo },
  { to: '/home-page', label: 'Home Page', icon: FiHome },
  { to: '/contact', label: 'Contact Info', icon: FiPhone },
]

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-stone-50">
      <aside className="w-64 shrink-0 bg-stone-900 text-stone-200 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-serif text-xl text-white">Eliseo</p>
          <p className="text-[11px] tracking-widest uppercase text-rose-300 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive ? 'bg-rose-600 text-white' : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <a
            href="https://eliseobeauty.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-white/10 hover:text-white transition"
          >
            <FiExternalLink size={16} /> View site
          </a>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
