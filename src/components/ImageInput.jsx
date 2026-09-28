import { useRef, useState } from 'react'
import { FiUpload, FiX, FiLoader } from 'react-icons/fi'
import { api } from '../api'

// Shows an image preview with an "upload from computer" button, and lets the
// admin paste an external URL instead. onChange receives the final URL/path
// to store on the content object (e.g. "/uploads/xyz.jpg" or a full https URL).
const ImageInput = ({ label, value, onChange }) => {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await api.upload(file)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      {label && (
        <span className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-1.5">{label}</span>
      )}
      <div className="flex gap-3 items-start">
        <div className="w-28 h-28 shrink-0 rounded-lg border border-stone-300 bg-stone-50 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={api.fileUrl(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-stone-400 text-center px-2">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL, or upload a file"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
          />
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md transition disabled:opacity-60"
            >
              {uploading ? <FiLoader className="animate-spin" size={13} /> : <FiUpload size={13} />}
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 px-2 py-1.5"
              >
                <FiX size={13} /> Clear
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default ImageInput
