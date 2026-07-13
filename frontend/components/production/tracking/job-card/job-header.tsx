
import StatusBadge from "@/components/common/status-badge"

type Props = {
  header: any
}

export default function JobHeader({
  header,
}: Props) {

  return (

    <div
      className="
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
          flex-col
          gap-6
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            {header.job_card_number}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-zinc-400
            "
          >
            Production Job Card
          </p>

        </div>

        <StatusBadge

            status={header.status}

            />

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

        <Info
          label="Sales Order"
          value={header.sales_order_number}
        />

        <Info
          label="Production Request"
          value={header.production_request_number}
        />

        <Info
          label="Customer"
          value={header.customer_name}
        />

        <Info
          label="Production Date"
          value={header.production_date}
        />

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
          mt-1
          text-base
          font-medium
        "
      >
        {value || "-"}
      </p>

    </div>

  )

}