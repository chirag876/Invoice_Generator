import { Building2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Input } from '../ui/Input'

export function ReceiverDetails({ receiver, onChange }) {
  return (
    <Card>
      <CardHeader title="Bill To (Client Details)" icon={<Building2 size={16} />} />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Client Name / Company"
            value={receiver.name}
            onChange={(v) => onChange({ name: v })}
            placeholder="Client Name"
            className="col-span-2"
            required
          />
          <Input
            label="Email"
            value={receiver.email}
            onChange={(v) => onChange({ email: v })}
            placeholder="client@example.com"
            type="email"
          />
          <Input
            label="Phone"
            value={receiver.phone}
            onChange={(v) => onChange({ phone: v })}
            placeholder="+91 00000 00000"
          />
          <Input
            label="Address"
            value={receiver.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="Client address"
            className="col-span-2"
          />
          <Input
            label="City"
            value={receiver.city}
            onChange={(v) => onChange({ city: v })}
            placeholder="Mumbai"
          />
          <Input
            label="State"
            value={receiver.state}
            onChange={(v) => onChange({ state: v })}
            placeholder="Maharashtra"
          />
          <Input
            label="Pincode"
            value={receiver.pincode}
            onChange={(v) => onChange({ pincode: v })}
            placeholder="400001"
          />
          <Input
            label="GSTIN"
            value={receiver.gstin}
            onChange={(v) => onChange({ gstin: v })}
            placeholder="22BBBBB0000B1Z5"
          />
        </div>
      </CardBody>
    </Card>
  )
}
