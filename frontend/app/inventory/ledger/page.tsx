import {

  getStockLedgerServer,

} from "@/lib/api/stock-ledger-server"


export default async function
StockLedgerPage() {

  const ledger =
    await getStockLedgerServer()

  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Stock Ledger
        </h1>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          Inventory movement audit trail
        </p>

      </div>


      <div
        className="
          overflow-x-auto
          rounded-2xl
          border
          border-zinc-200
          bg-white
          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >

        <table
          className="
            min-w-full
            divide-y
            divide-zinc-200
            dark:divide-zinc-800
          "
        >

          <thead
            className="
              bg-zinc-50
              dark:bg-zinc-950
            "
          >

            <tr>

              {
                [

                  "Date",

                  "SM Code",

                  "Material",

                  "Warehouse",

                  "Movement",

                  "Direction",

                  "Quantity",

                  "Reference",

                  "User",
                ]

                .map((header) => (

                  <th

                    key={header}

                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-zinc-500
                    "
                  >
                    {header}
                  </th>
                ))
              }

            </tr>

          </thead>


          <tbody
            className="
              divide-y
              divide-zinc-100
              dark:divide-zinc-800
            "
          >

            {
              ledger.map(
                (entry: any) => (

                  <tr
                    key={entry.id}
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        entry.movement_date
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                      "
                    >
                      {
                        entry.sm_code
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        entry.material_name
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        entry.warehouse_name
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        entry.movement_type
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                      "
                    >

                      <div
                        className={`

                          inline-flex
                          items-center
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold

                          ${

                            entry.direction === "IN"

                              ? `
                                bg-green-100
                                text-green-700
                              `

                              : `
                                bg-red-100
                                text-red-700
                              `
                          }
                        `}
                      >

                        {
                          entry.direction
                        }

                      </div>

                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                      "
                    >
                      {
                        entry.quantity
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {

                        entry.reference_type

                        || "-"
                      }
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        entry.created_by_name
                      }
                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  )
}