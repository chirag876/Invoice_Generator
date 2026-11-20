export function getItemAmount(item) {
  if (item.type === 'task') {
    return parseFloat(((item.hours || 0) * (item.rate || 0)).toFixed(2))
  }
  return parseFloat(((item.quantity || 0) * (item.rate || 0)).toFixed(2))
}

export function calculateTotals(invoice) {
  const { items, taxEnabled, taxPercent, discountEnabled, discountType, discountValue, shippingEnabled, shippingValue } = invoice

  const subtotal = items.reduce((sum, item) => sum + getItemAmount(item), 0)

  const discountAmount = discountEnabled
    ? discountType === 'percentage'
      ? parseFloat(((subtotal * (discountValue || 0)) / 100).toFixed(2))
      : parseFloat((discountValue || 0).toFixed(2))
    : 0

  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxEnabled ? parseFloat(((taxableAmount * (taxPercent || 0)) / 100).toFixed(2)) : 0
  const shipping = shippingEnabled ? parseFloat((shippingValue || 0).toFixed(2)) : 0
  const grandTotal = parseFloat((taxableAmount + taxAmount + shipping).toFixed(2))

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountAmount,
    taxAmount,
    shipping,
    grandTotal,
  }
}

export function formatCurrency(amount, symbol) {
  return `${symbol}${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
