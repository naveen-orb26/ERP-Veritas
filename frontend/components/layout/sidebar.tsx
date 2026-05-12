"use client"

import {
  BarChart3,
  Factory,
  LayoutDashboard,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Truck,
} from "lucide-react"

import { motion } from "framer-motion"

import { useUI } from "@/providers/ui-provider"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sales",
    icon: ShoppingCart,
  },
  {
    title: "Production",
    icon: Factory,
  },
  {
    title: "Packing",
    icon: Package,
  },
  {
    title: "Dispatch",
    icon: Truck,
  },
  {
    title: "Reports",
    icon: BarChart3,
  },
]

export function Sidebar() {

  const {
    sidebarCollapsed,
    toggleSidebar,
  } = useUI()

  return (

    <motion.aside
      animate={{
        width:
          sidebarCollapsed
            ? 96
            : 300,
      }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 26,
      }}
      className="
        fixed
        left-0
        top-0
        z-50
        hidden
        h-screen
        border-r
        border-white/5
        bg-[#081120]/95
        backdrop-blur-2xl
        md:flex
        md:flex-col
      "
    >

      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.10),transparent_35%)]
        "
      />

      {/* Content */}

      <div
        className="
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          px-4
          py-5
        "
      >

        {/* Header */}

        <motion.div
          animate={{
            alignItems:
              sidebarCollapsed
                ? "center"
                : "stretch",
          }}
          transition={{
            duration: 0.22,
          }}
          className="
            mb-8
            flex
            flex-col
          "
        >

          {/* Top Row */}

          <div
            className="
              flex
              w-full
              items-center
              overflow-hidden
            "
          >

            {/* Orb */}

            <motion.div
              animate={{
                boxShadow:
                  sidebarCollapsed
                    ? "0 0 32px rgba(132,255,0,0.18)"
                    : "0 0 20px rgba(132,255,0,0.12)",
              }}
              transition={{
                duration: 0.22,
              }}
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-lime-400
                text-lg
                font-black
                text-black
              "
            >
              V
            </motion.div>

            {/* Brand Text */}

            <motion.div
              animate={{
                opacity:
                  sidebarCollapsed
                    ? 0
                    : 1,

                x:
                  sidebarCollapsed
                    ? -10
                    : 0,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                ml-3
                overflow-hidden
                whitespace-nowrap
              "
              style={{
                width:
                  sidebarCollapsed
                    ? 0
                    : 170,

                pointerEvents:
                  sidebarCollapsed
                    ? "none"
                    : "auto",
              }}
            >

              <h1
                className="
                  text-lg
                  font-bold
                  tracking-wide
                  text-white
                "
              >
                ERP-Veritas
              </h1>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Operational Intelligence
              </p>

            </motion.div>

          </div>

        </motion.div>

        {/* Rail Toggle */}

        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className={`
            flex

            ${
              sidebarCollapsed
                ? "mb-2 justify-center -translate-x-[4px]"
                : "-mt-20 mb-6 w-full justify-end"
            }
          `}
        >

          <motion.button
            layout
            whileTap={{
              scale: 0.94,
            }}
            whileHover={{
              scale: 1.03,
            }}
            animate={{
              rotate:
                sidebarCollapsed
                  ? 180
                  : 0,
            }}
            transition={{
              duration: 0.24,
              ease: "easeInOut",
            }}
            onClick={toggleSidebar}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-white/5
              bg-white/5
              transition-all
              duration-300
              hover:bg-white/10
            "
          >

            <PanelLeft
              className="
                h-5
                w-5
                text-zinc-300
              "
            />

          </motion.button>

        </motion.div>

        {/* Navigation */}

        <nav
          className="
            flex
            flex-1
            flex-col
            gap-2
          "
        >

          {navItems.map((item, index) => {

            const Icon =
              item.icon

            return (

              <motion.button
                key={item.title}
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay:
                    index * 0.03,
                }}
                whileHover={{
                  x:
                    sidebarCollapsed
                      ? 0
                      : 3,
                }}
                className={`
                  group
                  flex
                  h-12
                  items-center
                  rounded-2xl
                  transition-all
                  duration-300
                  hover:bg-lime-400/10

                  ${
                    sidebarCollapsed
                      ? "justify-center px-0"
                      : "px-4"
                  }
                `}
              >

                <Icon
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-zinc-400
                    transition-colors
                    duration-300
                    group-hover:text-lime-400
                  "
                />

                <motion.span
                  animate={{
                    opacity:
                      sidebarCollapsed
                        ? 0
                        : 1,

                    x:
                      sidebarCollapsed
                        ? -10
                        : 0,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className="
                    ml-3
                    overflow-hidden
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-zinc-300
                    transition-colors
                    duration-300
                    group-hover:text-white
                  "
                  style={{
                    width:
                      sidebarCollapsed
                        ? 0
                        : "auto",
                  }}
                >
                  {item.title}
                </motion.span>

              </motion.button>

            )
          })}

        </nav>

        {/* Footer */}

        <motion.div
          animate={{
            opacity:
              sidebarCollapsed
                ? 0
                : 1,

            y:
              sidebarCollapsed
                ? 10
                : 0,
          }}
          transition={{
            duration: 0.16,
          }}
          className={`
            overflow-hidden
            rounded-2xl
            border
            border-lime-400/10
            bg-lime-400/5

            ${
              sidebarCollapsed
                ? "h-0 p-0"
                : "mt-4 p-4"
            }
          `}
        >

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            <Settings
              className="
                h-4
                w-4
                text-lime-400
              "
            />

            <span
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              System Status
            </span>

          </div>

          <p
            className="
              text-sm
              text-zinc-400
            "
          >
            All operational services running normally.
          </p>

        </motion.div>

      </div>

    </motion.aside>
  )
}