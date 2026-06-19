import Link from "next/link"

import {
  getProductionRequests,
} from "@/lib/api/production-server"

export default async function
ProductionRequestsPage() {

  const requests =
    await getProductionRequests()

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
            Production Requests
          </h1>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            Manufacturing demand
            generated from sales orders.
          </p>

        </div>

        <Link
          href="/production/requests/create"

          className="
            bg-white
            text-black
            px-4
            py-2
            rounded-lg
          "
        >
          Create Request
        </Link>

      </div>

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
                Request No
              </th>

              <th className="p-4 text-left">
                Source
              </th>

              <th className="p-4 text-left">
                Order No
              </th>

              <th className="p-4 text-left">
                SR Number
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Requested
              </th>

              <th className="p-4 text-left">
                Allocated
              </th>

              <th className="p-4 text-left">
                Remaining
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {

              requests.map(
                (request: any) => (

                  <tr
                    key={request.id}

                    className="
                      border-t
                      border-zinc-800
                    "
                  >

                    <td className="p-4">

                      <a
                        href={`/production/requests/${request.id}/edit`}

                        className="
                          text-blue-400
                          hover:underline
                          font-medium
                        "
                      >

                        PR-{request.id}

                      </a>

                    </td>

                    <td className="p-4">
                      {request.source_type}
                    </td>

                    <td className="p-4">
                      {request.order_number || "-"}
                    </td>

                    <td className="p-4">
                      {request.sr_number || "-"}
                    </td>

                    <td className="p-4">
                      {request.product_name || "-"}
                    </td>

                    <td className="p-4">
                      {request.customer_name || "-"}
                    </td>

                    <td className="p-4">
                      {
                        request
                          .requested_quantity
                          .toLocaleString()
                      }
                    </td>

                    <td className="p-4">
                      {
                        request
                          .allocated_quantity
                          .toLocaleString()
                      }
                    </td>

                    <td className="p-4">

                      <div className="flex flex-col gap-1">

                        <span
                          className={
                            request.remaining_quantity > 0
                              ? "text-yellow-400"
                              : "text-green-400"
                          }
                        >

                          {request.remaining_quantity}

                        </span>

                        {
                          request.remaining_quantity > 0 && (
                            
                            <a
                              href={
                                `/production/requests/${request.id}/job-cards/create`
                              }

                              className="
                                text-sm
                                text-blue-400
                                hover:underline
                              "
                            >

                              Create Job Card

                            </a>
                          )
                        }

                      </div>

                    </td>

                    <td className="p-4">

                      <span
                        className={

                          request.status === "COMPLETED"

                            ? "text-green-400"

                          : request.status === "IN_PROGRESS"

                            ? "text-blue-400"

                          : request.status === "CANCELLED"

                            ? "text-red-400"

                          : "text-yellow-400"
                        }
                      >

                        {request.status}

                      </span>

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