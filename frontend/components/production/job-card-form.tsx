"use client"

import { useState } from "react"

import { useRouter }
from "next/navigation"

import {
  createJobCard,
} from "@/lib/api/job-cards-client"

export default function
JobCardForm({

  request,

}: {
  request: any
}) {

  const router =
    useRouter()

  const [
    plannedQuantity,

    setPlannedQuantity,

  ] = useState(
    request.remaining_quantity
  )

  const [
    remarks,

    setRemarks,

  ] = useState("")

  const [
    loading,

    setLoading,

  ] = useState(false)

  async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    if (
      plannedQuantity <= 0
    ) {

      alert(
        "Planned quantity must be greater than zero."
      )

      return
    }

    if (

      plannedQuantity >

      request.remaining_quantity

    ) {

      alert(

        `Only ${request.remaining_quantity} quantity is available.`
      )

      return
    }

    try {

      setLoading(true)

      await createJobCard({

        production_request:
          request.id,

        planned_quantity:
          plannedQuantity,

        remarks,
      })

      router.push(
        "/production/job-cards"
      )

    } catch (error: any) {

      alert(error.message)

    } finally {

      setLoading(false)
    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="
        max-w-5xl
        space-y-8
      "
    >

      <div
        className="
          grid
          grid-cols-2
          gap-6

          rounded-xl

          border
          border-zinc-800

          p-6
        "
      >

        <Info
          label="Production Request"
          value={`PR-${request.id}`}
        />

        <Info
          label="Source Type"
          value={request.source_type}
        />

        <Info
          label="Sales Order"
          value={
            request.order_number
          }
        />

        <Info
          label="Customer"
          value={
            request.customer_name
          }
        />

        <Info
          label="SR Number"
          value={
            request.sr_number
          }
        />

        <Info
          label="Product"
          value={
            request.product_name
          }
        />

        <Info
          label="Requested Quantity"
          value={
            request.requested_quantity
          }
        />

        <Info
          label="Allocated"
          value={
            request.allocated_quantity
          }
        />

        <Info
          label="Remaining"
          value={
            request.remaining_quantity
          }
        />

      </div>

      <div>

        <label
          className="
            block
            mb-2
          "
        >

          Planned Quantity

        </label>

        <input
          type="number"

          value={
            plannedQuantity
          }

          onChange={(e) =>

            setPlannedQuantity(
              Number(
                e.target.value
              )
            )
          }

          max={
            request.remaining_quantity
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

      </div>

      <div>

        <label
          className="
            block
            mb-2
          "
        >

          Remarks

        </label>

        <textarea

          value={remarks}

          onChange={(e) =>

            setRemarks(
              e.target.value
            )
          }

          rows={4}

          className="
            w-full

            rounded-lg

            border
            border-zinc-700

            bg-zinc-900

            p-3
          "
        />

      </div>

      <button

        type="submit"

        disabled={loading}

        className="
          rounded-lg

          bg-white

          px-6
          py-3

          text-black

          disabled:opacity-50
        "
      >

        {
          loading

            ? "Creating..."

            : "Create Job Card"
        }

      </button>

    </form>
  )
}

function Info({

  label,

  value,

}: {

  label: string

  value: any
}) {

  return (

    <div>

      <p
        className="
          text-sm
          text-zinc-500
        "
      >

        {label}

      </p>

      <p
        className="
          mt-1
          font-medium
        "
      >

        {value || "-"}

      </p>

    </div>
  )
}