import React, { createContext, useContext, useState, useEffect } from 'react'
import { MenuItem, TableOrder, OrderItem } from '../types'
import { mockMenuItems, mockInitialTableOrders } from '../data/mockMenu'

interface AddItemParams {
  menuItemId: string
  quantity: number
  notes?: string
}

interface SettleBillResult {
  tableId: string
  receiptNumber: string
  totalPaid: number
  paymentMethod: string
  settledAt: string
}

interface OrderContextType {
  menuItems: MenuItem[]
  tableOrders: TableOrder[]
  toggle86: (menuItemId: string) => void
  addOrderItem: (tableId: string, params: AddItemParams) => void
  removeOrderItem: (tableId: string, orderItemId: string) => void
  updateOrderStatus: (tableId: string, status: 'active' | 'billing' | 'paid') => void
  settleBill: (
    tableId: string,
    paymentMethod: string,
    tipAmount: number
  ) => SettleBillResult | null
  getOrderForTable: (tableId: string) => TableOrder | undefined
  stats: {
    totalActiveOrders: number
    totalActiveRevenue: number
    items86Count: number
    totalMenuItems: number
  }
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const MENU_STORAGE_KEY = 'dinesight_menu_items_v1'
const ORDERS_STORAGE_KEY = 'dinesight_table_orders_v1'

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return mockMenuItems
  })

  const [tableOrders, setTableOrders] = useState<TableOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return mockInitialTableOrders
  })

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems))
    } catch {
      // ignore
    }
  }, [menuItems])

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(tableOrders))
    } catch {
      // ignore
    }
  }, [tableOrders])

  // Toggle 86'd status of a menu item
  const toggle86 = (menuItemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === menuItemId) {
          const next86 = !item.is86
          return {
            ...item,
            is86: next86,
            stockRemaining: next86 ? 0 : item.stockRemaining && item.stockRemaining > 0 ? item.stockRemaining : 10,
          }
        }
        return item
      })
    )
  }

  // Add item(s) to a table's order
  const addOrderItem = (tableId: string, { menuItemId, quantity, notes }: AddItemParams) => {
    const menuItem = menuItems.find((m) => m.id === menuItemId)
    if (!menuItem) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newOrderItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      notes: notes?.trim() || '',
      orderedAt: timeStr,
      status: 'ordered',
    }

    setTableOrders((prev) => {
      const existing = prev.find((o) => o.tableId === tableId)
      if (existing) {
        return prev.map((ord) => {
          if (ord.tableId === tableId) {
            return {
              ...ord,
              status: 'active',
              items: [...ord.items, newOrderItem],
            }
          }
          return ord
        })
      } else {
        // If table didn't have an open order, create a fresh one
        const tableNum = parseInt(tableId.replace(/[^0-9]/g, '')) || 1
        const freshOrder: TableOrder = {
          id: `ord-${tableId}-${Date.now()}`,
          tableId,
          tableNumber: tableNum,
          zone: 'Main Dining',
          waiterId: 'wtr-1',
          waiterName: 'Alexander Wright',
          guestCount: 2,
          openedAt: timeStr,
          status: 'active',
          items: [newOrderItem],
        }
        return [...prev, freshOrder]
      }
    })
  }

  // Remove an item from an order
  const removeOrderItem = (tableId: string, orderItemId: string) => {
    setTableOrders((prev) =>
      prev.map((ord) => {
        if (ord.tableId === tableId) {
          return {
            ...ord,
            items: ord.items.filter((it) => it.id !== orderItemId),
          }
        }
        return ord
      })
    )
  }

  // Update order status
  const updateOrderStatus = (tableId: string, status: 'active' | 'billing' | 'paid') => {
    setTableOrders((prev) =>
      prev.map((ord) => (ord.tableId === tableId ? { ...ord, status } : ord))
    )
  }

  // Settle bill / Checkout
  const settleBill = (
    tableId: string,
    paymentMethod: string,
    tipAmount: number
  ): SettleBillResult | null => {
    const order = tableOrders.find((o) => o.tableId === tableId)
    if (!order) return null

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.0825
    const serviceCharge = subtotal * 0.1
    const totalPaid = subtotal + tax + serviceCharge + tipAmount

    const receiptNum = `GB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    const settledAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Mark order as paid
    setTableOrders((prev) =>
      prev.map((ord) => (ord.tableId === tableId ? { ...ord, status: 'paid' } : ord))
    )

    return {
      tableId,
      receiptNumber: receiptNum,
      totalPaid: Number(totalPaid.toFixed(2)),
      paymentMethod,
      settledAt,
    }
  }

  const getOrderForTable = (tableId: string) => {
    return tableOrders.find((o) => o.tableId === tableId)
  }

  // Calculate live stats
  const activeOrders = tableOrders.filter((o) => o.status !== 'paid')
  const totalActiveRevenue = activeOrders.reduce((sum, ord) => {
    const tableSub = ord.items.reduce((s, it) => s + it.price * it.quantity, 0)
    return sum + tableSub
  }, 0)

  const items86Count = menuItems.filter((i) => i.is86).length

  return (
    <OrderContext.Provider
      value={{
        menuItems,
        tableOrders,
        toggle86,
        addOrderItem,
        removeOrderItem,
        updateOrderStatus,
        settleBill,
        getOrderForTable,
        stats: {
          totalActiveOrders: activeOrders.length,
          totalActiveRevenue: Number(totalActiveRevenue.toFixed(2)),
          items86Count,
          totalMenuItems: menuItems.length,
        },
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}

