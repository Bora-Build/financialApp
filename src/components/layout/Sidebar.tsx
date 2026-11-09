import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  CreditCard,
  Home,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Target,
  User,
} from 'lucide-react'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'
import { BrandIcon, BrandLockup } from '../brand/Brand'
import { logout as logoutRequest } from '../../services/auth'
import { useAuthStore } from '../../stores/authStore'

const navGroups = [
  {
    title: 'Visão geral',
    items: [{ to: '/', icon: Home, label: 'Dashboard' }],
  },
  {
    title: 'Gestão',
    items: [
      { to: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
      { to: '/accounts', icon: CreditCard, label: 'Contas' },
      { to: '/budgets', icon: PieChart, label: 'Orçamentos' },
      { to: '/goals', icon: Target, label: 'Metas' },
    ],
  },
  {
    title: 'Conta',
    items: [{ to: '/profile', icon: User, label: 'Perfil' }],
  },
]

function getInitials(name?: string | null) {
  const parts = String(name || 'Usuário')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return (parts[0]?.[0] || 'U').toUpperCase()
}

function SidebarTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 z-[70] hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:block">
      {label}
    </span>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const storeLogout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutRequest()
    } catch {
      // Ignore network errors and force local logout for a consistent UX.
    } finally {
      storeLogout()
      navigate('/login', { replace: true })
      setIsLoggingOut(false)
    }
  }

  return (
    <aside
      className={cn(
        'relative z-40 hidden h-[calc(100dvh-1.5rem)] flex-shrink-0 flex-col overflow-visible rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.75)] backdrop-blur transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/92 dark:shadow-[0_18px_70px_-44px_rgba(0,0,0,0.95)] lg:flex',
        sidebarCollapsed ? 'w-[4.5rem]' : 'w-64'
      )}
    >
      <div
        className={cn(
          'flex h-20 items-center border-b border-slate-100 px-3 dark:border-slate-800/80',
          sidebarCollapsed ? 'justify-center' : 'justify-between gap-3'
        )}
      >
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <BrandIcon size="sm" />
            <button
              type="button"
              onClick={toggleSidebar}
              className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-violet-400/40 dark:hover:text-violet-200 dark:focus:ring-offset-slate-950"
              aria-label="Expandir menu lateral"
            >
              <PanelLeftOpen size={15} />
              <SidebarTooltip label="Expandir" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-3">
            <BrandLockup iconSize="sm" wordmarkSize="sm" />
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-violet-400/40 dark:hover:text-violet-200 dark:focus:ring-offset-slate-950"
                aria-label="Recolher menu lateral"
              >
                <PanelLeftClose size={15} />
                <SidebarTooltip label="Recolher" />
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-visible px-2 py-5">
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex h-11 items-center rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
                          sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                          isActive
                            ? 'bg-violet-50 text-violet-700 shadow-[0_10px_26px_-24px_rgba(109,40,217,0.75)] dark:bg-violet-500/15 dark:text-violet-200'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-[0_10px_26px_-26px_rgba(15,23,42,0.65)] dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                        )
                      }
                      aria-label={sidebarCollapsed ? label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              'absolute left-0 top-2.5 h-6 w-1 rounded-r-full transition-opacity',
                              isActive
                                ? 'scale-y-100 bg-violet-600 opacity-100 dark:bg-violet-300'
                                : 'scale-y-50 opacity-0'
                            )}
                          />
                          <span
                            className={cn(
                              'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                              isActive
                                ? 'scale-105 bg-white text-violet-700 shadow-sm dark:bg-violet-400/15 dark:text-violet-200'
                                : 'text-slate-500 group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm dark:text-slate-400 dark:group-hover:bg-slate-900 dark:group-hover:text-white'
                            )}
                          >
                            <Icon size={18} className="flex-shrink-0" />
                          </span>
                          {!sidebarCollapsed && <span className="truncate">{label}</span>}
                          <SidebarTooltip label={label} />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-2 dark:border-slate-800/80">
        {sidebarCollapsed ? (
          <Link
            to="/profile"
            className="relative mb-2 flex h-10 w-full items-center justify-center rounded-xl text-violet-700 transition-all hover:bg-violet-50 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:text-violet-200 dark:hover:bg-violet-500/10 dark:focus-visible:ring-offset-slate-950"
            aria-label="Abrir perfil"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold dark:bg-violet-500/20">
              {getInitials(user?.name)}
            </span>
          </Link>
        ) : (
          <Link
            to="/profile"
            className="mb-2 flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-slate-50/70 p-3 transition-all hover:-translate-y-0.5 hover:border-violet-100 hover:bg-violet-50/60 hover:shadow-[0_12px_28px_-26px_rgba(109,40,217,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-violet-400/20 dark:hover:bg-violet-500/10 dark:focus-visible:ring-offset-slate-950"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || 'Usuário'}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email || 'Conta ativa'}
              </p>
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
            'text-slate-500 hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-600 hover:shadow-[0_12px_28px_-26px_rgba(225,29,72,0.7)] disabled:opacity-60 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300',
            sidebarCollapsed && 'justify-center px-0'
          )}
          aria-label={sidebarCollapsed ? 'Sair' : undefined}
        >
          <span className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
            sidebarCollapsed ? '' : '-ml-1',
            'group-hover:bg-white group-hover:text-rose-600 dark:group-hover:bg-slate-900 dark:group-hover:text-rose-300'
          )}>
            <LogOut size={18} className="flex-shrink-0" />
          </span>
          {!sidebarCollapsed && <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>}
          <SidebarTooltip label="Sair" />
        </button>
      </div>
    </aside>
  )
}
