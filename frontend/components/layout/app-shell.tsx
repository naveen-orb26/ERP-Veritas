"use client"

import { motion } from "framer-motion"

import { useUI } from "@/providers/ui-provider"

import { Sidebar } from "@/components/layout/sidebar"

import { Topbar } from "@/components/layout/topbar"

type AppShellProps = {

  children: React.ReactNode

  user: {
    email: string
    role: string
  }
}

export function AppShell({
  children,
  user,
}: AppShellProps) {

  const {
    sidebarCollapsed,
  } = useUI()

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
      "
    >

      {/* Sidebar */}

      <Sidebar />

      {/* Main Layout */}

      <motion.div
        animate={{
          paddingLeft:
            sidebarCollapsed
              ? 96
              : 300,
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 28,
        }}
        className="
          flex
          min-h-screen
          flex-col
        "
      >

        {/* Topbar */}

        <Topbar user={user} />

        {/* Content */}

        <main
          className="
            flex-1
            p-4
            md:p-6
            2xl:p-8
          "
        >

          {children}

        </main>

      </motion.div>

    </div>
  )
}