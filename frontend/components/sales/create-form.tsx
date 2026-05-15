"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

const UOM_OPTIONS = [

  "PCS",
  "GROSS",
  "METER",
  "ROLL",
  "SET",
]

const COMPANY_STATE =
  "Karnataka"

interface Customer {

  id: number

  customer_code: string

  name: string

  state: string
}

interface Product {

  id: number

  sr_number: string

  product_name: string

  base_unit: string
}

interface LineItem {

  product_id: string

  quantity: number

  unit_price: number

  unit: string

  gst_percentage: number
}

interface Props {

  customers: Customer[]

  products: Product[]
}

export default function
CreateSalesOrderForm({

  customers,
  products,

}: Props) {

  const [lineItems, setLineItems] =
    useState<LineItem[]>([
      {
        product_id: "",
        quantity: 1,
        unit_price: 0,
        unit: "",
        gst_percentage: 18,
      },
    ])

  const [customerId, setCustomerId] =
    useState("")

  const [customerPO, setCustomerPO] =
    useState("")

  const router =  useRouter()
  
  const [
    deliveryLeadDays,
    setDeliveryLeadDays,
  ] = useState(0)

  const [
    priorityFlag,
    setPriorityFlag,
  ] = useState(false)

  const [remarks, setRemarks] =
    useState("")

  const [isSubmitting, setIsSubmitting] =
    useState(false)
  

  const [errors, setErrors] =
    useState<any>({})
  
  const selectedCustomer =
    customers.find(
    (customer) =>

      customer.id.toString() ===
      customerId
  )

const isInterState =

  selectedCustomer
    ? (
        selectedCustomer.state !==
        COMPANY_STATE
      )
    : false

  // =====================================================
  // TOTALS ENGINE
  // =====================================================

  const lineTotals =

    lineItems.map(
      (item) => {

        const taxableValue =

          item.quantity *
          item.unit_price

        const gstAmount =

    taxableValue *
    (
        item.gst_percentage / 100
    )

    const cgst =

    isInterState
        ? 0
        : gstAmount / 2

    const sgst =

    isInterState
        ? 0
        : gstAmount / 2

    const igst =

    isInterState
        ? gstAmount
        : 0

    const lineGrandTotal =

          taxableValue +
          gstAmount

        return {

          taxableValue,

          gstAmount,

          cgst,

          sgst,
          
          igst,

          lineGrandTotal,
        }
      }
    )

  const subtotal =

    lineTotals.reduce(

      (total, line) =>

        total +
        line.taxableValue,

      0
    )

  const totalCGST =

    lineTotals.reduce(

      (total, line) =>

        total +
        line.cgst,

      0
    )

  const totalSGST =

    lineTotals.reduce(

      (total, line) =>

        total +
        line.sgst,

      0
    )

  const totalIGST =

  lineTotals.reduce(

    (total, line) =>

      total +
      line.igst,

    0
  )

  const totalGST =

    lineTotals.reduce(

      (total, line) =>

        total +
        line.gstAmount,

      0
    )

  const grandTotal =

    lineTotals.reduce(

      (total, line) =>

        total +
        line.lineGrandTotal,

      0
    )

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit() {

    try {

      setIsSubmitting(true)
      
      const validationErrors: any = {}

      if (!customerId) {

        validationErrors.customer =
          "Please select a customer"
      }

      if (deliveryLeadDays <= 0) {

            validationErrors.delivery_lead_days =
              "Lead time must be greater than zero"
          }

      if (lineItems.length === 0) {

        validationErrors.line_items =
          "Add at least one line item"
      }

      lineItems.forEach(
        (item, index) => {

          if (!item.product_id) {

            validationErrors[
              `product_${index}`
            ] =

              "Please select a product"
          }

          if (!item.unit) {

            validationErrors[
              `uom_${index}`
            ] =

              "Please select UOM"
          }

          if (item.quantity <= 0) {

            validationErrors[
              `quantity_${index}`
            ] =

              "Quantity must be greater than zero"
          }

          if (item.unit_price < 0) {

            validationErrors[
              `price_${index}`
            ] =

              "Unit price cannot be negative"
          }

          
        }
      )

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {

        setErrors(
          validationErrors
        )

        setIsSubmitting(false)

        return
      }
            
      const payload = {

        customer:
          Number(customerId),

        customer_po_id:
          customerPO,

        order_date:
          new Date()
            .toISOString()
            .split("T")[0],

        delivery_lead_days:
          deliveryLeadDays,

        priority_flag:
          priorityFlag,

        status:
          "DRAFT",

        subtotal_amount:
        Number(
            subtotal.toFixed(2)
        ),

        tax_amount:
        Number(
            totalGST.toFixed(2)
        ),

        total_amount:
        Number(
            grandTotal.toFixed(2)
        ),

        remarks,

        lines:

          lineItems.map(
            (item) => ({

              product:
                Number(
                  item.product_id
                ),

              quantity:
                item.quantity,

              unit_price:
                Number(
                    item.unit_price.toFixed(2)
                ),

              remarks: "",
            })
          ),
      }

      const response = await fetch(

    "http://localhost:8000/api/sales-orders/",

    {
        method: "POST",

        credentials: "include",

        headers: {
        "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
        payload
        ),
    }
    )

    if (!response.ok) {

      const errorData =
        await response.json()

      setErrors(errorData)

      return
    }

    const createdOrder =
    await response.json()


    router.push(
        `/sales/${createdOrder.id}`
    )

    } catch {

  setErrors({
    non_field_errors: [
      "Something went wrong. Please try again."
    ]
  })

  }finally {

      setIsSubmitting(false)
    }
  }

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-8">
        Create Sales Order
      </h1>

      {/* CUSTOMER */}

      <div className="mb-8">

      <div
        className="
          flex
          items-center
          justify-between
          mb-2
        "
      >

        <label>
          Customer
        </label>

        <a
          href="/customers/create"

          className="
            text-sm
            text-blue-400
            underline
          "
        >
          Add New Customer
        </a>

      </div>

        <select
          value={customerId}

          onChange={(e) =>
            setCustomerId(
              e.target.value
            )
          }

          className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-2
            w-full
          "
        >

          <option>
            Select Customer
          </option>

          {
            customers.map(
              (customer) => (

                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {
                    customer.customer_code
                  }
                  {" - "}
                  {customer.name}

                </option>
              )
            )
          }

        </select>
        {
        errors.customer && (

          <p
            className="
              text-red-500
              text-sm
              mt-2
            "
          >

            {errors.customer}

          </p>
        )
      }

      </div>

      {/* SALES ORDER DETAILS */}

      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* CUSTOMER PO */}

        <div>

          <label className="block mb-2">
            Customer PO Number
          </label>

          <input
            type="text"

            value={customerPO}

            onChange={(e) =>
              setCustomerPO(
                e.target.value
              )
            }

            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              px-4
              py-2
            "
          />

        </div>

        {/* DELIVERY LEAD TIME */}

        <div>

          <label className="block mb-2">
            Delivery Lead Time (Days)
          </label>

          <input
            type="number"

            min="0"

            value={deliveryLeadDays}

            onChange={(e) =>
              setDeliveryLeadDays(
                Number(
                  e.target.value
                )
              )
            }

            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded-lg
              px-4
              py-2
            "
          />

          {
            errors.delivery_lead_days && (

              <p
                className="
                  text-red-500
                  text-sm
                  mt-2
                "
              >

                {
                  errors
                  .delivery_lead_days
                }

              </p>
            )
          }
          </div>
        </div>
      {/* PRIORITY */}

      <div className="mb-8">

        <label
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
          />

          Priority Order

        </label>

      </div>

      {/* REMARKS */}

      <div className="mb-8">

        <label className="block mb-2">
          Remarks
        </label>

        <textarea
          value={remarks}

          onChange={(e) =>
            setRemarks(
              e.target.value
            )
          }

          rows={4}

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-2
          "
        />

      </div>

      {/* LINE ITEMS */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            mb-4
          "
        >

          <h2 className="text-xl">
            Line Items
          </h2>

          <button
            type="button"

            onClick={() =>

              setLineItems([
                ...lineItems,

                {
                  product_id: "",
                  quantity: 1,
                  unit_price: 0,
                  unit: "",
                  gst_percentage: 18,
                },
              ])
            }

            className="
              bg-white
              text-black
              px-4
              py-2
              rounded-lg
            "
          >
            Add Row
          </button>

        </div>

        {/* HEADERS */}

        <div
          className="
            grid
            grid-cols-15
            gap-4
            mb-3
            text-sm
            text-zinc-400
            font-medium
          "
        >

          <div className="col-span-4">
            Product
          </div>

          <div className="col-span-2">
            Qty
          </div>

          <div className="col-span-2">
            UOM
          </div>

          <div className="col-span-2">
            Rate
          </div>

          <div className="col-span-2">
            GST %
          </div>

          <div className="col-span-2">
            Total
          </div>

          <div className="col-span-1">
            Action
          </div>

        </div>

        {/* ROWS */}

        <div className="space-y-4">

          {
            lineItems.map(
              (item, index) => (

                <div
                  key={index}

                  className="
                    grid
                    grid-cols-15
                    gap-4
                    items-start
                    mb-4
                  "
                >

                  {/* PRODUCT */}

                  <div className="col-span-4">

                    <select
                      value={item.product_id}

                      onChange={(e) => {

                        const selectedProduct =
                          products.find(
                            (p) =>
                              p.id.toString() ===
                              e.target.value
                          )

                        const updated =
                          [...lineItems]

                        updated[index]
                          .product_id =
                            e.target.value

                        if (selectedProduct) {

                          updated[index]
                            .unit =
                              selectedProduct.base_unit
                        }

                        setLineItems(updated)
                      }}

                      className="
                        w-full
                        bg-zinc-900
                        border
                        border-zinc-700
                        rounded-lg
                        px-4
                        py-2
                      "
                    >

                      <option value="">
                        Select Product
                      </option>

                      {
                        products.map(
                          (product) => (

                            <option
                              key={product.id}
                              value={product.id}
                            >

                              {
                                product.sr_number
                              }

                              {" - "}

                              {
                                product.product_name
                              }

                            </option>
                          )
                        )
                      }

                    </select>

                    {
                      errors[
                        `product_${index}`
                      ] && (

                        <p
                          className="
                            text-red-500
                            text-xs
                            mt-1
                            h-4
                          "
                        >

                          {
                            errors[
                              `product_${index}`
                            ]
                          }

                        </p>
                      )
                    }

                  </div>

                  {/* QUANTITY */}

                  <div className="col-span-2">

                    <input
                      type="number"

                      placeholder="Qty"

                      min="1"

                      value={item.quantity}

                      onChange={(e) => {

                        const updated =
                          [...lineItems]

                        updated[index]
                          .quantity =
                            Number(
                              e.target.value
                            )

                        setLineItems(updated)
                      }}

                      className="
                        w-full
                        bg-zinc-900
                        border
                        border-zinc-700
                        rounded-lg
                        px-4
                        py-2
                      "
                    />

                    {
                      errors[
                        `quantity_${index}`
                      ] && (

                        <p
                          className="
                            text-red-500
                            text-xs
                            mt-1
                            h-4
                          "
                        >

                          {
                            errors[
                              `quantity_${index}`
                            ]
                          }

                        </p>
                      )
                    }

                  </div>

                  {/* UOM */}

                  <div className="col-span-2">

                    <select
                      value={item.unit}

                      onChange={(e) => {

                        const updated =
                          [...lineItems]

                        updated[index]
                          .unit =
                            e.target.value

                        setLineItems(updated)
                      }}

                      className="
                        w-full
                        bg-zinc-900
                        border
                        border-zinc-700
                        rounded-lg
                        px-4
                        py-2
                      "
                    >

                      <option value="">
                        Select UOM
                      </option>

                      {
                        UOM_OPTIONS.map(
                          (uom) => (

                            <option
                              key={uom}
                              value={uom}
                            >

                              {uom}

                            </option>
                          )
                        )
                      }

                    </select>

                    {
                      errors[
                        `uom_${index}`
                      ] && (

                        <p
                          className="
                            text-red-500
                            text-xs
                            mt-1
                            h-4
                          "
                        >

                          {
                            errors[
                              `uom_${index}`
                            ]
                          }

                        </p>
                      )
                    }

                  </div>

                  {/* RATE */}

                  <div className="col-span-2">

                    <input
                      type="number"

                      placeholder="Rate"

                      min="0"

                      value={item.unit_price}

                      onChange={(e) => {

                        const updated =
                          [...lineItems]

                        updated[index]
                          .unit_price =
                            Number(
                              e.target.value
                            )

                        setLineItems(updated)
                      }}

                      className="
                        w-full
                        bg-zinc-900
                        border
                        border-zinc-700
                        rounded-lg
                        px-4
                        py-2
                      "
                    />

                    {
                      errors[
                        `price_${index}`
                      ] && (

                        <p
                          className="
                            text-red-500
                            text-xs
                            mt-1
                            h-4
                          "
                        >

                          {
                            errors[
                              `price_${index}`
                            ]
                          }

                        </p>
                      )
                    }
                  </div>        
     
                  {/* GST */}

                  <input
                    type="number"

                    value={item.gst_percentage}

                    onChange={(e) => {

                      const updated =
                        [...lineItems]

                      updated[index]
                        .gst_percentage =
                          Number(
                            e.target.value
                          )

                      setLineItems(updated)
                    }}

                    className="
                      col-span-2
                      bg-zinc-900
                      border
                      border-zinc-700
                      rounded-lg
                      px-4
                      py-2
                    "
                  />

                  {/* TOTAL */}

                  <div
                    className="
                      col-span-2
                      text-zinc-300
                    "
                  >
                    ₹
                    {
                      lineTotals[index]
                        ?.lineGrandTotal
                        .toFixed(2)
                    }
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"

                    onClick={() => {

                      const updated =
                        lineItems.filter(
                          (_, i) =>
                            i !== index
                        )

                      setLineItems(updated)
                    }}

                    className="
                      col-span-1
                      text-red-400
                    "
                  >
                    Remove
                  </button>

                </div>
              )
            )
          }

        </div>

      </div>

     
    {/* ORDER SUMMARY */}

    <div
    className="
        mt-10
        ml-auto
        max-w-md
        border
        border-zinc-800
        rounded-xl
        p-6
        space-y-4
    "
    >

    <div
        className="
        flex
        justify-between
        "
    >

        <span>
        Subtotal
        </span>

        <span>
        ₹
        {
            subtotal.toFixed(2)
        }
        </span>

    </div>

    {
        isInterState ? (

        <div
            className="
            flex
            justify-between
            "
        >

            <span>
            IGST
            </span>

            <span>
            ₹
            {
                totalIGST.toFixed(2)
            }
            </span>

        </div>

        ) : (

        <>

            <div
            className="
                flex
                justify-between
            "
            >

            <span>
                CGST
            </span>

            <span>
                ₹
                {
                totalCGST.toFixed(2)
                }
            </span>

            </div>

            <div
            className="
                flex
                justify-between
            "
            >

            <span>
                SGST
            </span>

            <span>
                ₹
                {
                totalSGST.toFixed(2)
                }
            </span>

            </div>

        </>

        )
    }

    <div
        className="
        flex
        justify-between
        text-xl
        font-bold
        border-t
        border-zinc-700
        pt-4
        "
    >

        <span>
        Grand Total
        </span>

        <span>
        ₹
        {
            grandTotal.toFixed(2)
        }
        </span>

    </div>

    </div>


        
            {
      errors.non_field_errors && (

        <div
          className="
            bg-red-500/10
            border
            border-red-500
            rounded-lg
            p-4
            text-red-400
            mb-6
          "
        >

          {
            errors
            .non_field_errors[0]
          }

        </div>
      )
    }

      {/* SUBMIT */}

      <div className="mt-8">

        <button
          type="button"

          onClick={handleSubmit}

          disabled={isSubmitting}

          className="
            bg-white
            text-black
            px-6
            py-3
            rounded-lg
            font-medium
            disabled:opacity-50
          "
        >

          {
            isSubmitting
              ? "Creating..."
              : "Create Sales Order"
          }

        </button>

      </div>

    </div>
  )
}

