import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Fingerprint, Lock, Mail, Moon, ShieldCheck, Sun } from 'lucide-react'
import { isPasskeyAvailable, login, loginWithPasskey } from '../../services/auth'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'
import { AlertModal, type AlertTone } from '../../components/ui/AlertModal'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { getFirstFormErrorMessage } from './formError'
import { BrandLockup } from '../../components/brand/Brand'
import { buildApiUrl } from '../../lib/apiBase'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type FormData = z.infer<typeof schema>
type AlertState = { title: string; message: string; tone?: AlertTone } | null
const heroHighlights = ['Saldo organizado', 'Metas acompanhadas', 'Gastos sob controle']

function isPwaStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  )
}

export default function LoginScreen() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { theme, toggleTheme } = useAppStore()
  const [alert, setAlert] = useState<AlertState>(null)
  const [passkeyAvailable, setPasskeyAvailable] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [isStandalonePwa, setIsStandalonePwa] = useState(false)

  const googleLoginUrl = buildApiUrl('/api/auth/google/start')
  const heroImageSrc = buildApiUrl('/api/media/login-01')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    isPasskeyAvailable().then(setPasskeyAvailable)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const updateStandaloneState = () => setIsStandalonePwa(isPwaStandalone())

    updateStandaloneState()
    mediaQuery.addEventListener('change', updateStandaloneState)

    return () => mediaQuery.removeEventListener('change', updateStandaloneState)
  }, [])

  const finishLogin = (user: any) => {
    setUser(user)
    if (!user.cpf || !String(user.cpf).trim()) {
      navigate('/complete-profile', { replace: true })
      return
    }
    navigate(user.onboarding_completed ? '/' : '/onboarding', { replace: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      const user = await login(data.email, data.password)
      finishLogin(user)
    } catch (err: any) {
      setAlert({
        title: 'Não foi possível entrar',
        message: err?.response?.data?.error || 'Credenciais inválidas. Tente novamente.',
        tone: 'error',
      })
    }
  }

  const onInvalid = () => {
    setAlert({
      title: 'Verifique os dados',
      message: getFirstFormErrorMessage(errors, 'Preencha os campos obrigatórios para continuar.'),
      tone: 'warning',
    })
  }

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true)
    try {
      const user = await loginWithPasskey(getValues('email'))
      finishLogin(user)
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase()
      const isAbort = err?.name === 'AbortError' || message.includes('cancel')
      setAlert({
        title: isAbort ? 'Autenticação cancelada' : 'Não foi possível entrar com Face ID',
        message:
          err?.response?.data?.error ||
          'Use uma passkey cadastrada neste dispositivo ou entre com e-mail e senha.',
        tone: isAbort ? 'warning' : 'error',
      })
    } finally {
      setPasskeyLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f7f7fb] via-[#f1f2f8] to-[#ede9fe] px-0 py-0 transition-colors dark:from-slate-950 dark:via-[#101827] dark:to-violet-950 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/75 text-slate-600 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.7)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-300 dark:shadow-[0_16px_34px_-24px_rgba(0,0,0,0.85)] dark:hover:bg-slate-800 dark:hover:text-violet-200 dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-slate-950"
        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <main className="auth-shell-enter mx-auto w-full max-w-6xl overflow-hidden bg-white transition-colors dark:bg-slate-950 lg:grid lg:min-h-[720px] lg:grid-cols-[1.04fr_0.96fr] lg:rounded-[28px] lg:border lg:border-slate-200/80 lg:shadow-[0_30px_90px_-44px_rgba(76,29,149,0.42)] dark:lg:border-slate-800/90 dark:lg:shadow-[0_34px_90px_-42px_rgba(0,0,0,0.84)]">
        <section className="relative hidden bg-violet-950 lg:block">
          <img
            src={heroImageSrc}
            alt="Pessoa organizando controle financeiro"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-90 dark:saturate-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#210f3f]/90 via-[#3f1a78]/50 to-slate-900/20 dark:from-slate-950/90 dark:via-violet-950/50 dark:to-slate-950/20" />

          <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <ShieldCheck size={14} />
            Ambiente seguro
          </div>

          <div className="absolute inset-x-8 bottom-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {heroHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
            <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white">
              Controle sua vida financeira com clareza.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/90">
              Organize contas, gastos e metas em uma experiência simples e segura.
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-start justify-center bg-white p-4 pt-5 transition-colors dark:bg-gradient-to-br dark:from-slate-950 dark:via-[#090f1f] dark:to-[#151329] sm:min-h-0 sm:items-center sm:p-7 lg:p-12">
          <div className="auth-panel-enter w-full max-w-[26.5rem]">
            <div className="relative mb-6 overflow-hidden rounded-[24px] border border-violet-200/70 bg-violet-900 shadow-[0_20px_45px_-30px_rgba(76,29,149,0.55)] dark:border-violet-400/20 dark:bg-slate-900 lg:hidden">
              <img
                src={heroImageSrc}
                alt="Pessoa organizando as finanças"
                className="absolute inset-0 h-full w-full object-cover opacity-55 dark:opacity-65 dark:brightness-90 dark:saturate-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-950/75 via-violet-900/55 to-purple-700/40 dark:from-slate-950/80 dark:via-violet-950/48 dark:to-purple-900/34" />
              <div className="relative px-5 py-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <ShieldCheck size={13} />
                  Acesso seguro
                </div>
                <h3 className="max-w-[18rem] text-[1.8rem] font-semibold leading-[1.12] text-white">
                  Controle sua vida financeira com clareza.
                </h3>
                <p className="mt-2 max-w-[19rem] text-[16px] text-white/85">
                  Organize contas, gastos e metas com segurança.
                </p>
              </div>
            </div>

            <div className="mb-6 text-center lg:mb-7">
              <BrandLockup iconSize="sm" wordmarkSize="sm" className="justify-center" />
              <h2 className="mt-4 text-[1.85rem] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-[1.95rem] lg:text-[2rem]">
                Acesse sua conta
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                Entre com segurança para continuar cuidando da sua vida financeira.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/85 bg-white/95 p-4 shadow-[0_18px_55px_-42px_rgba(76,29,149,0.45)] backdrop-blur-sm transition-colors dark:border-slate-700/75 dark:bg-slate-900/78 dark:shadow-[0_18px_55px_-34px_rgba(0,0,0,0.86)] sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent">
              <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  leftIcon={<Mail size={16} />}
                  autoComplete="email"
                  className="h-11 rounded-xl border-slate-300 bg-slate-50 text-[16px] focus:ring-violet-600 dark:border-slate-600 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:ring-violet-500/35"
                  {...register('email')}
                />

                <Input
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  leftIcon={<Lock size={16} />}
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-slate-300 bg-slate-50 text-[16px] focus:ring-violet-600 dark:border-slate-600 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:ring-violet-500/35"
                  {...register('password')}
                />

                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-xs font-semibold text-violet-700 hover:underline dark:text-violet-300 dark:hover:text-violet-200">
                    Esqueci minha senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  size="lg"
                  leftIcon={!isSubmitting ? <ArrowRight size={16} /> : undefined}
                  className="h-12 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 text-white shadow-[0_16px_34px_-20px_rgba(109,40,217,0.88)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 dark:from-violet-600 dark:to-fuchsia-600 dark:shadow-[0_16px_34px_-22px_rgba(168,85,247,0.95)]"
                >
                  Entrar
                </Button>
              </form>

              <div className="mt-6 mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Outras formas</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              </div>

              <a
                href={googleLoginUrl}
                className="group inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-[0_10px_28px_-26px_rgba(15,23,42,0.75)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 active:translate-y-0 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:border-violet-400/70 dark:hover:bg-slate-900"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-violet-700 shadow-sm dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200">
                  G
                </span>
                Continuar com o Google
              </a>

              {passkeyAvailable && isStandalonePwa && (
                <Button
                  type="button"
                  fullWidth
                  variant="outline"
                  size="lg"
                  loading={passkeyLoading}
                  disabled={isSubmitting}
                  leftIcon={!passkeyLoading ? <Fingerprint size={17} /> : undefined}
                  onClick={handlePasskeyLogin}
                  className="mt-3 h-11 rounded-xl border-slate-200 bg-white text-violet-700 hover:border-violet-200 hover:bg-violet-50 active:translate-y-0 dark:border-slate-700 dark:bg-slate-950/70 dark:text-violet-200 dark:hover:border-violet-400/70 dark:hover:bg-slate-900 lg:hidden"
                >
                  Entrar com Face ID / Passkey
                </Button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <ShieldCheck size={14} className="text-violet-600 dark:text-violet-300" />
                <span>Ambiente protegido por autenticação segura.</span>
              </div>

              <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
                Não tem conta?{' '}
                <Link to="/register" className="font-semibold text-violet-700 hover:underline dark:text-violet-300 dark:hover:text-violet-200">
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <AlertModal
        open={Boolean(alert)}
        title={alert?.title || ''}
        message={alert?.message || ''}
        tone={alert?.tone}
        onClose={() => setAlert(null)}
      />
    </div>
  )
}

