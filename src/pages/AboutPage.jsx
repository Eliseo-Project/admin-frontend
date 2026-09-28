import { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input, Select, Textarea } from '../components/ui'
import ImageInput from '../components/ImageInput'

const ICON_OPTIONS = [
  { value: 'feather', label: 'Feather (Artistry)' },
  { value: 'heart', label: 'Heart (Care)' },
  { value: 'shield', label: 'Shield (Integrity)' },
  { value: 'award', label: 'Award' },
  { value: 'users', label: 'Users' },
  { value: 'star', label: 'Star' },
]

const AboutPage = () => {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getAbout().then(setForm)
  }, [])

  const updateValue = (index, patch) => {
    const values = form.values.map((v, i) => (i === index ? { ...v, ...patch } : v))
    setForm({ ...form, values })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.updateAbout(form)
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
      <h1 className="text-2xl font-semibold text-stone-800 mb-1">About Us Page</h1>
      <p className="text-stone-500 mb-6">Hero image, our story, values and the mission statement.</p>

      <form onSubmit={save} className="space-y-6">
        <Card title="Hero & story images">
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageInput label="Hero background image" value={form.heroImage} onChange={(url) => setForm({ ...form, heroImage: url })} />
            <ImageInput label="Our Story image" value={form.storyImage} onChange={(url) => setForm({ ...form, storyImage: url })} />
          </div>
        </Card>

        <Card title="Our Story text">
          <div className="space-y-5">
            <Field label="Heading">
              <Input value={form.storyHeading} onChange={(e) => setForm({ ...form, storyHeading: e.target.value })} />
            </Field>
            <Field label="Paragraph 1">
              <Textarea rows={4} value={form.storyParagraph1} onChange={(e) => setForm({ ...form, storyParagraph1: e.target.value })} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea rows={3} value={form.storyParagraph2} onChange={(e) => setForm({ ...form, storyParagraph2: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Values" description="The three value cards shown on the About page.">
          <div className="space-y-5">
            {form.values.map((v, i) => (
              <div key={i} className="grid sm:grid-cols-3 gap-4 border border-stone-200 rounded-lg p-4">
                <Field label="Icon">
                  <Select value={v.icon} onChange={(e) => updateValue(i, { icon: e.target.value })}>
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Title">
                  <Input value={v.title} onChange={(e) => updateValue(i, { title: e.target.value })} />
                </Field>
                <Field label="Text">
                  <Input value={v.text} onChange={(e) => updateValue(i, { text: e.target.value })} />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Mission statement">
          <Field label="Quote">
            <Textarea rows={3} value={form.missionQuote} onChange={(e) => setForm({ ...form, missionQuote: e.target.value })} />
          </Field>
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

export default AboutPage
