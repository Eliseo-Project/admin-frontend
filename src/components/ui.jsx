// Small shared form/UI primitives used across every admin page.

export const Card = ({ title, description, actions, children, className = '' }) => (
  <div className={`bg-white border border-stone-200 rounded-xl shadow-sm ${className}`}>
    {(title || actions) && (
      <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-stone-100">
        <div>
          {title && <h2 className="text-lg font-semibold text-stone-800">{title}</h2>}
          {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
)

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-xs text-stone-400 mt-1">{hint}</span>}
  </label>
)

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition'

export const Input = (props) => <input {...props} className={`${inputClass} ${props.className || ''}`} />

export const Textarea = (props) => (
  <textarea {...props} className={`${inputClass} resize-y ${props.className || ''}`} />
)

export const Select = (props) => (
  <select {...props} className={`${inputClass} ${props.className || ''}`}>
    {props.children}
  </select>
)

export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-rose-600 text-white hover:bg-rose-700',
    secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    ghost: 'text-stone-600 hover:bg-stone-100',
  }
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  )
}

export const Banner = ({ kind = 'info', children }) => {
  const kinds = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  if (!children) return null
  return <div className={`text-sm border rounded-lg px-4 py-3 ${kinds[kind]}`}>{children}</div>
}
