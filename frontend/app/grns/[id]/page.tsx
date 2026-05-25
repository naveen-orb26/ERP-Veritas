import Link
from "next/link"

import {

  getGRNServer,

} from "@/lib/api/grns-server"


import {
  GRNActions
}
from "@/components/grns/grn-actions"

export default async function
GRNDetailPage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {


  

  const { id } =
    await params

  const grn =
    await getGRNServer(id)


    async function handleApprove() {
    
    const token = localStorage.getItem(
      "access"
    )
      
    const response = await fetch(

      `${process.env.NEXT_PUBLIC_API_URL}/grns/${id}/approve/`,

      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {

      alert(
        "Failed to approve GRN"
      )

      return
    }

    window.location.reload()
  }


  async function handleCancel() {


    const token = localStorage.getItem(
      "access"
    )

    const response = await fetch(

      `${process.env.NEXT_PUBLIC_API_URL}/grns/${id}/cancel/`,

      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {

      alert(
        "Failed to cancel GRN"
      )

      return
    }

    window.location.reload()
  }
      
  
  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <Link

        href="/grns"

        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-zinc-200
          px-4
          py-2
          text-sm
          transition
          hover:bg-zinc-100
          dark:border-zinc-800
          dark:hover:bg-zinc-900
        "
      >
        ← Back to GRNs
      </Link>


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

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {grn.grn_number}
            </h1>

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
                  grn.status === "APPROVED"

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
              {grn.status}
            </div>

          </div>

          <p
            className="
              mt-2
              text-sm
              text-zinc-500
            "
          >
            {
              grn.vendor_name
            }
          </p>

        </div>

        
      </div>
        
    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <GRNActions

        id={grn.id}

        status={grn.status}
      />

      {
        grn.status ===
        "DRAFT"

        && (

          <Link

            href={
              `/grns/${grn.id}/edit`
            }

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
            Edit GRN
          </Link>
        )
      }

    </div>
          
      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Procurement
          </h2>

          <div
            className="
              space-y-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                PO Number
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  grn.po_number
                  || "-"
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Invoice Number
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  grn.invoice_number
                  || "-"
                }
              </p>

            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Receiving
          </h2>

          <div
            className="
              space-y-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Invoice Date
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  grn.invoice_date
                  || "-"
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Received By
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  grn.received_by
                  || "-"
                }
              </p>

            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Audit
          </h2>

          <div
            className="
              space-y-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Received At
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  new Date(
                    grn.received_at
                  ).toLocaleString()
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      <div
        className="
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-6
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            GRN Lines
          </h2>

        </div>


        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-200
            dark:border-zinc-800
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

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  SM Code
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Material
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Qty
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Unit Cost
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Tax
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Total
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Warehouse
                </th>

              </tr>

            </thead>

            <tbody>

              {grn.lines.map(
                (line: any) => {

                  const lineTotal =

                    (
                      Number(
                        line.received_quantity
                      )
                      *
                      Number(
                        line.unit_cost
                      )
                    )
                    +
                    Number(
                      line.tax_amount
                    )

                  return (

                    <tr

                      key={line.id}

                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-900
                      "
                    >

                      <td className="px-4 py-4 text-sm font-medium">
                        {line.sm_code}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {line.material_name}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {line.received_quantity}
                        {" "}
                        {line.received_unit}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {line.unit_cost}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {line.tax_amount}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold">
                        {lineTotal.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {line.warehouse_name}
                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

      </div>


      <div
        className="
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-6
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <h2
          className="
            mb-4
            text-lg
            font-semibold
          "
        >
          Remarks
        </h2>

        <p
          className="
            text-sm
            leading-6
            text-zinc-600
            dark:text-zinc-300
          "
        >
          {
            grn.remarks
            || "No remarks provided."
          }
        </p>

      </div>

    </div>
  )
}