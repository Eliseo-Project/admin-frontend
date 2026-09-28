import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input, Textarea } from '../components/ui'
import ImageInput from '../components/ImageInput'
import ConfirmModal from '../components/ConfirmModal'

const emptyOffer = { title: '', tag: '', image: '', description: '', validUntil: '' }

const OffersPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // offer being edited, or 'new'
  const [form, setForm] = useState(emptyOffer)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = () => api.getOffers().then(setOffers).finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])

  const startEdit = (offer) => {
    setEditing(offer.id)
    setForm(offer)
    setError('')
  }
  const startNew = () => {
    setEditing('new')
    setForm(emptyOffer)
    setError('')
  }
  const cancel = () => {
    setEditing(null)
    setForm(emptyOffer)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') {
        await api.createOffer(form)
      } else {
        await api.updateOffer(editing, form)
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
    await api.deleteOffer(toDelete)
    setToDelete(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Offers</h1>
          <p className="text-stone-500 mt-1">Promotions shown on the Home page slider and the Offers page.</p>
        </div>
        <Button onClick={startNew}>
          <FiPlus size={15} /> Add offer
        </Button>
      </div>

      {editing && (
        <Card title={editing === 'new' ? 'New offer' : 'Edit offer'} className="mb-6">
          <form onSubmit={save} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Title">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </Field>
              <Field label="Tag (e.g. 20% Off, New, Combo)">
                <Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
              </Field>
            </div>
            <ImageInput label="Image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <Field label="Description">
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Valid until">
              <Input value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
            </Field>
            <Banner kind="error">{error}</Banner>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save offer'}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden !p-0">
              <div className="h-36 bg-stone-100">
                {offer.image && (
                  <img src={api.fileUrl(offer.image)} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wide bg-rose-50 text-rose-600 px-2 py-0.5 rounded">
                    {offer.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-stone-800 text-sm">{offer.title}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{offer.description}</p>
                <p className="text-xs text-stone-400 mt-2">{offer.validUntil}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(offer)}
                    className="flex items-center gap-1 text-xs text-stone-600 hover:text-rose-600"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setToDelete(offer.id)}
                    className="flex items-center gap-1 text-xs text-stone-600 hover:text-red-600"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this offer?"
        message="This cannot be undone."
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default OffersPage
