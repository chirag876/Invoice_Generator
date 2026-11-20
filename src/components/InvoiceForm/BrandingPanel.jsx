import { useRef } from 'react'
import { Palette, Upload, X } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'

export function BrandingPanel({ invoice, onChange }) {
  const fileRef = useRef(null)

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange({ logoUrl: ev.target.result })
    reader.readAsDataURL(file)
  }

  return (
    <Card>
      <CardHeader title="Branding" icon={<Palette size={16} />} />
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* Logo Upload */}
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
              Company Logo
            </label>
            {invoice.logoUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={invoice.logoUrl}
                  alt="Logo"
                  className="h-14 w-auto max-w-[140px] object-contain rounded border border-slate-200 p-1"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onChange({ logoUrl: null })}
                >
                  <X size={12} /> Remove
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
              >
                <Upload size={18} className="mx-auto text-slate-400 mb-1" />
                <p className="text-xs text-slate-400">Click to upload logo</p>
                <p className="text-xs text-slate-300">PNG, JPG, SVG</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={invoice.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
              <span className="text-sm text-slate-600 font-mono">{invoice.accentColor}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
