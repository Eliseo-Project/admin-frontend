import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiScissors, FiTag, FiUsers, FiMessageSquare, FiArrowRight } from 'react-icons/fi'
import { api } from '../api'
import { Card } from '../components/ui'

const tiles = [
  { key: 'categories', label: 'Service Categories', to: '/services', icon: FiScissors },
  { key: 'offers', label: 'Active Offers', to: '/offers', icon: FiTag },
  { key: 'team', label: 'Team Members', to: '/team', icon: FiUsers },
  { key: 'testimonials', label: 'Testimonials', to: '/testimonials', icon: FiMessageSquare },
]

const Dashboard = () => {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    Promise.all([api.getCategories(), api.getOffers(), api.getTeam(), api.getTestimonials()]).then(
      ([categories, offers, team, testimonials]) => {
        setCounts({ categories: categories.length, offers: offers.length, team: team.length, testimonials: testimonials.length })
      },
    )
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>
      <p className="text-stone-500 mt-1 mb-8">
        Manage every piece of content on the Eliseo Beauty Lounge website — services, offers, team,
        testimonials, about us, home page images and contact details.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {tiles.map((t) => (
          <Link key={t.key} to={t.to}>
            <Card className="hover:border-rose-300 transition-colors h-full">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <t.icon size={18} />
                </div>
                <span className="text-2xl font-semibold text-stone-800">{counts[t.key] ?? '–'}</span>
              </div>
              <p className="text-sm text-stone-500 mt-4">{t.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card title="Quick links">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { to: '/about', label: 'Edit About Us page & images' },
            { to: '/home-page', label: 'Edit Home page images & gallery' },
            { to: '/contact', label: 'Edit contact details & map' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50/40 transition text-sm text-stone-700"
            >
              {l.label}
              <FiArrowRight size={14} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
