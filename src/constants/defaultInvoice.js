export const DEFAULT_INVOICE = {
  logoUrl: null,
  logoSize: 80,       // px width
  logoRotation: 0,    // degrees
  accentColor: '#6366f1',
  invoiceTitle: 'INVOICE',

  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: 'INR',
  currencySymbol: '₹',

  // Notes as array of strings
  notes: [''],
  // Terms as array of strings
  terms: ['Payment is due within 30 days.'],

  sender: {
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    gstin: '', pan: '',
  },

  receiver: {
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    gstin: '',
  },

  items: [
    {
      id: crypto.randomUUID(),
      type: 'commodity',           // 'commodity' | 'task'
      description: '',
      subDescription: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      // task-only
      taskName: '',
      hours: 1,
      taskDescription: '',
    },
  ],

  taxEnabled: true,
  taxLabel: 'GST',
  taxPercent: 18,
  discountEnabled: false,
  discountType: 'percentage',
  discountValue: 0,
  shippingEnabled: false,
  shippingValue: 0,

  signatureDataUrl: null,
  signatureName: '',
}

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
]
