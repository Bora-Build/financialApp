import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { PullToRefresh } from './PullToRefresh'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden bg-gray-50 transition-colors dark:bg-slate-950 lg:gap-3 lg:p-3">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:rounded-3xl lg:border lg:border-slate-200/70 lg:bg-white/70 lg:shadow-[0_18px_60px_-48px_rgba(15,23,42,0.7)] lg:backdrop-blur dark:lg:border-slate-800/80 dark:lg:bg-slate-950/50 dark:lg:shadow-[0_18px_70px_-50px_rgba(0,0,0,0.9)]">
        <Header />
        <PullToRefresh>
          {children}
        </PullToRefresh>
      </div>
      <BottomNav />
    </div>
  )
}
