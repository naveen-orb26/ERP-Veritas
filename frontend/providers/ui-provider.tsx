"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"

type UIContextType = {
  sidebarCollapsed: boolean

  toggleSidebar: () => void
}

const UIContext = createContext<UIContextType | null>(
  null
)

export function UIProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev)
  }

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
    }),
    [sidebarCollapsed]
  )

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)

  if (!context) {
    throw new Error(
      "useUI must be used inside UIProvider"
    )
  }

  return context
}