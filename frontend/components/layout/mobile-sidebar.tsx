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

const navigation = [

  {

    section: "Procurement",

    items: [

      {
        title: "Vendors",
        href: "/vendors",
      },

      {
        title: "Raw Materials",
        href: "/raw-materials",
      },

      {
        title: "Material Sources",
        href: "/material-sources",
      },

      {
        title: "GRNs",
        href: "/grns",
      },
    ],
  },


  {

    section: "Inventory",

    items: [

      {
        title: "Inventory",
        href: "/inventory",
      },

      {
        title: "Stock Ledger",
        href: "/inventory/ledger",
      },

      {
        title: "Warehouses",
        href: "/warehouses",
      },
    ],
  },


  {

    section: "Sales",

    items: [

      {
        title: "Customers",
        href: "/customers",
      },
    ],
  },


  {

    section: "Production",

    items: [

      {
        title: "Production",
        href: "/production",
      },

      {
        title: "Packing",
        href: "/packing",
      },
    ],
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

            {navigation.map((group) => (

  <div
    key={group.section}
    className="mb-6"
  >

    <p
      className="
        mb-2
        px-4
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-zinc-500
      "
    >
      {group.section}
    </p>

    <div
      className="
        flex
        flex-col
        gap-1
      "
    >

      {group.items.map((item) => (

        <a

          key={item.title}

          href={item.href}

          className="
            rounded-2xl
            px-4
            py-3
            text-sm
            font-medium
            text-zinc-300
            transition-all
            hover:bg-lime-400/10
          "
        >
          {item.title}
        </a>
      ))}

    </div>

  </div>
))}
          </nav>

        </SheetContent>

      </Sheet>

    </div>
  )
}