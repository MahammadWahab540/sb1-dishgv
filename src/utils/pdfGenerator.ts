import { jsPDF } from 'jspdf';
import { Invoice } from '../types/invoice';

export const generatePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.text('INVOICE', pageWidth / 2, 20, { align: 'center' });
  
  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.id}`, 20, 40);
  doc.text(`Date: ${invoice.date}`, 20, 45);
  doc.text(`Due Date: ${invoice.dueDate}`, 20, 50);
  
  // Client Information
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 70);
  doc.setFontSize(10);
  doc.text(invoice.client.name, 20, 75);
  doc.text(invoice.client.email, 20, 80);
  doc.text(invoice.client.address.split('\n'), 20, 85);
  
  // Items Table
  let yPos = 110;
  doc.setFontSize(10);
  doc.text('Description', 20, yPos);
  doc.text('Qty', 120, yPos);
  doc.text('Rate', 140, yPos);
  doc.text('Amount', 170, yPos);
  
  yPos += 10;
  invoice.items.forEach(item => {
    doc.text(item.description, 20, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`$${item.rate.toFixed(2)}`, 140, yPos);
    doc.text(`$${item.amount.toFixed(2)}`, 170, yPos);
    yPos += 10;
  });
  
  // Totals
  yPos += 10;
  doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 140, yPos);
  yPos += 10;
  doc.text(`Tax (${invoice.tax}%): $${(invoice.subtotal * invoice.tax / 100).toFixed(2)}`, 140, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Total: $${invoice.total.toFixed(2)}`, 140, yPos);
  
  // Notes & Terms
  if (invoice.notes) {
    yPos += 20;
    doc.setFontSize(10);
    doc.text('Notes:', 20, yPos);
    doc.text(invoice.notes, 20, yPos + 5);
  }
  
  if (invoice.terms) {
    yPos += 20;
    doc.text('Terms & Conditions:', 20, yPos);
    doc.text(invoice.terms, 20, yPos + 5);
  }
  
  // Save the PDF
  doc.save(`invoice-${invoice.id}.pdf`);
};