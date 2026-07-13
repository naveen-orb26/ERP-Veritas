type Props = {
  batch: any
}

function Metric({
  label,
  value,
}:{
  label:string
  value:any
}){

  return(

    <div
      className="
        rounded-lg
        border
        border-zinc-800
        bg-zinc-950
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
          text-xl
          font-semibold
        "
      >
        {value ?? "-"}
      </p>

    </div>

  )

}

export default function ExecutionCard({
  batch,
}:Props){

  const totalStages = batch.stages.length

  const completedStages = batch.stages.filter(
    (stage:any)=>
      stage.status==="COMPLETED"
  ).length

  const progress = totalStages
    ? Math.round(
        (completedStages/totalStages)*100
      )
    : 0

  return(

    <div
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >

      <h2
        className="
          mb-6
          text-xl
          font-semibold
        "
      >
        Production Execution
      </h2>

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <Metric
          label="Batch Status"
          value={batch.status}
        />

        <Metric
          label="Current Stage"
          value={batch.current_stage}
        />

        <Metric
          label="Planned Quantity"
          value={batch.planned_quantity}
        />

        <Metric
          label="Actual Quantity"
          value={batch.actual_quantity ?? 0}
        />

        <Metric
          label="Job Card Status"
          value={batch.job_card_status}
        />

        <Metric
          label="Production Request"
          value={batch.production_request_status}
        />

      </div>

      <div className="mt-8">

        <div
          className="
            mb-2
            flex
            justify-between
            text-sm
          "
        >

          <span>

            Stage Progress

          </span>

          <span>

            {completedStages}
            /
            {totalStages}

          </span>

        </div>

        <div
          className="
            h-3
            overflow-hidden
            rounded-full
            bg-zinc-800
          "
        >

          <div

            style={{

              width:`${progress}%`

            }}

            className="
              h-full
              bg-blue-500
              transition-all
            "

          />

        </div>

      </div>

      <div
        className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <Metric
          label="Started At"
          value={
            batch.start_time
              ? new Date(
                  batch.start_time
                ).toLocaleString()
              : "-"
          }
        />

        <Metric
          label="Completed At"
          value={
            batch.end_time
              ? new Date(
                  batch.end_time
                ).toLocaleString()
              : "-"
          }
        />

      </div>

    </div>

  )

}