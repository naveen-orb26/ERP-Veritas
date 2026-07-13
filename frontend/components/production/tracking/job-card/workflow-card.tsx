import CreateBatchForm from "../../create-batch-form"

type Props = {

  workflow: {

    production_id: number

    status: string

    status_display: string

    can_create_batch: boolean

    remaining_to_batch: number

    next_action: string

    next_action_display: string

  }

}

export default function WorkflowCard({

  workflow,

}: Props) {

  const createBatch =

    workflow.next_action === "CREATE_BATCH"

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

      <h2
        className="
          text-lg
          font-semibold
        "
      >
        Workflow
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-zinc-400
        "
      >
        Current workflow action for this Job Card.
      </p>

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wide
              text-zinc-500
            "
          >
            Next Action
          </p>

          <p
            className="
              mt-2
              text-lg
              font-semibold
            "
          >
            {workflow.next_action_display}
          </p>

          <p
            className="
              mt-2
              text-sm
              text-zinc-400
            "
          >
            Remaining to Batch :{" "}
            {workflow.remaining_to_batch.toLocaleString()}
          </p>

        </div>

        {createBatch ? (

        <CreateBatchForm

            productionId={workflow.production_id}

            remainingQuantity={
            workflow.remaining_to_batch
            }

        />

        ) : (

        <div
            className="
            rounded-lg
            border
            border-zinc-800
            bg-zinc-950/40
            px-5
            py-4
            text-sm
            text-zinc-400
            "
        >

            {workflow.next_action_display}

        </div>

        )}

      </div>

    </div>

  )

}