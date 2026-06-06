import Link
from "next/link"

import {

  Home,

  Plus,

} from "lucide-react"

import {

  getPurchaseOrdersServer,

} from "@/lib/api/purchase-orders-server"


export default async function
PurchaseOrdersPage() {

  const purchaseOrders =

    await getPurchaseOrdersServer()

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

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

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          {/* Home Button */}

          <Link

            href="/"

            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-200
              bg-white
              transition
              hover:bg-zinc-100
              dark:border-zinc-800
              dark:bg-zinc-950
              dark:hover:bg-zinc-900
            "
          >

            <Home
              className="
                h-5
                w-5
              "
            />

          </Link>

          {/* Title */}

          <div>

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              Purchase Orders
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Procurement planning
              and vendor ordering
            </p>

          </div>

        </div>

        {/* Create Button */}

        <Link

          href="/purchase-orders/create"

          className="
            inline-flex
            items-center
            gap-2
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

          <Plus
            className="
              h-4
              w-4
            "
          />

          Create PO

        </Link>

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

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
                PO Date
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
                Expected Delivery
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
                Total
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

            {purchaseOrders.map(
              (purchaseOrder: any) => (

                <tr

                  key={purchaseOrder.id}

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
                      purchaseOrder.po_number
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
                      purchaseOrder.vendor_name
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
                      new Date(
                        purchaseOrder.po_date
                      ).toLocaleDateString()
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

                      purchaseOrder
                        .expected_delivery_date

                        ?

                        new Date(
                          purchaseOrder
                            .expected_delivery_date
                        ).toLocaleDateString()

                        :

                        "-"
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
                          purchaseOrder.status ===
                          "APPROVED"

                            ? `
                              border-green-200
                              bg-green-50
                              text-green-700
                              dark:border-green-900
                              dark:bg-green-950/40
                              dark:text-green-300
                            `

                            : purchaseOrder.status ===
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
                        purchaseOrder.status
                      }

                    </div>

                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                      font-medium
                    "
                  >
                    ₹
                    {
                      Number(
                        purchaseOrder
                          .grand_total
                      ).toLocaleString()
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                    "
                  >

                    <Link

                      href={
                        `/purchase-orders/${purchaseOrder.id}`
                      }

                      className="
                        text-sm
                        font-medium
                        underline-offset-4
                        hover:underline
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