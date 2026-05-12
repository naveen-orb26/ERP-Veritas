"use client"

import { motion } from "framer-motion"

import {
  Activity,
  Factory,
  PackageCheck,
  ShoppingCart,
} from "lucide-react"

import { DashboardWidget } from "@/components/dashboard/dashboard-widget"

type KPIWidgetProps = {
  title: string

  value: string

  subtitle?: string

  icon: string

  trend?: string

  delay?: number
}

const iconMap = {
  orders: ShoppingCart,
  production: Factory,
  dispatch: PackageCheck,
  efficiency: Activity,
}

export function KPIWidget({
  title,
  value,
  subtitle,
  icon,
  trend,
  delay = 0,
}: KPIWidgetProps) {

  const Icon =
    iconMap[icon as keyof typeof iconMap]

  return (
    <DashboardWidget
      title={title}
      subtitle={subtitle}
      delay={delay}
    >

      <div className="flex items-start justify-between">

        {/* Left */}

        <div>

          <motion.h2
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: delay + 0.1,
              duration: 0.35,
            }}
            className="
              text-4xl
              font-black
              tracking-tight
              text-white
            "
          >
            {value}
          </motion.h2>

          {trend && (

            <p
              className="
                mt-3
                text-sm
                font-medium
                text-lime-400
              "
            >
              {trend}
            </p>

          )}

        </div>

        {/* Right */}

        <motion.div
          whileHover={{
            scale: 1.06,
          }}
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-lime-400/10
            bg-lime-400/10
          "
        >

          <Icon
            className="
              h-7
              w-7
              text-lime-400
            "
          />

        </motion.div>

      </div>

    </DashboardWidget>
  )
}