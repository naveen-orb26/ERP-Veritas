type Props = {

  planning: {

    planned_quantity: number

    allocated_to_batches: number

    remaining_to_batch: number

  }

}

export default function PlanningSummaryCard({

  planning,

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
        Planning Summary
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-zinc-400
        "
      >
        Batch allocation progress for this Job Card.
      </p>

      <div
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-3
        "
      >

        <SummaryItem
          label="Planned Quantity"
          value={planning.planned_quantity}
        />

        <SummaryItem
          label="Allocated to Batches"
          value={planning.allocated_to_batches}
        />

        <SummaryItem
          label="Remaining to Batch"
          value={planning.remaining_to_batch}
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

  value: number

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
        {value.toLocaleString()}
      </p>

    </div>

  )

}