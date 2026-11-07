import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Plus,
  Minus,
  Search,
  Filter,
  UtensilsCrossed,
  AlertCircle,
  CheckCircle2,
  ChefHat,
  Ban,
} from 'lucide-react'
import { MenuItem, MenuCategory } from '../../types'
import { useOrders } from '../../context/OrderContext'

interface AddItemModalProps {
  tableNumber: number
  tableId: string
  isOpen: boolean
  onClose: () => void
}

const categories: Array<MenuCategory | 'ALL'> = [
  'ALL',
  'Starters',
  'Steaks & Grills',
  'Mains',
  'Sides',
  'Beverages & Wine',
  'Desserts',
]

export const AddItemModal: React.FC<AddItemModalProps> = ({
  tableNumber,
  tableId,
  isOpen,
  onClose,
}) => {
  const { menuItems, addOrderItem } = useOrders()
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Prevent background scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleSelectItem = (item: MenuItem) => {
    if (item.is86) return // Cannot select 86'd item
    setSelectedMenuItem(item)
    setQuantity(1)
    setNotes('')
  }

  const handleConfirmAdd = () => {
    if (!selectedMenuItem) return

    addOrderItem(tableId, {
      menuItemId: selectedMenuItem.id,
      quantity,
      notes,
    })

    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
      setSelectedMenuItem(null)
      onClose()
    }, 600)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-warm-200 rounded-2xl shadow-floating w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-warm-100 flex items-center justify-between bg-warm-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-forest-100 text-forest-800 rounded-xl">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900 font-display">
                Add Items to Table {tableNumber < 10 ? `0${tableNumber}` : tableNumber}
              </h3>
              <p className="text-xs text-charcoal-500">
                Append additional dishes, drink rounds, or guest requests to running order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-warm-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-warm-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, steaks, cocktails, wines..."
              className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-200 rounded-xl text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-warm-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-400">
              No matching menu items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredItems.map((item) => {
                const isSelected = selectedMenuItem?.id === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      item.is86
                        ? 'bg-warm-100/50 border-warm-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-forest-50/80 border-forest-600 ring-1 ring-forest-600 shadow-sm cursor-pointer'
                        : 'bg-white border-warm-200 hover:border-warm-300 hover:bg-warm-50/40 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-charcoal-900 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-forest-800 shrink-0 ml-2">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-warm-100 text-[10px]">
                      <span className="font-mono text-charcoal-500">
                        Station: {item.station}
                      </span>
                      {item.is86 ? (
                        <span className="inline-flex items-center text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                          <Ban className="w-2.5 h-2.5 mr-1" /> 86'd / Sold Out
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold font-mono">
                          In Stock ({item.stockRemaining ?? 'Plenty'})
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Selected Item Customization / Add Tray */}
        {selectedMenuItem && (
          <div className="p-4 bg-warm-50 border-t border-warm-200 space-y-3 animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-charcoal-900">
                  {selectedMenuItem.name}
                </span>
                <span className="text-xs font-mono text-forest-700 font-bold ml-2">
                  ${selectedMenuItem.price.toFixed(2)} each
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-charcoal-600">Qty:</span>
                <div className="flex items-center border border-warm-300 rounded-lg bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-warm-100 text-charcoal-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-charcoal-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-warm-100 text-charcoal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-mono font-bold text-charcoal-900 ml-1">
                  = ${(selectedMenuItem.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chef note / modification (e.g. Medium Rare, Dressing on side, No Ice)..."
                className="flex-1 px-3 py-1.5 bg-white border border-warm-300 rounded-lg text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <button
                onClick={handleConfirmAdd}
                className="px-4 py-1.5 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1 cursor-pointer shrink-0"
              >
                {showSuccessToast ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

