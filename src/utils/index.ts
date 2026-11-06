import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TableStatus, AlertSeverity } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function getStatusColor(status: TableStatus): {
  bg: string
  text: string
  border: string
  dot: string
  badgeBg: string
  label: string
} {
  switch (status) {
    case 'AVAILABLE':
    case 'available':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        dot: 'bg-emerald-500',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        label: 'AVAILABLE',
      }
    case 'OCCUPIED':
    case 'occupied':
      return {
        bg: 'bg-charcoal-100',
        text: 'text-charcoal-800',
        border: 'border-charcoal-300',
        dot: 'bg-charcoal-600',
        badgeBg: 'bg-charcoal-200 text-charcoal-900 border-charcoal-300',
        label: 'OCCUPIED',
      }
    case 'WAITING_FOR_WAITER':
    case 'attention_needed':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-400',
        dot: 'bg-amber-500 animate-pulse',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse',
        label: 'WAITING FOR WAITER',
      }
    case 'WAITER_ASSIGNED':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-800',
        border: 'border-sky-300',
        dot: 'bg-sky-500',
        badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
        label: 'WAITER ASSIGNED',
      }
    case 'SERVING':
      return {
        bg: 'bg-forest-50',
        text: 'text-forest-800',
        border: 'border-forest-400',
        dot: 'bg-forest-600',
        badgeBg: 'bg-forest-100 text-forest-900 border-forest-300',
        label: 'SERVING',
      }
    case 'SERVICE_COMPLETED':
    case 'dirty':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-300',
        dot: 'bg-purple-500',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        label: 'SERVICE COMPLETED',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-400',
        badgeBg: 'bg-gray-100 text-gray-700 border-gray-200',
        label: String(status).toUpperCase(),
      }
  }
}

export function getSeverityBadge(severity: AlertSeverity): {
  bg: string
  text: string
  border: string
} {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-red-500/10', text: 'text-red-700', border: 'border-red-300' }
    case 'high':
      return { bg: 'bg-amber-500/10', text: 'text-amber-800', border: 'border-amber-400' }
    case 'medium':
      return { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-300' }
    case 'low':
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-700', border: 'border-zinc-300' }
  }
}
