
import { Input } from '../ui/Input'
import { getQRCodePayload } from '../../utils/qrCode'
import { calculateTotals } from '../../utils/calculateTotals'

function SectionToggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export function PaymentTab({ invoice, onChange }) {
  const qr = invoice.qrCode
  const bank = invoice.bankDetails

  const updateQR = (updates) => {
    onChange({
      qrCode: { ...qr, ...updates },
    })
  }

  const updateBank = (updates) => {
    onChange({
      bankDetails: { ...bank, ...updates },
    })
  }

  const { error } = getQRCodePayload(qr)

  const totals = calculateTotals(invoice)

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* QR Code Section */}
      <section className="flex flex-col gap-4">
        <SectionToggle
          label="QR Code"
          checked={qr.enabled}
          onChange={(enabled) => updateQR({ enabled })}
        />

        {qr.enabled && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase">
                QR Type
              </label>

              <select
                value={qr.type}
                onChange={(e) => updateQR({
                  type: e.target.value,
                })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="link">
                  Non-payment QR (URL)
                </option>

                <option value="payment">
                  Payment QR (UPI)
                </option>
              </select>
            </div>

            {qr.type === 'link' && (
              <>
                <Input
                  label="Website / URL"
                  type="url"
                  value={qr.url}
                  onChange={(url) => updateQR({ url })}
                  placeholder="https://example.com"
                />

                <Input
                  label="QR Label"
                  value={qr.label}
                  onChange={(label) => updateQR({ label })}
                  placeholder="Visit my website"
                />
              </>
            )}

            {qr.type === 'payment' && (
              <>
                <Input
                  label="UPI ID"
                  value={qr.upiId}
                  onChange={(upiId) => updateQR({ upiId })}
                  placeholder="example@bank"
                />

                <Input
                  label="Payee Name"
                  value={qr.payeeName}
                  onChange={(payeeName) => updateQR({ payeeName })}
                  placeholder="Account holder name"
                />

                <Input
                  label="Payment Amount (INR)"
                  type="number"
                  value={qr.amountINR}
                  onChange={(amountINR) => updateQR({ amountINR })}
                  placeholder="0.00"
                />

                {invoice.currency === 'INR' ? (
                  <button
                    type="button"
                    onClick={() => updateQR({
                      amountINR: totals.grandTotal.toFixed(2),
                    })}
                    className="text-xs font-semibold text-indigo-600 self-start"
                  >
                    Use invoice total
                  </button>
                ) : (
                  <p className="text-xs text-amber-600">
                    Invoice currency is {invoice.currency}.
                    Enter the INR equivalent manually.
                    No automatic currency conversion is applied.
                  </p>
                )}

                {invoice.currency === 'INR' &&
                  qr.amountINR &&
                  Number(qr.amountINR) !== totals.grandTotal && (
                    <p className="text-xs text-amber-600">
                      QR payment amount differs from invoice total.
                      Please verify before exporting.
                    </p>
                  )}
              </>
            )}

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}
          </>
        )}
      </section>

      <div className="border-t border-slate-100" />

      {/* Bank Details Section */}
      <section className="flex flex-col gap-4">
        <SectionToggle
          label="Bank Details"
          checked={bank.enabled}
          onChange={(enabled) => updateBank({ enabled })}
        />

        {bank.enabled && (
          <>
            <Input
              label="Bank Name"
              value={bank.bankName}
              onChange={(bankName) => updateBank({ bankName })}
              placeholder="Bank name"
            />

            <Input
              label="Account Holder Name"
              value={bank.accountHolderName}
              onChange={(accountHolderName) => updateBank({
                accountHolderName,
              })}
              placeholder="Account holder name"
            />

            <Input
              label="Account Number"
              value={bank.accountNumber}
              onChange={(accountNumber) => updateBank({
                accountNumber,
              })}
              placeholder="Account number"
            />

            <Input
              label="IFSC Code"
              value={bank.ifscCode}
              onChange={(ifscCode) => updateBank({
                ifscCode: ifscCode.toUpperCase(),
              })}
              placeholder="ABCD0123456"
            />

            {bank.ifscCode &&
              !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifscCode) && (
                <p className="text-xs text-red-500">
                  Please check the IFSC code format.
                </p>
              )}
          </>
        )}
      </section>
    </div>
  )
}
