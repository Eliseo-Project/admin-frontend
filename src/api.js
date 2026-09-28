const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {}
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  url: API_URL,
  fileUrl: (p) => (p && p.startsWith('/uploads') ? `${API_URL}${p}` : p || ''),

  upload: async (file) => {
    const form = new FormData()
    form.append('image', file)
    const result = await request('/upload', { method: 'POST', body: form, isForm: true })
    return result.url
  },

  getCategories: () => request('/services'),
  createCategory: (payload) => request('/services', { method: 'POST', body: payload }),
  updateCategory: (slug, payload) => request(`/services/${slug}`, { method: 'PUT', body: payload }),
  deleteCategory: (slug) => request(`/services/${slug}`, { method: 'DELETE' }),

  getOffers: () => request('/offers'),
  createOffer: (payload) => request('/offers', { method: 'POST', body: payload }),
  updateOffer: (id, payload) => request(`/offers/${id}`, { method: 'PUT', body: payload }),
  deleteOffer: (id) => request(`/offers/${id}`, { method: 'DELETE' }),

  getTeam: () => request('/team'),
  createTeamMember: (payload) => request('/team', { method: 'POST', body: payload }),
  updateTeamMember: (id, payload) => request(`/team/${id}`, { method: 'PUT', body: payload }),
  deleteTeamMember: (id) => request(`/team/${id}`, { method: 'DELETE' }),

  getTestimonials: () => request('/testimonials'),
  createTestimonial: (payload) => request('/testimonials', { method: 'POST', body: payload }),
  updateTestimonial: (id, payload) => request(`/testimonials/${id}`, { method: 'PUT', body: payload }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: 'DELETE' }),

  getAbout: () => request('/about'),
  updateAbout: (payload) => request('/about', { method: 'PUT', body: payload }),

  getHome: () => request('/home'),
  updateHome: (payload) => request('/home', { method: 'PUT', body: payload }),

  getContact: () => request('/contact'),
  updateContact: (payload) => request('/contact', { method: 'PUT', body: payload }),
}
