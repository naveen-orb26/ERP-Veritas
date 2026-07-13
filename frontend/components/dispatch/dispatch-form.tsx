"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  createDispatch,
} from "@/lib/api/dispatch-client"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {

  salesOrders: any[]

  initialSalesOrderId:
    number | null
}

export default function
DispatchForm({

  salesOrders,

  initialSalesOrderId,

}: Props) {

  const router =
    useRouter()

  const [

    selectedOrder,

    setSelectedOrder,

  ] = useState<number | null>(

    initialSalesOrderId

  )

  const [

    preview,

    setPreview,

  ] = useState<any>(null)

  const [

    loading,

    setLoading,

  ] = useState(false)

  const [

    submitting,

    setSubmitting,

  ] = useState(false)

  const [

    error,

    setError,

  ] = useState("")

  const [

    deliveryPartner,

    setDeliveryPartner,

  ] = useState("")

  const [

    vehicleNumber,

    setVehicleNumber,

  ] = useState("")

  const [

    awb,

    setAwb,

  ] = useState("")

  const [

    dispatchDate,

    setDispatchDate,

  ] = useState(

    new Date()

      .toISOString()

      .substring(0, 10)

  )

  const [

    remarks,

    setRemarks,

  ] = useState("")

  const [

    quantities,

    setQuantities,

  ] = useState<

    Record<number, number>

  >({})

  useEffect(() => {

    if (

      !selectedOrder

    ) {

      setPreview(null)

      return

    }

    async function load() {

      setLoading(true)

      setError("")

      try {

        const response =
          await fetch(

            `${API_BASE_URL}/api/sales-orders/${selectedOrder}/dispatch-preview/`,

            {

              credentials:
                "include",
            }
          )

        const data =
          await response.json()

        setPreview(data)

        const values:
          Record<number, number> = {}

        data.lines.forEach(

          (line: any) => {

            values[line.id] = 0

          }

        )

        setQuantities(
          values
        )

      }

      catch (

        error: any

      ) {

        setError(

          error.message
        )

      }

      finally {

        setLoading(false)

      }

    }

    load()

  }, [

    selectedOrder,

  ])

  const totalQuantity =
    useMemo(() => {

      return Object.values(

        quantities

      ).reduce(

        (

          a,

          b,

        ) =>

          a + b,

        0
      )

    }, [

      quantities,

    ])

  async function
  handleSubmit(

    e: React.FormEvent

  ) {

    e.preventDefault()

    if (

      !preview

    ) return

    setSubmitting(true)

    setError("")

    try {

      const payload = {

        sales_order:
          preview.id,

        delivery_partner:
          deliveryPartner,

        vehicle_number:
          vehicleNumber,

        awb_number:
          awb,

        dispatch_date:
          dispatchDate,

        remarks,

        items:

          preview.lines

          .filter(

            (line: any) =>

              quantities[
                line.id
              ] > 0

          )

          .map(

            (line: any) => ({

              sales_order_line:
                line.id,

              dispatched_quantity:

                quantities[
                  line.id
                ],

            })

          ),

      }

      const dispatch =
        await createDispatch(
          payload
        )

      router.push(

        `/dispatch/${dispatch.id}`

      )

    }

    catch (

      error: any

    ) {

      setError(

        error.message
      )

    }

    finally {

      setSubmitting(false)

    }

  }

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <h1
        className="
          mb-8
          text-3xl
          font-bold
        "
      >
        Dispatch Shipment
      </h1>

      {

        error && (

          <div
            className="
              mb-6
              rounded-lg
              border
              border-red-700
              bg-red-900/20
              p-4
            "
          >

            {error}

          </div>

        )

      }

      <form
        onSubmit={
          handleSubmit
        }
        className="
          space-y-8
        "
      >

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-zinc-400
            "
          >

            Sales Order

          </label>

          <select

            value={
              selectedOrder
              ?? ""
            }

            onChange={(e)=>

              setSelectedOrder(

                e.target.value

                ? Number(

                    e.target.value

                  )

                : null

              )

            }

            className="
              w-full
              rounded-lg
              border
              border-zinc-700
              bg-zinc-900
              p-3
            "
          >

            <option value="">
              Select Sales Order
            </option>

            {

              salesOrders.map(

                (order:any)=>(

                  <option

                    key={
                      order.id
                    }

                    value={
                      order.id
                    }

                  >

                    {

                      order.order_number

                    }

                    {" - "}

                    {

                      order.customer_name

                    }

                  </option>

                )

              )

            }

          </select>

        </div>

        {

          loading && (

            <div>

              Loading...

            </div>

          )

        }

        {

          preview && (

            <>
            <div
  className="
    grid
    gap-4
    md:grid-cols-2
  "
>

  <InfoCard
    label="Sales Order"
    value={
      preview.order_number
    }
  />

  <InfoCard
    label="Customer"
    value={
      preview.customer_name
    }
  />

</div>

<div
  className="
    grid
    gap-4
    md:grid-cols-2
  "
>

  <div>

    <label
      className="
        mb-2
        block
        text-sm
        text-zinc-400
      "
    >
      Delivery Partner
    </label>

    <input

      value={
        deliveryPartner
      }

      onChange={(e)=>

        setDeliveryPartner(
          e.target.value
        )

      }

      className="
        w-full
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        p-3
      "

    />

  </div>

  <div>

    <label
      className="
        mb-2
        block
        text-sm
        text-zinc-400
      "
    >
      Vehicle Number
    </label>

    <input

      value={
        vehicleNumber
      }

      onChange={(e)=>

        setVehicleNumber(
          e.target.value
        )

      }

      className="
        w-full
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        p-3
      "

    />

  </div>

  <div>

    <label
      className="
        mb-2
        block
        text-sm
        text-zinc-400
      "
    >
      AWB Number
    </label>

    <input

      value={
        awb
      }

      onChange={(e)=>

        setAwb(
          e.target.value
        )

      }

      className="
        w-full
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        p-3
      "

    />

  </div>

  <div>

    <label
      className="
        mb-2
        block
        text-sm
        text-zinc-400
      "
    >
      Dispatch Date
    </label>

    <input

      type="date"

      value={
        dispatchDate
      }

      onChange={(e)=>

        setDispatchDate(
          e.target.value
        )

      }

      className="
        w-full
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        p-3
      "

    />

  </div>

</div>

<div>

  <label
    className="
      mb-2
      block
      text-sm
      text-zinc-400
    "
  >
    Remarks
  </label>

  <textarea

    value={
      remarks
    }

    onChange={(e)=>

      setRemarks(
        e.target.value
      )

    }

    className="
      w-full
      rounded-lg
      border
      border-zinc-700
      bg-zinc-900
      p-3
    "

  />

</div>

<div
  className="
    space-y-4
  "
>

  {

    preview.lines.map(

      (line:any)=>(

        <div

          key={
            line.id
          }

          className="
            rounded-xl
            border
            border-zinc-800
            p-5
          "
        >

          <div
            className="
              grid
              gap-4
              md:grid-cols-6
            "
          >

            <InfoCard

              label="Product"

              value={
                line.product_name
              }

            />

            <InfoCard

              label="SR"

              value={
                line.sr_number
              }

            />

            <InfoCard

              label="Ordered"

              value={`${line.ordered_quantity} ${line.base_unit}`}

            />

            <InfoCard

              label="Packed"

              value={`${line.packed_quantity} ${line.base_unit}`}
            />

            <InfoCard

              label="Remaining"

              value={`${line.remaining_to_dispatch} ${line.base_unit}`}

            />

            <div>

              <label
                className="
                  text-xs
                  text-zinc-500
                "
              >

                Dispatch Qty

              </label>

              <input

                type="number"

                min={0}

                max={
                  line.remaining_to_dispatch
                }

                value={
                  quantities[
                    line.id
                  ]
                }

                onChange={(e)=>

                  setQuantities({

                    ...quantities,

                    [

                      line.id

                    ]:

                    Number(

                      e.target.value

                    ),

                  })

                }

                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-zinc-700
                  bg-zinc-900
                  p-2
                "

              />

            </div>

          </div>

        </div>

      )

    )

  }

</div>

<div
  className="
    rounded-xl
    border
    border-zinc-800
    p-6
  "
>

  <div
    className="
      flex
      items-center
      justify-between
    "
  >

    <span>

      Total Dispatch

    </span>

    <span
      className="
        text-xl
        font-bold
      "
    >

      {totalQuantity}

    </span>

  </div>

</div>

<button

  type="submit"

  disabled={

    submitting ||

    totalQuantity <= 0

  }

  className="
    rounded-lg
    bg-green-600
    px-6
    py-3
  "

>

  {

    submitting

    ? "Dispatching..."

    : "Dispatch Shipment"

  }

</button>

</>

)

}

</form>

</div>

)

}

function InfoCard({

  label,

  value,

}:{

  label:string

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