export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Client {
  name: string;
  email: string;
  address: string;
  company?: string;
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  client: Client;
  notes?: string;
  terms?: string;
  subtotal: number;
  tax: number;
  total: number;
}