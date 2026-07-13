import Link from "next/link"

import {
  getDispatches,
} from "@/lib/api/dispatch-server"

export const dynamic =
  "force-dynamic"

export default async function
DispatchPage() {

  const dispatches =
    await getDispatches()

  return (

    <div className="p-8">

      <div
        className="
          mb-8
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          Dispatch
        </h1>

      </div>

      <div
        className="
          space-y-4
        "
      >

        {

          dispatches.length === 0 && (

            <div
              className="
                rounded-xl
                border
                border-zinc-800
                p-8
                text-center
                text-zinc-400
              "
            >

              No dispatches found.

            </div>
          )
        }

        {

          dispatches.map(
            (dispatch: any) => (

              <Link

                key={dispatch.id}

                href={`/dispatch/${dispatch.id}`}

              >

                <div
                  className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950
                    p-5
                    transition
                    hover:border-blue-600
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-lg
                          font-semibold
                          text-white
                        "
                      >
                        {
                          dispatch.dispatch_number
                        }
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-400
                        "
                      >
                        {
                          dispatch.sales_order_number
                        }
                      </p>

                    </div>

                    <div
                      className="
                        text-right
                      "
                    >

                      <p
                        className="
                          text-white
                        "
                      >
                        {
                          dispatch.total_quantity
                        } pcs
                      </p>

                      <p
                        className="
                          text-sm
                          text-zinc-500
                        "
                      >
                        {
                          dispatch.dispatch_date
                        }
                      </p>

                    </div>

                  </div>

                  <div
                    className="
                      mt-4
                      text-sm
                      text-zinc-400
                    "
                  >

                    Customer :

                    {" "}

                    {
                      dispatch.customer_name
                    }

                  </div>

                </div>

              </Link>

            )
          )
        }

      </div>

    </div>

  )
}