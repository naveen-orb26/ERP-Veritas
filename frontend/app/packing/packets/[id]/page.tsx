import {
  getPacket,
} from "@/lib/api/packets-server"

import Link
from "next/link"


export default async function
PacketDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const packet =
    await getPacket(id)

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        {packet.packet_number}
      </h1>

        <Link
        href={`/production/batches/${packet.batch}`}
        className="
            mt-2
            inline-block
            text-blue-400
        "
        >
        View Batch
        </Link>

      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-4
        "
      >

        <Metric
          label="Quantity"
          value={
            packet.units_in_packet
          }
        />

        <Metric
          label="Status"
          value={
            packet.status
          }
        />

        <Metric
          label="Allocation"
          value={
            packet.allocation_type
          }
        />

        <Metric
          label="Order"
          value={
            packet.sales_order_number
          }
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
          Details
        </h2>

        <div className="space-y-3">

          <Row
            label="Customer"
            value={
              packet.customer_name
            }
          />

          <Row
            label="Product"
            value={
              packet.product_name
            }
          />

          <Row
            label="Batch"
            value={
              packet.batch_number
            }
          />

          <Row
            label="Job Card"
            value={
              packet.job_card_number
            }
          />

          <Row
            label="Manufacture Date"
            value={
              packet.manufacture_date
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

        <h2
          className="
            mb-4
            text-xl
            font-semibold
          "
        >
          Label Preview
        </h2>

        <pre
          className="
            whitespace-pre-wrap
            text-sm
          "
        >
          {JSON.stringify(

            packet.label_data,

            null,

            2
          )}
        </pre>

      </div>

    </div>
  )
}

function Metric({
  label,
  value,
}: any) {

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

function Row({
  label,
  value,
}: any) {

  return (

    <div
      className="
        flex
        justify-between
      "
    >

      <span
        className="
          text-zinc-500
        "
      >
        {label}
      </span>

      <span>
        {value}
      </span>

    </div>
  )
}