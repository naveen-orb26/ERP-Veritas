"use client"

import Link from "next/link"
import SalesOrderActions from "@/components/sales/sales-order-actions"


interface Props {

  order:any

}

export default function
DetailView({

  order,

}:Props){
  
  const isDraft = order.status === "DRAFT"

  const isConfirmed = order.status === "CONFIRMED"

  const isOnHold = order.status === "ON_HOLD"

  const isCancelled = order.status === "CANCELLED"

  const isDispatched = order.status === "DISPATCHED"


  return(

    <div
      className="
        space-y-8
        p-8
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-6
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >

            {order.order_number}

          </h1>

          <p
            className="
              mt-2
              text-zinc-400
            "
          >

            {order.customer_name}

          </p>

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-3
            "
          >

            <StatusBadge
              status={
                order.status
              }
            />

            <span
              className="
                rounded-full
                bg-zinc-800
                px-3
                py-1
                text-sm
              "
            >

              Order Date :

              {" "}

              {order.order_date}

            </span>

            <span
              className="
                rounded-full
                bg-zinc-800
                px-3
                py-1
                text-sm
              "
            >

              Expected :

              {" "}

              {

                order.expected_delivery_date

              }

            </span>

          </div>

        </div>

        <div
          className="
            flex
            gap-3
          "
        >

          {isDraft && (

          <Link

            href={`/sales/${order.id}/edit`}

            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2
            "
          >

            Edit Order

          </Link>

        )}  

          <SalesOrderActions

          orderId={
            String(order.id)
          }

          status={
            order.status
          }

        />

        </div>
        

      </div>
      

      {/* ================================================= */}
      {/* METRICS */}
      {/* ================================================= */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >

        <MetricCard

          title="Products"

          value={
            order.product_count
          }

        />

        <MetricCard

          title="Ordered"

          value={
            order.ordered_quantity
          }

        />

        <MetricCard

          title="Dispatched"

          value={
            order.dispatched_quantity
          }

        />

        <MetricCard

          title="Completion"

          value={`${

            order.completion_percentage

          }%`}

        />

      </div>

      {/* ================================================= */}
      {/* PRODUCT WORKFLOW */}
      {/* ================================================= */}

      <div
        className="
          space-y-5
        "
      >

        {

          order.lines.map(

            (

              line:any

            )=>(

              <div

                key={
                  line.id
                }

                className="
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-xl
                        font-semibold
                      "
                    >

                      {

                        line.product_name

                      }

                    </h2>

                    <p
                      className="
                        mt-1
                        text-zinc-400
                      "
                    >

                      SR :

                      {" "}

                      {

                        line.sr_number

                      }

                    </p>

                  </div>

                  <span
                    className="
                      rounded-lg
                      bg-zinc-800
                      px-3
                      py-1
                    "
                  >

                    {

                      line.quantity

                    }

                    {" "}

                    {

                      line.base_unit

                    }

                  </span>

                </div>

                <div
                  className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-6
                  "
                >

                  <MetricCard

                    title="Production"

                    value={

                      line.production_requested

                    }

                  />

                  <MetricCard

                    title="Produced"

                    value={

                      line.produced_quantity

                    }

                  />

                  <MetricCard

                    title="Inspected"

                    value={

                      line.inspected_quantity

                    }

                  />

                  <MetricCard

                    title="Packed"

                    value={

                      line.packed_quantity

                    }

                  />

                  <MetricCard

                    title="Dispatched"

                    value={

                      line.dispatched_quantity

                    }

                  />

                  <MetricCard

                    title="Remaining"

                    value={

                      line.remaining_to_dispatch

                    }

                  />

                </div>

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  {
                    !isConfirmed ? null : (

                      line.production_request_id ? (

                        <Link

                          href={`/production/requests/${line.production_request_id}/edit`}

                          className="
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                          "
                        >

                          View Production Request

                        </Link>

                      ) : (

                        <Link

                          href={`/production/requests/create?salesOrderLine=${line.id}`}

                          className="
                            rounded-lg
                            bg-emerald-600
                            px-4
                            py-2
                            text-sm
                          "
                        >

                          Create Production Request

                        </Link>

                      )

                    )
                  }

                  {

                    isConfirmed && line.has_job_cards && (

                      <Link

                        href={`/production/job-cards/by-sales-line/${line.id}`}

                        className="
                          rounded-lg
                          bg-zinc-800
                          px-4
                          py-2
                        "

                      >

                        View Job Card

                      </Link>

                    )

                  }

                  {

                  line.batch_count > 0 && (

                  <div

                  className="

                  inline-flex

                  items-center

                  gap-2

                  rounded-full

                  bg-zinc-800

                  px-3

                  py-1

                  text-xs

                  "

                  >

                  📦

                  {

                  line.batch_count === 1

                  ?

                  "1 Batch"

                  :

                  `${line.batch_count} Batches`

                  }

                  </div>

                  )
                  }

                  {

                    isConfirmed && line.inspection_count > 0 && (

                      <Link

                        href={`/inspection?line=${line.id}`}

                        className="
                          rounded-lg
                          bg-zinc-800
                          px-4
                          py-2
                        "

                      >

                        {

                          line.inspection_count

                        }

                        {" Inspection"}

                        {

                          line.inspection_count > 1

                          && "s"

                        }

                      </Link>

                    )

                  }

                  {

                    line.packet_count > 0 && (

                      <Link

                        href={`/packing/packets?line=${line.id}`}

                        className="
                          rounded-lg
                          bg-zinc-800
                          px-4
                          py-2
                        "

                      >

                        {

                          line.packet_count

                        }

                        {" Packet"}

                        {

                          line.packet_count > 1

                          && "s"

                        }

                      </Link>

                    )

                  }

                  {
                    isConfirmed && 
                    line.remaining_to_dispatch > 0

                    &&

                    line.packed_quantity >

                    line.dispatched_quantity

                    && (

                      <Link

                        href={`/dispatch/create?salesOrder=${order.id}`}

                        className="
                          rounded-lg
                          bg-green-600
                          px-4
                          py-2
                        "

                      >

                        Dispatch

                      </Link>

                    )

                  }

                  {

                    line.dispatch_count > 0 && (

                      <Link

                        href={`/dispatch?salesOrder=${order.id}`}

                        className="
                          rounded-lg
                          bg-zinc-800
                          px-4
                          py-2
                        "

                      >

                        View Dispatches

                      </Link>

                    )

                  }

                  </div>

                  </div>

                  )

                  )

                  }

                  </div>

                  </div>

                  )

                  }

                  function MetricCard({

                    title,

                    value,

                  }:{

                    title:string

                    value:any

                  }){

                    return(

                      <div
                        className="
                          rounded-lg
                          border
                          border-zinc-800
                          p-4
                        "
                      >

                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide
                            text-zinc-500
                          "
                        >

                          {title}

                        </p>

                        <p
                          className="
                            mt-2
                            text-xl
                            font-semibold
                          "
                        >

                          {value}

                        </p>

                      </div>

                    )

                  }

                  function StatusBadge({

                    status,

                  }:{

                    status:string

                  }){

                    return(

                      <span
                        className="
                          rounded-full
                          bg-blue-700
                          px-3
                          py-1
                          text-sm
                        "
                      >

                        {status}

                      </span>

                    )

                  }