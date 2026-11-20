import { Input } from '../ui/Input'

export function ClientTab({ receiver, onChange }) {
  const r = receiver
  return (
    <div className="flex flex-col gap-4 p-4">
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Client Details</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name / Company" value={r.name} onChange={(v) => onChange({ name: v })} placeholder="Client Name" className="col-span-2" />
          <Input label="Email" type="email" value={r.email} onChange={(v) => onChange({ email: v })} placeholder="client@example.com" />
          <Input label="Phone" value={r.phone} onChange={(v) => onChange({ phone: v })} placeholder="+91 98765 43210" />
          <Input label="Address" value={r.address} onChange={(v) => onChange({ address: v })} placeholder="Client address" className="col-span-2" />
          <Input label="City" value={r.city} onChange={(v) => onChange({ city: v })} placeholder="Mumbai" />
          <Input label="State" value={r.state} onChange={(v) => onChange({ state: v })} placeholder="Maharashtra" />
          <Input label="Pincode" value={r.pincode} onChange={(v) => onChange({ pincode: v })} placeholder="400001" />
          <Input label="GSTIN" value={r.gstin} onChange={(v) => onChange({ gstin: v })} placeholder="22BBBBB0000B1Z5" className="col-span-2" />
        </div>
      </section>
    </div>
  )
}
