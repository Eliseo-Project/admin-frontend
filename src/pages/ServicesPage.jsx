import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiSave, FiX } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input } from '../components/ui'
import ImageInput from '../components/ImageInput'
import ConfirmModal from '../components/ConfirmModal'

const emptySubCategory = () => ({ name: '', items: [{ name: '', price: '' }] })

const CategoryCard = ({ category, onSaved, onDeleted }) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ images: [], ...category })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const updateGalleryImage = (index, url) => {
    const images = form.images.map((img, i) => (i === index ? url : img))
    setForm({ ...form, images })
  }
  const addGalleryImage = () => setForm({ ...form, images: [...form.images, ''] })
  const removeGalleryImage = (index) =>
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) })

  const updateSub = (index, patch) => {
    const subCategories = form.subCategories.map((s, i) => (i === index ? { ...s, ...patch } : s))
    setForm({ ...form, subCategories })
  }
  const updateItem = (subIndex, itemIndex, patch) => {
    const subCategories = form.subCategories.map((s, i) => {
      if (i !== subIndex) return s
      const items = s.items.map((it, j) => (j === itemIndex ? { ...it, ...patch } : it))
      return { ...s, items }
    })
    setForm({ ...form, subCategories })
  }
  const addSub = () => setForm({ ...form, subCategories: [...form.subCategories, emptySubCategory()] })
  const removeSub = (index) =>
    setForm({ ...form, subCategories: form.subCategories.filter((_, i) => i !== index) })
  const addItem = (subIndex) => {
    const subCategories = form.subCategories.map((s, i) =>
      i === subIndex ? { ...s, items: [...s.items, { name: '', price: '' }] } : s,
    )
    setForm({ ...form, subCategories })
  }
  const removeItem = (subIndex, itemIndex) => {
    const subCategories = form.subCategories.map((s, i) =>
      i === subIndex ? { ...s, items: s.items.filter((_, j) => j !== itemIndex) } : s,
    )
    setForm({ ...form, subCategories })
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await api.updateCategory(category.slug, form)
      onSaved(updated)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="!p-0 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
            {form.image && <img src={api.fileUrl(form.image)} alt="" className="w-full h-full object-cover" />}
          </div>
          <div>
            <p className="font-semibold text-stone-800">{form.name}</p>
            <p className="text-xs text-stone-400">{form.subCategories.length} sub-categories</p>
          </div>
        </div>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-stone-100 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </Field>
          </div>
          <ImageInput label="Category image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <div>
            <span className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
              Extra gallery images (shown on the Services page)
            </span>
            <div className="grid sm:grid-cols-2 gap-5">
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ImageInput value={img} onChange={(url) => updateGalleryImage(i, url)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="mt-1 text-stone-400 hover:text-red-600 shrink-0"
                  >
                    <FiX size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addGalleryImage}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              <FiPlus size={12} /> Add gallery image
            </button>
          </div>

          <div className="space-y-5">
            {form.subCategories.map((sub, si) => (
              <div key={si} className="rounded-lg border border-stone-200 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <Input
                    value={sub.name}
                    onChange={(e) => updateSub(si, { name: e.target.value })}
                    placeholder="Sub-category name (e.g. Hair)"
                    className="max-w-xs"
                  />
                  <button onClick={() => removeSub(si)} className="text-stone-400 hover:text-red-600">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {sub.items.map((item, ii) => (
                    <div key={ii} className="flex gap-2 items-center">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(si, ii, { name: e.target.value })}
                        placeholder="Service name"
                        className="flex-1"
                      />
                      <Input
                        value={item.price}
                        onChange={(e) => updateItem(si, ii, { price: e.target.value })}
                        placeholder="Rs. 0,000"
                        className="w-32"
                      />
                      <button onClick={() => removeItem(si, ii)} className="text-stone-400 hover:text-red-600 shrink-0">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addItem(si)}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  <FiPlus size={12} /> Add service
                </button>
              </div>
            ))}
            <button onClick={addSub} className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700">
              <FiPlus size={14} /> Add sub-category
            </button>
          </div>

          <Banner kind="error">{error}</Banner>

          <div className="flex items-center justify-between">
            <Button onClick={save} disabled={saving}>
              <FiSave size={14} /> {saving ? 'Saving…' : 'Save category'}
            </Button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600"
            >
              <FiTrash2 size={13} /> Delete category
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmingDelete}
        title={`Delete "${category.name}"?`}
        message="All its sub-categories and services will be removed too."
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={async () => {
          await api.deleteCategory(category.slug)
          setConfirmingDelete(false)
          onDeleted(category.slug)
        }}
      />
    </Card>
  )
}

const ServicesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  const load = () => api.getCategories().then(setCategories).finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])

  const createCategory = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const created = await api.createCategory({ name: newName, tagline: '', image: '', images: [], subCategories: [] })
      setCategories([...categories, created])
      setNewName('')
      setAdding(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Services</h1>
          <p className="text-stone-500 mt-1">Categories, sub-categories, service names and prices.</p>
        </div>
        <Button onClick={() => setAdding((v) => !v)}>
          <FiPlus size={15} /> Add category
        </Button>
      </div>

      {adding && (
        <Card className="mb-6">
          <form onSubmit={createCategory} className="flex items-end gap-3">
            <Field label="New category name">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Bridal" required />
            </Field>
            <Button type="submit">Create</Button>
          </form>
          <Banner kind="error">{error}</Banner>
        </Card>
      )}

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              onSaved={(updated) => setCategories((cs) => cs.map((c) => (c.slug === cat.slug ? updated : c)))}
              onDeleted={(slug) => setCategories((cs) => cs.filter((c) => c.slug !== slug))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesPage
