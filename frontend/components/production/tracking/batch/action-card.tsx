"use client"

import Link from "next/link"

import { useRouter } from "next/navigation"

import {
  startStage,
  completeStage,
} from "@/lib/api/stages-client"

type Props = {
  batch: any
}

export default function ActionCard({
  batch,
}: Props) {

  const router = useRouter()

  const activeStage = batch.stages.find(
    (stage: any) =>
      stage.status === "IN_PROGRESS"
  )

  const pendingStage = batch.stages.find(
    (stage: any) =>
      stage.status === "PENDING"
  )

  async function handleStart() {

    await startStage(
      batch.id
    )

    router.refresh()

  }

  async function handleComplete() {

    await completeStage(
      batch.id
    )

    router.refresh()

  }

  return (

    <div
      className="
        mt-6
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >

      <h2
        className="
          mb-5
          text-xl
          font-semibold
        "
      >
        Workflow Action
      </h2>

      {

        batch.status ===
        "PRODUCTION_COMPLETE"

        ? (

          <>

            <p
              className="
                mb-6
                text-zinc-400
              "
            >

              Production has been completed.

              Inspection can now begin.

            </p>

            <Link

              href={`/production/inspections/create?batch=${batch.id}`}

              className="
                inline-flex
                rounded-lg
                bg-green-600
                px-6
                py-3
                font-medium
                hover:bg-green-700
              "
            >

              Proceed to Inspection

            </Link>

          </>

        )

        : activeStage ? (

          <>

            <p
              className="
                mb-2
                text-zinc-400
              "
            >
              Current Stage
            </p>

            <p
              className="
                mb-6
                text-lg
                font-semibold
              "
            >
              {activeStage.stage_name}
            </p>

            <button

              onClick={handleComplete}

              className="
                rounded-lg
                bg-green-600
                px-6
                py-3
                font-medium
                hover:bg-green-700
              "

            >

              Complete {activeStage.stage_name}

            </button>

          </>

        )

        : pendingStage ? (

          <>

            <p
              className="
                mb-2
                text-zinc-400
              "
            >
              Next Stage
            </p>

            <p
              className="
                mb-6
                text-lg
                font-semibold
              "
            >
              {pendingStage.stage_name}
            </p>

            <button

              onClick={handleStart}

              className="
                rounded-lg
                bg-blue-600
                px-6
                py-3
                font-medium
                hover:bg-blue-700
              "

            >

              Start {pendingStage.stage_name}

            </button>

          </>

        ) : (

          <p>

            Workflow completed.

          </p>

        )

      }

    </div>

  )

}