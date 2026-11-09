import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Scale, Lightbulb,
  AlertTriangle, Plus, Calendar, ArrowUpRight, ArrowDownRight,
  Receipt, Repeat2, Target, ArrowRight, WalletCards,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useDashboard, useInsights } from '../../hooks/api/useDashboard'
import { useAuthStore } from '../../stores/authStore'
import { formatCurrency, getGreeting } from '../../utils/formatters'
import { cn } from '../../lib/utils'
import type { DashboardData } from '../../types'
import AddTransactionModal, { type TabType } from '../transactions/AddTransactionModal'

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex min-h-[9rem] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="group mt-3 inline-flex min-h-10 min-w-[11rem] items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 text-xs font-semibold text-violet-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-[0_16px_34px_-28px_rgba(109,40,217,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-violet-400/25 dark:bg-slate-950 dark:text-violet-200 dark:hover:bg-violet-500/10 dark:focus-visible:ring-offset-slate-950"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white transition-transform group-hover:scale-105 dark:bg-violet-500">
            <Plus size={13} />
          </span>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default function DashboardScreen() {
  const { user } = useAuthStore()
  const { data: rawData, isLoading, error } = useDashboard()
  const data = rawData as DashboardData | undefined
  const { data: insights } = useInsights()
  const [addOpen, setAddOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<TabType>('expense')

  const openTransactionModal = (tab: TabType = 'expense') => {
    setInitialTab(tab)
    setAddOpen(true)
  }

  if (isLoading) return <DashboardSkeleton />
  if (error) return (
    <div className="flex items-center justify-center p-8">
      <p className="text-red-500 text-sm">Erro ao carregar dashboard. Tente novamente.</p>
    </div>
  )

  const cm = data?.current_month ?? { income: 0, expenses: 0, balance: 0, savings_rate: 0 }
  const avg = data?.averages ?? { daily: 0, weekly: 0, biweekly: 0 }
  const balancePositive = cm.balance >= 0
  const userFirstName = user?.name?.split(' ')[0] || 'Usuário'

  const chartData = (data?.monthly_cash_flow ?? []).map(m => ({
    ...m,
    name: new Date(m.year, m.month - 1).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
  }))
  const hasCashFlowData = chartData.some(m => Number(m.income || 0) > 0 || Number(m.expenses || 0) > 0)
  const hasTopCategories = Boolean(data?.top_categories && data.top_categories.length > 0)
  const hasRecentTransactions = Boolean(data?.recent_transactions && data.recent_transactions.length > 0)

  const summaryCards = [
    {
      label: 'Receitas',
      value: cm.income,
      hint: 'entradas este mês',
      icon: TrendingUp,
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
      valueClass: 'text-slate-950 dark:text-slate-100',
    },
    {
      label: 'Gastos',
      value: cm.expenses,
      hint: 'saídas este mês',
      icon: TrendingDown,
      iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
      valueClass: 'text-slate-950 dark:text-slate-100',
    },
    {
      label: 'Saldo',
      value: cm.balance,
      hint: balancePositive ? 'resultado positivo' : 'acompanhe de perto',
      icon: Scale,
      iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
      valueClass: balancePositive ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300',
    },
  ]

  const quickActions = [
    { label: 'Receita', icon: TrendingUp, onClick: () => openTransactionModal('income'), className: 'text-emerald-700 dark:text-emerald-300' },
    { label: 'Despesa', icon: Receipt, onClick: () => openTransactionModal('expense'), className: 'text-rose-700 dark:text-rose-300' },
    { label: 'Transferência', icon: Repeat2, onClick: () => openTransactionModal('transfer'), className: 'text-violet-700 dark:text-violet-300' },
  ]

  return (
    <div className="w-full max-w-[76rem] space-y-5 px-3 py-5 pb-24 sm:px-5 lg:ml-0 lg:mr-auto lg:px-8 lg:pb-8">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/10 bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700 p-5 text-white shadow-[0_22px_60px_-42px_rgba(109,40,217,0.95)]">
          <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
          <div className="relative flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-100/80">{getGreeting()}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Olá, {userFirstName}</h2>
              <p className="mt-1 max-w-xl text-sm text-violet-100/85">
                Acompanhe seu desempenho financeiro e registre movimentos do mês.
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-100">Saldo total</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    {formatCurrency(data?.total_balance ?? 0)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      balancePositive ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'
                    )}>
                      {balancePositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {formatCurrency(Math.abs(cm.balance))} este mês
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-violet-100">
                      {formatCurrency(data?.projected_end_of_month ?? 0)} gastos projetados
                    </span>
                  </div>
                </div>
                <Link
                  to="/accounts"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Ver contas
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2">
            <WalletCards size={17} className="text-violet-600 dark:text-violet-300" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ações rápidas</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="group flex min-h-20 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-left text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-violet-100 hover:bg-white hover:shadow-[0_14px_30px_-28px_rgba(15,23,42,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-offset-slate-950"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:-translate-y-0.5 dark:bg-slate-950">
                  <action.icon size={15} className={action.className} />
                </span>
                <span>{action.label}</span>
              </button>
            ))}
            <Link
              to="/goals"
              className="group flex min-h-20 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-left text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-violet-100 hover:bg-white hover:shadow-[0_14px_30px_-28px_rgba(15,23,42,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-offset-slate-950"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:-translate-y-0.5 dark:bg-slate-950">
                <Target size={15} className="text-violet-700 dark:text-violet-300" />
              </span>
              <span>Meta</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summaryCards.map(card => (
          <div
            key={card.label}
            className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-34px_rgba(15,23,42,0.8)] dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-2xl', card.iconClass)}>
                <card.icon size={17} />
              </div>
              <span className="rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                este mês
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className={cn('mt-1 truncate text-lg font-bold tabular-nums', card.valueClass)}>
              {formatCurrency(card.value)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.hint}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Médias de gasto</p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
          {[
            { label: 'Diária', value: avg.daily },
            { label: 'Semanal', value: avg.weekly },
            { label: 'Quinzenal', value: avg.biweekly },
          ].map(item => (
            <div key={item.label} className="p-4 text-left sm:text-center">
              <p className="mb-1 text-xs text-slate-400 dark:text-slate-500">{item.label}</p>
              <p className="text-sm font-bold text-slate-950 tabular-nums dark:text-slate-100">{formatCurrency(item.value)}</p>
            </div>
          ))}
        </div>
        {data?.projected_end_of_month !== undefined && (
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex min-w-0 items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Projeção de gastos até fim do mês</span>
            </div>
            <span className={cn('text-sm font-bold tabular-nums', data.projected_end_of_month <= (data?.total_balance ?? 0) ? 'text-emerald-600 dark:text-emerald-300' : 'text-orange-500')}>
              {formatCurrency(data.projected_end_of_month)}
            </span>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">Fluxo de Caixa</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Receitas e gastos dos últimos meses.</p>
          </div>
          <span className="hidden rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-400 dark:bg-slate-900 dark:text-slate-500 sm:inline-flex">
            Mensal
          </span>
        </div>
        {hasCashFlowData ? (
          <>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 0, right: 0, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip
                  formatter={(v: number, name: string) => [formatCurrency(v), name === 'income' ? 'Receitas' : 'Gastos']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
                <Bar dataKey="income" name="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Gastos" fill="#f87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /><span className="text-xs text-slate-500">Receitas</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-red-400" /><span className="text-xs text-slate-500">Gastos</span></div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Sem fluxo para exibir"
            description="Adicione receitas e despesas para acompanhar a evolução do seu caixa."
            actionLabel="Adicionar transação"
            onAction={() => openTransactionModal('expense')}
          />
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="mb-4 text-sm font-semibold text-slate-950 dark:text-slate-100">Top Categorias</p>
          {hasTopCategories ? (
            <div className="space-y-3">
              {data!.top_categories.slice(0, 5).map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ backgroundColor: (cat.color || '#6366f1') + '20' }}>
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color || '#6366f1' }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat.category_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">{formatCurrency(cat.total)}</span>
                      <span className="ml-1.5 text-xs text-slate-400">{cat.percentage?.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(cat.percentage || 0, 100)}%`, backgroundColor: cat.color || '#6366f1' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem categorias ainda"
              description="As categorias aparecem aqui quando houver despesas classificadas."
              actionLabel="Registrar despesa"
              onAction={() => openTransactionModal('expense')}
            />
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="px-4 pt-4 pb-3">
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">Transações Recentes</p>
          </div>
          {hasRecentTransactions ? (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {data!.recent_transactions.slice(0, 8).map(tx => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: tx.category_color || '#6366f1' }}>
                    {(tx.category_name || tx.description).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-950 dark:text-slate-100">{tx.description}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {tx.category_name && <span>{tx.category_name} · </span>}
                      {new Date(String(tx.date).split('T')[0] + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={cn('text-sm font-bold tabular-nums', tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-500 dark:text-rose-300')}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 pt-0">
              <EmptyState
                title="Nenhuma transação registrada"
                description="Comece adicionando sua primeira receita ou despesa do mês."
                actionLabel="Criar transação"
                onAction={() => openTransactionModal('expense')}
              />
            </div>
          )}
        </div>
      </section>

      {/* Budget alerts */}
      {data?.budget_alerts && data.budget_alerts.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">Alertas de Orçamento</p>
          </div>
          <div className="space-y-2">
            {data.budget_alerts.map(budget => (
              <div key={budget.id} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-400/20 dark:bg-amber-500/10">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-100">{budget.category_name}</p>
                    <span className={cn('text-xs font-bold', (budget.percentage ?? 0) > 100 ? 'text-red-600' : 'text-amber-600')}>
                      {budget.percentage?.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                    <div className={cn('h-full rounded-full', (budget.percentage ?? 0) > 100 ? 'bg-red-500' : 'bg-amber-500')}
                      style={{ width: `${Math.min(budget.percentage ?? 0, 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatCurrency(budget.spent ?? 0)} de {formatCurrency(budget.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {Array.isArray(insights) && insights.length > 0 && (
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-4 transition-colors dark:border-violet-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/35">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center shadow-sm dark:bg-yellow-300">
              <Lightbulb size={14} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Insights Financeiros</p>
            <span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-xs font-medium text-white dark:bg-violet-500/25 dark:text-violet-100">IA</span>
          </div>
          <div className="space-y-3">
            {insights.slice(0, 3).map((tip: any, i: number) => (
              <div key={tip.id ?? i} className="rounded-xl border border-transparent bg-white p-3.5 shadow-sm transition-colors dark:border-slate-700/80 dark:bg-slate-950/72 dark:shadow-none">
                <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{tip.title}</p>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-slate-400">{tip.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => openTransactionModal('expense')}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl transition-all hover:bg-violet-700 active:scale-95 lg:hidden"
        aria-label="Adicionar transação"
      >
        <Plus size={24} />
      </button>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} initialTab={initialTab} />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[76rem] space-y-5 px-3 py-5 sm:px-5 lg:px-8 animate-pulse">
      <div className="h-16 w-full max-w-md rounded-3xl bg-slate-200" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <div className="h-36 rounded-3xl bg-slate-200" />
        <div className="h-36 rounded-3xl bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-3xl bg-slate-200" />)}
      </div>
      <div className="h-32 rounded-3xl bg-slate-200" />
      <div className="h-64 rounded-3xl bg-slate-200" />
    </div>
  )
}
