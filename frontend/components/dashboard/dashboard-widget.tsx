"use client"

import { motion } from "framer-motion"

type DashboardWidgetProps = {
  title: string

  subtitle?: string

  children: React.ReactNode

  className?: string

  delay?: number
}

export function DashboardWidget({
  title,
  subtitle,
  children,
  className = "",
  delay = 0,
}: DashboardWidgetProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.45,
        ease: "easeOut",
      }}
      className={`
        glass-panel
        rounded-3xl
        border
        border-white/5
        p-6
        ${className}
      `}
    >

      {/* Header */}

      <div className="mb-6">

        <h3
          className="
            text-lg
            font-bold
            tracking-tight
            text-white
          "
        >
          {title}
        </h3>

        {subtitle && (

          <p
            className="
              mt-1
              text-sm
              text-zinc-500
            "
          >
            {subtitle}
          </p>

        )}

      </div>

      {/* Content */}

      <div>
        {children}
      </div>

    </motion.section>
  )
}