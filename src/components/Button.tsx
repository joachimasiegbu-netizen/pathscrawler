import { motion } from 'framer-motion'
import { type ComponentPropsWithoutRef } from 'react'
import { usePathStore } from '../store/usePathStore'

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variantStyles = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-dark',
  secondary: 'bg-slate-800 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-100 hover:bg-slate-800',
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const motionProps = reduceMotion
    ? {}
    : {
        whileTap: { scale: 0.97 },
        whileHover: { scale: 1.01 },
      }

  return (
    <motion.button
      {...motionProps}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
