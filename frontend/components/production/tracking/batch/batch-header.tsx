import Link from "next/link"
import StatusBadge from "@/components/common/status-badge"

type Props = {
  batch: any
}


export default function BatchHeader({
  batch,
}: Props) {

  return (

    <div
      className="
        mb-8
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >

      <Link
        href={`/production/job-cards/${batch.production}`}
        className="
          mb-6
          inline-flex
          text-sm
          text-blue-400
          hover:text-blue-300
        "
      >
        ← Back to Job Card
      </Link>

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            {batch.batch_number}
          </h1>

          <p
            className="
              mt-2
              text-zinc-400
            "
          >
            Job Card :
            {" "}
            {batch.job_card_number}
          </p>

        </div>

        <div
        className="
            flex
            items-start
            justify-start
            lg:justify-end
        "
        >

        <StatusBadge
            status={batch.status}
        />

        </div>

      </div>

      <div
        className="
          mt-8
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <div>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Sales Order
          </p>

          <p
            className="
              mt-1
              font-medium
            "
          >
            {batch.sales_order_number ?? "-"}
          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Customer
          </p>

          <p
            className="
              mt-1
              font-medium
            "
          >
            {batch.customer_name ?? "-"}
          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Current Stage
          </p>

          <p
            className="
              mt-1
              font-medium
            "
          >
            {
            typeof batch.current_stage === "string"
                ? batch.current_stage
                : batch.current_stage?.stage_name ?? "-"
            }
          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Production Request
          </p>

          <p
            className="
              mt-1
              font-medium
            "
          >
            PR-{batch.production_request_id}
          </p>

        </div>

      </div>

    </div>

  )

}