import Link from "next/link"

import StatusBadge from "@/components/common/status-badge"

type Props = {

  batches: any[]

}

export default function BatchSummaryCard({

  batches,

}: Props) {

  return (

    <div
      className="
        mt-6
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-6
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Batch Summary
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-zinc-400
            "
          >
            Monitor every production batch for this Job Card.
          </p>

        </div>

        <div
          className="
            rounded-md
            bg-zinc-800
            px-3
            py-1
            text-sm
            text-zinc-300
          "
        >
          {batches.length} Batch{batches.length !== 1 ? "es" : ""}
        </div>

      </div>

      <div
        className="
          mt-6
          space-y-4
        "
      >

        {batches.length === 0 && (

          <div
            className="
              rounded-lg
              border
              border-dashed
              border-zinc-700
              py-10
              text-center
              text-zinc-400
            "
          >

            No batches created yet.

          </div>

        )}

        {batches.map(

          (

            batch,

            index,

          ) => (

            <div
              key={batch.id}
              className="
                rounded-lg
                border
                border-zinc-800
                bg-zinc-950/40
                p-5
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div>

                  <h3
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    Batch {index + 1}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-zinc-500
                    "
                  >
                    {batch.batch_number}
                  </p>

                </div>

                <StatusBadge

                  status={batch.status}

                />

              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-6
                  md:grid-cols-3
                "
              >

                <Info
                  label="Current Stage"
                  value={batch.current_stage}
                />

                <Info
                    label="Stage Progress"
                    value={`${batch.stage_progress.completed} / ${batch.stage_progress.total}`}
                />

                <Info
                  label="Planned Quantity"
                  value={batch.planned_quantity}
                />

              </div>

              <div
                className="
                  mt-6
                  flex
                  justify-end
                "
              >

                <Link
                  href={`/production/batches/${batch.id}`}
                  className="
                    text-sm
                    font-medium
                    text-blue-400
                    hover:text-blue-300
                  "
                >
                  View Batch →
                </Link>

              </div>

            </div>

          )

        )}

      </div>

    </div>

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
          text-xs
          uppercase
          tracking-wide
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-base
          font-medium
        "
      >
        {value ?? "-"}
      </p>

    </div>

  )

}