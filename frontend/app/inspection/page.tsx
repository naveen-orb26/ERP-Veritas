import {
  getInspections,
} from "@/lib/api/inspections-server"

export const dynamic =
  "force-dynamic"

export default async function
InspectionsPage() {

  const inspections =
    await getInspections()

  return (

    <div className="p-8">

      <h1
        className="
          mb-6
          text-3xl
          font-bold
          text-white
        "
      >
        Inspections
      </h1>

      <div
        className="
          grid
          gap-4
        "
      >

        {inspections.map(
          (inspection: any) => (

            <div
              key={inspection.id}

              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-6
                text-white
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      font-semibold
                    "
                  >
                    Inspection #
                    {inspection.id}
                  </h2>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    {inspection.batch_number}
                  </p>

                </div>

                <div
                  className="
                    rounded-lg
                    bg-blue-900/20
                    px-3
                    py-1
                    text-sm
                  "
                >
                  {
                    inspection.source_type
                  }
                </div>

              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  md:grid-cols-3
                "
              >

                <Info
                  label="Job Card"
                  value={
                    inspection.job_card_number
                  }
                />

                <Info
                  label="Reference"
                  value={
                    inspection.reference_number
                  }
                />

                <Info
                  label="Customer"
                  value={
                    inspection.customer_name
                  }
                />

                <Info
                  label="Product"
                  value={
                    inspection.product_name
                  }
                />

                <Info
                  label="Accepted"
                  value={
                    inspection.accepted_quantity
                  }
                />

                <Info
                  label="Rejected"
                  value={
                    inspection.rejected_quantity
                  }
                />

                <Info
                  label="Inspector"
                  value={
                    inspection.inspector_name
                  }
                />

                <Info
                  label="Date"
                  value={
                    inspection.inspection_date
                  }
                />

              </div>

            </div>
          )
        )}

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
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          font-medium
        "
      >
        {value || "-"}
      </p>

    </div>
  )
}