
import { QRCodeCanvas } from 'qrcode.react'
import { getQRCodePayload } from '../../utils/qrCode'

export function PreviewPayment({ invoice, accent }) {
  const qr = invoice.qrCode
  const bank = invoice.bankDetails

  const { value } = getQRCodePayload(qr)

  const showQR = qr?.enabled && Boolean(value)

  const bankFields = [
    ['Bank Name', bank?.bankName],
    ['Account Holder', bank?.accountHolderName],
    ['Account Number', bank?.accountNumber],
    ['IFSC Code', bank?.ifscCode],
  ].filter(([, fieldValue]) => fieldValue?.trim())

  const showBank = bank?.enabled && bankFields.length > 0

  if (!showQR && !showBank) return null

  return (
    <section className="px-10 pt-6">
      <div className="border-t border-slate-200 pt-5">

        <div
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: accent }}
        >
          {showBank || qr.type === 'payment'
            ? 'Payment Information'
            : 'Additional Information'}
        </div>

        <div className="flex items-start justify-between gap-6">

          {/* Bank Details */}
          {showBank && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 mb-3">
                Bank Details
              </p>

              <div className="flex flex-col gap-2">
                {bankFields.map(([label, fieldValue]) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400 uppercase">
                      {label}
                    </p>

                    <p className="text-xs font-medium text-slate-700 break-all">
                      {fieldValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code */}
          {showQR && (
            <div className="flex flex-col items-center max-w-[220px]">
              <QRCodeCanvas
                value={value}
                size={144}
                level="M"
                marginSize={4}
                bgColor="#ffffff"
                fgColor="#000000"
              />

              {qr.type === 'payment' ? (
                <>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Scan to Pay
                  </p>

                  <p className="text-[10px] text-slate-500 break-all text-center">
                    {qr.upiId}
                  </p>

                  <p
                    className="text-sm font-bold mt-1"
                    style={{ color: accent }}
                  >
                    ₹{Number(qr.amountINR).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-500 mt-2 text-center break-words">
                  {qr.label || 'Scan to visit'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
