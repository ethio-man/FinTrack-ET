import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Search, Filter, Download, FileText, Plus, X, Calendar, User, ShoppingBag, CreditCard, Smartphone, Building2, Wallet, Trash2, Edit2, Send, Printer, ArrowLeft, MoreVertical, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

// Types
interface LineItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Sale {
  id: string;
  date: string;
  time: string;
  customer: string;
  customerPhone?: string;
  items: LineItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'telebirr' | 'bank' | 'credit';
  status: 'complete' | 'pending' | 'canceled';
  notes?: string;
  amountPaid: number;
  balanceDue: number;
}

// Mock Data
const mockSales: Sale[] = [
  {
    id: '#29345',
    date: '07 January, 2022',
    time: '10:30 AM',
    customer: 'James Dorgan',
    customerPhone: '+251 911 234567',
    items: [
      { id: '1', product: 'Premium Coffee Beans', quantity: 2, unitPrice: 450, subtotal: 900 },
      { id: '2', product: 'Ceramic Mug Set', quantity: 1, unitPrice: 250, subtotal: 250 }
    ],
    subtotal: 1150,
    discount: 50,
    total: 1100,
    paymentMethod: 'cash',
    status: 'complete',
    amountPaid: 1100,
    balanceDue: 0
  },
  {
    id: '#23848',
    date: '07 January, 2022',
    time: '11:15 AM',
    customer: 'Savannah Nguyen',
    customerPhone: '+251 911 345678',
    items: [
      { id: '1', product: 'Office Chair Deluxe', quantity: 3, unitPrice: 1200, subtotal: 3600 }
    ],
    subtotal: 3600,
    discount: 0,
    total: 3600,
    paymentMethod: 'telebirr',
    status: 'complete',
    amountPaid: 3600,
    balanceDue: 0
  },
  {
    id: '#23466',
    date: '06 January, 2022',
    time: '2:45 PM',
    customer: 'Dianne Russell',
    customerPhone: '+251 911 456789',
    items: [
      { id: '1', product: 'Laptop Stand', quantity: 1, unitPrice: 850, subtotal: 850 }
    ],
    subtotal: 850,
    discount: 100,
    total: 750,
    paymentMethod: 'bank',
    status: 'pending',
    amountPaid: 0,
    balanceDue: 750
  },
  {
    id: '#19394',
    date: '05 January, 2022',
    time: '9:20 AM',
    customer: 'Annette Black',
    customerPhone: '+251 911 567890',
    items: [
      { id: '1', product: 'Wireless Mouse', quantity: 2, unitPrice: 320, subtotal: 640 }
    ],
    subtotal: 640,
    discount: 0,
    total: 640,
    paymentMethod: 'credit',
    status: 'canceled',
    amountPaid: 0,
    balanceDue: 0
  },
  {
    id: '#19217',
    date: '05 January, 2022',
    time: '3:10 PM',
    customer: 'Jane Cooper',
    customerPhone: '+251 911 678901',
    items: [
      { id: '1', product: 'Desk Organizer', quantity: 1, unitPrice: 450, subtotal: 450 }
    ],
    subtotal: 450,
    discount: 0,
    total: 450,
    paymentMethod: 'cash',
    status: 'complete',
    amountPaid: 450,
    balanceDue: 0
  }
];

const mockProducts = [
  { id: '1', name: 'Premium Coffee Beans', price: 450, category: 'Beverages', stock: 150 },
  { id: '2', name: 'Ceramic Mug Set', price: 250, category: 'Kitchen', stock: 80 },
  { id: '3', name: 'Office Chair Deluxe', price: 1200, category: 'Furniture', stock: 25 },
  { id: '4', name: 'Laptop Stand', price: 850, category: 'Electronics', stock: 45 },
  { id: '5', name: 'Wireless Mouse', price: 320, category: 'Electronics', stock: 120 },
  { id: '6', name: 'Desk Organizer', price: 450, category: 'Office Supplies', stock: 60 },
  { id: '7', name: 'USB-C Cable', price: 180, category: 'Electronics', stock: 200 },
  { id: '8', name: 'Notebook A5', price: 120, category: 'Stationery', stock: 300 }
];

const mockCustomers = [
  'James Dorgan',
  'Savannah Nguyen',
  'Dianne Russell',
  'Annette Black',
  'Jane Cooper',
  'Floyd Miles',
  'Robert Fox',
  'Jenny Wilson'
];

// Period comparison chart data
const periodComparisonData = [
  { time: '00:00', revenue: 15200, transactions: 12100, refunds: 2800 },
  { time: '06:00', revenue: 18400, transactions: 14300, refunds: 3100 },
  { time: '12:00', revenue: 22100, transactions: 16800, refunds: 3400 },
  { time: '18:00', revenue: 24800, transactions: 18200, refunds: 3350 },
  { time: 'Now, 20:00', revenue: 25680, transactions: 18420, refunds: 3260 }
];

// Main Sales Component
export default function Sales() {
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const handleViewSale = (saleId: string) => {
    setSelectedSaleId(saleId);
    setCurrentView('detail');
  };

  const handleNewSale = () => {
    setCurrentView('new');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSaleId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' && <SalesListView onNewSale={handleNewSale} onViewSale={handleViewSale} />}
      {currentView === 'new' && <NewSaleView onBack={handleBackToList} />}
      {currentView === 'detail' && selectedSaleId && (
        <SaleDetailView saleId={selectedSaleId} onBack={handleBackToList} onEdit={() => setCurrentView('new')} />
      )}
    </div>
  );
}

// Sales List View
function SalesListView({ onNewSale, onViewSale }: { onNewSale: () => void; onViewSale: (id: string) => void }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    paymentMethod: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const thisPeriodTotal = 25680;
  const lastPeriodTotal = 21600;
  const percentChange = ((thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal) * 100;

  const transactions = mockSales.length;
  const transactionsLastPeriod = 1520;
  const transactionsChange = ((transactions - transactionsLastPeriod) / transactionsLastPeriod) * 100;

  const refunds = 3260;
  const refundsLastPeriod = 3330;
  const refundsChange = ((refunds - refundsLastPeriod) / refundsLastPeriod) * 100;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Sales</h1>
        <p className="text-gray-600 text-sm">Manage and track all sales transactions</p>
      </div>

      {/* Summary Strip */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg">All</button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Revenue</button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Transactions</button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Refunds</button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Compared to</button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1">
            Previous month <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${thisPeriodTotal.toLocaleString()}</h3>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{percentChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last period</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Transactions</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${18420}</h3>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{transactionsChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last period</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Refunds</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${refunds.toLocaleString()}</h3>
              <span className="text-sm text-red-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {refundsChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last period</p>
          </div>
        </div>

        {/* Period Comparison Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={periodComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line
                key="line-revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                key="line-transactions"
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                key="line-refunds"
                type="monotone"
                dataKey="refunds"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales by customer, ID, or product..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            onClick={onNewSale}
          >
            <Plus className="w-4 h-4" />
            Record Sale
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Date Range</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Payment Method</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.paymentMethod}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="telebirr">Telebirr</option>
                <option value="bank">Bank Transfer</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Min Amount</label>
              <input
                type="number"
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Max Amount</label>
              <input
                type="number"
                placeholder="$10000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    ID <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Customer <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Date <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Items <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Total <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Payment <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Status <ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockSales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onViewSale(sale.id)}
                      className="text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      {sale.id}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        index % 4 === 0 ? 'bg-pink-500' : index % 4 === 1 ? 'bg-green-500' : index % 4 === 2 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}>
                        {sale.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{sale.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.items.length} item(s)</td>
                  <td className="px-6 py-4 text-sm">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs capitalize">
                      {sale.paymentMethod === 'cash' && <Wallet className="w-3 h-3" />}
                      {sale.paymentMethod === 'telebirr' && <Smartphone className="w-3 h-3" />}
                      {sale.paymentMethod === 'bank' && <Building2 className="w-3 h-3" />}
                      {sale.paymentMethod === 'credit' && <CreditCard className="w-3 h-3" />}
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs capitalize ${
                      sale.status === 'complete' ? 'bg-green-100 text-green-700' :
                      sale.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        sale.status === 'complete' ? 'bg-green-500' :
                        sale.status === 'pending' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewSale(sale.id)}
                        className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                      >
                        View
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to {mockSales.length} of {mockSales.length} sales</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// New Sale View
function NewSaleView({ onBack }: { onBack: () => void }) {
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'telebirr' | 'bank' | 'credit'>('cash');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleTime, setSaleTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

  const addLineItem = (product: typeof mockProducts[0]) => {
    const existing = lineItems.find(item => item.product === product.name);
    if (existing) {
      setLineItems(lineItems.map(item =>
        item.product === product.name
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setLineItems([...lineItems, {
        id: String(Date.now()),
        product: product.name,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      }]);
    }
    setSearchProduct('');
  };

  const updateQuantity = (id: string, quantity: number) => {
    setLineItems(lineItems.map(item =>
      item.id === id
        ? { ...item, quantity, subtotal: quantity * item.unitPrice }
        : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const finalAmount = subtotal - discount;

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl">Create New Sale</h1>
          <p className="text-gray-600 text-sm">Record a new sales transaction</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 space-y-6">
          {/* Customer & Date */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Sale Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Customer *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Select existing customer</option>
                    {mockCustomers.map(customer => (
                      <option key={customer} value={customer}>{customer}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Or type new customer name"
                  className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                    />
                  </div>
                  <input
                    type="time"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={saleTime}
                    onChange={(e) => setSaleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selector */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Add Products</h3>
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products to add..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            {searchProduct && filteredProducts.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    className="w-full px-4 py-3 hover:bg-gray-50 text-left flex items-center justify-between border-b border-gray-100 last:border-0"
                    onClick={() => addLineItem(product)}
                  >
                    <div>
                      <p className="text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category} • {product.stock} in stock</p>
                    </div>
                    <span className="text-sm">${product.price}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Line Items */}
            {lineItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Product</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Qty</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Subtotal</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 text-sm">{item.product}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${item.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Payment Method</h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'cash' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <p className="text-sm text-center">Cash</p>
              </button>
              <button
                onClick={() => setPaymentMethod('telebirr')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'telebirr'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'telebirr' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <p className="text-sm text-center">Telebirr</p>
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'bank' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <p className="text-sm text-center">Bank</p>
              </button>
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'credit' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <p className="text-sm text-center">Credit</p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Notes (Optional)</h3>
            <textarea
              placeholder="Add memo or reference number..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Totals Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h3 className="mb-4">Summary</h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg">Total</span>
              <span className="text-2xl">${finalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                Save & Print Receipt
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Save & Send SMS
              </button>
              <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Save Draft
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Tip:</span> You can add products by searching or scanning barcodes. The date defaults to now but can be changed for past sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sale Detail View
function SaleDetailView({ saleId, onBack, onEdit }: { saleId: string; onBack: () => void; onEdit: () => void }) {
  const sale = mockSales.find(s => s.id === saleId);

  if (!sale) {
    return (
      <div className="p-6">
        <p>Sale not found</p>
        <button onClick={onBack} className="text-indigo-600 hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl">Sale {sale.id}</h1>
            <p className="text-gray-600 text-sm">{sale.date} at {sale.time}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200">
            <Send className="w-4 h-4" />
            Send SMS
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 hover:bg-red-200">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="col-span-2 space-y-6">
          {/* Invoice Preview */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl mb-1">INVOICE</h2>
                <p className="text-sm text-gray-600">Invoice Number: {sale.id}</p>
                <p className="text-sm text-gray-600">Date: {sale.date}</p>
              </div>
              <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Business Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm mb-1">My Business Name</p>
              <p className="text-xs text-gray-600">123 Business Street</p>
              <p className="text-xs text-gray-600">Addis Ababa, Ethiopia</p>
              <p className="text-xs text-gray-600">+251 911 123456</p>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <p className="text-xs text-gray-600 mb-2">BILL TO</p>
              <p className="text-sm mb-1">{sale.customer}</p>
              {sale.customerPhone && <p className="text-xs text-gray-600">{sale.customerPhone}</p>}
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 text-xs text-gray-600">ITEM</th>
                    <th className="text-right py-3 text-xs text-gray-600">QTY</th>
                    <th className="text-right py-3 text-xs text-gray-600">UNIT PRICE</th>
                    <th className="text-right py-3 text-xs text-gray-600">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm">{item.product}</td>
                      <td className="py-3 text-sm text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-sm text-right">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${sale.subtotal.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-600">-${sale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-lg">Total</span>
                  <span className="text-lg">${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">NOTES</p>
                <p className="text-sm text-gray-700">{sale.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                <div className="flex items-center gap-2">
                  {sale.paymentMethod === 'cash' && <Wallet className="w-4 h-4 text-gray-600" />}
                  {sale.paymentMethod === 'telebirr' && <Smartphone className="w-4 h-4 text-gray-600" />}
                  {sale.paymentMethod === 'bank' && <Building2 className="w-4 h-4 text-gray-600" />}
                  {sale.paymentMethod === 'credit' && <CreditCard className="w-4 h-4 text-gray-600" />}
                  <span className="text-sm capitalize">{sale.paymentMethod}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-green-600">${sale.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance Due</span>
                  <span className={sale.balanceDue > 0 ? 'text-red-600' : 'text-gray-900'}>
                    ${sale.balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4">Status</h3>
            <div>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm capitalize ${
                sale.status === 'complete' ? 'bg-green-100 text-green-700' :
                sale.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  sale.status === 'complete' ? 'bg-green-500' :
                  sale.status === 'pending' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`}></div>
                {sale.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          {sale.status === 'complete' && sale.balanceDue > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="mb-4">Quick Actions</h3>
              <button className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Convert to Debt
              </button>
            </div>
          )}

          {/* Customer Debt Status */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-amber-900">
              <span className="font-medium">Customer Status:</span> No outstanding debts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
