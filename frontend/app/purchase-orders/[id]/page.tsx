import Link
from "next/link"

import {

  ArrowLeft,

  Home,

} from "lucide-react"

import {

  getPurchaseOrderServer,

} from "@/lib/api/purchase-orders-server"

import {

  POActions,

} from "@/components/purchase-orders/po-actions"


type Props = {

  params: Promise<{
    id: string
  }>
}


export default async function
PurchaseOrderDetailPage({

  params,
}: Props) {

  const { id } =
    await params

  const po =
    await getPurchaseOrderServer(
      id
    )

  return (

    <div
      className="
        space-y-8
        p-6
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <Link

            href="/purchase-orders"

            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
            "
          >

            <ArrowLeft
              className="
                h-5
                w-5
              "
            />

          </Link>

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
            "
          >

            <Home
              className="
                h-5
                w-5
              "
            />

          </Link>

          <div>

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {po.po_number}
            </h1>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Purchase Order
            </p>

          </div>

        </div>

        <div
          className="
            flex
            items-center
            gap-4
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
                po.status ===
                "APPROVED"

                  ? `
                    border-green-200
                    bg-green-50
                    text-green-700
                  `
                : po.status ===
                    "PARTIALLY_RECEIVED"

                    ? `
                      border-orange-200
                      bg-orange-50
                      text-orange-700
                    `

                  : po.status ===
                    "CANCELLED"

                    ? `
                      border-red-200
                      bg-red-50
                      text-red-700
                    `

                    : `
                      border-yellow-200
                      bg-yellow-50
                      text-yellow-700
                    `
              }
            `}
          >

            {po.status}

          </div>
              
             {
              [
                "APPROVED",
                "PARTIALLY_RECEIVED",
              ].includes(
                po.status
              ) && (

                <Link

                  href={
                    `/grns/create?po=${po.id}`
                  }

                  className="
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  Create GRN
                </Link>
              )
            }

          <POActions

            id={po.id}

            status={po.status}
          />

        </div>

      </div>


      {/* ===================================== */}
      {/* INFO CARDS */}
      {/* ===================================== */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Vendor
          </h2>

          <div
            className="
              space-y-2
              text-sm
            "
          >

            <p>
              <strong>
                Vendor:
              </strong>
              {" "}
              {po.vendor_name}
            </p>

            <p>
              <strong>
                Vendor GST:
              </strong>
              {" "}
              {po.vendor_gstin}
            </p>

            <p>
              <strong>
                Vendor PR:
              </strong>
              {" "}
              {
                po.vendor_pr_number
                || "-"
              }
            </p>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Delivery
          </h2>

          <div
            className="
              space-y-2
              text-sm
            "
          >

            <p>
              <strong>
                PO Date:
              </strong>
              {" "}
              {po.po_date}
            </p>

            <p>
              <strong>
                Lead Days:
              </strong>
              {" "}
              {po.lead_days}
            </p>

            <p>
              <strong>
                Expected:
              </strong>
              {" "}
              {
                po.expected_delivery_date
              }
            </p>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Financials
          </h2>

          <div
            className="
              space-y-2
              text-sm
            "
          >

            <p>
              <strong>
                Subtotal:
              </strong>
              {" "}
              ₹{po.subtotal}
            </p>

            <p>
              <strong>
                Tax:
              </strong>
              {" "}
              ₹{po.total_tax_amount}
            </p>

            <p>
              <strong>
                Grand Total:
              </strong>
              {" "}
              ₹{po.grand_total}
            </p>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* ADDRESSES */}
      {/* ===================================== */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
        "
      >

        <div
          className="
            rounded-2xl
            border
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Billing Address
          </h2>

          <p
            className="
              whitespace-pre-wrap
              text-sm
            "
          >
            {po.billing_address}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            p-6
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Shipping Address
          </h2>

          <p
            className="
              whitespace-pre-wrap
              text-sm
            "
          >
            {po.shipping_address}
          </p>

        </div>

      </div>


      {/* ===================================== */}
      {/* LINE ITEMS */}
      {/* ===================================== */}

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
                SM Code
              </th>

              <th className="p-3 text-left">
                Material
              </th>

              <th className="p-3 text-left">
                Warehouse
              </th>

              <th className="p-3 text-left">
                Ordered
              </th>

              <th className="p-3 text-left">
                Received
              </th>

              <th className="p-3 text-left">
                Pending
              </th>

              <th className="p-3 text-left">
                Unit
              </th>

              <th className="p-3 text-left">
                Cost
              </th>

              <th className="p-3 text-left">
                Tax
              </th>

              <th className="p-3 text-left">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {po.lines.map(
              (line: any) => (

                <tr
                  key={line.id}
                  className="
                    border-b
                  "
                >

                  <td className="p-3">
                    {line.sm_code}
                  </td>

                  <td className="p-3">
                    {line.material_name}
                  </td>

                  <td className="p-3">
                    {
                      line.warehouse_name
                    }
                  </td>

                  <td className="p-3">
                    {line.ordered_quantity}
                  </td>

                  <td
                    className="
                      p-3
                      text-green-600
                      font-medium
                    "
                  >
                    {line.received_quantity}
                  </td>

                  <td
                    className="
                      p-3
                      text-orange-600
                      font-medium
                    "
                  >
                    {line.pending_quantity}
                  </td>

                  <td className="p-3">
                    {line.unit}
                  </td>

                  <td className="p-3">
                    ₹{line.unit_cost}
                  </td>

                  <td className="p-3">
                    ₹{line.tax_amount}
                  </td>

                  <td className="p-3">
                    ₹{line.line_total}
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