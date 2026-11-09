import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useAppStore } from './stores/appStore'
import { useAuthInit } from './hooks/useAuth'
import { useIOSViewportReset } from './hooks/useIOSViewportReset'
import { useFinancialPollingSync } from './hooks/api/useFinancialPollingSync'
import AppLayout from './components/layout/AppLayout'
import { ToastContainer } from './components/ui/Toast'
import { AppLockGuard } from './components/security/AppLockGuard'
import LoginScreen from './features/auth/LoginScreen'
import GoogleAuthCallbackScreen from './features/auth/GoogleAuthCallbackScreen'
import RegisterScreen from './features/auth/RegisterScreen'
import CreatePasswordScreen from './features/auth/CreatePasswordScreen'
import CompleteProfileScreen from './features/auth/CompleteProfileScreen'
import ForgotPasswordScreen from './features/auth/ForgotPasswordScreen'
import ResetPasswordScreen from './features/auth/ResetPasswordScreen'
import OnboardingWizard from './features/onboarding/OnboardingWizard'
import DashboardScreen from './features/dashboard/DashboardScreen'
import TransactionListScreen from './features/transactions/TransactionListScreen'
import AccountListScreen from './features/accounts/AccountListScreen'
import BudgetListScreen from './features/budgets/BudgetListScreen'
import GoalListScreen from './features/goals/GoalListScreen'
import ProfileScreen from './features/profile/ProfileScreen'
import { resolveAppBasePath } from './lib/basePath'

const ROUTER_BASENAME = resolveAppBasePath(import.meta.env.VITE_APP_BASE_PATH)

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!user.cpf || !String(user.cpf).trim()) return <Navigate to="/complete-profile" replace />
  if (!user.onboarding_completed) return <Navigate to="/onboarding" replace />
  return <AppLockGuard>{children}</AppLockGuard>
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  useAuthInit()
  useIOSViewportReset()
  useFinancialPollingSync()
  const theme = useAppStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <BrowserRouter
      basename={ROUTER_BASENAME}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/auth/callback" element={<GoogleAuthCallbackScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/create-password" element={<CreatePasswordScreen />} />
        <Route path="/complete-profile" element={<AuthenticatedRoute><CompleteProfileScreen /></AuthenticatedRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><DashboardScreen /></AppLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><AppLayout><TransactionListScreen /></AppLayout></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><AppLayout><AccountListScreen /></AppLayout></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><AppLayout><BudgetListScreen /></AppLayout></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><AppLayout><GoalListScreen /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfileScreen /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
