import React from 'react';
import { Receipt } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Freelancer Invoice Generator</h1>
          </div>
        </div>
      </header>
      <main className="py-8">
        <InvoiceForm />
      </main>
    </div>
  );
}

export default App;