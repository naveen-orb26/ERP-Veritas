"use client"

import { useState, useTransition } from "react"

import { useRouter } from "next/navigation"

import {
  startStage,
  completeStage,
} from "@/lib/api/stages-client"

export default function StageActions({
  batchId,
  stage,
}: {
  batchId: number
  stage: any
}) {

  const router =
    useRouter()

  const [isPending, startTransition] =
  useTransition()

  async function handleStart() {

  console.log("START CLICKED")

  const result =
    await startStage(batchId)

  console.log(
    "START RESULT",
    result
  )

  console.log(
    "REFRESHING"
  )

  router.refresh()
}
async function handleComplete() {

  console.log(
    "COMPLETE CLICKED"
  )

  const result =
    await completeStage(batchId)

  console.log(
    "COMPLETE RESULT",
    result
  )

  console.log(
    "REFRESHING"
  )

  router.refresh()
}
  if (stage.status === "PENDING") {

    return (

      <button
        onClick={handleStart}

        disabled={isPending}

        className="
          rounded-lg
          bg-blue-600
          px-3
          py-1
          text-sm
        "
      >
        Start
      </button>
    )
  }

  if (stage.status === "IN_PROGRESS") {

    return (

      <button
        onClick={handleComplete}

        disabled={isPending}

        className="
          rounded-lg
          bg-green-600
          px-3
          py-1
          text-sm
        "
      >
        Complete
      </button>
    )
  }

  return null
}