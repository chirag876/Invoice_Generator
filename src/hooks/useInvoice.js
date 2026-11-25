
import { useState, useCallback } from 'react'
import { DEFAULT_INVOICE } from '../constants/defaultInvoice'
import { getItemAmount } from '../utils/calculateTotals'

function createInvoice() {
  const invoice = structuredClone(DEFAULT_INVOICE)

  invoice.invoiceDate = new Date().toISOString().split('T')[0]

  invoice.items = invoice.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }))

  return invoice
}

export function useInvoice() {
  const [invoice, setInvoice] = useState(createInvoice)

  const updateInvoice = useCallback((updates) => {
    setInvoice((p) => ({ ...p, ...updates }))
  }, [])

  const updateSender = useCallback((updates) => {
    setInvoice((p) => ({
      ...p,
      sender: { ...p.sender, ...updates },
    }))
  }, [])

  const updateReceiver = useCallback((updates) => {
    setInvoice((p) => ({
      ...p,
      receiver: { ...p.receiver, ...updates },
    }))
  }, [])

  const addItem = useCallback((type = 'commodity') => {
    setInvoice((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          id: crypto.randomUUID(),
          type,
          description: '',
          subDescription: '',
          quantity: 1,
          rate: 0,
          amount: 0,
          taskName: '',
          hours: 1,
          taskDescription: '',
        },
      ],
    }))
  }, [])

  const updateItem = useCallback((id, updates) => {
    setInvoice((p) => ({
      ...p,
      items: p.items.map((item) => {
        if (item.id !== id) return item

        const updated = { ...item, ...updates }
        updated.amount = getItemAmount(updated)

        return updated
      }),
    }))
  }, [])

  const removeItem = useCallback((id) => {
    setInvoice((p) => ({
      ...p,
      items: p.items.length > 1
        ? p.items.filter((item) => item.id !== id)
        : p.items,
    }))
  }, [])

  const setSignature = useCallback((dataUrl) => {
    setInvoice((p) => ({
      ...p,
      signatureDataUrl: dataUrl,
    }))
  }, [])

  const clearSignature = useCallback(() => {
    setInvoice((p) => ({
      ...p,
      signatureDataUrl: null,
    }))
  }, [])

  const importInvoice = useCallback((data) => {
    setInvoice(structuredClone(data))
  }, [])

  const resetInvoice = useCallback(() => {
    if (window.confirm('Reset everything? This cannot be undone.')) {
      setInvoice(createInvoice())
    }
  }, [])

  return {
    invoice,
    updateInvoice,
    updateSender,
    updateReceiver,
    addItem,
    updateItem,
    removeItem,
    setSignature,
    clearSignature,
    importInvoice,
    resetInvoice,
  }
}
