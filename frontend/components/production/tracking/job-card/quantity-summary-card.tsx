type Props = {

  quantity: {

    planned_quantity: number

    accepted_quantity: number

    rejected_quantity: number

    produced_quantity: number

    remaining_quantity: number

    completion_percentage: number

  }

}

export default function QuantitySummaryCard({

  quantity,

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

      <h2
        className="
          text-lg
          font-semibold
        "
      >
        Quantity Summary
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-zinc-400
        "
      >
        Verified production quantities after inspection.
      </p>

      <div
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        <SummaryItem
          label="Planned"
          value={quantity.planned_quantity}
        />

        <SummaryItem
          label="Produced"
          value={quantity.produced_quantity}
        />

        <SummaryItem
          label="Accepted"
          value={quantity.accepted_quantity}
        />

        <SummaryItem
          label="Rejected"
          value={quantity.rejected_quantity}
        />

        <SummaryItem
          label="Remaining"
          value={quantity.remaining_quantity}
        />

        <SummaryItem
          label="Completion"
          value={`${quantity.completion_percentage}%`}
        />

      </div>

    </div>

  )

}

function SummaryItem({

  label,

  value,

}: {

  label: string

  value: string | number

}) {

  return (

    <div
      className="
        rounded-lg
        border
        border-zinc-800
        bg-zinc-950/40
        p-4
      "
    >

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
          text-2xl
          font-bold
        "
      >
        {value}
      </p>

    </div>

  )

}