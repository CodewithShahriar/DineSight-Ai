import React, { useState } from 'react'
import {
  UtensilsCrossed,
  Receipt,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Sparkles,
  Search,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { StatCard } from '../components/shared/StatCard'
import { useOrders } from '../context/OrderContext'
import { AddItemModal } from '../components/orders/AddItemModal'
import { BillReceiptModal } from '../components/orders/BillReceiptModal'
import { TableOrder } from '../types'

export const LiveOrders: React.FC = () => {
  const { tableOrders, stats } = useOrders()

  // Zone filter
  const [selectedZone, setSelectedZone] = useState<string>('ALL')
  const [searchTable, setSearchTable] = useState<string>('')

  // Modals state
  const [selectedOrderForAdd, setSelectedOrderForAdd] = useState<TableOrder | null>(null)
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<TableOrder | null>(null)

  // Filtered orders
  const filteredOrders = tableOrders.filter((order) => {
    const matchesZone = selectedZone === 'ALL' || order.zone === selectedZone
    const matchesSearch =
      searchTable === '' ||
      `table ${order.tableNumber}`.toLowerCase().includes(searchTable.toLowerCase()) ||
      order.waiterName.toLowerCase().includes(searchTable.toLowerCase())
    return matchesZone && matchesSearch
  })

  const zones = ['ALL', 'Main Dining', 'Veranda Patio', 'Private Dining']

  const billingRequestedCount = tableOrders.filter((o) => o.status === 'billing').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Live Table Orders & Billing"
        subtitle="Real-time guest tickets, server assignments, running bill calculations, and table checkout"
      />

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Dining Tables"
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
          description="Total active tickets awaiting settlement"
        />
        <StatCard
          title="Checks Awaiting Settlement"
          value={billingRequestedCount}
          change={billingRequestedCount > 0 ? 'Guests requested bill' : 'All tables dining'}
          trend={billingRequestedCount > 0 ? 'neutral' : 'up'}
          icon={<Receipt className="w-5 h-5 text-amber-700" />}
          description="Tables with active checkout requests"
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
          icon={<TrendingUp className="w-5 h-5 text-forest-700" />}
          description="Avg bill per seated dining party"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Dining Zone Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mr-1">
            Zone:
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

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            placeholder="Search by table or server..."
            className="w-full pl-9 pr-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-charcoal-400 bg-white rounded-2xl border border-warm-200">
            No active orders found matching the filter criteria.
          </div>
        ) : (
          filteredOrders.map((order) => {
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
                    Terminal Order: {order.id}
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
          })
        )}
      </div>

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

export default LiveOrders

