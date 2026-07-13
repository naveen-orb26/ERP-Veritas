import Link from "next/link"

import {
  getDispatch,
} from "@/lib/api/dispatch-server"

export default async function
DispatchDetailPage({

  params,

}:{

  params: Promise<{

    id:string

  }>

}){

  const {id}=await params

  const dispatch=
    await getDispatch(id)

  return(

    <div
      className="
        p-8
        text-white
      "
    >

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
            {
              dispatch.dispatch_number
            }
          </h1>

          <p
            className="
              mt-2
              text-zinc-400
            "
          >
            {
              dispatch.sales_order_number
            }
          </p>

        </div>

      </div>

      <div
        className="
          mb-8
          grid
          gap-4
          md:grid-cols-4
        "
      >

        <Metric
          label="Customer"
          value={
            dispatch.customer_name
          }
        />

        <Metric
          label="Total Qty"
          value={
            dispatch.total_quantity
          }
        />

        <Metric
          label="AWB"
          value={
            dispatch.awb_number
            || "-"
          }
        />

        <Metric
          label="Dispatch Date"
          value={
            dispatch.dispatch_date
          }
        />

      </div>

      <h2
        className="
          mb-4
          text-xl
          font-semibold
        "
      >
        Items
      </h2>

      <div
        className="
          space-y-4
        "
      >

        {

          dispatch.items.map(
            (item:any)=>(

              <div

                key={item.id}

                className="
                  rounded-xl
                  border
                  border-zinc-800
                  p-5
                "
              >

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        font-semibold
                      "
                    >
                      {
                        item.product_name
                      }
                    </p>

                    <p
                      className="
                        text-sm
                        text-zinc-400
                      "
                    >
                      {
                        item.sr_number
                      }
                    </p>

                  </div>

                  <div
                    className="
                      text-right
                    "
                  >

                    <p>

                      {
                        item.dispatched_quantity
                      }

                    </p>

                    <p
                      className="
                        text-sm
                        text-zinc-500
                      "
                    >
                      dispatched
                    </p>

                  </div>

                </div>

              </div>

            )
          )

        }

      </div>

      <Link

        href="/dispatch"

        className="
          mt-8
          inline-block
          text-blue-400
        "
      >

        ← Back

      </Link>

    </div>

  )

}

function Metric({

  label,

  value,

}:{

  label:string

  value:any

}){

  return(

    <div
      className="
        rounded-xl
        border
        border-zinc-800
        p-4
      "
    >

      <p
        className="
          text-xs
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          font-semibold
        "
      >
        {value}
      </p>

    </div>

  )

}