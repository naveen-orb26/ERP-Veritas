import Link
from "next/link"

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
        p-6
        space-y-6
      "
    >

      <Link

        href="/inventory"

        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          px-4
          py-2
          text-sm
        "
      >
        ← Back to Inventory
      </Link>

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
          Complete inventory movement history
        </p>

      </div>

      <div
        className="
          rounded-2xl
          border
          overflow-hidden
        "
      >

        <table
          className="
            w-full
          "
        >

          <thead>

            <tr
              className="
                border-b
              "
            >

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Warehouse
              </th>

              <th className="p-3 text-left">
                SM Code
              </th>

              <th className="p-3 text-left">
                Material
              </th>

              <th className="p-3 text-left">
                Movement
              </th>

              <th className="p-3 text-left">
                Direction
              </th>

              <th className="p-3 text-left">
                Qty
              </th>

              <th className="p-3 text-left">
                Reference
              </th>

              <th className="p-3 text-left">
                Remarks
              </th>

            </tr>

          </thead>

          <tbody>
            {ledger.length === 0 ? (

            <tr>

              <td
                colSpan={9}
                className="
                  p-12
                  text-center
                  text-zinc-500
                "
              >
                No stock movements found
              </td>

            </tr>

          ) : (
            ledger.map(
              (entry: any) => (

                <tr
                  key={entry.id}
                  className="
                    border-b
                  "
                >

                  <td className="p-3">
                    {
                      new Date(
                        entry.movement_date
                      ).toLocaleString()
                    }
                  </td>

                  <td className="p-3">
                    {
                      entry.warehouse_name
                    }
                  </td>

                  <td className="p-3">
                    {entry.sm_code}
                  </td>

                  <td className="p-3">
                    {
                      entry.material_name
                    }
                  </td>

                  <td className="p-3">
                    {
                      entry.movement_type
                    }
                  </td>

                  <td
                    className={`

                      p-3
                      font-medium

                      ${
                        entry.direction === "IN"

                          ? "text-green-600"

                          : "text-red-600"
                      }
                    `}
                  >
                    {entry.direction}
                  </td>

                  <td className="p-3">
                    {entry.quantity}
                  </td>

                  <td className="p-3">

                    {
                      entry.reference_type
                    }

                    {" "}

                    {
                      entry.reference_id
                    }

                  </td>

                  <td className="p-3">
                    {entry.remarks}
                  </td>

                </tr>
              )
            )
          )}

          </tbody>

        </table>

      </div>

    </div>
  )
}