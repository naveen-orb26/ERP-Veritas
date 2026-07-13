"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  createProductionRequest,
  updateProductionRequest,
} from "@/lib/api/production-client"

import {

  cancelProductionRequest,

} from "@/lib/api/production-client"

import Link from "next/link"


type SalesOrderLine = {

  id: number

  sales_order: number

  order_number: string

  customer_name: string

  sr_number: string

  product_name: string

  quantity: number

  fulfilled_quantity: number

  pending_quantity: number
}

type ProductionRequest = {

  id:number

  sales_order_line:number|null

  customer_name: string

  order_number: string

  sr_number: string

  product_name: string

  remarks:string

  allocated_quantity:number

  status:string

  has_job_cards:boolean

  remaining_quantity: number

  requested_quantity: number

}

type Props = {

  mode: "create" | "edit"

  salesLines: SalesOrderLine[]

  initialData?: ProductionRequest

  initialSalesOrderLine?: number

  fromSalesOrder?: boolean
}

function InfoCard({

  label,

  value,

}: {

  label: string

  value: string | number

}) {

  return (

    <div>

      <p
        className="
          text-sm
          text-zinc-400
          mb-1
        "
      >
        {label}
      </p>

      <p className="font-medium">

        {value || "-"}

      </p>

    </div>
  )
}

export default function RequestForm({

  mode,

  salesLines,

  initialData,

  initialSalesOrderLine,

  fromSalesOrder,


}: Props) {

  const router = useRouter()

  const locked = (initialData?.allocated_quantity || 0) > 0
  
  const preselectedLine = salesLines.find( line => line.id === initialSalesOrderLine)
  
  const hideSelectionFields =  fromSalesOrder === true

  const [

    selectedOrderId,

    setSelectedOrderId,

  ] = useState(

    preselectedLine

      ? String(
          preselectedLine.sales_order
        )

      : ""
  )

  const productionRequest = initialData

  if (mode === "edit" && !productionRequest) {

    return null

  }

  const [

    selectedLineId,

    setSelectedLineId,

  ] = useState(

    initialData?.sales_order_line
      ?.toString()

    ||

    initialSalesOrderLine
      ?.toString()

    ||

    ""
  )

  const [

    remarks,

    setRemarks,

  ] = useState(

    initialData?.remarks || ""
  )

  const [

    loading,

    setLoading,

  ] = useState(false)

  const [

    error,

    setError,

  ] = useState("")

  const salesOrders = useMemo(() => {

    const map = new Map()

    salesLines.forEach((line) => {

      if (!map.has(line.sales_order)) {

        map.set(
          line.sales_order,
          {
            id: line.sales_order,

            order_number:
              line.order_number,

            customer_name:
              line.customer_name,
          }
        )
      }
    })

    return Array.from(
      map.values()
    )

  }, [salesLines])

  const filteredLines = useMemo(() => {

    if (!selectedOrderId) {

      return []
    }

    return salesLines.filter(

      (line) =>

        line.sales_order ===
        Number(selectedOrderId)
    )

  }, [

    salesLines,

    selectedOrderId,
  ])

  const selectedLine = useMemo(() => {

  const lineId =

    mode === "edit"

      ? productionRequest?.sales_order_line

      : Number(selectedLineId)

  return salesLines.find(

    (line) =>

      line.id === lineId

  )

}, [

  salesLines,

  selectedLineId,

  productionRequest,

  mode,

])

  async function
    handleCancel(){

      if(!initialData){

        return

      }

      try{

        await cancelProductionRequest(

          initialData.id

        )

        router.push(

          "/production/requests"

        )

        router.refresh()

      }

      catch(error){

        console.error(error)

      }

    }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setError("")

    if (!selectedLineId) {

      setError(
        "Please select a sales order line."
      )

      return
    }

    setLoading(true)

    const payload = {

      source_type: "SALES_ORDER",

      sales_order_line:
        Number(selectedLineId),

      remarks,
    }

    try {

      if (mode === "create") {

        await createProductionRequest(
          payload
        )

      } else {

        await updateProductionRequest(

          initialData!.id,

          payload
        )
      }

      router.push(
        "/production/requests"
      )

      router.refresh()

    } catch (err: any) {

      setError(

        err.message ||

        "Failed to save request."
      )

    } finally {

      setLoading(false)
    }
  }
  console.log({

  hideSelectionFields,

  selectedLine,

  selectedLineId,

  initialSalesOrderLine,

  initialData,

})
  return (

    <form

      onSubmit={handleSubmit}

      className="
        max-w-6xl
        space-y-8
      "
    > 
    
    {
      
      locked && (

        <div
          className="
            mb-6

            rounded-lg

            border
            border-yellow-500/30

            bg-yellow-500/10

            p-4

            text-yellow-300
          "
        >

          Job cards already exist.

          This production request
          can no longer be modified.

        </div>
      )
    }
    {
      
        !hideSelectionFields && (

      <>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >
        
        <div>

          <label
            className="
              block
              mb-2
              text-sm
              font-medium
            "
          >
            Source Type
          </label>

          <input

            value="Sales Order"

            disabled

            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              p-3
              opacity-70
            "
          />

        </div>

        <div>

          <label
            className="
              block
              mb-2
              text-sm
              font-medium
            "
          >
            Sales Order
          </label>

          <select

            value={selectedOrderId}

            disabled={locked}

            onChange={(e) => {

              setSelectedOrderId(
                e.target.value
              )

              setSelectedLineId("")
            }}

            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              p-3
            "
          >

            <option value="">

              Select sales order

            </option>

            {

              salesOrders.map(
                (order: any) => (

                  <option
                    key={order.id}
                    value={order.id}
                  >

                    {

                      `${order.order_number}
                      • ${order.customer_name}`

                    }

                  </option>
                )
              )
            }

          </select>

        </div>
           
      </div>
        
      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Sales Order Line
        </label>

        <select

          value={selectedLineId}

          disabled={
            locked ||
            !selectedOrderId
          }

          onChange={(e) =>

            setSelectedLineId(
              e.target.value
            )
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            p-3
          "
        >

          <option value="">

            Select SR Number

          </option>

          {

            filteredLines.map(
              (line) => (

                <option
                  key={line.id}
                  value={line.id}
                >

                  {

                    `${line.sr_number}
                    • ${line.product_name}
                    • Pending:
                    ${line.pending_quantity.toLocaleString()}`

                  }

                </option>
              )
            )
          }

        </select>

      </div>

    
      </>

            )
            }

        {
          hideSelectionFields

          &&

          productionRequest

          &&

          (

          <div

          className="

          mb-6

          rounded-xl

          border

          border-zinc-800

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

          Sales Order Information

          </h2>

          <div

          className="

          grid

          gap-4

          md:grid-cols-2

          "

          >

          <InfoCard

          label="Sales Order"

          value={productionRequest.order_number}

          />

          <InfoCard

          label="Customer"

          value={productionRequest.customer_name}

          />

          <InfoCard

          label="SR Number"

          value={productionRequest.sr_number}

          />

          <InfoCard

          label="Product"

          value={productionRequest.product_name}

          />

          <InfoCard

          label="Requested Quantity"

          value={productionRequest.requested_quantity}

          />

          <InfoCard

          label="Pending Quantity"

          value={productionRequest.remaining_quantity}

          />

          </div>

          </div>

          )
          }

        {

        selectedLine && (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6

              rounded-xl

              border
              border-zinc-800

              bg-zinc-900

              p-6
            "
          >

            <InfoCard
              label="Customer"
              value={
                selectedLine.customer_name
              }
            />

            <InfoCard
              label="Order Number"
              value={
                selectedLine.order_number
              }
            />

            <InfoCard
              label="SR Number"
              value={
                selectedLine.sr_number
              }
            />

            <InfoCard
              label="Product"
              value={
                selectedLine.product_name
              }
            />

            <InfoCard
              label="Ordered Quantity"
              value={
                selectedLine.quantity
                  .toLocaleString()
              }
            />

            <InfoCard
              label="Fulfilled Quantity"
              value={
                selectedLine
                  .fulfilled_quantity
                  .toLocaleString()
              }
            />

            <InfoCard
              label="Pending Quantity"
              value={
                selectedLine
                  .pending_quantity
                  .toLocaleString()
              }
            />

            <InfoCard
              label="Requested Quantity"
              value={
                selectedLine
                  .pending_quantity
                  .toLocaleString()
              }
            />

          </div>
        )
      }



      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Remarks
        </label>

        <textarea

          rows={4}

          value={remarks}

          onChange={(e) =>

            setRemarks(
              e.target.value
            )
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            p-3
          "
        />
         
      </div>
                

      {

        error && (

          <div className="text-red-400">

            {error}

          </div>
        )
      }

      
           {/* ===========================
                    ACTION BUTTONS
               =========================== */}

                {

                mode === "create"

                &&

                (

                <button

                type="submit"

                disabled={loading}

                className="

                mt-6

                rounded-lg

                bg-emerald-600

                px-5

                py-2

                font-medium

                hover:bg-emerald-700

                "

                >

                Create Production Request

                </button>

                )

                }

                {

                mode === "edit"

                &&

                initialData?.status === "CANCELLED"

                &&

                (

                <button

                type="button"

                disabled

                className="

                mt-6

                rounded-lg

                border

                border-red-700

                bg-red-900/30

                px-5

                py-2

                cursor-not-allowed

                "

                >

                Production Request Cancelled

                </button>
                
              )
              &&
              (             <div
                    className="
                    mb-4
                    rounded-lg
                    border
                    border-red-700
                    bg-red-900/20
                    p-3
                    text-sm
                    text-red-300
                    "
                    >

                    This Production Request has been cancelled.
                    No further Job Cards can be created. Kindly create new PR for proceeding.

                    </div>)
                

                }
                   


                {

                mode === "edit"

                &&

                initialData?.status !== "CANCELLED"

                &&

                !locked

                &&

                (

                <button

                type="button"

                onClick={handleCancel}

                className="

                mt-6

                rounded-lg

                bg-red-600

                px-5

                py-2

                font-medium

                hover:bg-red-700

                "

                >

                Cancel Production Request

                </button>

                )

                }

                {

                  mode==="edit"

                  &&

                  initialData?.status!=="CANCELLED"

                  && productionRequest

                  &&

                  (

                  <div

                  className="

                  mt-8

                  rounded-xl

                  border

                  border-zinc-800

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

                  Job Cards

                  </h2>

                  {
                    productionRequest?.remaining_quantity === productionRequest?.requested_quantity ?

                    (

                    <Link

                    href={`/production/job-cards/create?productionRequest=${productionRequest!.id}`}

                    className="

                    inline-flex

                    rounded-lg

                    bg-emerald-600

                    px-5

                    py-2

                    "

                    >

                    Create Job Card

                    </Link>

                    )

                    :

                    productionRequest.remaining_quantity > 0

                    ?

                    (

                    <div className="flex gap-3">

                    <Link

                    href={`/production/job-cards/create?productionRequest=${productionRequest!.id}`}

                    className="

                    inline-flex

                    rounded-lg

                    bg-emerald-600

                    px-5

                    py-2

                    "

                    >

                    Create Job Card

                    </Link>

                    <Link

                    href={`/production/job-cards/by-sales-line/${productionRequest!.sales_order_line}`}

                    className="

                    inline-flex

                    rounded-lg

                    bg-blue-600

                    px-5

                    py-2

                    "

                    >

                    View Job Cards

                    </Link>

                    </div>

                    )

                    :

                    (

                    <Link

                    href={`/production/job-cards/by-sales-line/${productionRequest!.sales_order_line}`}

                    className="

                    inline-flex

                    rounded-lg

                    bg-blue-600

                    px-5

                    py-2

                    "

                    >

                    View Job Cards

                    </Link>

                    )
                    }
                  </div>

                  )
                  }

                
    </form>
  
  )
}
