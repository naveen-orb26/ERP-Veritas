import {

  getSalesOrder,

} from "@/lib/api/sales"

import StatusBadge
from "@/components/ui/status-badge"

import SalesOrderActions
from "@/components/sales/sales-order-actions"

interface Props {

  params: Promise<{
    id: string
  }>
}

export default async function
SalesOrderDetailPage({
  params,
}: Props) {

  const { id } =
    await params

  const order =
    await getSalesOrder(id)

  return (

    <div className="p-8 text-white">

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
            {
              order.order_number
            }
          </h1>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            {
              order.customer_name
            }
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <StatusBadge
            status={order.status}
          />

          <SalesOrderActions
            orderId={id}
            status={order.status}
          />

        </div>

      </div>

      {/* ORDER INFO */}

      <div
        className="
          grid
          grid-cols-2
          gap-6
          mb-10
        "
      >

        <div
          className="
            border
            border-zinc-800
            rounded-xl
            p-6
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-4
            "
          >
            Order Details
          </h2>

          <div className="space-y-3">

            <div>

              <span
                className="
                  text-zinc-400
                "
              >
                Customer PO:
              </span>

              {" "}

              {
                order.customer_po_id
              }

            </div>

            <div>

              <span
                className="
                  text-zinc-400
                "
              >
                Order Date:
              </span>

              {" "}

              {
                order.order_date
              }

            </div>

            <div>

              <span
                className="
                  text-zinc-400
                "
              >
                Expected Delivery:
              </span>

              {" "}

              {
                order.expected_delivery_date
              }

            </div>

          </div>

        </div>

        {/* TOTALS */}

        <div
          className="
            border
            border-zinc-800
            rounded-xl
            p-6
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-4
            "
          >
            Totals
          </h2>

          <div className="space-y-3">

            <div
              className="
                flex
                justify-between
              "
            >

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {
                  order.subtotal_amount
                }
              </span>

            </div>

            <div
              className="
                flex
                justify-between
              "
            >

              <span>
                Tax
              </span>

              <span>
                ₹
                {
                  order.tax_amount
                }
              </span>

            </div>

            <div
              className="
                flex
                justify-between
                text-xl
                font-bold
                border-t
                border-zinc-700
                pt-4
              "
            >

              <span>
                Grand Total
              </span>

              <span>
                ₹
                {
                  order.total_amount
                }
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* LINE ITEMS */}

      <div
        className="
          border
          border-zinc-800
          rounded-xl
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-zinc-900
            "
          >

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Rate
              </th>

              <th className="p-4 text-left">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {
              order.lines.map(
                (line: any) => (

                  <tr
                    key={line.id}

                    className="
                      border-t
                      border-zinc-800
                    "
                  >

                    <td className="p-4">
                      {
                        line.sr_number
                      }
                    </td>

                    <td className="p-4">
                      {
                        line.quantity
                      }
                    </td>

                    <td className="p-4">

                      ₹
                      {
                        line.unit_price
                      }

                    </td>

                    <td className="p-4">

                      ₹
                      {
                        line.line_total
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