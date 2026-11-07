import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Receipt,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Users,
  Percent,
  Clock,
  Sparkles,
  Building2,
} from 'lucide-react'
import { TableOrder } from '../../types'
import { useOrders } from '../../context/OrderContext'

interface BillReceiptModalProps {
  order: TableOrder | null
  isOpen: boolean
  onClose: () => void
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { settleBill } = useOrders()

  const [tipPercent, setTipPercent] = useState<number>(18)
  const [customTip, setCustomTip] = useState<string>('')
  const [splitCount, setSplitCount] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'apple_pay'>('card')
  const [isPaid, setIsPaid] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState<string>(() => {
    return `GB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  })

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

  if (!isOpen || !order) return null

  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const tax = subtotal * 0.0825 // 8.25% Sales tax
  const serviceCharge = subtotal * 0.1 // 10% Service gratuity

  // Tip calculation
  const calculatedTip =
    customTip !== ''
      ? parseFloat(customTip) || 0
      : (subtotal * tipPercent) / 100

  const grandTotal = subtotal + tax + serviceCharge + calculatedTip
  const perPersonAmount = grandTotal / Math.max(1, splitCount)

  const handlePrint = () => {
    window.print()
  }

  const handleSettlePayment = () => {
    const result = settleBill(order.tableId, paymentMethod, calculatedTip)
    if (result) {
      setReceiptNumber(result.receiptNumber)
      setIsPaid(true)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-warm-200 rounded-2xl shadow-2xl w-full max-w-lg h-[88vh] max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Fixed) */}
        <div className="shrink-0 px-5 py-3.5 border-b border-warm-100 flex items-center justify-between bg-warm-50/90">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-forest-100 text-forest-800 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal-900 font-display">
                Guest Check & Invoice — Table {order.tableNumber < 10 ? `0${order.tableNumber}` : order.tableNumber}
              </h3>
              <p className="text-[11px] text-charcoal-500 font-mono">
                Assigned Server: {order.waiterName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-warm-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photorealistic Thermal Receipt Body (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
          <div className="p-5 sm:p-6 bg-warm-50/90 border border-warm-200/90 rounded-xl font-mono text-charcoal-800 text-xs shadow-inner relative">
            {/* Paid Watermark Stamp */}
            {isPaid && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="rotate-[-14deg] border-4 border-emerald-600/80 text-emerald-600 font-black text-3xl tracking-widest uppercase px-6 py-2 rounded-xl bg-white/90 shadow-xl backdrop-blur-xs animate-in zoom-in-50 duration-200">
                  PAID & SETTLED
                </div>
              </div>
            )}

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-dashed border-warm-300 space-y-0.5">
              <h4 className="font-serif text-base font-bold text-charcoal-900 tracking-tight">
                THE GRAND BISTRO
              </h4>
              <p className="text-[10px] text-charcoal-500 uppercase tracking-widest font-sans">
                Fine Dining & Vision Operations
              </p>
              <p className="text-[10px] text-charcoal-500">104 Piccadilly Circus, London W1J</p>
              <p className="text-[10px] text-charcoal-400 font-mono">Tax ID: GB-9428-10294</p>
            </div>

            {/* Order Details Metadata */}
            <div className="py-2.5 border-b border-dashed border-warm-300 text-[11px] flex justify-between">
              <div>
                <p>
                  <span className="text-charcoal-500">Table:</span>{' '}
                  <span className="font-bold text-charcoal-900">
                    Table {order.tableNumber < 10 ? `0${order.tableNumber}` : order.tableNumber}
                  </span>
                </p>
                <p>
                  <span className="text-charcoal-500">Server:</span> {order.waiterName}
                </p>
                <p>
                  <span className="text-charcoal-500">Guests:</span> {order.guestCount} Persons
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-charcoal-900">{receiptNumber}</p>
                <p className="text-charcoal-500">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-charcoal-500">{order.openedAt}</p>
              </div>
            </div>

            {/* Itemized Lines */}
            <div className="py-3 border-b border-dashed border-warm-300 space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-charcoal-400 uppercase tracking-wider pb-1">
                <span>Qty Item</span>
                <span>Amount</span>
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs leading-snug">
                  <div className="flex-1 pr-3">
                    <span className="font-bold text-charcoal-900">{item.quantity}x</span>{' '}
                    <span>{item.name}</span>
                    {item.notes && (
                      <p className="text-[10px] text-charcoal-400 italic pl-5">
                        ↳ {item.notes}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-charcoal-900 shrink-0 font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="py-3 border-b border-dashed border-warm-300 space-y-1 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Food & Beverage Subtotal:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Sales Tax (8.25%):</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Service Gratuity (10%):</span>
                <span className="font-mono">${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-forest-700 font-semibold">
                <span>Staff Tip Addition:</span>
                <span className="font-mono">+${calculatedTip.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Due */}
            <div className="pt-3 pb-1 flex justify-between items-baseline font-bold text-base text-charcoal-900">
              <span className="font-serif">Total Balance Due:</span>
              <span className="font-mono text-xl text-forest-900">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Split Information */}
            {splitCount > 1 && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] flex items-center justify-between text-emerald-900">
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  Split evenly between {splitCount} guests:
                </span>
                <span className="font-bold font-mono text-xs">
                  ${perPersonAmount.toFixed(2)} / person
                </span>
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-4 pt-3 border-t border-dashed border-warm-300 text-center text-[10px] text-charcoal-400 font-sans">
              <p>Thank you for dining at The Grand Bistro!</p>
              <p>Terminal 04-A • Operations Verified</p>
            </div>
          </div>

          {/* Interactive Tip, Split & Payment Controls (if not already settled) */}
          {!isPaid ? (
            <div className="mt-4 space-y-4">
              {/* Tip Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Select Staff Gratuity (Tip):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 15, 18, 20].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => {
                        setTipPercent(rate)
                        setCustomTip('')
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                        tipPercent === rate && customTip === ''
                          ? 'bg-forest-800 text-white shadow-xs'
                          : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
                      }`}
                    >
                      {rate === 0 ? 'No Tip' : `${rate}% ($${((subtotal * rate) / 100).toFixed(0)})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Bill Controls */}
              <div className="flex items-center justify-between p-2.5 bg-warm-50 rounded-xl border border-warm-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-forest-700" />
                  <span className="text-xs font-semibold text-charcoal-800">Split Check:</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSplitCount(cnt)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                        splitCount === cnt
                          ? 'bg-forest-800 text-white shadow-xs'
                          : 'bg-white border border-warm-200 text-charcoal-600 hover:bg-warm-100'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Payment Tender:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-1 ring-forest-700'
                        : 'border-warm-200 hover:bg-warm-50 text-charcoal-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-1 ring-forest-700'
                        : 'border-warm-200 hover:bg-warm-50 text-charcoal-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-1 ring-forest-700'
                        : 'border-warm-200 hover:bg-warm-50 text-charcoal-700'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash Tender</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">
                Payment Settled Successfully
              </p>
              <p className="text-xs text-emerald-700">
                Total ${grandTotal.toFixed(2)} received via {paymentMethod.toUpperCase()}.
                Table status updated to Completed.
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions (Fixed) */}
        <div className="shrink-0 p-4 border-t border-warm-100 bg-warm-50 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-warm-200 hover:bg-white text-charcoal-700 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Print Check</span>
          </button>

          {!isPaid ? (
            <button
              onClick={handleSettlePayment}
              className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-950/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settle & Complete Bill (${grandTotal.toFixed(2)})</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Close
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

