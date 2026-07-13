type Props = {

  progress: {

    total_batches: number

    completed_batches: number

    remaining_batches: number

    completion_percentage: number

  }

}

export default function ProgressSummaryCard({

  progress,

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
        Progress Summary
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-zinc-400
        "
      >
        Overall execution progress of all production batches.
      </p>

      <div className="mt-6">

        <div
          className="
            flex
            justify-between
            text-sm
            text-zinc-400
          "
        >
          <span>

            {progress.completed_batches} of {progress.total_batches} batches completed

          </span>

          <span>

            {progress.completion_percentage}%

          </span>

        </div>

        <div
          className="
            mt-2
            h-3
            overflow-hidden
            rounded-full
            bg-zinc-800
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-green-500
              transition-all
            "
            style={{

              width: `${progress.completion_percentage}%`

            }}
          />

        </div>

      </div>

      <div
        className="
          mt-8
          grid
          gap-4
          grid-cols-3
        "
      >

        <SummaryItem
          label="Total"
          value={progress.total_batches}
        />

        <SummaryItem
          label="Completed"
          value={progress.completed_batches}
        />

        <SummaryItem
          label="Remaining"
          value={progress.remaining_batches}
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
        text-center
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