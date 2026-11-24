import { useState } from 'react'
import { FileDown, Eye, FileText, RotateCcw } from 'lucide-react'

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

  // Mobile: 'form' | 'preview'
  const [mobileView, setMobileView] = useState('form')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* ── Top Nav ── */}
      <header className="bg-[#1a1a2e] shadow-md sticky top-0 z-30 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">

          {/* Logo + title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">InvoiceGen</span>
            <span className="text-slate-500 text-xs hidden lg:block">— 100% local, no data leaves your browser</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Mobile: Form / Preview toggle */}
            <div className="flex lg:hidden bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setMobileView('form')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  mobileView === 'form' ? 'bg-white text-slate-800' : 'text-slate-400'
                }`}
              >
                Form
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                  mobileView === 'preview' ? 'bg-white text-slate-800' : 'text-slate-400'
                }`}
              >
                <Eye size={12} /> Preview
              </button>
            </div>

            {/* Desktop: Reset */}
            <button
              onClick={resetInvoice}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Download PDF — always visible */}
            <button
              onClick={downloadPDF}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <FileDown size={14} />
              <span className="hidden sm:inline">{exporting ? 'Generating...' : 'Download PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 flex overflow-hidden w-full max-w-screen-2xl mx-auto">

        {/* ── FORM PANEL ──
            Mobile:  full width, shown when mobileView === 'form'
            Desktop: fixed 520px, always visible
        */}
        <div
          className={`
            flex flex-col bg-white border-r border-slate-200 flex-shrink-0
            ${mobileView === 'form' ? 'flex' : 'hidden'} lg:flex
            w-full lg:w-[520px]
          `}
          style={{ height: 'calc(100vh - 56px)' }}
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

          {/* Fixed bottom download */}
          <div className="border-t border-slate-100 p-3 flex-shrink-0 bg-white">
            <button
              onClick={downloadPDF}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <FileDown size={15} />
              {exporting ? 'Generating PDF...' : 'Download Invoice PDF'}
            </button>
          </div>
        </div>

        {/* ── PREVIEW PANEL ──
            Mobile:  full width, shown when mobileView === 'preview'
            Desktop: flex-1, always visible
        */}
        <div
          className={`
            flex-1 overflow-y-auto scrollbar-thin bg-slate-100 p-3 sm:p-5
            ${mobileView === 'preview' ? 'flex flex-col' : 'hidden'} lg:block
          `}
          style={{ height: 'calc(100vh - 56px)' }}
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
            {/* Browser chrome — hidden on mobile to save space */}
            <div className="hidden sm:flex bg-slate-50 border-b border-slate-200 px-4 py-2 items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400">Live Preview</span>
            </div>

            {/* Scale down preview on small screens so invoice fits */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <InvoicePreview invoice={invoice} />
              </div>
            </div>
          </div>

          {/* Mobile: quick download below preview */}
          <div className="lg:hidden mt-4 px-1">
            <button
              onClick={downloadPDF}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <FileDown size={15} />
              {exporting ? 'Generating PDF...' : 'Download Invoice PDF'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}