"use client"

import {

  useMemo,

  useState,

} from "react"

import { useRouter }
from "next/navigation"

import {

  createSalesOrder,

} from "@/lib/api/sales"



export default function
CreateSalesForm({

  customers,

  products,

  companyState,

}: any) {
  

  const router = useRouter()

  // =================================================
  // HEADER STATE
  // =================================================

  const [
    customer,

    setCustomer

  ] = useState("")

  const [
    orderDate,

    setOrderDate

  ] = useState(

    new Date()
      .toISOString()
      .split("T")[0]
  )

  const [
    deliveryLeadDays,

    setDeliveryLeadDays

  ] = useState("")

  const [
    expectedDeliveryDate,

    setExpectedDeliveryDate

  ] = useState("")

  const [
    priorityFlag,

    setPriorityFlag

  ] = useState(false)

  const [
    remarks,

    setRemarks

  ] = useState("")

  // =================================================
  // LINE ITEMS
  // =================================================

  const [
    lines,

    setLines

  ] = useState<any[]>([])

  // =================================================
  // NEW LINE STATE
  // =================================================

  const [
    selectedSr,

    setSelectedSr

  ] = useState("")

  const [
    quantity,

    setQuantity

  ] = useState("")

  const [
    unitPrice,

    setUnitPrice

  ] = useState("")

  const [
    lineRemarks,

    setLineRemarks

  ] = useState("")

    // =================================================
  // VALIDATION ERRORS
  // =================================================

  const [
    errors,

    setErrors

  ] = useState<any>({})

  // =================================================
  // SR PRODUCT LOOKUP
  // =================================================

  const selectedProduct =
    useMemo(() => {

      return products.find(
        (product: any) =>

          product.sr_number
            ===
          selectedSr
      )

    }, [

      selectedSr,

      products,
    ])


  // =================================================
  // CUSTOMER LOOKUP
  // =================================================

  const selectedCustomer =
  useMemo(() => {

    return customers.find(
      (item: any) =>

        String(item.id)
          ===
        String(customer)
    )

  }, [

    customer,

    customers,
  ])
  // =================================================
  // DELIVERY DATE AUTO CALCULATION
  // =================================================

  function calculateExpectedDate(
    leadDays: string
  ) {

    if (
      !orderDate ||
      !leadDays
    ) return

    const date =
      new Date(orderDate)

    date.setDate(

      date.getDate()
      +
      Number(leadDays)
    )

    const formatted =
      date
        .toISOString()
        .split("T")[0]

    setExpectedDeliveryDate(
      formatted
    )
  }

  function calculateLeadDays(
    deliveryDate: string
  ) {

    if (
      !orderDate ||
      !deliveryDate
    ) return

    const start =
      new Date(orderDate)

    const end =
      new Date(deliveryDate)

    const diff =
      Math.ceil(

        (
          end.getTime()
          -
          start.getTime()
        )

        /

        (
          1000
          * 60
          * 60
          * 24
        )
      )

    setDeliveryLeadDays(
      String(diff)
    )
  }

    // =================================================
    // GST CALCULATION
    // =================================================

    function calculateGST(

      amount: number,

      gstPercentage: number
    ) {

      const totalTax = (

        amount
        *
        gstPercentage

      ) / 100

      const sameState =

        selectedCustomer?.state
          ?.toLowerCase()

        ===

        companyState
          .toLowerCase()

      if (sameState) {

        return {

          cgst:
            totalTax / 2,

          sgst:
            totalTax / 2,

          igst: 0,

          totalTax,
        }
      }

      return {

        cgst: 0,

        sgst: 0,

        igst: totalTax,

        totalTax,
      }
    }
    
  // =================================================
  // ADD LINE
  // =================================================

  function addLine() {
    if (!customer) {

        setErrors({

          ...errors,

          customer:
            "Select customer before adding products",
        })

        return
      }


    if (

      !selectedProduct ||

      !quantity ||

      !unitPrice
    ) {

      return
    }

    const amount =

  Number(quantity)
  *
  Number(unitPrice)

  const gstData =
    calculateGST(

      amount,

      Number(
        selectedProduct
          .gst_percentage
      )
    )

    setErrors({

        ...errors,

        customer: "",

        lines: "",
        })

    setLines([

      ...lines,

      {

        product:
          selectedProduct.id,

        sr_number:
          selectedProduct.sr_number,

        product_name:
          selectedProduct.product_name,

        specification:
          selectedProduct
            .size_or_variant,

        color:
          selectedProduct.color,

        quantity:
          Number(quantity),

        unit_price:
          Number(unitPrice),
        
        gst_percentage:
          Number(
            selectedProduct
              .gst_percentage
          ),

        cgst:
          gstData.cgst,

        sgst:
          gstData.sgst,

        igst:
          gstData.igst,

        total_tax:
          gstData.totalTax,
          
        remarks:
          lineRemarks,
      }
    ])

    // RESET

    setSelectedSr("")

    setQuantity("")

    setUnitPrice("")

    setLineRemarks("")
  }

  // =================================================
  // REMOVE LINE
  // =================================================

  function removeLine(
    index: number
  ) {

    setLines(

      lines.filter(
        (_: any, i: number) =>
          i !== index
      )
    )
  }

  // =================================================
  // TOTAL PREVIEW
  // =================================================

  const estimatedSubtotal =
    useMemo(() => {

      return lines.reduce(

        (
          total: number,

          line: any
        ) => {

          return (

            total
            +
            (
              line.quantity
              *
              line.unit_price
            )
          )

        },

        0
      )

    }, [lines])


      const estimatedTotalGST =
    useMemo(() => {

      return lines.reduce(

        (
          total: number,

          line: any
        ) => {

          return (
            total
            +
            line.total_tax
          )

        },

        0
      )

    }, [lines])

  const estimatedGrandTotal =

    estimatedSubtotal
    +
    estimatedTotalGST
  // =================================================
  // SUBMIT
  // =================================================

  async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    const newErrors: any = {}

    if (!customer) {

      newErrors.customer =
        "Customer is required"
    }

    if (!orderDate) {

      newErrors.orderDate =
        "Order date is required"
    }

    if (lines.length === 0) {

      newErrors.lines =
        "Add at least one product"
    }

    setErrors(newErrors)

    if (
      Object.keys(newErrors)
        .length > 0
    ) {

      return
    }

    try {

      await createSalesOrder({

        customer,

        order_date:
          orderDate,

        delivery_lead_days:
          deliveryLeadDays
            ? Number(
                deliveryLeadDays
              )
            : null,

        expected_delivery_date:
          expectedDeliveryDate
            || null,

        priority_flag:
          priorityFlag,

        remarks,

        lines: lines.map(
          (line: any) => ({

            product:
              line.product,

            quantity:
              line.quantity,

            unit_price:
              line.unit_price,

            remarks:
              line.remarks,
          })
        )
      })

      router.push("/sales")

      router.refresh()

    } catch (error) {

      console.error(error)

      alert(
        "Failed to create sales order"
      )
    }
  }

  return (

    <form
      onSubmit={handleSubmit}

      className="
        space-y-8
      "
    >

      {/* ================================================= */}
      {/* ORDER HEADER */}
      {/* ================================================= */}

      <div
        className="
          bg-zinc-900/60
          border
          border-zinc-800
          rounded-2xl
          p-6
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* CUSTOMER */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              text-zinc-400
            "
          >
            Customer *
          </label>

          <select

            required

            disabled={lines.length > 0}

            value={customer}
            
            onChange={(e) => {

              setCustomer(
                e.target.value
              )

              setErrors({
                ...errors,
                customer: "",
              })
            }}

             className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white

              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            <option value="">
              Select Customer
            </option>

            {
              customers.map(
                (customer: any) => (

                  <option

                    key={customer.id}

                    value={customer.id}
                  >

                    {
                      customer.name
                    }

                  </option>
                )
              )
            }

          </select>
            {
              errors.customer && (

                <p
                  className="
                    text-sm
                    text-red-400
                  "
                >
                  {
                    errors.customer
                  }
                </p>
              )
            }
        </div>

        {/* ORDER DATE */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              text-zinc-400
            "
          >
            Order Date *
          </label>

          <input

            required

            type="date"

            value={orderDate}

            onChange={(e) => {

              setOrderDate(
                e.target.value
              )

              setErrors({
                ...errors,
                orderDate: "",
              })
            }}

            className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          {
            errors.orderDate && (

              <p
                className="
                  text-sm
                  text-red-400
                "
              >
                {
                  errors.orderDate
                }
              </p>
            )
          }

        </div>

        {/* LEAD DAYS */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              text-zinc-400
            "
          >
            Delivery Lead Days
          </label>

          <input

            type="number"

            value={
              deliveryLeadDays
            }

            onChange={(e) => {

              setDeliveryLeadDays(
                e.target.value
              )

              calculateExpectedDate(
                e.target.value
              )
            }}

            className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

        </div>

        {/* EXPECTED DELIVERY */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              text-zinc-400
            "
          >
            Expected Delivery
          </label>

          <input

            type="date"

            value={
              expectedDeliveryDate
            }

            onChange={(e) => {

              setExpectedDeliveryDate(
                e.target.value
              )

              calculateLeadDays(
                e.target.value
              )
            }}

            className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

        </div>

        {/* PRIORITY */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <input

            type="checkbox"

            checked={priorityFlag}

            onChange={(e) =>
              setPriorityFlag(
                e.target.checked
              )
            }

            className="
              w-4
              h-4
            "
          />

          <span
            className="
              text-zinc-300
            "
          >
            High Priority Order
          </span>

        </div>

        {/* REMARKS */}

        <div
          className="
            lg:col-span-2
            space-y-2
          "
        >

          <label
            className="
              text-sm
              text-zinc-400
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
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

        </div>

      </div>
      {/* ================================================= */}
      {/* ADD LINE ITEM */}
      {/* ================================================= */}

      <div
        className="
          bg-zinc-900/60
          border
          border-zinc-800
          rounded-2xl
          p-6
          space-y-6
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Add Products
          </h2>

          <p
            className="
              text-zinc-400
              mt-1
            "
          >
            Search and add using
            SR Number.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-5
            gap-4
          "
        >

          {/* SR NUMBER */}

          <div
            className="
              lg:col-span-2
              space-y-2
            "
          >

            <label
              className="
                text-sm
                text-zinc-400
              "
            >
              SR Number *
            </label>

            <input

              list="products"

              value={selectedSr}

              onChange={(e) =>
                setSelectedSr(
                  e.target.value
                )
              }

              placeholder="Search SR Number"

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                px-4
                py-3
                text-white
              "
            />

            <datalist id="products">

              {
                products.map(
                  (product: any) => (

                    <option

                      key={product.id}

                      value={
                        product.sr_number
                      }
                    >

                      {
                        product.product_name
                      }

                    </option>
                  )
                )
              }

            </datalist>

          </div>

          {/* QUANTITY */}

          <div
            className="
              space-y-2
            "
          >

            <label
              className="
                text-sm
                text-zinc-400
              "
            >
              Quantity *
            </label>

            <input

              type="number"

              value={quantity}

              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                px-4
                py-3
                text-white
              "
            />

          </div>

          {/* UNIT PRICE */}

          <div
            className="
              space-y-2
            "
          >

            <label
              className="
                text-sm
                text-zinc-400
              "
            >
              Unit Price *
            </label>

            <input

              type="number"

              value={unitPrice}

              onChange={(e) =>
                setUnitPrice(
                  e.target.value
                )
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                px-4
                py-3
                text-white
              "
            />

          </div>

          {/* BUTTON */}

          <div
            className="
              flex
              items-end
            "
          >

            <button

              type="button"

              onClick={addLine}

              className="
                w-full
                bg-white
                hover:bg-zinc-200
                transition
                text-black
                rounded-xl
                py-3
                font-medium
              "
            >
              Add
            </button>

          </div>

        </div>

        {/* PRODUCT PREVIEW */}

        {
          selectedProduct && (

            <div
              className="
                border
                border-zinc-800
                rounded-2xl
                p-5
                bg-zinc-950/60
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
                    selectedProduct
                      .product_name
                  }
                </p>

                <p
                  className="
                    text-zinc-400
                    mt-1
                  "
                >
                  {
                    selectedProduct
                      .size_or_variant
                  }

                  {" • "}

                  {
                    selectedProduct
                      .color
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
                    text-zinc-500
                    text-sm
                  "
                >
                  Base Unit
                </p>

                <p
                  className="
                    text-white
                    font-medium
                  "
                >
                  {
                    selectedProduct
                      .base_unit
                  }
                </p>

              </div>

            </div>
          )
        }

      </div>

          {
          errors.lines && (

            <p
              className="
                text-sm
                text-red-400
              "
            >
              {
                errors.lines
              }
            </p>
          )
        }

{/* ================================================= */}
{/* LINE ITEMS TABLE */}
{/* ================================================= */}

<div
  className="
    border
    border-zinc-800
    rounded-2xl
    overflow-hidden
    bg-zinc-900/40
  "
>

  <table className="w-full">

    <thead
      className="
        bg-zinc-900
      "
    >

      <tr>

        <th
          className="
            px-4
            py-4
            text-left
            text-zinc-400
            text-sm
          "
        >
          SR Number
        </th>

        <th
          className="
            px-4
            py-4
            text-left
            text-zinc-400
            text-sm
          "
        >
          Product
        </th>

        <th
          className="
            px-4
            py-4
            text-left
            text-zinc-400
            text-sm
          "
        >
          Specification
        </th>

        <th
          className="
            px-4
            py-4
            text-right
            text-zinc-400
            text-sm
          "
        >
          Qty
        </th>

        <th
          className="
            px-4
            py-4
            text-right
            text-zinc-400
            text-sm
          "
        >
          Unit Price
        </th>

        <th
          className="
            px-4
            py-4
            text-right
            text-zinc-400
            text-sm
          "
        >
          Base Amount
        </th>

        <th
          className="
            px-4
            py-4
            text-right
            text-zinc-400
            text-sm
          "
        >
          GST
        </th>

        <th
          className="
            px-4
            py-4
            text-right
            text-zinc-400
            text-sm
          "
        >
          Grand Total
        </th>

        <th
          className="
            px-4
            py-4
            text-center
            text-zinc-400
            text-sm
          "
        >
          Action
        </th>

      </tr>

    </thead>

    <tbody>

      {
        lines.map(
          (
            line: any,
            index: number
          ) => {

            const baseAmount =

              line.quantity
              *
              line.unit_price

            const grandTotal =

              baseAmount
              +
              line.total_tax

            return (

              <tr

                key={index}

                className="
                  border-t
                  border-zinc-800
                "
              >

                {/* SR */}

                <td
                  className="
                    px-4
                    py-4
                    text-blue-400
                    font-medium
                  "
                >
                  {
                    line.sr_number
                  }
                </td>

                {/* PRODUCT */}

                <td
                  className="
                    px-4
                    py-4
                    text-white
                  "
                >
                  {
                    line.product_name
                  }
                </td>

                {/* SPEC */}

                <td
                  className="
                    px-4
                    py-4
                    text-zinc-300
                  "
                >

                  {
                    line.specification
                  }

                  {" • "}

                  {
                    line.color
                  }

                </td>

                {/* QTY */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                    text-zinc-300
                  "
                >
                  {
                    line.quantity
                  }
                </td>

                {/* UNIT PRICE */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                    text-zinc-300
                  "
                >

                  ₹

                  {
                    line.unit_price
                  }

                </td>

                {/* BASE */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                    text-white
                  "
                >

                  ₹

                  {
                    baseAmount
                      .toFixed(2)
                  }

                </td>

                {/* GST */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                  "
                >

                  <div
                    className="
                      text-white
                      font-medium
                    "
                  >

                    {
                      line.gst_percentage
                    }%

                  </div>

                  {
                    line.cgst > 0 && (

                      <div
                        className="
                          text-xs
                          text-zinc-500
                          mt-1
                        "
                      >

                        CGST:
                        ₹
                        {
                          line.cgst
                            .toFixed(2)
                        }

                        <br />

                        SGST:
                        ₹
                        {
                          line.sgst
                            .toFixed(2)
                        }

                      </div>
                    )
                  }

                  {
                    line.igst > 0 && (

                      <div
                        className="
                          text-xs
                          text-zinc-500
                          mt-1
                        "
                      >

                        IGST:
                        ₹
                        {
                          line.igst
                            .toFixed(2)
                        }

                      </div>
                    )
                  }

                </td>

                {/* GRAND TOTAL */}

                <td
                  className="
                    px-4
                    py-4
                    text-right
                    text-white
                    font-semibold
                  "
                >

                  ₹

                  {
                    grandTotal
                      .toFixed(2)
                  }

                </td>

                {/* ACTION */}

                <td
                  className="
                    px-4
                    py-4
                    text-center
                  "
                >

                  <button

                    type="button"

                    onClick={() =>
                      removeLine(index)
                    }

                    className="
                      text-red-400
                      hover:text-red-300
                    "
                  >
                    Remove
                  </button>

                </td>

              </tr>
            )
          }
        )
      }

    </tbody>

  </table>

</div>

      {/* ================================================= */}
      {/* TOTALS */}
      {/* ================================================= */}
<div
  className="
    w-full
    max-w-md
    bg-zinc-900/60
    border
    border-zinc-800
    rounded-2xl
    p-6
    space-y-4
  "
>

  <div
    className="
      flex
      items-center
      justify-between
    "
  >

    <span
      className="
        text-zinc-400
      "
    >
      Estimated Subtotal
    </span>

    <span
      className="
        text-white
        font-medium
      "
    >
      ₹
      {
        estimatedSubtotal
          .toFixed(2)
      }
    </span>

  </div>

  <div
    className="
      flex
      items-center
      justify-between
    "
  >

    <span
      className="
        text-zinc-400
      "
    >
      Estimated GST
    </span>

    <span
      className="
        text-white
        font-medium
      "
    >
      ₹
      {
        estimatedTotalGST
          .toFixed(2)
      }
    </span>

  </div>

  <div
    className="
      border-t
      border-zinc-800
      pt-4
      flex
      items-center
      justify-between
    "
  >

    <span
      className="
        text-lg
        font-semibold
        text-white
      "
    >
      Estimated Grand Total
    </span>

    <span
      className="
        text-xl
        font-bold
        text-white
      "
    >
      ₹
      {
        estimatedGrandTotal
          .toFixed(2)
      }
    </span>

  </div>

  <p
    className="
      text-xs
      text-zinc-500
      leading-relaxed
    "
  >
    GST and final totals
    will be automatically
    recalculated by backend
    during order creation.
  </p>

</div>

      {/* ================================================= */}
      {/* SUBMIT */}
      {/* ================================================= */}

      <div
        className="
          flex
          justify-end
        "
      >

        <button

          type="submit"

          className="
            bg-white
            hover:bg-zinc-200
            transition
            text-black
            px-6
            py-3
            rounded-xl
            font-medium
          "
        >
          Create Sales Order
        </button>

      </div>

    </form>
  )
}