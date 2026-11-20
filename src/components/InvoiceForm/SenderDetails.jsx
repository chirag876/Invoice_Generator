import { User } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Input } from '../ui/Input'

export function SenderDetails({ sender, onChange }) {
  return (
    <Card>
      <CardHeader title="From (Your Details)" icon={<User size={16} />} />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Name / Company"
            value={sender.name}
            onChange={(v) => onChange({ name: v })}
            placeholder="Your Name or Company"
            className="col-span-2"
            required
          />
          <Input
            label="Email"
            value={sender.email}
            onChange={(v) => onChange({ email: v })}
            placeholder="you@example.com"
            type="email"
          />
          <Input
            label="Phone"
            value={sender.phone}
            onChange={(v) => onChange({ phone: v })}
            placeholder="+91 00000 00000"
          />
          <Input
            label="Address"
            value={sender.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="Street address"
            className="col-span-2"
          />
          <Input
            label="City"
            value={sender.city}
            onChange={(v) => onChange({ city: v })}
            placeholder="Jaipur"
          />
          <Input
            label="State"
            value={sender.state}
            onChange={(v) => onChange({ state: v })}
            placeholder="Rajasthan"
          />
          <Input
            label="Pincode"
            value={sender.pincode}
            onChange={(v) => onChange({ pincode: v })}
            placeholder="302001"
          />
          <Input
            label="GSTIN"
            value={sender.gstin}
            onChange={(v) => onChange({ gstin: v })}
            placeholder="22AAAAA0000A1Z5"
          />
          <Input
            label="PAN"
            value={sender.pan}
            onChange={(v) => onChange({ pan: v })}
            placeholder="AAAAA0000A"
          />
        </div>
      </CardBody>
    </Card>
  )
}
