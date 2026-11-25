
import { saveAs } from 'file-saver'
import {
  DEFAULT_INVOICE,
  CURRENCIES,
} from '../constants/defaultInvoice'
import { getItemAmount } from './calculateTotals'

const TEMPLATE_VERSION = 1
const MAX_FILE_SIZE = 20 * 1024 * 1024

function isObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
}

function normalizeFields(defaults, source) {
  const result = structuredClone(defaults)

  if (!isObject(source)) return result

  for (const key of Object.keys(defaults)) {
    const value = source[key]
    const fallback = defaults[key]

    if (value === undefined) continue

    if (isObject(fallback)) {
      result[key] = normalizeFields(fallback, value)
    } else if (typeof fallback === 'string') {
      if (typeof value === 'string') result[key] = value
    } else if (typeof fallback === 'number') {
      if (typeof value === 'number' && Number.isFinite(value)) {
        result[key] = value
      }
    } else if (typeof fallback === 'boolean') {
      if (typeof value === 'boolean') result[key] = value
    }
  }

  return result
}

function normalizeTextList(value, fallback) {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    const list = value.filter((v) => typeof v === 'string')
    return list.length ? list : ['']
  }

  return [...fallback]
}

function normalizeImage(value) {
  if (
    typeof value === 'string' &&
    /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/i.test(value)
  ) {
    return value
  }

  return null
}

export function saveTemplate(invoice) {
  const template = {
    version: TEMPLATE_VERSION,
    exportedAt: new Date().toISOString(),
    invoice: invoice,
  }

  const json = JSON.stringify(template, null, 2)

  const blob = new Blob([json], {
    type: 'application/json;charset=utf-8',
  })

  const fileName = (invoice.invoiceNumber || 'invoice')
    .replace(/[^a-zA-Z0-9_-]/g, '-')

  saveAs(blob, `${fileName}-template.json`)
}

export async function loadTemplate(file) {
  if (!file) {
    throw new Error('Please select a JSON file.')
  }

  if (!file.name.toLowerCase().endsWith('.json')) {
    throw new Error('Only JSON files are supported.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Template cannot exceed 20 MB.')
  }

  let parsed

  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('Invalid JSON file.')
  }

  if (
    !isObject(parsed) ||
    parsed.version !== TEMPLATE_VERSION ||
    !isObject(parsed.invoice)
  ) {
    throw new Error('Unsupported invoice template.')
  }

  const data = parsed.invoice

  if (
    !isObject(data.sender) ||
    !isObject(data.receiver) ||
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    throw new Error('Invalid invoice structure.')
  }

  const invoice = normalizeFields(DEFAULT_INVOICE, data)

  invoice.notes = normalizeTextList(
    data.notes,
    DEFAULT_INVOICE.notes
  )

  invoice.terms = normalizeTextList(
    data.terms,
    DEFAULT_INVOICE.terms
  )

  invoice.logoUrl = normalizeImage(data.logoUrl)
  invoice.signatureDataUrl = normalizeImage(data.signatureDataUrl)

  invoice.items = data.items.map((item) => {
    if (!isObject(item)) {
      throw new Error('Invalid line item.')
    }

    const normalized = normalizeFields(
      DEFAULT_INVOICE.items[0],
      item
    )

    normalized.id = crypto.randomUUID()
    normalized.type = item.type === 'task'
      ? 'task'
      : 'commodity'

    normalized.quantity = Math.max(0, normalized.quantity)
    normalized.hours = Math.max(0, normalized.hours)
    normalized.rate = Math.max(0, normalized.rate)
    normalized.amount = getItemAmount(normalized)

    return normalized
  })

  const currency = CURRENCIES.find(
    (c) => c.code === invoice.currency
  ) || CURRENCIES[0]

  invoice.currency = currency.code
  invoice.currencySymbol = currency.symbol

  return invoice
}
