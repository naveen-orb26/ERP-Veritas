"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import {
  ChevronDown,
  LogOut,
  ShieldCheck,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

import { logoutUser } from "@/lib/api/auth"

import { MobileSidebar } from "@/components/layout/mobile-sidebar"

type TopbarProps = {

  user: {
    email: string
    role: string
  }
}

export function Topbar({
  user,
}: TopbarProps) {

  const router = useRouter()

  const [open, setOpen] =
    useState(false)

  async function handleLogout() {

    await logoutUser()

    window.location.href = "/login"
  }

  return (

    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-white/5
        bg-[#050816]/80
        backdrop-blur-2xl
      "
    >

      <div
        className="
          flex
          h-20
          items-center
          justify-between
          px-4
          md:px-6
          2xl:px-8
        "
      >

        {/* Left */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <MobileSidebar />

          <div>

            <h1
              className="
                text-xl
                font-black
                tracking-tight
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

          </div>

        </div>

        {/* Right */}

        <div className="relative">

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2
              transition-all
              hover:bg-white/[0.06]
            "
          >

            {/* Avatar */}

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-lime-400/10
                ring-1
                ring-lime-400/20
              "
            >

              <span
                className="
                  text-sm
                  font-black
                  uppercase
                  text-lime-400
                "
              >
                {user.email[0]}
              </span>

            </div>

            {/* Info */}

            <div
              className="
                hidden
                text-left
                md:block
              "
            >

              <p
                className="
                  max-w-[180px]
                  truncate
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {user.email}
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  uppercase
                  tracking-wide
                  text-lime-400
                "
              >

                <ShieldCheck
                  className="
                    h-3
                    w-3
                  "
                />

                {user.role}

              </div>

            </div>

            <ChevronDown
              className={`
                h-4
                w-4
                text-zinc-400
                transition-transform
                duration-200
                ${open ? "rotate-180" : ""}
              `}
            />

          </button>

          {/* Dropdown */}

          <AnimatePresence>

            {open && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#0b1120]
                  shadow-2xl
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    border-b
                    border-white/5
                    p-5
                  "
                >

                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    {user.email}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      uppercase
                      tracking-wide
                      text-lime-400
                    "
                  >
                    {user.role}
                  </p>

                </div>

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-sm
                    text-red-300
                    transition-all
                    hover:bg-red-500/10
                  "
                >

                  <LogOut
                    className="
                      h-4
                      w-4
                    "
                  />

                  Logout

                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </header>
  )
}