import { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input } from '../components/ui'
import ImageInput from '../components/ImageInput'

const ContactPage = () => {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getContact().then(setForm)
  }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.updateContact(form)
      setForm(updated)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <p className="text-stone-400 text-sm">Loading…</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 mb-1">Contact Info</h1>
      <p className="text-stone-500 mb-6">Shown in the footer and on the Contact Us page.</p>

      <form onSubmit={save} className="space-y-6">
        <Card title="Details">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Address">
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>
            <Field label="Map search text">
              <Input value={form.mapQuery} onChange={(e) => setForm({ ...form, mapQuery: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Phone (secondary, optional)">
              <Input value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Instagram URL">
              <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </Field>
            <Field label="Facebook URL">
              <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
            </Field>
            <Field label="Opening hours — line 1">
              <Input value={form.hoursLine1} onChange={(e) => setForm({ ...form, hoursLine1: e.target.value })} />
            </Field>
            <Field label="Opening hours — line 2">
              <Input value={form.hoursLine2} onChange={(e) => setForm({ ...form, hoursLine2: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Contact page hero image">
          <ImageInput value={form.heroImage} onChange={(url) => setForm({ ...form, heroImage: url })} />
        </Card>

        <Banner kind="error">{error}</Banner>
        <Banner kind="success">{saved ? 'Saved.' : ''}</Banner>

        <Button type="submit" disabled={saving}>
          <FiSave size={14} /> {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  )
}

export default ContactPage
