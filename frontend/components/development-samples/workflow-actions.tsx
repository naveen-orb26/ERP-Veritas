"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  approveDevelopmentSample,

  rejectDevelopmentSample,

} from "@/lib/api/sampling"


export default function
WorkflowActions({

  sample,
}: {
  sample: any
}) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  async function
  handleApprove() {

    try {

      
      setLoading(true)
      setError("")
      await approveDevelopmentSample(
        sample.id.toString()
      )

      router.refresh()

    } catch (error) {

      console.error(error)

      if (error instanceof Error) {

        setError(error.message)

      } else {

        setError(
          "Failed to approve sample"
        )
      } 

    } finally {

      setLoading(false)
    }
  }
    async function
  handleReject() {

    try {

      setLoading(true)
      setError("")

      await rejectDevelopmentSample(
        sample.id.toString()
      )

      router.refresh()

    } catch (error) {

      console.error(error)

      if (error instanceof Error) {

        setError(error.message)

      } else {

        setError(
          "Failed to reject sample"
        )
      }

    } finally {

      setLoading(false)
    }
  }


  const isApproved =
    sample.status ===
    "APPROVED"

  const isRejected =
    sample.status ===
    "REJECTED"

      return (
        <>
    <div
      className="
        flex
        gap-3
        flex-wrap
      "
    >

      <button

        type="button"

        disabled={
          loading
          ||
          isApproved
          ||
          isRejected
        }

        onClick={handleApprove}

        className="
          px-5
          py-2
          rounded-xl
          bg-green-600
          hover:bg-green-700
          disabled:opacity-50
          text-white
          transition
        "
      >

        {loading
          ? "Processing..."
          : "Approve"}

      </button>

      <button

        type="button"

        disabled={
          loading
          ||
          isApproved
          ||
          isRejected
        }

        onClick={handleReject}

        className="
          px-5
          py-2
          rounded-xl
          bg-red-600
          hover:bg-red-700
          disabled:opacity-50
          text-white
          transition
        "
      >

        {loading
          ? "Processing..."
          : "Reject"}

      </button>

    </div>

    {error && (

      <div
        className="
          mt-4
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
          dark:border-red-900
          dark:bg-red-950/40
          dark:text-red-300
        "
      >
        {error}
      </div>
    )}

  </>
)
}