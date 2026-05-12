"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { motion } from "framer-motion"

import {
  ArrowRight,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react"

import { loginUser } from "@/lib/api/auth"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    setError("")

    try {

      await loginUser(
        email,
        password,
      )

      window.location.href = "/"

    } catch (err: any) {

      setError(
        err.message ||
        "Login failed."
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#050816]
        px-6
      "
    >

      {/* Background Glow */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.15),transparent_35%)]
        "
      />

      {/* Grid Overlay */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* Login Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/[0.04]
          p-8
          shadow-2xl
          backdrop-blur-2xl
        "
      >

        {/* Brand */}

        <div className="mb-10">

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-12
                w-12
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
                  text-xl
                  font-black
                  text-lime-400
                "
              >
                V
              </span>

            </div>

            <div>

              <h1
                className="
                  text-2xl
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
                  text-zinc-400
                "
              >
                Operational Intelligence Platform
              </p>

            </div>

          </div>

        </div>

        {/* Heading */}

        <div className="mb-8">

          <h2
            className="
              text-3xl
              font-black
              tracking-tight
              text-white
            "
          >
            Welcome back
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-zinc-400
            "
          >
            Sign in to continue to ERP-Veritas.
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
              "
            >
              Email
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                transition-all
                focus-within:border-lime-400/40
                focus-within:ring-2
                focus-within:ring-lime-400/20
              "
            >

              <Mail
                className="
                  h-5
                  w-5
                  text-zinc-500
                "
              />

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  h-14
                  w-full
                  bg-transparent
                  px-3
                  text-white
                  outline-none
                  placeholder:text-zinc-500
                "
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
              "
            >
              Password
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                transition-all
                focus-within:border-lime-400/40
                focus-within:ring-2
                focus-within:ring-lime-400/20
              "
            >

              <LockKeyhole
                className="
                  h-5
                  w-5
                  text-zinc-500
                "
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="
                  h-14
                  w-full
                  bg-transparent
                  px-3
                  text-white
                  outline-none
                  placeholder:text-zinc-500
                "
              />

            </div>

          </div>

          {/* Error */}

          {error && (

            <div
              className="
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {error}
            </div>

          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-lime-400
              font-semibold
              text-black
              transition-all
              hover:scale-[1.01]
              hover:bg-lime-300
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (

              <Loader2
                className="
                  h-5
                  w-5
                  animate-spin
                "
              />

            ) : (

              <>
                Continue
                <ArrowRight
                  className="
                    h-5
                    w-5
                  "
                />
              </>

            )}

          </button>

        </form>

      </motion.div>

    </main>
  )
}