import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'
import { api } from '../api'
import { Banner, Button, Card, Field, Input } from '../components/ui'
import ImageInput from '../components/ImageInput'
import ConfirmModal from '../components/ConfirmModal'

const emptyMember = { name: '', role: '', specialty: '', years: '', photo: '' }

const TeamPage = () => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMember)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = () => api.getTeam().then(setTeam).finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])

  const startEdit = (member) => {
    setEditing(member.id)
    setForm(member)
    setError('')
  }
  const startNew = () => {
    setEditing('new')
    setForm(emptyMember)
    setError('')
  }
  const cancel = () => {
    setEditing(null)
    setForm(emptyMember)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, years: Number(form.years) || 0 }
      if (editing === 'new') {
        await api.createTeamMember(payload)
      } else {
        await api.updateTeamMember(editing, payload)
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
    await api.deleteTeamMember(toDelete)
    setToDelete(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Team</h1>
          <p className="text-stone-500 mt-1">Shown on the About Us page. Leave photo empty to show initials.</p>
        </div>
        <Button onClick={startNew}>
          <FiPlus size={15} /> Add member
        </Button>
      </div>

      {editing && (
        <Card title={editing === 'new' ? 'New team member' : 'Edit team member'} className="mb-6">
          <form onSubmit={save} className="space-y-5">
            <ImageInput label="Photo (optional)" value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Role">
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </Field>
              <Field label="Specialty">
                <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
              </Field>
              <Field label="Years of experience">
                <Input type="number" min="0" value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
              </Field>
            </div>
            <Banner kind="error">{error}</Banner>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save member'}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member) => (
            <Card key={member.id} className="text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto overflow-hidden flex items-center justify-center text-stone-500 font-serif text-lg">
                {member.photo ? (
                  <img src={api.fileUrl(member.photo)} alt="" className="w-full h-full object-cover" />
                ) : (
                  member.name
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                )}
              </div>
              <h3 className="font-semibold text-stone-800 text-sm mt-3">{member.name}</h3>
              <p className="text-xs text-rose-600 mt-0.5">{member.role}</p>
              <p className="text-xs text-stone-400 mt-1">{member.specialty}</p>
              <p className="text-xs text-stone-400">{member.years} yrs</p>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => startEdit(member)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-rose-600">
                  <FiEdit2 size={12} /> Edit
                </button>
                <button onClick={() => setToDelete(member.id)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-red-600">
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Remove this team member?"
        message="This cannot be undone."
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default TeamPage
