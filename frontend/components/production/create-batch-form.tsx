"use client"

import {
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  createBatch,
} from "@/lib/api/batches-client"

export default function
CreateBatchForm({
  productionId,
  remainingQuantity,
}: {
  productionId: number
  remainingQuantity: number
}) {

const router =
  useRouter()

const [
  quantity,
  setQuantity,
] = useState(
  remainingQuantity
)

const [
  error,
  setError,
] = useState("")

const [
  loading,
  setLoading,
] = useState(false)

async function handleSubmit(
  e: React.FormEvent
) {

  e.preventDefault()

  setLoading(true)

  setError("")

  try {

    await createBatch({

      production:
        productionId,

      planned_quantity:
        quantity,
    })

    router.refresh()

  } catch (err: any) {

    setError(

      err.message
      ||
      "Failed to create batch."
    )

  } finally {

    setLoading(false)
  }
}

  return (

    <form
      onSubmit={handleSubmit}

      className="
        mt-4
        rounded-lg
        border
        border-zinc-800
        p-4
      "
    >

      <div>

        <label
          className="
            mb-2
            block
            text-sm
            text-zinc-400
          "
        >
          Batch Quantity
        </label>

        <input
          type="number"

          min={1}

          max={remainingQuantity}

          value={quantity}

          onChange={(e) =>
            setQuantity(
              Number(
                e.target.value
              )
            )
          }

          className="
            w-full
            rounded-lg
            border
            border-zinc-700
            bg-zinc-900
            p-3
          "
        />

        <p
          className="
            mt-2
            text-sm
            text-zinc-500
          "
        >
          Remaining:
          {" "}
          {remainingQuantity}
        </p>
        
          {
            error && (

                <div
                className="
                    mt-4

                    rounded-lg

                    border
                    border-red-500/30 

                    bg-red-500/10

                    p-3

                    text-sm
                    text-red-300
                "
                >

                {error}

                </div>
            )
            }

      </div>

      <button
        type="submit"

        disabled={loading}

        className="
          mt-4
          rounded-lg
          bg-blue-600
          px-4
          py-2
        "
      >

        {
          loading

            ? "Creating..."

            : "Create Batch"
        }

      </button>

    </form>
  )
}