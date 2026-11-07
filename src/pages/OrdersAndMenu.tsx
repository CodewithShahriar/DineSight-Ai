import React, { useState } from 'react'
import {
  UtensilsCrossed,
  Receipt,
  Plus,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  Clock,
  Users,
  ChefHat,
  AlertTriangle,
  Flame,
  Wine,
  Sparkles,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { StatCard } from '../components/shared/StatCard'
import { useOrders } from '../context/OrderContext'
import { AddItemModal } from '../components/orders/AddItemModal'
import { BillReceiptModal } from '../components/orders/BillReceiptModal'
import { TableOrder, MenuCategory, KitchenStation } from '../types'

export const OrdersAndMenu: React.FC = () => {
  const { menuItems, tableOrders, toggle86, removeOrderItem, stats } = useOrders()

  // Tabs: 'orders' | 'menu'
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders')

  // Orders Tab filters
  const [selectedZone, setSelectedZone] = useState<string>('ALL')

  // Menu Tab filters
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'ALL'>('ALL')
  const [selectedStation, setSelectedStation] = useState<KitchenStation | 'ALL'>('ALL')
  const [menuSearch, setMenuSearch] = useState<string>('')

  // Modals state
  const [selectedOrderForAdd, setSelectedOrderForAdd] = useState<TableOrder | null>(null)
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<TableOrder | null>(null)

  // Filtered orders
  const filteredOrders = tableOrders.filter((order) => {
    if (selectedZone === 'ALL') return true
    return order.zone === selectedZone
  })

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory
    const matchesStation = selectedStation === 'ALL' || item.station === selectedStation
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase())
    return matchesCat && matchesStation && matchesSearch
  })

  const zones = ['ALL', 'Main Dining', 'Veranda Patio', 'Private Dining']
  const categories: Array<MenuCategory | 'ALL'> = [
    'ALL',
    'Starters',
    'Steaks & Grills',
    'Mains',
    'Sides',
    'Beverages & Wine',
    'Desserts',
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Live Orders & 86'd Menu Ops"
        subtitle="Manage live table tickets, waiter order dispatches, instant 86'd kitchen stock controls, and bill checkouts"
      />

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Table Orders"
          value={stats.totalActiveOrders}
          change="+2 from last hour"
          trend="up"
          icon={<UtensilsCrossed className="w-5 h-5 text-forest-700" />}
          description="Seated dining tables with running checks"
        />
        <StatCard
          title="Live Running Checks"
          value={`$${stats.totalActiveRevenue.toFixed(0)}`}
          change="+18.4% vs lunch target"
          trend="up"
          icon={<DollarSign className="w-5 h-5 text-emerald-700" />}
          description="Total active orders awaiting settlement"
        />
        <StatCard
          title="86'd / Sold Out Items"
          value={stats.items86Count}
          change={stats.items86Count > 0 ? 'Kitchen unavailable' : 'All items in stock'}
          trend={stats.items86Count > 0 ? 'down' : 'neutral'}
          icon={<Ban className="w-5 h-5 text-rose-700" />}
          description="Menu items flagged out of stock"
        />
        <StatCard
          title="Average Ticket Size"
          value={
            stats.totalActiveOrders > 0
              ? `$${(stats.totalActiveRevenue / stats.totalActiveOrders).toFixed(0)}`
              : '$0'
          }
          change="+12% premium items"
          trend="up"
          icon={<TrendingUp className="w-5 h-5 text-amber-700" />}
          description="Avg bill per seated table"
        />
      </div>

      {/* Main Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Live Table Orders & Billing</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'orders' ? 'bg-forest-950/60 text-emerald-300' : 'bg-warm-200 text-charcoal-700'
              }`}
            >
              {stats.totalActiveOrders}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>86'd Menu Stock Controls</span>
            {stats.items86Count > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-700 text-white animate-pulse">
                {stats.items86Count} Sold Out
              </span>
            )}
          </button>
        </div>

        <div className="text-xs text-charcoal-500 font-mono flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Real-time Vision POS Synchronization Active</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE TABLE ORDERS & BILLING                                         */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Zone Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mr-1">
              Dining Zone:
            </span>
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOrders.map((order) => {
              const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0)
              const tax = subtotal * 0.0825
              const service = subtotal * 0.1
              const totalEstimate = subtotal + tax + service

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border transition-all shadow-subtle flex flex-col justify-between overflow-hidden ${
                    order.status === 'billing'
                      ? 'border-amber-300 ring-2 ring-amber-400/30'
                      : order.status === 'paid'
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 bg-warm-50/80 border-b border-warm-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forest-800 text-white font-serif font-bold text-base shadow-xs">
                        T{order.tableNumber < 10 ? `0${order.tableNumber}` : order.tableNumber}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-charcoal-900 font-display">
                            Table {order.tableNumber < 10 ? `0${order.tableNumber}` : order.tableNumber}
                          </h4>
                          <span className="text-[11px] text-charcoal-500 font-mono">
                            • {order.zone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-charcoal-500 mt-0.5">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1 text-charcoal-400" />
                            {order.guestCount} Guests
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-charcoal-400" />
                            Seated {order.openedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Badge */}
                    <div>
                      {order.status === 'billing' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center animate-pulse">
                          <Receipt className="w-3 h-3 mr-1" /> Bill Requested
                        </span>
                      ) : order.status === 'paid' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Paid & Settled
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 border border-forest-200 inline-flex items-center">
                          <UtensilsCrossed className="w-3 h-3 mr-1" /> Dining Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Server Assignment Bar */}
                  <div className="px-4 py-2 bg-warm-100/60 border-b border-warm-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {order.waiterAvatar && (
                        <img
                          src={order.waiterAvatar}
                          alt={order.waiterName}
                          className="w-5 h-5 rounded-full object-cover border border-forest-600/30"
                        />
                      )}
                      <span className="text-charcoal-500">Assigned Server:</span>
                      <span className="font-bold text-charcoal-900">{order.waiterName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-charcoal-400">
                      Terminal Order ID: {order.id}
                    </span>
                  </div>

                  {/* Order Items Table */}
                  <div className="p-4 flex-1 overflow-y-auto max-h-56 divide-y divide-warm-100">
                    <div className="flex justify-between font-bold text-[10px] text-charcoal-400 uppercase tracking-wider pb-1">
                      <span>Ordered Items & Modifications</span>
                      <span>Status / Price</span>
                    </div>

                    {order.items.map((it) => (
                      <div key={it.id} className="py-2 flex items-start justify-between text-xs">
                        <div className="flex-1 pr-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-forest-800 bg-forest-50 px-1.5 py-0.5 rounded text-[11px]">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-charcoal-900">{it.name}</span>
                          </div>
                          {it.notes && (
                            <p className="text-[11px] text-charcoal-500 italic pl-6 mt-0.5">
                              ↳ {it.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 flex items-center space-x-2">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase ${
                              it.status === 'in_kitchen'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {it.status === 'in_kitchen' ? 'In Kitchen' : 'Served'}
                          </span>
                          <span className="font-mono font-bold text-charcoal-900 text-xs w-14 text-right">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Running Total & Actions Footer */}
                  <div className="p-4 bg-warm-50/90 border-t border-warm-200 space-y-3">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-charcoal-500">
                        Running Bill Total (incl. Tax & 10% Service):
                      </span>
                      <span className="font-mono font-bold text-base text-forest-900">
                        ${totalEstimate.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {/* Add Item / Extra Round Button */}
                      <button
                        onClick={() => setSelectedOrderForAdd(order)}
                        className="flex-1 py-2 px-3 rounded-xl border border-warm-300 hover:bg-white text-charcoal-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-forest-700" />
                        <span>Add Items / Round</span>
                      </button>

                      {/* Generate Bill Button */}
                      <button
                        onClick={() => setSelectedOrderForBill(order)}
                        className="flex-1 py-2 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-forest-950/20 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Generate Bill & Checkout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KITCHEN MENU STOCK & 86'd MANAGER                                  */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controls Bar: Search & Category Filters */}
          <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search restaurant menu to 86 or restock items..."
                  className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-200 rounded-xl text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              {/* Station Filter */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-charcoal-500 whitespace-nowrap">
                  Kitchen Station:
                </span>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value as KitchenStation | 'ALL')}
                  className="px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-lg text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
                >
                  <option value="ALL">All Kitchen Stations</option>
                  <option value="Grill">Grill Station</option>
                  <option value="Saute">Saute Station</option>
                  <option value="Cold Pantry">Cold Pantry / Garde Manger</option>
                  <option value="Bar">Beverage Bar</option>
                  <option value="Pastry">Pastry & Desserts</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-forest-800 text-white shadow-xs'
                      : 'bg-warm-100 text-charcoal-600 hover:bg-warm-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all shadow-subtle flex flex-col justify-between ${
                  item.is86
                    ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-400/40'
                    : 'bg-white border-warm-200 hover:border-warm-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-charcoal-400">
                        {item.category} • {item.station}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal-900 mt-0.5 leading-tight">
                        {item.name}
                      </h4>
                    </div>
                    <span className="font-mono font-bold text-sm text-forest-800 ml-2">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-500 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card Bottom: Stock Status & Toggle */}
                <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between">
                  <div>
                    {item.is86 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                        <Ban className="w-3 h-3 mr-1" /> 86'd / SOLD OUT
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> In Stock ({item.stockRemaining ?? 'Plenty'})
                      </span>
                    )}
                  </div>

                  {/* 1-Click 86'd Toggle Button */}
                  <button
                    onClick={() => toggle86(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-xs ${
                      item.is86
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {item.is86 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Restock Item</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>86 This Item</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrderForAdd && (
        <AddItemModal
          tableId={selectedOrderForAdd.tableId}
          tableNumber={selectedOrderForAdd.tableNumber}
          isOpen={true}
          onClose={() => setSelectedOrderForAdd(null)}
        />
      )}

      {selectedOrderForBill && (
        <BillReceiptModal
          order={selectedOrderForBill}
          isOpen={true}
          onClose={() => setSelectedOrderForBill(null)}
        />
      )}
    </div>
  )
}
export default OrdersAndMenu
