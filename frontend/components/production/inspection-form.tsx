"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  createInspection,
} from "@/lib/api/inspections-client"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

export default function
InspectionForm({
  batchId,
}: {
  batchId: number
}) {

  const router =
    useRouter()

  const [
    batch,
    setBatch,
  ] = useState<any>(null)

  const [
    accepted,
    setAccepted,
  ] = useState(0)

  const [
    rejected,
    setRejected,
  ] = useState(0)

  const [
    remarks,
    setRemarks,
  ] = useState("")

  const [
    error,
    setError,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(false)

  useEffect(() => {

    async function loadBatch() {

      const response =
        await fetch(

          `${API_BASE_URL}/api/production-batches/${batchId}/`,
          {
            credentials:
              "include",
          }
        )

      const data =
        await response.json()

      setBatch(data)
    }

    loadBatch()

  }, [batchId])

  async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setError("")

    setLoading(true)

    try {

      await createInspection({

        batch: batchId,

        accepted_quantity:
          accepted,

        rejected_quantity:
          rejected,

        remarks,
      })

      router.push(
        "/production/inspections"
      )

   } catch (error: any) {

  try {

    const parsed =
      JSON.parse(
        error.message
      )

    setError(

      parsed.non_field_errors?.[0]

      ||

      parsed.detail

      ||

      "Failed to create inspection."
    )

  } catch {

    setError(
      error.message
    )
  }

} finally {

      setLoading(false)
    }
  }

  if (!batch) {

    return (

      <div className="p-8 text-white">

        Loading...

      </div>
    )
  }

  if (
    batch.remaining_for_inspection <= 0
    ) {

    return (

        <div className="p-8 text-white">

        <h1
            className="
            mb-4
            text-3xl
            font-bold
            "
        >
            Inspection Complete
        </h1>

        <div
            className="
            rounded-xl
            border
            border-green-800
            bg-green-900/20
            p-6
            "
        >

            This batch has already
            been fully inspected.

        </div>

        </div>
    )
    }

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <h1
        className="
          mb-6
          text-3xl
          font-bold
        "
      >
        Record Inspection
      </h1>

      <div
        className="
          mb-8
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <Metric
  label="Batch Number"
  value={
    batch.batch_number
  }
/>

<Metric
  label="Job Card"
  value={
    batch.job_card_number
  }
/>

<Metric
  label="Product"
  value={
    batch.product_name
  }
/>

    <Metric
    label="Customer"
    value={
        batch.customer_name
    }
    />

    <Metric
    label="Source Type"
    value={
        batch.source_type
    }
    />

    <Metric
    label="Reference"
    value={
        batch.reference_number
    }
    />

    <Metric
    label="Batch Quantity"
    value={
        batch.planned_quantity
    }
    />

    <Metric
    label="Already Inspected"
    value={
        batch.inspected_quantity
    }
    />

    <Metric
    label="Remaining For Inspection"
    value={
        batch.remaining_for_inspection
    }
    />

      </div>

      {
        error && (

          <div
            className="
              mb-4
              rounded-lg
              border
              border-red-800
              bg-red-900/20
              p-4
              text-red-400
            "
          >
            {error}
          </div>
        )
      }

      <form
        onSubmit={
          handleSubmit
        }

        className="
          space-y-4
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
            Accepted Quantity
        </label>

        <input

          type="number"

          value={accepted}

          onChange={(e) =>
            setAccepted(
              Number(
                e.target.value
              )
            )
          }

          placeholder="Accepted Quantity"

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
                mb-2
                block
                text-sm
                text-zinc-400
                "
            >
                Rejected Quantity
        </label>
    
        <input

          type="number"

          value={rejected}

          onChange={(e) =>
            setRejected(
              Number(
                e.target.value
              )
            )
          }

          placeholder="Rejected Quantity"

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
                mb-2
                block
                text-sm
                text-zinc-400
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

          placeholder="Remarks"

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
            bg-green-600
            px-4
            py-2
          "
        >

          {
            loading
            ? "Recording..."
            : "Record Inspection"
          }

        </button>

      </form>

    </div>
  )
}

function Metric({
  label,
  value,
}: {
  label: string
  value: any
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-zinc-800
        p-4
      "
    >

      <p
        className="
          text-xs
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          font-semibold
        "
      >
        {value}
      </p>

    </div>
  )
}