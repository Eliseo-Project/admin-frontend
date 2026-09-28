import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input, Textarea } from '../components/ui'
import ConfirmModal from '../components/ConfirmModal'

const emptyTestimonial = { name: '', role: '', quote: '' }

const TestimonialsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyTestimonial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = () => api.getTestimonials().then(setItems).finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])

  const startEdit = (t) => {
    setEditing(t.id)
    setForm(t)
    setError('')
  }
  const startNew = () => {
    setEditing('new')
    setForm(emptyTestimonial)
    setError('')
  }
  const cancel = () => {
    setEditing(null)
    setForm(emptyTestimonial)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') {
        await api.createTestimonial(form)
      } else {
        await api.updateTestimonial(editing, form)
      }
      await load()
      cancel()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    await api.deleteTestimonial(toDelete)
    setToDelete(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Testimonials</h1>
          <p className="text-stone-500 mt-1">Client quotes shown in the Home page slider.</p>
        </div>
        <Button onClick={startNew}>
          <FiPlus size={15} /> Add testimonial
        </Button>
      </div>

      {editing && (
        <Card title={editing === 'new' ? 'New testimonial' : 'Edit testimonial'} className="mb-6">
          <form onSubmit={save} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Role / description">
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Regular Client, 3 years" />
              </Field>
            </div>
            <Field label="Quote">
              <Textarea rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
            </Field>
            <Banner kind="error">{error}</Banner>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save testimonial'}
              </Button>
              <Button type="button" variant="secondary" onClick={cancel}>
                <FiX size={15} /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((t) => (
            <Card key={t.id}>
              <p className="text-sm text-stone-700 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-semibold text-stone-800 mt-3">{t.name}</p>
              <p className="text-xs text-stone-400">{t.role}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => startEdit(t)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-rose-600">
                  <FiEdit2 size={12} /> Edit
                </button>
                <button onClick={() => setToDelete(t.id)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-red-600">
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this testimonial?"
        message="This cannot be undone."
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default TestimonialsPage
