import Link from "next/link"

import {

  getRawMaterialInventoryServer,

} from "@/lib/api/raw-material-inventory-server"


export default async function
InventoryPage() {

  const inventory = await
    getRawMaterialInventoryServer()

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
          Inventory
        </h1>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          Raw material stock visibility
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

                  "SM Code",

                  "Material",

                  "Vendor",

                  "Warehouse",

                  "Current",

                  "Reserved",

                  "Available",

                  "Status",
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
              inventory.map(
                (item: any) => (

                  <tr

                    key={item.id}

                    className="
                        
                        transition
                      
                        dark:hover:bg-zinc-800
                    "

                    
                    >

                    <td
                        className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                        "
                        >

                        <Link

                            href={
                            `/inventory/${item.id}`
                            }

                            className="
                            text-blue-600
                            hover:underline
                            "
                        >
                            {
                            item.sm_code
                            }
                        </Link>

                        </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                      "
                    >
                      {
                        item.material_name
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
                        item.vendor_name
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
                        item.warehouse_name
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
                        item.current_quantity
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
                        item.reserved_quantity
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
                        item.available_quantity
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

                            item.is_below_minimum

                              ? `
                                bg-red-100
                                text-red-700
                              `

                              : `
                                bg-green-100
                                text-green-700
                              `
                          }
                        `}
                      >

                        {

                          item.is_below_minimum

                            ? "Low Stock"

                            : "Healthy"
                        }

                      </div>

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