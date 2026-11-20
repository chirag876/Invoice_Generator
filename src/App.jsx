import { useState } from 'react'
import { FileDown, Eye, EyeOff, RotateCcw, FileText } from 'lucide-react'

import { useInvoice } from './hooks/useInvoice'
import { useExport } from './hooks/useExport'

import { TabNav } from './components/InvoiceForm/TabNav'
import { SenderTab } from './components/InvoiceForm/SenderTab'
import { ClientTab } from './components/InvoiceForm/ClientTab'
import { ItemsTab } from './components/InvoiceForm/ItemsTab'
import { NotesTab } from './components/InvoiceForm/NotesTab'
import { StyleTab } from './components/InvoiceForm/StyleTab'
import { InvoicePreview } from './components/InvoicePreview/InvoicePreview'

export default function App() {
  const {
    invoice, updateInvoice, updateSender, updateReceiver,
    addItem, updateItem, removeItem,
    setSignature, clearSignature, resetInvoice,
  } = useInvoice()

  const { downloadPDF, exporting } = useExport(invoice)
  const [activeTab, setActiveTab] = useState('sender')
  const [showPreview, setShowPreview] = useState(true)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Top Nav */}
      <header className="bg-[#1a1a2e] shadow-md sticky top-0 z-30 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">InvoiceGen</span>
            <span className="text-slate-500 text-xs hidden md:block">— 100% local, no data leaves your browser</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium rounded-lg transition-colors">
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
            <button onClick={resetInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium rounded-lg transition-colors">
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button onClick={downloadPDF} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
              <FileDown size={14} />
              {exporting ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Body — flex row */}
      <main className="flex-1 flex overflow-hidden w-full max-w-screen-2xl mx-auto">

        {/* LEFT: Form — 520px wide for comfort */}
        <div
          className="flex flex-col bg-white border-r border-slate-200 flex-shrink-0"
          style={{ width: showPreview ? '520px' : '680px', height: 'calc(100vh - 56px)' }}
        >
          <TabNav active={activeTab} onChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {activeTab === 'sender' && (
              <SenderTab invoice={invoice} onSender={updateSender} onChange={updateInvoice} />
            )}
            {activeTab === 'client' && (
              <ClientTab receiver={invoice.receiver} onChange={updateReceiver} />
            )}
            {activeTab === 'items' && (
              <ItemsTab
                invoice={invoice}
                onChange={updateInvoice}
                onAdd={addItem}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            )}
            {activeTab === 'notes' && (
              <NotesTab invoice={invoice} onChange={updateInvoice} />
            )}
            {activeTab === 'style' && (
              <StyleTab invoice={invoice} onChange={updateInvoice} />
            )}
          </div>

          {/* Fixed bottom download button */}
          <div className="border-t border-slate-100 p-3 flex-shrink-0 bg-white">
            <button onClick={downloadPDF} disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
              <FileDown size={15} />
              {exporting ? 'Generating PDF...' : 'Download Invoice PDF'}
            </button>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        {showPreview && (
          <div
            className="flex-1 overflow-y-auto scrollbar-thin bg-slate-100 p-5"
            style={{ height: 'calc(100vh - 56px)' }}
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              {/* Browser chrome */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-400">Live Preview</span>
              </div>
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
