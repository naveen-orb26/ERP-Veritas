import Link
from "next/link"

import {

  getGRNsServer,

} from "@/lib/api/grns-server"


export default async function
GRNsPage() {

  const grns =
    await getGRNsServer()

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Goods Receipt Notes
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-zinc-500
            "
          >
            Inventory receipt and
            procurement intake records
          </p>

        </div>

        <Link

          href="/grns/create"

          className="
            inline-flex
            items-center
            rounded-xl
            bg-zinc-900
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
            dark:bg-white
            dark:text-black
          "
        >
          Create GRN
        </Link>

      </div>


      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <table
          className="
            w-full
            border-collapse
          "
        >

          <thead>

            <tr
              className="
                border-b
                border-zinc-200
                bg-zinc-50
                dark:border-zinc-800
                dark:bg-zinc-900
              "
            >

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                GRN Number
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Vendor
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                PO Number
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Invoice Number
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Status
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Received At
              </th>

              <th
                className="
                  px-4
                  py-3
                "
              />

            </tr>

          </thead>

          <tbody>

            {grns.map(
              (grn: any) => (

                <tr

                  key={grn.id}

                  className="
                    border-b
                    border-zinc-100
                    dark:border-zinc-900
                  "
                >

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                      font-medium
                    "
                  >
                    {
                      grn.grn_number
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      grn.vendor_name
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      grn.po_number || "-"
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      grn.invoice_number
                      || "-"
                    }
                  </td>

                  <td
                    className="
                      px-4
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
                        border

                        ${
                          grn.status ===
                          "APPROVED"

                            ? `
                              border-green-200
                              bg-green-50
                              text-green-700
                              dark:border-green-900
                              dark:bg-green-950/40
                              dark:text-green-300
                            `

                            : grn.status ===
                              "CANCELLED"

                              ? `
                                border-red-200
                                bg-red-50
                                text-red-700
                                dark:border-red-900
                                dark:bg-red-950/40
                                dark:text-red-300
                              `

                              : `
                                border-yellow-200
                                bg-yellow-50
                                text-yellow-700
                                dark:border-yellow-900
                                dark:bg-yellow-950/40
                                dark:text-yellow-300
                              `
                        }
                      `}
                    >
                      {
                        grn.status
                      }
                    </div>

                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      new Date(
                        grn.received_at
                      ).toLocaleDateString()
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-right
                    "
                  >

                    <Link

                      href={
                        `/grns/${grn.id}`
                      }

                      className="
                        text-sm
                        font-medium
                        text-zinc-700
                        hover:underline
                        dark:text-zinc-300
                      "
                    >
                      View
                    </Link>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}