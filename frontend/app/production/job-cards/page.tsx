import Link from "next/link"

import {
  getJobCards,
} from "@/lib/api/job-cards-server"

export default async function
JobCardsPage() {

  const jobCards =
    await getJobCards()

  return (

    <div className="p-8 text-white">

      <div
        className="
          mb-8
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
            "
          >
            Job Cards
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-zinc-400
            "
          >
            Track production execution,
            batches, and stage progress.
          </p>

        </div>

      </div>

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-zinc-800
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
                Job Card
              </th>

              <th className="p-4 text-left">
                Sales Order
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                SR Number
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Planned Qty
              </th>

              <th className="p-4 text-left">
                Batched
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
              jobCards.length === 0

                ? (

                  <tr>

                    <td
                      colSpan={9}

                      className="
                        p-8
                        text-center
                        text-zinc-500
                      "
                    >
                      No job cards found.
                    </td>

                  </tr>
                )

                : (

                  jobCards.map(
                    (job: any) => (

                      <tr
                        key={job.id}

                        className="
                          border-t
                          border-zinc-800
                        "
                      >

                        <td className="p-4">

                          <Link
                            href={
                              `/production/job-cards/${job.id}/edit`
                            }

                            className="
                              font-medium
                              text-blue-400
                              hover:underline
                            "
                          >

                            {job.job_card_number}

                          </Link>

                        </td>

                        <td className="p-4">

                          {
                            job.order_number
                            || "-"
                          }

                        </td>

                        <td className="p-4">

                          {
                            job.customer_name
                            || "-"
                          }

                        </td>

                        <td className="p-4">

                          <span
                            className="
                              font-mono
                            "
                          >

                            {
                              job.sr_number
                              || "-"
                            }

                          </span>

                        </td>

                        <td className="p-4">

                          {
                            job.product_name
                          }

                        </td>

                        <td className="p-4">

                          {
                            job.planned_quantity
                              ?.toLocaleString()
                          }

                        </td>

                        <td className="p-4">

                          {
                            job.allocated_to_batches
                              ?.toLocaleString()
                          }

                        </td>

                        <td className="p-4">

                          <span
                            className={

                              job.remaining_to_batch > 0

                                ? "text-yellow-400"

                                : "text-green-400"
                            }
                          >

                            {
                              job.remaining_to_batch
                                ?.toLocaleString()
                            }

                          </span>

                        </td>

                        <td className="p-4">

                          <span
                            className={

                              job.status ===
                              "COMPLETED"

                                ? "text-green-400"

                              : job.status ===
                                "IN_PROGRESS"

                                ? "text-blue-400"

                              : "text-yellow-400"
                            }
                          >

                            {job.status}

                          </span>

                        </td>

                      </tr>
                    )
                  )
                )
            }

          </tbody>

        </table>

      </div>

    </div>
  )
}