import { NavLink } from 'react-router-dom'
import { ArrowLeftRight, CreditCard, Home, PieChart, Target } from 'lucide-react'
import { cn } from '../../lib/utils'

const tabs = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
  { to: '/accounts', icon: CreditCard, label: 'Contas' },
  { to: '/budgets', icon: PieChart, label: 'Orçamentos' },
  { to: '/goals', icon: Target, label: 'Metas' },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 shadow-[0_-18px_38px_-34px_rgba(15,23,42,0.7)] backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-16 grid-cols-5 items-center">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group relative flex h-full min-w-0 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
                isActive ? 'text-violet-700 dark:text-violet-200' : 'text-slate-400 dark:text-slate-500'
              )
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute top-1 h-1 w-5 rounded-full transition-opacity',
                    isActive ? 'bg-violet-600 opacity-100 dark:bg-violet-300' : 'opacity-0'
                  )}
                />
                <span
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                    isActive
                      ? 'bg-violet-50 dark:bg-violet-500/15'
                      : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                  )}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 1.75} />
                </span>
                <span className="max-w-full truncate px-0.5 text-[10px] leading-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
