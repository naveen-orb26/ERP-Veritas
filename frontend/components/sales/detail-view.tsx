"use client"

import Link from "next/link"

import {

  useRouter,

} from "next/navigation"

import {

  salesOrderAction,

} from "@/lib/api/sales"

export default function
SalesDetailView({

  salesOrder,

}: any) {

  const router = useRouter()

  // =================================================
  // STATUS ACTIONS
  // =================================================

  async function handleAction(
    action: string
  ) {

    try {

      await salesOrderAction(

        salesOrder.id,

        action
      )

      router.refresh()

    } catch (error) {

      console.error(error)

      alert(
        "Failed to update status"
      )
    }
  }

  // =================================================
  // GST TOTALS
  // =================================================

  const totalCGST =

    salesOrder.lines.reduce(

      (
        total: number,

        line: any
      ) => {

        return (
          total
          +
          Number(
            line.cgst_amount
          )
        )

      },

      0
    )

  const totalSGST =

    salesOrder.lines.reduce(

      (
        total: number,

        line: any
      ) => {

        return (
          total
          +
          Number(
            line.sgst_amount
          )
        )

      },

      0
    )

  const totalIGST =

    salesOrder.lines.reduce(

      (
        total: number,

        line: any
      ) => {

        return (
          total
          +
          Number(
            line.igst_amount
          )
        )

      },

      0
    )

  return (

    <div
      className="
        space-y-8
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-4
              flex-wrap
            "
          >

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {
                salesOrder
                  .order_number
              }
            </h1>

            <span
              className="
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                bg-zinc-800
                text-zinc-200
              "
            >

              {
                salesOrder.status
                  .replaceAll(
                    "_",
                    " "
                  )
              }

            </span>

            {
              salesOrder
                .priority_flag && (

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    bg-red-500/20
                    text-red-300
                  "
                >
                  High Priority
                </span>
              )
            }

          </div>

          <p
            className="
              text-zinc-400
              mt-3
            "
          >
            Customer:
            {" "}

            {
              salesOrder
                .customer_name
            }
          </p>

        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          <Link

            href={
              `/sales/${salesOrder.id}/edit`
            }

            className="
              bg-white
              hover:bg-zinc-200
              transition
              text-black
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >
            Edit
          </Link>

          <button

            onClick={() =>
              handleAction(
                "confirm"
              )
            }

            className="
              bg-blue-500
              hover:bg-blue-400
              transition
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >
            Confirm
          </button>

          <button

            onClick={() =>
              handleAction(
                "hold"
              )
            }

            className="
              bg-yellow-500
              hover:bg-yellow-400
              transition
              text-black
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >
            Hold
          </button>

          <button

            onClick={() =>
              handleAction(
                "cancel"
              )
            }

            className="
              bg-red-500
              hover:bg-red-400
              transition
              px-5
              py-3
              rounded-xl
              font-medium
            "
          >
            Cancel
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* ORDER INFO */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-4
          gap-6
        "
      >

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Order Date
          </p>

          <p
            className="
              text-white
              text-lg
              font-semibold
              mt-2
            "
          >
            {
              salesOrder
                .order_date
            }
          </p>

        </div>

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Expected Delivery
          </p>

          <p
            className="
              text-white
              text-lg
              font-semibold
              mt-2
            "
          >
            {
              salesOrder
                .expected_delivery_date
            }
          </p>

        </div>

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Lead Days
          </p>

          <p
            className="
              text-white
              text-lg
              font-semibold
              mt-2
            "
          >
            {
              salesOrder
                .delivery_lead_days
            }
          </p>

        </div>

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Remaining Days
          </p>

          <p
            className={

              salesOrder
                .remaining_days < 0

              ?

              `
              text-red-400
              text-lg
              font-semibold
              mt-2
              `

              :

              salesOrder
                .remaining_days <= 3

              ?

              `
              text-yellow-400
              text-lg
              font-semibold
              mt-2
              `

              :

              `
              text-green-400
              text-lg
              font-semibold
              mt-2
              `
            }
          >

            {
              salesOrder
                .remaining_days
            }

          </p>

        </div>

      </div>
      {/* ================================================= */}
      {/* LINE ITEMS */}
      {/* ================================================= */}

      <div
        className="
          border
          border-zinc-800
          rounded-2xl
          overflow-hidden
          bg-zinc-900/40
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-zinc-900
            "
          >

            <tr>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-zinc-400
                  text-sm
                "
              >
                SR Number
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-zinc-400
                  text-sm
                "
              >
                Product
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                Qty
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                Fulfilled
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                Pending
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                Unit Price
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                GST
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-zinc-400
                  text-sm
                "
              >
                Line Total
              </th>

            </tr>

          </thead>

          <tbody>

            {
              salesOrder.lines.map(
                (
                  line: any
                ) => (

                  <tr

                    key={line.id}

                    className="
                      border-t
                      border-zinc-800
                    "
                  >

                    {/* SR */}

                    <td
                      className="
                        px-4
                        py-4
                        text-blue-400
                        font-medium
                      "
                    >
                      {
                        line.sr_number_snapshot
                      }
                    </td>

                    {/* PRODUCT */}

                    <td
                      className="
                        px-4
                        py-4
                        text-white
                      "
                    >

                      <div>

                        <p>
                          {
                            line.product_name_snapshot
                          }
                        </p>

                        <p
                          className="
                            text-zinc-500
                            text-xs
                            mt-1
                          "
                        >

                          {
                            line.size_snapshot
                          }

                          {" • "}

                          {
                            line.color_snapshot
                          }

                        </p>

                      </div>

                    </td>

                    {/* ORDERED */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-zinc-300
                      "
                    >
                      {
                        line.quantity
                      }
                    </td>

                    {/* FULFILLED */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-green-400
                        font-medium
                      "
                    >
                      {
                        line.fulfilled_quantity
                      }
                    </td>

                    {/* PENDING */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-yellow-400
                        font-medium
                      "
                    >
                      {
                        line.pending_quantity
                      }
                    </td>

                    {/* UNIT PRICE */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-zinc-300
                      "
                    >

                      ₹
                      {
                        line.unit_price
                      }

                    </td>

                    {/* GST */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                      "
                    >

                      <div
                        className="
                          text-white
                          font-medium
                        "
                      >

                        {
                          line.gst_percentage
                        }%

                      </div>

                      {
                        Number(
                          line.cgst_amount
                        ) > 0 && (

                          <div
                            className="
                              text-xs
                              text-zinc-500
                              mt-1
                            "
                          >

                            CGST:
                            ₹
                            {
                              Number(
                                line.cgst_amount
                              ).toFixed(2)
                            }

                            <br />

                            SGST:
                            ₹
                            {
                              Number(
                                line.sgst_amount
                              ).toFixed(2)
                            }

                          </div>
                        )
                      }

                      {
                        Number(
                          line.igst_amount
                        ) > 0 && (

                          <div
                            className="
                              text-xs
                              text-zinc-500
                              mt-1
                            "
                          >

                            IGST:
                            ₹
                            {
                              Number(
                                line.igst_amount
                              ).toFixed(2)
                            }

                          </div>
                        )
                      }

                    </td>

                    {/* TOTAL */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-white
                        font-semibold
                      "
                    >

                      ₹

                      {
                        Number(
                          line.line_total
                        ).toFixed(2)
                      }

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

      {/* ================================================= */}
      {/* TOTALS */}
      {/* ================================================= */}

      <div
        className="
          flex
          justify-end
        "
      >

        <div
          className="
            w-full
            max-w-md
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            space-y-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-zinc-400
              "
            >
              Subtotal
            </span>

            <span
              className="
                text-white
                font-medium
              "
            >

              ₹

              {
                Number(
                  salesOrder
                    .subtotal_amount
                ).toFixed(2)
              }

            </span>

          </div>

          {
            totalCGST > 0 && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-zinc-400
                  "
                >
                  Total CGST
                </span>

                <span
                  className="
                    text-white
                    font-medium
                  "
                >

                  ₹

                  {
                    totalCGST
                      .toFixed(2)
                  }

                </span>

              </div>
            )
          }

          {
            totalSGST > 0 && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-zinc-400
                  "
                >
                  Total SGST
                </span>

                <span
                  className="
                    text-white
                    font-medium
                  "
                >

                  ₹

                  {
                    totalSGST
                      .toFixed(2)
                  }

                </span>

              </div>
            )
          }

          {
            totalIGST > 0 && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-zinc-400
                  "
                >
                  Total IGST
                </span>

                <span
                  className="
                    text-white
                    font-medium
                  "
                >

                  ₹

                  {
                    totalIGST
                      .toFixed(2)
                  }

                </span>

              </div>
            )
          }

          <div
            className="
              border-t
              border-zinc-800
              pt-4
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Grand Total
            </span>

            <span
              className="
                text-2xl
                font-bold
                text-white
              "
            >

              ₹

              {
                Number(
                  salesOrder
                    .total_amount
                ).toFixed(2)
              }

            </span>

          </div>

        </div>

      </div>

      {/* REMARKS */}

      {
        salesOrder.remarks && (

          <div
            className="
              bg-zinc-900/60
              border
              border-zinc-800
              rounded-2xl
              p-6
            "
          >

            <h3
              className="
                text-lg
                font-semibold
                mb-3
              "
            >
              Remarks
            </h3>

            <p
              className="
                text-zinc-300
                leading-relaxed
              "
            >
              {
                salesOrder.remarks
              }
            </p>

          </div>
        )
      }

    </div>
  )
}