import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, type, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
    const passwordToggleLabel = showPassword ? 'Ocultar senha' : 'Mostrar senha'

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-gray-400 dark:text-slate-500">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            className={cn(
              'w-full h-10 rounded-lg border bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100',
              'text-[16px] placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
              error ? 'border-red-400' : 'border-gray-300 dark:border-slate-700',
              leftIcon ? 'pl-10' : 'pl-3',
              (rightIcon || isPassword) ? 'pr-10' : 'pr-3',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className={cn(
                'absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition',
                'hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
                'dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-slate-950'
              )}
              aria-label={passwordToggleLabel}
              aria-pressed={showPassword}
              title={passwordToggleLabel}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <span className="pointer-events-none absolute right-3 text-gray-400 dark:text-slate-500">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
