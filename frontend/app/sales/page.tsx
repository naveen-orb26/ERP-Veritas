import Link from "next/link"

import {

  getSalesOrders,

} from "@/lib/api/sales-server"

export default async function
SalesPage() {

  const salesOrders =
    await getSalesOrders()

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Sales Orders
          </h1>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            Sales lifecycle,
            delivery tracking and
            dispatch orchestration.
          </p>

        </div>

        <Link

          href="/sales/create"

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
          Create Sales Order
        </Link>

      </div>

      {/* TABLE */}

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
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                SO Number
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Customer
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Order Date
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Expected Delivery
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Remaining Days
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Status
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {
              salesOrders.map(
                (order: any) => (

                  <tr

                    key={order.id}

                    className="
                      border-t
                      border-zinc-800
                      hover:bg-zinc-900/50
                      transition
                    "
                  >

                    {/* SO NUMBER */}

                    <td
                      className="
                        px-4
                        py-4
                      "
                    >

                      <Link

                        href={
                          `/sales/${order.id}`
                        }

                        className="
                          text-blue-400
                          hover:text-blue-300
                          font-medium
                        "
                      >

                        {
                          order.order_number
                        }

                      </Link>

                    </td>

                    {/* CUSTOMER */}

                    <td
                      className="
                        px-4
                        py-4
                        text-white
                      "
                    >

                      {
                        order.customer_name
                      }

                    </td>

                    {/* ORDER DATE */}

                    <td
                      className="
                        px-4
                        py-4
                        text-zinc-300
                      "
                    >

                      {
                        order.order_date
                      }

                    </td>

                    {/* DELIVERY */}

                    <td
                      className="
                        px-4
                        py-4
                        text-zinc-300
                      "
                    >

                      {
                        order.expected_delivery_date
                      }

                    </td>

                    {/* REMAINING */}

                    <td
                      className="
                        px-4
                        py-4
                      "
                    >

                      <span
                        className={

                          order.remaining_days < 0

                          ?

                          `
                          text-red-400
                          font-medium
                          `

                          :

                          order.remaining_days <= 3

                          ?

                          `
                          text-yellow-400
                          font-medium
                          `

                          :

                          `
                          text-green-400
                          font-medium
                          `
                        }
                      >

                        {
                          order.remaining_days
                        }

                        {
                          order.remaining_days !== null
                          &&
                          " days"
                        }

                      </span>

                    </td>

                    {/* STATUS */}

                    <td
                      className="
                        px-4
                        py-4
                      "
                    >

                      <span
                        className="
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          bg-zinc-800
                          text-zinc-200
                        "
                      >

                        {
                          order.status
                            .replaceAll(
                              "_",
                              " "
                            )
                        }

                      </span>

                    </td>

                    {/* TOTAL */}

                    <td
                      className="
                        px-4
                        py-4
                        text-right
                        text-white
                        font-medium
                      "
                    >

                      ₹
                      {
                        order.total_amount
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