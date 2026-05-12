"use client"

import {
  BarChart3,
  Factory,
  LayoutDashboard,
  Package,
  PanelLeft,
  ShoppingCart,
  Truck,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

export function MobileSidebar() {
  return (
    <div className="md:hidden">

      <Sheet>

        <SheetTrigger asChild>

          <button
            className="
              flex
              items-center
              justify-center
              rounded-2xl
              border
              border-white/5
              bg-white/5
              p-3
              backdrop-blur-xl
              transition-all
              duration-300
              hover:bg-white/10
            "
          >

            <PanelLeft className="h-5 w-5 text-zinc-300" />

          </button>

        </SheetTrigger>

        <SheetContent
          side="left"
          className="
            border-white/5
            bg-[#09090B]/95
            backdrop-blur-2xl
          "
          
        >
        <SheetHeader className="sr-only">

            <SheetTitle>
                ERP Navigation
            </SheetTitle>

        </SheetHeader>
          {/* Brand */}

          <div className="mb-10 flex items-center gap-3">

            <div
              className="
                veritas-glow
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-lime-400
                font-black
                text-black
              "
            >
              V
            </div>

            <div>

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

              <p className="text-sm text-zinc-500">
                Industrial Platform
              </p>

            </div>

          </div>

          {/* Navigation */}

          <nav className="flex flex-col gap-2">

            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.title}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    px-4
                    py-3
                    transition-all
                    duration-300
                    hover:bg-lime-400/10
                  "
                >

                  <Icon
                    className="
                      h-5
                      w-5
                      text-zinc-400
                    "
                  />

                  <span
                    className="
                      font-medium
                      text-zinc-300
                    "
                  >
                    {item.title}
                  </span>

                </button>
              )
            })}

          </nav>

        </SheetContent>

      </Sheet>

    </div>
  )
}