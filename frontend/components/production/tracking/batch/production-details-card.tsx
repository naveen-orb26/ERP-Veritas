type Props = {

  batch: any

}

function Row({

  label,

  value,

}: {

  label: string

  value: any

}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-zinc-800
        py-3
      "
    >

      <span
        className="
          text-sm
          text-zinc-400
        "
      >

        {label}

      </span>

      <span
        className="
          font-medium
        "
      >

        {value || "Not Declared"}

      </span>

    </div>

  )

}

export default function ProductionDetailsCard({

  batch,

}: Props) {

  return (

    <div
      className="
        mt-6
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

        Production Details

      </h2>

      <Row

        label="Machine"

        value={batch.machine_name}

      />

      <Row

        label="Operator"

        value={batch.operator_name}

      />

      <Row

        label="Shift"

        value={batch.shift}

      />

      <Row

        label="Start Time"

        value={

          batch.start_time

            ?

            new Date(

              batch.start_time

            ).toLocaleString()

            :

            "-"

        }

      />

      <Row

        label="End Time"

        value={

          batch.end_time

            ?

            new Date(

              batch.end_time

            ).toLocaleString()

            :

            "-"

        }

      />

    </div>

  )

}