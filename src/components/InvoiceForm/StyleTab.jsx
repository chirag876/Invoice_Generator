import { useEffect, useRef } from 'react'
import SignaturePadLib from 'signature_pad'
import { Upload, X, Check, Trash2, PenLine, RotateCw } from 'lucide-react'

const ACCENT_PRESETS = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#1a1a2e',
]

export function StyleTab({ invoice, onChange }) {
  const fileRef = useRef(null)
  const sigFileRef = useRef(null)
  const canvasRef = useRef(null)
  const padRef = useRef(null)

  // Init signature pad
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    padRef.current = new SignaturePadLib(canvas, {
      penColor: '#1a1a2e',
      backgroundColor: 'rgba(0,0,0,0)',
      minWidth: 1, maxWidth: 3,
    })
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const data = padRef.current.toData()
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
      padRef.current.clear()
      padRef.current.fromData(data)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange({ logoUrl: ev.target.result, logoSize: 80, logoRotation: 0 })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSigUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange({ signatureDataUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSaveDraw = () => {
    if (!padRef.current || padRef.current.isEmpty()) return
    onChange({ signatureDataUrl: padRef.current.toDataURL('image/png') })
  }

  const handleClearSig = () => {
    padRef.current?.clear()
    onChange({ signatureDataUrl: null })
  }

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Logo */}
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Logo</p>
        {invoice.logoUrl ? (
          <div className="flex flex-col gap-3">
            {/* Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={invoice.logoUrl}
                alt="Logo preview"
                style={{
                  width: `${invoice.logoSize || 80}px`,
                  transform: `rotate(${invoice.logoRotation || 0}deg)`,
                  transition: 'width 0.1s, transform 0.1s',
                }}
                className="object-contain rounded flex-shrink-0"
              />
              <button onClick={() => onChange({ logoUrl: null })}
                className="ml-auto text-xs text-red-400 hover:text-red-600 flex items-center gap-1 font-medium flex-shrink-0">
                <X size={12} /> Remove
              </button>
            </div>
            {/* Size slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500 font-medium">Size</label>
                <span className="text-xs text-slate-400">{invoice.logoSize || 80}px</span>
              </div>
              <input type="range" min="30" max="200" value={invoice.logoSize || 80}
                onChange={(e) => onChange({ logoSize: parseInt(e.target.value) })}
                className="w-full accent-indigo-600" />
            </div>
            {/* Rotation slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <RotateCw size={11} /> Rotation
                </label>
                <span className="text-xs text-slate-400">{invoice.logoRotation || 0}°</span>
              </div>
              <input type="range" min="-180" max="180" value={invoice.logoRotation || 0}
                onChange={(e) => onChange({ logoRotation: parseInt(e.target.value) })}
                className="w-full accent-indigo-600" />
              <button onClick={() => onChange({ logoRotation: 0 })}
                className="mt-1 text-xs text-slate-400 hover:text-slate-600">Reset rotation</button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400/50 hover:bg-indigo-50/50 transition-colors"
          >
            <Upload size={18} className="mx-auto text-slate-300 mb-1.5" />
            <p className="text-xs text-slate-400 font-medium">Click to upload logo</p>
            <p className="text-xs text-slate-300 mt-0.5">PNG, JPG, SVG</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
      </section>

      {/* Accent Color */}
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Accent Color</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {ACCENT_PRESETS.map((color) => (
            <button key={color} onClick={() => onChange({ accentColor: color })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: color, borderColor: invoice.accentColor === color ? '#1a1a2e' : 'transparent' }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input type="color" value={invoice.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white" />
          <span className="text-sm text-slate-500 font-mono">{invoice.accentColor}</span>
        </div>
      </section>

      {/* Signature */}
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Signature</p>
        <div className="flex flex-col gap-3">

          {/* Saved preview */}
          {invoice.signatureDataUrl && (
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-200">
              <img src={invoice.signatureDataUrl} alt="Signature" className="h-10 w-auto" />
              <span className="text-xs text-emerald-500 font-semibold">✓ Signature saved</span>
            </div>
          )}

          {/* Draw */}
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1">
              <PenLine size={11} /> Draw signature
            </p>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-indigo-300 transition-colors">
              <canvas ref={canvasRef} className="signature-canvas w-full h-24 block" />
              {!invoice.signatureDataUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-xs text-slate-300">Draw here ✍️</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveDraw}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                <Check size={12} /> Save Drawing
              </button>
              <button onClick={handleClearSig}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>

          {/* OR Upload */}
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or upload</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <button
            onClick={() => sigFileRef.current?.click()}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-medium hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors w-full"
          >
            <Upload size={13} /> Upload signature image (PNG, JPG)
          </button>
          <input ref={sigFileRef} type="file" accept="image/*" className="hidden" onChange={handleSigUpload} />

          {/* Name */}
          <input
            value={invoice.signatureName || ''}
            onChange={(e) => onChange({ signatureName: e.target.value })}
            placeholder="Authorized by (name / designation)"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>
      </section>
    </div>
  )
}
