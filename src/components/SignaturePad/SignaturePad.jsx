import { useEffect, useRef, useState } from 'react'
import SignaturePadLib from 'signature_pad'
import { PenLine, Trash2, Check } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function SignaturePad({ invoice, onSave, onClear, onChange }) {
  const canvasRef = useRef(null)
  const padRef = useRef(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    padRef.current = new SignaturePadLib(canvas, {
      penColor: '#1a1a2e',
      backgroundColor: 'rgba(0,0,0,0)',
      minWidth: 1,
      maxWidth: 3,
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

  const handleSave = () => {
    if (padRef.current.isEmpty()) return
    const dataUrl = padRef.current.toDataURL('image/png')
    onSave(dataUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    padRef.current?.clear()
    onClear()
    setSaved(false)
  }

  return (
    <Card>
      <CardHeader title="Signature" icon={<PenLine size={16} />} subtitle="Draw your handwritten signature" />
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* Canvas */}
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-accent/40 transition-colors">
            <canvas
              ref={canvasRef}
              className="signature-canvas w-full h-28 block"
            />
            {!invoice.signatureDataUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-300 select-none">Sign here ✍️</p>
              </div>
            )}
          </div>

          {/* Saved preview */}
          {invoice.signatureDataUrl && (
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-200">
              <img
                src={invoice.signatureDataUrl}
                alt="Saved signature"
                className="h-10 w-auto"
              />
              <span className="text-xs text-green-500 font-medium">Signature saved ✓</span>
            </div>
          )}

          {/* Signer name */}
          <Input
            label="Authorized by (name)"
            value={invoice.signatureName}
            onChange={(v) => onChange({ signatureName: v })}
            placeholder="Your name or designation"
          />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="accent" size="sm" onClick={handleSave}>
              <Check size={13} />
              {saved ? 'Saved!' : 'Save Signature'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 size={13} /> Clear
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
