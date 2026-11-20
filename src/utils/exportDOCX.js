import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  HeadingLevel,
  ImageRun,
} from 'docx'
import { saveAs } from 'file-saver'
import { calculateTotals, formatCurrency } from './calculateTotals'

function cell(text, bold = false, align = AlignmentType.LEFT, color = '000000') {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: String(text),
            bold,
            color,
            size: 20,
          }),
        ],
      }),
    ],
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
  })
}

function headerCell(text) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: 'ffffff', size: 20 })],
      }),
    ],
    shading: { fill: '1a1a2e' },
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
  })
}

export async function exportToDOCX(invoice, fileName = 'invoice.docx') {
  const { subtotal, totalTax, grandTotal } = calculateTotals(invoice.items)
  const sym = invoice.currencySymbol

  const itemRows = invoice.items.map(
    (item) =>
      new TableRow({
        children: [
          cell(item.description),
          cell(item.quantity, false, AlignmentType.CENTER),
          cell(formatCurrency(item.rate, sym), false, AlignmentType.RIGHT),
          cell(`${item.taxPercent}%`, false, AlignmentType.CENTER),
          cell(formatCurrency(item.quantity * item.rate, sym), false, AlignmentType.RIGHT),
        ],
      })
  )

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: invoice.invoiceTitle, bold: true, size: 48, color: '1a1a2e' })],
          }),

          new Paragraph({ text: '' }),

          // Invoice meta
          new Paragraph({ children: [new TextRun({ text: `Invoice No: `, bold: true }), new TextRun(invoice.invoiceNumber)] }),
          new Paragraph({ children: [new TextRun({ text: `Date: `, bold: true }), new TextRun(invoice.invoiceDate)] }),
          invoice.dueDate
            ? new Paragraph({ children: [new TextRun({ text: `Due Date: `, bold: true }), new TextRun(invoice.dueDate)] })
            : new Paragraph({ text: '' }),

          new Paragraph({ text: '' }),

          // From / To
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'FROM', bold: true, size: 22, color: '0ea5e9' })] }),
                      new Paragraph({ children: [new TextRun({ text: invoice.sender.name, bold: true, size: 24 })] }),
                      new Paragraph({ text: invoice.sender.email }),
                      new Paragraph({ text: invoice.sender.phone }),
                      new Paragraph({ text: invoice.sender.address }),
                      new Paragraph({ text: `${invoice.sender.city} ${invoice.sender.state} ${invoice.sender.pincode}` }),
                      invoice.sender.gstin ? new Paragraph({ children: [new TextRun({ text: `GSTIN: ${invoice.sender.gstin}` })] }) : new Paragraph({ text: '' }),
                    ],
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'BILL TO', bold: true, size: 22, color: '0ea5e9' })] }),
                      new Paragraph({ children: [new TextRun({ text: invoice.receiver.name, bold: true, size: 24 })] }),
                      new Paragraph({ text: invoice.receiver.email }),
                      new Paragraph({ text: invoice.receiver.phone }),
                      new Paragraph({ text: invoice.receiver.address }),
                      new Paragraph({ text: `${invoice.receiver.city} ${invoice.receiver.state} ${invoice.receiver.pincode}` }),
                      invoice.receiver.gstin ? new Paragraph({ children: [new TextRun({ text: `GSTIN: ${invoice.receiver.gstin}` })] }) : new Paragraph({ text: '' }),
                    ],
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // Items table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell('Description'),
                  headerCell('Qty'),
                  headerCell('Rate'),
                  headerCell('Tax'),
                  headerCell('Amount'),
                ],
              }),
              ...itemRows,
            ],
          }),

          new Paragraph({ text: '' }),

          // Totals
          new Paragraph({ children: [new TextRun({ text: `Subtotal: `, bold: true }), new TextRun(formatCurrency(subtotal, sym))] }),
          new Paragraph({ children: [new TextRun({ text: `Tax: `, bold: true }), new TextRun(formatCurrency(totalTax, sym))] }),
          new Paragraph({ children: [new TextRun({ text: `Total: `, bold: true, size: 26 }), new TextRun({ text: formatCurrency(grandTotal, sym), bold: true, size: 26, color: '0ea5e9' })] }),

          new Paragraph({ text: '' }),

          // Notes
          invoice.notes
            ? new Paragraph({ children: [new TextRun({ text: 'Notes: ', bold: true }), new TextRun(invoice.notes)] })
            : new Paragraph({ text: '' }),

          invoice.terms
            ? new Paragraph({ children: [new TextRun({ text: 'Terms: ', bold: true }), new TextRun(invoice.terms)] })
            : new Paragraph({ text: '' }),

          new Paragraph({ text: '' }),

          // Signature
          invoice.signatureName
            ? new Paragraph({ children: [new TextRun({ text: `Authorized By: ${invoice.signatureName}`, bold: true })] })
            : new Paragraph({ text: '' }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, fileName)
}
