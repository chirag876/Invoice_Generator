
import { useRef, useState } from 'react'
import { Save, Upload } from 'lucide-react'
import {
  saveTemplate,
  loadTemplate,
} from '../../utils/templateManager'

export function TemplateActions({ invoice, onImport }) {
  const fileRef = useRef(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSave = () => {
    try {
      saveTemplate(invoice)
      setIsError(false)
      setMessage('Template exported.')
    } catch (error) {
      setIsError(true)
      setMessage(error.message)
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      const data = await loadTemplate(file)

      const confirmed = window.confirm(
        'Importing will replace the current invoice. Continue?'
      )

      if (!confirmed) return

      onImport(data)

      setIsError(false)
      setMessage('Template imported successfully.')
    } catch (error) {
      setIsError(true)
      setMessage(error.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="px-3 py-3 border-b border-slate-200 bg-slate-50">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-2 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 bg-white rounded-lg hover:bg-indigo-50"
        >
          <Save size={14} />
          Save as Template
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 px-2 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-100"
        >
          <Upload size={14} />
          Import Template
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {message && (
        <p
          role="status"
          className={`mt-2 text-xs ${
            isError ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
