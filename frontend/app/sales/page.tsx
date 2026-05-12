import Link from "next/link"

import {
  getSalesOrders,
} from "@/lib/api/sales"

export default async function SalesPage() {

  const orders =
    await getSalesOrders()

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            Sales Orders
          </h1>

          <p
            className="
              mt-1
              text-zinc-400
            "
          >
            Manage customer orders and sales workflow.
          </p>

        </div>

        <Link
          href="/sales/create"
          className="
            rounded-2xl
            bg-lime-400
            px-5
            py-3
            font-semibold
            text-black
            transition-all
            duration-300
            hover:scale-[1.02]
          "
        >
          Create Order
        </Link>

      </div>

      {/* Table */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/5
          bg-[#0b1727]
        "
      >

        <table
          className="
            w-full
          "
        >

          <thead
            className="
              border-b
              border-white/5
              bg-white/[0.02]
            "
          >

            <tr>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Order
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Customer
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Status
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Amount
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Created
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order: any) => (

              <Link
                key={order.id}
                href={`/sales/${order.id}`}
                className="
                  contents
                "
              >

                <tr
                  className="
                    border-b
                    border-white/5
                    transition-all
                    duration-200
                    hover:bg-white/[0.02]
                  "
                >

                  <td
                    className="
                      px-6
                      py-5
                      font-medium
                      text-white
                    "
                  >
                    {order.order_number}
                  </td>

                  <td
                    className="
                      px-6
                      py-5
                      text-zinc-300
                    "
                  >
                    {order.customer_name}
                  </td>

                  <td
                    className="
                      px-6
                      py-5
                    "
                  >

                    <span
                      className="
                        rounded-full
                        bg-lime-400/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-lime-400
                      "
                    >
                      {order.status}
                    </span>

                  </td>

                  <td
                    className="
                      px-6
                      py-5
                      text-zinc-300
                    "
                  >
                    ₹ {order.total_amount}
                  </td>

                  <td
                    className="
                      px-6
                      py-5
                      text-zinc-500
                    "
                  >
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </td>

                </tr>

              </Link>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}