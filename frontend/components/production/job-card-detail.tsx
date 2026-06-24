import Link from "next/link"
import CreateBatchForm from
  "./create-batch-form"

export default function
JobCardDetail({
  jobCard,
}: {
  jobCard: any
}) {

  return (

    <div className="p-8 text-white">

      <div
        className="
          mb-8
          flex
          items-start
          justify-between
        "
      >

        <div>

          <Link
            href="/production/job-cards"

            className="
              mb-4
              inline-block
              text-sm
              text-zinc-400
            "
          >
            ← Back to Job Cards
          </Link>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            {jobCard.job_card_number}
          </h1>

          <p
            className="
              mt-2
              text-zinc-400
            "
          >
            {jobCard.sr_number}
            {" • "}
            {jobCard.product_name}
          </p>

        </div>

        <span
          className="
            rounded-full
            bg-yellow-500/20
            px-3
            py-1
            text-sm
            text-yellow-300
          "
        >
          {jobCard.status}
        </span>

      </div>

      <div
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >

        <MetricCard
          label="Planned Quantity"
          value={jobCard.planned_quantity}
        />

        <MetricCard
          label="Produced Quantity"
          value={jobCard.produced_quantity}
        />

        <MetricCard
          label="Rejected Quantity"
          value={jobCard.total_rejected}
        />

        <MetricCard
          label="Remaining to Batch"
          value={jobCard.remaining_to_batch}
        />

      </div>

      <div
        className="
          mt-8
          rounded-xl
          border
          border-zinc-800
          p-6
        "
      >

        <h2
          className="
            mb-4
            text-xl
            font-semibold
          "
        >
          Order Details
        </h2>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          <InfoRow
            label="Sales Order"
            value={
              jobCard.order_number
              || "-"
            }
          />

          <InfoRow
            label="Customer"
            value={
              jobCard.customer_name
              || "-"
            }
          />

          <InfoRow
            label="SR Number"
            value={
              jobCard.sr_number
              || "-"
            }
          />

          <InfoRow
            label="Product"
            value={
              jobCard.product_name
            }
          />

        </div>

      </div>

      <div
        className="
          mt-8
          rounded-xl
          border
          border-zinc-800
          p-6
        "
      >

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Batches
          </h2>

          {
            jobCard.remaining_to_batch > 0 && (

              <CreateBatchForm

                productionId={jobCard.id}

                remainingQuantity={
                    jobCard.remaining_to_batch
                }

                />
            )
          }

        </div>

        {
          jobCard.batches?.length === 0

            ? (

              <p className="text-zinc-500">

                No batches created.

              </p>
            )

            : (

              <div className="space-y-4">

                {
                  jobCard.batches.map(
                    (batch: any) => (

                      <div
                        key={batch.id}

                        className="
                          rounded-lg
                          border
                          border-zinc-800
                          p-4
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

                            <h3
                              className="
                                font-medium
                              "
                            >
                              <Link
                                href={
                                    `/production/batches/${batch.id}/edit`
                                }

                                className="
                                    text-blue-400
                                    hover:underline
                                "
                                >

                                {batch.batch_number}

                                </Link>
                            </h3>

                            <p
                              className="
                                mt-1
                                text-sm
                                text-zinc-400
                              "
                            >
                              Qty:
                              {" "}
                              {batch.planned_quantity}
                            </p>

                          </div>

                          <div
                            className="
                              text-right
                            "
                          >

                            <div>

                              {
                                batch.current_stage
                              }

                            </div>

                            <div
                              className="
                                text-sm
                                text-zinc-400
                              "
                            >

                              {
                                batch.stage_progress
                                  ?.completed
                              }

                              /

                              {
                                batch.stage_progress
                                  ?.total
                              }

                            </div>

                          </div>

                        </div>

                      </div>
                    )
                  )
                }

              </div>
            )
        }

      </div>

    </div>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: number
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-zinc-800
        p-6
      "
    >

      <p
        className="
          text-sm
          text-zinc-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-2xl
          font-bold
        "
      >
        {value}
      </p>

    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
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

      <p className="mt-1">

        {value}

      </p>

    </div>
  )
}