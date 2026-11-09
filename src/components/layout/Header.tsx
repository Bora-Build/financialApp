import { ChevronLeft, ChevronRight, Bell, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { useAuthStore } from '../../stores/authStore'
import { formatMonth } from '../../utils/formatters'
import { BrandWordmark } from '../brand/Brand'

export function Header() {
  const { selectedMonth, setSelectedMonth, theme, toggleTheme } = useAppStore()
  const { user } = useAuthStore()

  const prevMonth = () => {
    const d = new Date(selectedMonth.year, selectedMonth.month - 2, 1)
    setSelectedMonth({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  const nextMonth = () => {
    const d = new Date(selectedMonth.year, selectedMonth.month, 1)
    setSelectedMonth({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  const monthLabel = formatMonth(selectedMonth.year, selectedMonth.month)

  return (
    <header className="safe-top sticky top-0 z-30 flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 transition-colors dark:border-slate-800 dark:bg-slate-950 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:min-w-[92px]">
        <div className="lg:hidden">
          <BrandWordmark size="sm" />
        </div>
      </div>

      <div className="mx-2 flex shrink-0 items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/80 px-1.5 py-1 shadow-[0_6px_18px_-14px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-900/85 lg:absolute lg:left-1/2 lg:mx-0 lg:-translate-x-1/2">
        <button
          onClick={prevMonth}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="w-24 truncate text-center text-[13px] font-medium capitalize text-gray-700 dark:text-slate-100 sm:w-40 sm:text-sm">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Próximo mês"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 lg:flex-none lg:min-w-[92px]">
        <button
          type="button"
          onClick={toggleTheme}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <Bell size={18} />
        </button>
        <Link
          to="/profile"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-500/20 dark:text-violet-200"
        >
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </Link>
      </div>
    </header>
  )
}
