"use client"

import { useState }
from "react"

import Link
from "next/link"

import {
  useRouter,
} from "next/navigation"

import {
  ArrowLeft,

  Home,

  Plus,

  Trash2,
} from "lucide-react"

import {
  createPurchaseOrder,

  updatePurchaseOrder,
} from "@/lib/api/purchase-orders-client"


function formatDate(
  date: Date
) {

  return date
    .toISOString()
    .split("T")[0]
}

type PurchaseOrderFormProps = {

  purchaseOrder?: any

  vendors: any[]

  materialSources: any[]

  warehouses: any[]
}


export default function
PurchaseOrderForm({

  purchaseOrder,

  vendors,

  materialSources,

  warehouses,
}: PurchaseOrderFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  const [formData, setFormData] =
    useState({

      vendor:
        purchaseOrder?.vendor || "",

      po_date:
        purchaseOrder?.po_date || "",

      vendor_pr_number:
        purchaseOrder?.vendor_pr_number || "",

      billing_address:
        purchaseOrder?.billing_address || "",

      shipping_address:
        purchaseOrder?.shipping_address || "",

      company_gstin:
        purchaseOrder?.company_gstin || "",

      vendor_gstin:
        purchaseOrder?.vendor_gstin || "",

      lead_days:
        purchaseOrder?.lead_days || 0,

      expected_delivery_date:
        purchaseOrder?.expected_delivery_date || "",

      status:
        purchaseOrder?.status || "DRAFT",

      remarks:
        purchaseOrder?.remarks || "",

      lines:

        purchaseOrder?.lines || [

          {
            material_source: "",

            warehouse:
              warehouses?.[0]?.id || "",

            ordered_quantity: 0,

            unit: "",

            unit_cost: 0,

            cgst_percent: 0,

            sgst_percent: 0,

            igst_percent: 0,

            remarks: "",
          }
        ],
    })


  function handleChange(

    field: string,

    value: any
  ) {

    setFormData({

      ...formData,

      [field]: value,
    })
  }


  function handleLineChange(

    index: number,

    field: string,

    value: any
  ) {

    const updatedLines = [
      ...formData.lines
    ]

    updatedLines[index] = {

      ...updatedLines[index],

      [field]: value,
    }


    // =============================================
    // AUTO UNIT FETCH
    // =============================================

    if (
      field ===
      "material_source"
    ) {

      const selectedMaterial =
        materialSources.find(
          (item: any) =>
            item.id ===
            Number(value)
        )

      if (selectedMaterial) {

        updatedLines[index].unit =
          selectedMaterial.base_unit
      }
    }


    setFormData({

      ...formData,

      lines: updatedLines,
    })
  }


  function addLine() {

    setFormData({

      ...formData,

      lines: [

        ...formData.lines,

        {
          material_source: "",

          warehouse:
            warehouses?.[0]?.id || "",

          ordered_quantity: 0,

          unit: "",

          unit_cost: 0,

          cgst_percent: 0,

          sgst_percent: 0,

          igst_percent: 0,

          remarks: "",
        }
      ],
    })
  }


  function removeLine(
    index: number
  ) {

    const updatedLines =
      formData.lines.filter(

        (_: any, i: number) =>
          i !== index
      )

    setFormData({

      ...formData,

      lines: updatedLines,
    })
  }


  async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    setError("")

    try {

      if (purchaseOrder) {

        await updatePurchaseOrder(

          purchaseOrder.id,

          formData
        )

      } else {
        console.log(formData)
        await createPurchaseOrder(
          formData
        )
      }

      router.push(
        "/purchase-orders"
      )

      router.refresh()

    } catch (err: any) {

      console.error(err)

      setError(

        err.message ||

        "Failed to save purchase order"
      )

    } finally {

      setLoading(false)
    }
  }


  return (

    <form
      onSubmit={handleSubmit}
      className="
        space-y-8
      "
    >

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

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

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <Link
            href="/purchase-orders"
            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Link
            href="/"
            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
            "
          >
            <Home className="h-5 w-5" />
          </Link>

          <div>

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {
                purchaseOrder

                  ? "Edit Purchase Order"

                  : "Create Purchase Order"
              }
            </h1>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Procurement planning
              and vendor ordering
            </p>

          </div>

        </div>

      </div>


      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}


      {/* ============================================= */}
      {/* HEADER FIELDS */}
      {/* ============================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
        "
      >

        {/* Vendor */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            Vendor
          </label>

          <select
            required
            value={formData.vendor}
            onChange={(e) =>
              handleChange(
                "vendor",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              text-sm
              dark:border-zinc-800
            dark:bg-zinc-950
            dark:text-white
            "
          >

            <option value="">
              Select Vendor
            </option>

            {vendors.map((vendor) => (

              <option
                key={vendor.id}
                value={vendor.id}
              >
                {vendor.vendor_name}
              </option>
            ))}

          </select>

        </div>


        {/* PO Date */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            PO Date
          </label>

          <input
            type="date"
            required
            value={formData.po_date}
            onChange={(e) =>
              handleChange(
                "po_date",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              text-sm
            "
          />

        </div>
        

        {/* Vendor PR Number */}

        <div className="space-y-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Vendor PR Number
        </label>

        <input

            value={
            formData.vendor_pr_number
            }

            onChange={(e) =>
            handleChange(

                "vendor_pr_number",

                e.target.value
            )
            }

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Lead Days */}

        <div className="space-y-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Lead Days
        </label>

        <input

            type="number"

            min="0"

            value={
            formData.lead_days
            }

            onChange={(e) => {

                const leadDays =
                    Number(
                    e.target.value
                    )

                const poDate = new Date(
                    formData.po_date
                )

                const expectedDate =
                    new Date(poDate)

                expectedDate.setDate(
                    poDate.getDate() +
                    leadDays
                )

                setFormData({

                    ...formData,

                    lead_days: leadDays,

                    expected_delivery_date:
                    formatDate(
                        expectedDate
                    ),
                })
                }}

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Expected Delivery Date */}

        <div className="space-y-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Expected Delivery Date
        </label>

        <input

            type="date"

            value={
            formData
                .expected_delivery_date
            }

            onChange={(e) => {
              
              if (!formData.po_date) {

                handleChange(
                  "expected_delivery_date",
                  e.target.value
                )

                return
              }

              const expectedDate =
                new Date(
                  e.target.value
                )

              const poDate =
                new Date(
                  formData.po_date
                )

              const diffTime =
                expectedDate.getTime()
                -
                poDate.getTime()

              const diffDays =
                Math.max(
                  0,
                  Math.ceil(
                    diffTime /
                    (1000 * 60 * 60 * 24)
                  )
                )

              setFormData({

                ...formData,

                expected_delivery_date:
                  e.target.value,

                lead_days:
                  diffDays,
              })
            }}

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Company GSTIN */}

        <div className="space-y-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Company GSTIN
        </label>

        <input

            value={
            formData.company_gstin
            }

            onChange={(e) =>
            handleChange(

                "company_gstin",

                e.target.value
            )
            }

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Vendor GSTIN */}

        <div className="space-y-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Vendor GSTIN
        </label>

        <input

            value={
            formData.vendor_gstin
            }

            onChange={(e) =>
            handleChange(

                "vendor_gstin",

                e.target.value
            )
            }

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Billing Address */}

        <div className="space-y-2 md:col-span-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Billing Address
        </label>

        <textarea

            rows={4}

            value={
            formData.billing_address
            }

            onChange={(e) =>
            handleChange(

                "billing_address",

                e.target.value
            )
            }

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>


        {/* Shipping Address */}

        <div className="space-y-2 md:col-span-2">

        <label
            className="
            text-sm
            font-medium
            "
        >
            Shipping Address
        </label>

        <textarea

            rows={4}

            value={
            formData.shipping_address
            }

            onChange={(e) =>
            handleChange(

                "shipping_address",

                e.target.value
            )
            }

            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm
            "
        />

        </div>

      </div>


      {/* ============================================= */}
      {/* LINE ITEMS */}
      {/* ============================================= */}

      <div className="space-y-6">

        <div
          className="
            flex
            items-center
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
              Line Items
            </h2>

          </div>

          <button
            type="button"
            onClick={addLine}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              px-4
              py-2
              text-sm
              font-medium
            "
          >

            <Plus className="h-4 w-4" />

            Add Line

          </button>

        </div>


{formData.lines.map(
  (line: any, index: number) => (

    <div
      key={index}
      className="
        rounded-2xl
        border
        p-6
        space-y-6
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-lg
            font-semibold
          "
        >
          Line {index + 1}
        </h3>

        {formData.lines.length > 1 && (

          <button
            type="button"
            onClick={() =>
              removeLine(index)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-300
              px-3
              py-2
              text-sm
              text-red-600
            "
          >

            <Trash2 className="h-4 w-4" />

            Remove

          </button>
        )}

      </div>


      {/* ========================================= */}
      {/* LINE FIELDS */}
      {/* ========================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* MATERIAL SOURCE */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            Material Source
          </label>

          <select

            required

            value={
              line.material_source
            }

            onChange={(e) =>
              handleLineChange(

                index,

                "material_source",

                Number(
                  e.target.value
                )
              )
            }

            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              text-sm
            border-zinc-800
            bg-zinc-950
            text-white
            "
          >

            <option value="">
              Select Material
            </option>

            {materialSources.map(
              (material: any) => (

                <option

                  key={material.id}

                  value={material.id}
                >
                  {material.sm_code}
                  {" - "}
                  {
                    material
                      .raw_material_name
                  }

                </option>
              )
            )}

          </select>

        </div>


        {/* WAREHOUSE */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            Warehouse
          </label>

          <select

            required

            value={line.warehouse}

            onChange={(e) =>
              handleLineChange(

                index,

                "warehouse",

                Number(
                  e.target.value
                )
              )
            }

            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              text-sm
            "
          >

            {warehouses.map(
              (warehouse: any) => (

                <option

                  key={warehouse.id}

                  value={warehouse.id}
                >
                  {
                    warehouse
                      .warehouse_name
                  }
                </option>
              )
            )}

          </select>

        </div>


        {/* ORDERED QUANTITY */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            Ordered Qty
          </label>

          <input

            type="number"

            min="0"

            step="0.0001"

            value={
              line.ordered_quantity
            }

            onChange={(e) =>
              handleLineChange(

                index,

                "ordered_quantity",

                Number(
                  e.target.value
                )
              )
            }

            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              text-sm
            "
          />

        </div>


        {/* UNIT */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-medium
            "
          >
            Unit
          </label>

          <input

            value={line.unit}

            readOnly

            className="
              w-full
              rounded-xl
              border
              bg-zinc-100
              px-4
              py-3
              text-sm
              dark:bg-zinc-900
            "
          />

        </div>

        {/* UNIT COST */}

<div className="space-y-2">

  <label
    className="
      text-sm
      font-medium
    "
  >
        Unit Cost
    </label>

    <input

        type="number"

        min="0"

        step="0.01"

        value={
        line.unit_cost
        }

        onChange={(e) =>
        handleLineChange(

            index,

            "unit_cost",

            Number(
            e.target.value
            )
        )
        }

        className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        "
    />

    </div>


    {/* CGST */}

    <div className="space-y-2">

    <label
        className="
        text-sm
        font-medium
        "
    >
        CGST %
    </label>

    <input

        type="number"

        min="0"

        step="0.01"

        value={
        line.cgst_percent
        }

        onChange={(e) =>
        handleLineChange(

            index,

            "cgst_percent",

            Number(
            e.target.value
            )
        )
        }

        className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        "
    />

    </div>


    {/* SGST */}

    <div className="space-y-2">

    <label
        className="
        text-sm
        font-medium
        "
    >
        SGST %
    </label>

    <input

        type="number"

        min="0"

        step="0.01"

        value={
        line.sgst_percent
        }

        onChange={(e) =>
        handleLineChange(

            index,

            "sgst_percent",

            Number(
            e.target.value
            )
        )
        }

        className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        "
    />

    </div>


    {/* IGST */}

    <div className="space-y-2">

    <label
        className="
        text-sm
        font-medium
        "
    >
        IGST %
    </label>

    <input

        type="number"

        min="0"

        step="0.01"

        value={
        line.igst_percent
        }

        onChange={(e) =>
        handleLineChange(

            index,

            "igst_percent",

            Number(
            e.target.value
            )
        )
        }

        className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        "
    />

    </div>
      
    <div
  className="
    rounded-xl
    border
    bg-zinc-50
    p-4
    dark:bg-zinc-900
  "
>

  <div
    className="
      text-sm
      text-zinc-500
    "
  >
    Line Total
  </div>

  <div
    className="
      mt-1
      text-lg
      font-semibold
    "
  >

    ₹

    {(

      Number(
        line.ordered_quantity || 0
      )

      *

      Number(
        line.unit_cost || 0
      )

      *

      (

        1 +

        (
          Number(
            line.cgst_percent || 0
          )

          +

          Number(
            line.sgst_percent || 0
          )

          +

          Number(
            line.igst_percent || 0
          )
        ) / 100
      )

    ).toFixed(2)}

  </div>

</div>

    {/* REMARKS */}

    <div className="space-y-2 xl:col-span-4">

    <label
        className="
        text-sm
        font-medium
        "
    >
        Line Remarks
    </label>

    <textarea

        rows={3}

        value={
        line.remarks
        }

        onChange={(e) =>
        handleLineChange(

            index,

            "remarks",

            e.target.value
        )
        }

        className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        text-sm
        "
    />

    </div>

      </div>

    </div>
  )
)}
</div>

<div
  className="
    rounded-2xl
    border
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
    Purchase Order Summary
  </h2>

  {(() => {

    const subtotal =

      formData.lines.reduce(

        (
          total,
          line
        ) =>

          total +

          (
            Number(
              line.ordered_quantity || 0
            )

            *

            Number(
              line.unit_cost || 0
            )
          ),

        0
      )

    const taxAmount =

      formData.lines.reduce(

        (
          total,
          line
        ) => {

          const base =

            Number(
              line.ordered_quantity || 0
            )

            *

            Number(
              line.unit_cost || 0
            )

          const taxPercent =

            Number(
              line.cgst_percent || 0
            )

            +

            Number(
              line.sgst_percent || 0
            )

            +

            Number(
              line.igst_percent || 0
            )

          return (

            total +

            (
              base *
              taxPercent /
              100
            )
          )
        },

        0
      )

    const grandTotal =

      subtotal +
      taxAmount

    return (

      <div
        className="
          space-y-2
          text-sm
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

        <div
          className="
            flex
            justify-between
          "
        >
          <span>
            Tax
          </span>

          <span>
            ₹
            {
              taxAmount.toFixed(2)
            }
          </span>
        </div>

        <div
          className="
            flex
            justify-between
            border-t
            pt-3
            text-lg
            font-semibold
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
    )

  })()}

</div>

      {/* ============================================= */}
      {/* SUBMIT */}
      {/* ============================================= */}

      <div
        className="
          flex
          justify-end
        "
      >

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-zinc-900
            px-6
            py-3
            text-sm
            font-medium
            text-white
          "
        >

          {
            loading

              ? "Saving..."

              : purchaseOrder

                ? "Update Purchase Order"

                : "Create Purchase Order"
          }

        </button>

      </div>

    </form>
  )
}


