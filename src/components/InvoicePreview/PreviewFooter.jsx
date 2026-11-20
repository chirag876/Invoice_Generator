export function PreviewFooter({ invoice, accent }) {
  const { notes, terms, signatureDataUrl, signatureName } = invoice

  const notesList = Array.isArray(notes) ? notes.filter(Boolean) : (notes ? [notes] : [])
  const termsList = Array.isArray(terms) ? terms.filter(Boolean) : (terms ? [terms] : [])

  const hasNotes = notesList.length > 0
  const hasTerms = termsList.length > 0

  return (
    <div className="px-10 py-8 mt-4">

      {/* Notes — full width */}
      {hasNotes && (
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            Notes
          </div>
          <ol className="list-none space-y-1">
            {notesList.map((note, i) => (
              <li key={i} className="text-xs text-slate-500 leading-5 flex gap-2">
                <span className="font-semibold text-slate-400 flex-shrink-0">{i + 1}.</span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Terms — full width below notes */}
      {hasTerms && (
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            Terms &amp; Conditions
          </div>
          <ol className="list-none space-y-1">
            {termsList.map((term, i) => (
              <li key={i} className="text-xs text-slate-500 leading-5 flex gap-2">
                <span className="font-semibold text-slate-400 flex-shrink-0">{i + 1}.</span>
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Signature — right aligned */}
      {(signatureDataUrl || signatureName) && (
        <div className="flex justify-end mb-6">
          <div className="text-center">
            {signatureDataUrl && (
              <img src={signatureDataUrl} alt="Signature" className="h-16 w-auto mx-auto mb-1" />
            )}
            <div className="border-t border-slate-300 pt-1 min-w-[140px]">
              <p className="text-xs text-slate-500">{signatureName || 'Authorized Signatory'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom accent bar */}
      <div className="h-1 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  )
}
