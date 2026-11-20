import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_INVOICE } from '../constants/defaultInvoice'
import { getItemAmount } from '../utils/calculateTotals'

const STORAGE_KEY = 'invoice_generator_v3'

export function useInvoice() {
  const [invoice, setInvoice] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // migrate old string notes/terms to arrays
        if (typeof parsed.notes === 'string') parsed.notes = parsed.notes ? [parsed.notes] : ['']
        if (typeof parsed.terms === 'string') parsed.terms = parsed.terms ? [parsed.terms] : ['']
        return { ...DEFAULT_INVOICE, ...parsed }
      }
    } catch {}
    return DEFAULT_INVOICE
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice)) } catch {}
  }, [invoice])

  const updateInvoice = useCallback((updates) => {
    setInvoice((p) => ({ ...p, ...updates }))
  }, [])

  const updateSender = useCallback((updates) => {
    setInvoice((p) => ({ ...p, sender: { ...p.sender, ...updates } }))
  }, [])

  const updateReceiver = useCallback((updates) => {
    setInvoice((p) => ({ ...p, receiver: { ...p.receiver, ...updates } }))
  }, [])

  const addItem = useCallback((type = 'commodity') => {
    setInvoice((p) => ({
      ...p,
      items: [...p.items, {
        id: crypto.randomUUID(), type,
        description: '', subDescription: '',
        quantity: 1, rate: 0, amount: 0,
        taskName: '', hours: 1, taskDescription: '',
      }],
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
    setInvoice((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }))
  }, [])

  const setSignature = useCallback((dataUrl) => {
    setInvoice((p) => ({ ...p, signatureDataUrl: dataUrl }))
  }, [])

  const clearSignature = useCallback(() => {
    setInvoice((p) => ({ ...p, signatureDataUrl: null }))
  }, [])

  const resetInvoice = useCallback(() => {
    if (window.confirm('Reset everything? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY)
      setInvoice(DEFAULT_INVOICE)
    }
  }, [])

  return {
    invoice, updateInvoice, updateSender, updateReceiver,
    addItem, updateItem, removeItem,
    setSignature, clearSignature, resetInvoice,
  }
}
