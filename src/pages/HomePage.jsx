import { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input, Textarea } from '../components/ui'
import ImageInput from '../components/ImageInput'

const HomePage = () => {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getHome().then(setForm)
  }, [])

  const updateGalleryImage = (index, url) => {
    const galleryImages = form.galleryImages.map((g, i) => (i === index ? url : g))
    setForm({ ...form, galleryImages })
  }

  const updateMobileServiceImage = (index, url) => {
    const mobileServiceImages = form.mobileServiceImages.map((g, i) => (i === index ? url : g))
    setForm({ ...form, mobileServiceImages })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.updateHome(form)
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
      <h1 className="text-2xl font-semibold text-stone-800 mb-1">Home Page</h1>
      <p className="text-stone-500 mb-6">Hero text, welcome section image, gallery photos and the closing banner.</p>

      <form onSubmit={save} className="space-y-6">
        <Card title="Hero section" description="The full-screen welcome section at the top of the site.">
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Title line 1">
                <Input value={form.heroTitleLine1} onChange={(e) => setForm({ ...form, heroTitleLine1: e.target.value })} />
              </Field>
              <Field label="Title line 2 (italic accent)">
                <Input value={form.heroTitleLine2} onChange={(e) => setForm({ ...form, heroTitleLine2: e.target.value })} />
              </Field>
            </div>
            <Field label="Subtitle">
              <Textarea rows={3} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
            </Field>
            <ImageInput
              label="Background image (optional — leave empty to keep the default dark green look)"
              value={form.heroBackgroundImage}
              onChange={(url) => setForm({ ...form, heroBackgroundImage: url })}
            />
          </div>
        </Card>

        <Card title="Welcome / Philosophy section image">
          <ImageInput value={form.welcomeImage} onChange={(url) => setForm({ ...form, welcomeImage: url })} />
        </Card>

        <Card title="Gallery" description="The six photos in the 'Moments of Elegance' gallery grid.">
          <div className="grid sm:grid-cols-3 gap-5">
            {form.galleryImages.map((img, i) => (
              <ImageInput key={i} label={`Photo ${i + 1}`} value={img} onChange={(url) => updateGalleryImage(i, url)} />
            ))}
          </div>
        </Card>

        <Card
          title="Eliseo To You — Mobile Service section"
          description="The homepage teaser for the mobile service, with a link through to its own page."
        >
          <div className="space-y-5">
            <Field label="Subtitle">
              <Textarea
                rows={3}
                value={form.mobileServiceSubtitle}
                onChange={(e) => setForm({ ...form, mobileServiceSubtitle: e.target.value })}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              {form.mobileServiceImages.map((img, i) => (
                <ImageInput key={i} label={`Photo ${i + 1}`} value={img} onChange={(url) => updateMobileServiceImage(i, url)} />
              ))}
            </div>
          </div>
        </Card>

        <Card title="Closing call-to-action banner image">
          <ImageInput value={form.ctaImage} onChange={(url) => setForm({ ...form, ctaImage: url })} />
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

export default HomePage
