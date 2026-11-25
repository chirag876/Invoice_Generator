
export function getQRCodePayload(qrCode) {
  if (!qrCode?.enabled) {
    return { value: '', error: '' }
  }

  if (qrCode.type === 'link') {
    try {
      const url = new URL(qrCode.url.trim())

      if (!['https:', 'http:'].includes(url.protocol)) {
        throw new Error()
      }

      if (url.href.length > 1000) {
        return {
          value: '',
          error: 'URL is too long.',
        }
      }

      return {
        value: url.href,
        error: '',
      }
    } catch {
      return {
        value: '',
        error: 'Enter a valid HTTP or HTTPS URL.',
      }
    }
  }

  if (qrCode.type === 'payment') {
    const upiId = qrCode.upiId.trim()
    const payeeName = qrCode.payeeName.trim()
    const rawAmount = String(qrCode.amountINR).trim()
    const amount = Number(rawAmount)

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
      return {
        value: '',
        error: 'Enter a valid UPI ID format.',
      }
    }

    if (!payeeName) {
      return {
        value: '',
        error: 'Enter the payee name.',
      }
    }

    if (
      !/^\d+(\.\d{1,2})?$/.test(rawAmount) ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return {
        value: '',
        error: 'Enter a valid positive INR amount.',
      }
    }

    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: amount.toFixed(2),
      cu: 'INR',
    })

    return {
      value: `upi://pay?${params.toString().replace(/\+/g, '%20')}`,
      error: '',
    }
  }

  return {
    value: '',
    error: 'Unsupported QR code type.',
  }
}
