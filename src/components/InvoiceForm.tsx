import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem, Client } from '../types/invoice';
import { generatePDF } from '../utils/pdfGenerator';

const emptyItem: InvoiceItem = {
  id: '',
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
};

const emptyClient: Client = {
  name: '',
  email: '',
  address: '',
  company: '',
};

export default function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem, id: uuidv4() }]);
  const [client, setClient] = useState<Client>(emptyClient);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [tax, setTax] = useState(0);

  const calculateAmount = (item: InvoiceItem) => {
    return item.quantity * item.rate;
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.amount = calculateAmount(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems(prev => [...prev, { ...emptyItem, id: uuidv4() }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const handleExport = () => {
    const invoice: Invoice = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items,
      client,
      notes,
      terms,
      subtotal,
      tax,
      total,
    };
    generatePDF(invoice);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">New Invoice</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Export PDF
          </button>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Bill To</h2>
            <input
              type="text"
              placeholder="Client Name"
              value={client.name}
              onChange={e => setClient({ ...client, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Client Email"
              value={client.email}
              onChange={e => setClient({ ...client, email: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              placeholder="Client Address"
              value={client.address}
              onChange={e => setClient({ ...client, address: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Items</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  className="flex-grow p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                  className="w-20 p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                  className="w-32 p-2 border rounded-lg"
                />
                <div className="w-32 p-2 bg-gray-50 rounded-lg text-right">
                  ${item.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-end gap-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-end gap-4 items-center">
            <span className="text-gray-600">Tax (%):</span>
            <input
              type="number"
              value={tax}
              onChange={e => setTax(parseFloat(e.target.value))}
              className="w-20 p-2 border rounded-lg"
            />
            <span className="font-semibold">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-end gap-4 text-lg font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Additional notes..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms</label>
            <textarea
              value={terms}
              onChange={e => setTerms(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Terms and conditions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}