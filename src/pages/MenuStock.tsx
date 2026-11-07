import React, { useState } from 'react'
import {
  ChefHat,
  Ban,
  CheckCircle2,
  Search,
  Filter,
  Flame,
  Wine,
  Sparkles,
  UtensilsCrossed,
  Layers,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { StatCard } from '../components/shared/StatCard'
import { useOrders } from '../context/OrderContext'
import { MenuCategory, KitchenStation } from '../types'

export const MenuStock: React.FC = () => {
  const { menuItems, toggle86, stats } = useOrders()

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'ALL'>('ALL')
  const [selectedStation, setSelectedStation] = useState<KitchenStation | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnly86, setShowOnly86] = useState(false)

  const categories: Array<MenuCategory | 'ALL'> = [
    'ALL',
    'Starters',
    'Steaks & Grills',
    'Mains',
    'Sides',
    'Beverages & Wine',
    'Desserts',
  ]

  const inStockCount = menuItems.filter((i) => !i.is86).length

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory
    const matchesStation = selectedStation === 'ALL' || item.station === selectedStation
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matches86Filter = !showOnly86 || item.is86
    return matchesCat && matchesStation && matchesSearch && matches86Filter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Kitchen 86'd & Menu Stock Controls"
        subtitle="Live dish availability, kitchen station inventory, instant 86'd sold-out toggles, and portion tracking"
      />

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Menu Offerings"
          value={stats.totalMenuItems}
          change="6 Core Categories"
          trend="neutral"
          icon={<UtensilsCrossed className="w-5 h-5 text-forest-700" />}
          description="Total active catalog recipes"
        />
        <StatCard
          title="Active In-Stock Items"
          value={inStockCount}
          change={`${Math.round((inStockCount / stats.totalMenuItems) * 100)}% available`}
          trend="up"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
          description="Dishes ready to prep & serve"
        />
        <StatCard
          title="Currently 86'd (Sold Out)"
          value={stats.items86Count}
          change={stats.items86Count > 0 ? 'Action required in kitchen' : 'Zero shortages'}
          trend={stats.items86Count > 0 ? 'down' : 'up'}
          icon={<Ban className="w-5 h-5 text-rose-700" />}
          description="Items flagged unavailable"
        />
        <StatCard
          title="Kitchen Stations"
          value="5 Active"
          change="Grill, Saute, Pantry, Bar, Pastry"
          trend="neutral"
          icon={<Flame className="w-5 h-5 text-amber-700" />}
          description="Production preparation lines"
        />
      </div>

      {/* Search, Filter & 86'd Toggle Bar */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, steaks, wine vintages, cocktails..."
              className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-200 rounded-xl text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
            />
          </div>

          {/* Kitchen Station Dropdown */}
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <span className="font-semibold text-charcoal-500 whitespace-nowrap">
              Station:
            </span>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value as KitchenStation | 'ALL')}
              className="px-3 py-2 bg-warm-50 border border-warm-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
            >
              <option value="ALL">All Kitchen Stations</option>
              <option value="Grill">Grill Station</option>
              <option value="Saute">Saute Station</option>
              <option value="Cold Pantry">Cold Pantry / Garde Manger</option>
              <option value="Bar">Beverage Bar</option>
              <option value="Pastry">Pastry & Desserts</option>
            </select>
          </div>

          {/* Quick 86'd Filter Pill */}
          <button
            onClick={() => setShowOnly86(!showOnly86)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              showOnly86
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Show Only 86'd ({stats.items86Count})</span>
          </button>
        </div>

        {/* Category Pills Bar */}
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
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-charcoal-400 bg-white rounded-2xl border border-warm-200">
            No menu items found matching the selected filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all shadow-subtle flex flex-col justify-between ${
                item.is86
                  ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-400/30'
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

                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {item.dietary.map((d) => (
                      <span
                        key={d}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warm-100 text-charcoal-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
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
          ))
        )}
      </div>
    </div>
  )
}

export default MenuStock
