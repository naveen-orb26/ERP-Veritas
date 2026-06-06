"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createGRN,

  updateGRN,

} from "@/lib/api/grns-client"


type GRNFormProps = {

  grn?: any

  purchaseOrder?: any

  vendors: any[]

  materialSources: any[]

  warehouses: any[]
}


export default function
GRNForm({

  grn,

  purchaseOrder,

  vendors,

  materialSources,

  warehouses,
}: GRNFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  const [formData, setFormData] =
    useState({

      vendor:
        grn?.vendor || purchaseOrder?.vendor || "",

      purchase_order:

        grn?.purchase_order

        ||

        purchaseOrder?.id

        ||

        "",

      po_number:
        grn?.po_number || purchaseOrder?.po_number || purchaseOrder?.po_number || "",

      invoice_number:
        grn?.invoice_number || "",

      invoice_date:
        grn?.invoice_date || "",

      received_by:
        grn?.received_by || "",

      remarks:
        grn?.remarks || "",

      lines:

  grn?.lines

  ||

  purchaseOrder?.lines?.map(
    (line: any) => ({

        warehouse:
          line.warehouse_id
          ||
          line.warehouse,

        material_source:
          line.material_source_id
          ||
          line.material_source,

        received_quantity: 0,

        received_unit:
          line.unit,

        unit_cost:
          Number(
            line.unit_cost
          ),

        tax_percent:

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
          ),

        tax_amount: 0,

        batch_reference: "",

        remarks: "",
      })
    )

    ||

    [

      {

        warehouse:
          warehouses?.[0]?.id || "",

        material_source: "",

        received_quantity: 0,

        received_unit: "",

        unit_cost: 0,

        tax_percent: 0,

        tax_amount: 0,

        batch_reference: "",

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

          warehouse:
            warehouses?.[0]?.id || "",

          material_source: "",

          received_quantity: 0,

          received_unit: "KG",

          unit_cost: 0,

          tax_percent: 0,

          tax_amount: 0,

          batch_reference: "",

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

      if (grn) {

        await updateGRN(

          grn.id,

          formData
        )

      } else {

        await createGRN(
          formData
        )
      }

      router.push("/grns")

      router.refresh()

    } catch (err: any) {

      console.error(err)

      setError(

        err.message ||

        "Failed to save GRN"
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
            dark:border-red-900
            dark:bg-red-950/40
            dark:text-red-300
          "
        >
          {error}
        </div>
      )}
            <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
        "
      >

        <div
          className="
            space-y-2
          "
        >

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
            value={
              formData.vendor
            }
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
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >

            <option value="">
              Select Vendor
            </option>

            {vendors.map(
              (vendor: any) => (

                <option

                  key={vendor.id}

                  value={vendor.id}
                >
                  {
                    vendor.vendor_code
                  }
                  {" · "}
                  {
                    vendor.vendor_name
                  }
                </option>
              )
            )}

          </select>

        </div>


        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              font-medium
            "
          >
            PO Number
          </label>

          <input
            value={
              formData.po_number
            }
            onChange={(e) =>
              handleChange(
                "po_number",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          />

        </div>

      </div>


      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-3
        "
      >

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              font-medium
            "
          >
            Invoice Number
          </label>

          <input
            value={
              formData.invoice_number
            }
            onChange={(e) =>
              handleChange(
                "invoice_number",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          />

        </div>


        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              font-medium
            "
          >
            Invoice Date
          </label>

          <input
            type="date"
            value={
              formData.invoice_date
            }
            onChange={(e) =>
              handleChange(
                "invoice_date",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          />

        </div>


        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-sm
              font-medium
            "
          >
            Received By
          </label>

          <input
            value={
              formData.received_by
            }
            onChange={(e) =>
              handleChange(
                "received_by",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          />

        </div>

      </div>
            <div
        className="
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

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            GRN Lines
          </h2>

          <button
            type="button"
            onClick={addLine}
            className="
              rounded-xl
              border
              border-zinc-300
              px-4
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-800
              dark:hover:bg-zinc-900
            "
          >
            + Add Line
          </button>

        </div>


        <div
          className="
            space-y-6
          "
        >

          {formData.lines.map(

            (
              line: any,
              index: number
            ) => {

              const lineTotal =

                (
                  Number(
                    line.received_quantity
                  )
                  *
                  Number(
                    line.unit_cost
                  )
                )
                +
                Number(
                  line.tax_amount
                )

              return (

                <div

                  key={index}

                  className="
                    rounded-2xl
                    border
                    border-zinc-200
                    bg-white
                    p-6
                    space-y-6
                    dark:border-zinc-800
                    dark:bg-zinc-950
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
                        text-sm
                        font-semibold
                      "
                    >
                      Line #{index + 1}
                    </h3>

                    {formData.lines.length > 1 && (

                      <button
                        type="button"
                        onClick={() =>
                          removeLine(index)
                        }
                        className="
                          text-sm
                          text-red-600
                          hover:underline
                        "
                      >
                        Remove
                      </button>
                    )}

                  </div>


                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-6
                      md:grid-cols-2
                    "
                  >

                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Warehouse
                      </label>

                      <select
                        value={
                          line.warehouse
                        }
                        onChange={(e) =>
                          handleLineChange(

                            index,

                            "warehouse",

                            e.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      >

                        {warehouses.map(
                          (warehouse: any) => (

                            <option

                              key={
                                warehouse.id
                              }

                              value={
                                warehouse.id
                              }
                            >
                              {
                                warehouse
                                .warehouse_code
                              }
                              {" · "}
                              {
                                warehouse
                                .warehouse_name
                              }
                            </option>
                          )
                        )}

                      </select>

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Material Source
                      </label>

                      <select
                        value={
                          line.material_source
                        }
                        onChange={(e) => {

                      const materialSourceId =
                        Number(
                          e.target.value
                        )

                      const selectedMaterialSource =

                        materialSources.find(

                          (item) =>

                            item.id ===
                            materialSourceId
                        )

                      const updatedLines = [
                        ...formData.lines
                      ]

                      updatedLines[index] = {

                        ...updatedLines[index],

                        material_source:
                          materialSourceId,

                        received_unit:

                          selectedMaterialSource
                            ?.base_unit || "",
                      }

                      setFormData({

                        ...formData,

                        lines: updatedLines,
                      })
                    }}
                        required
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      >

                        <option value="">
                          Select Material Source
                        </option>

                        {materialSources.map(
                          (source: any) => (

                            <option

                              key={source.id}

                              value={source.id}
                            >
                              {
                                source.sm_code
                              }
                              {" · "}
                              {
                                source.material_name
                              }
                              {" · "}
                              {
                                source.vendor_name
                              }
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>
                                    <div
                    className="
                      grid
                      grid-cols-1
                      gap-6
                      md:grid-cols-4
                    "
                  >

                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Received Quantity
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={
                          line.received_quantity
                        }
                        onChange={(e) =>
                          handleLineChange(

                            index,

                            "received_quantity",

                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Unit
                      </label>

                      <input

                        value={
                          line.received_unit
                        }

                        readOnly

                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

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
                        step="0.0001"
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
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Tax %
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          line.tax_percent
                        }
                        onChange={(e) => {

                            const taxPercent =
                                Number(
                                e.target.value
                                )

                            const taxAmount =

                                (
                                Number(
                                    line.received_quantity
                                )
                                *
                                Number(
                                    line.unit_cost
                                )
                                *
                                taxPercent
                                )
                                / 100

                            const updatedLines = [
                                ...formData.lines
                            ]

                            updatedLines[index] = {

                                ...updatedLines[index],

                                tax_percent:
                                taxPercent,

                                tax_amount:
                                taxAmount,
                            }

                            setFormData({

                                ...formData,

                                lines: updatedLines,
                            })
                            }}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      />

                    </div>

                  </div>


                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-6
                      md:grid-cols-3
                    "
                  >

                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Batch Reference
                      </label>

                      <input
                        value={
                          line.batch_reference
                        }
                        onChange={(e) =>
                          handleLineChange(

                            index,

                            "batch_reference",

                            e.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-300
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-zinc-500
                          dark:border-zinc-800
                          dark:bg-zinc-950
                        "
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Tax Amount
                      </label>

                      <input
                        readOnly
                        value={
                          Number(
                            line.tax_amount
                          ).toFixed(2)
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-200
                          bg-zinc-100
                          px-4
                          py-3
                          text-sm
                          dark:border-zinc-800
                          dark:bg-zinc-900
                        "
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                      "
                    >

                      <label
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Line Total
                      </label>

                      <input
                        readOnly
                        value={
                          lineTotal.toFixed(2)
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-zinc-200
                          bg-zinc-100
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          dark:border-zinc-800
                          dark:bg-zinc-900
                        "
                      />

                    </div>

                  </div>


                  <div
                    className="
                      space-y-2
                    "
                  >

                    <label
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      Remarks
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
                        border-zinc-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-zinc-500
                        dark:border-zinc-800
                        dark:bg-zinc-950
                      "
                    />

                  </div>

                </div>
              )
            }
          )}

        </div>

      </div>


      <div
        className="
          space-y-2
        "
      >

        <label
          className="
            text-sm
            font-medium
          "
        >
          GRN Remarks
        </label>

        <textarea
          rows={4}
          value={
            formData.remarks
          }
          onChange={(e) =>
            handleChange(
              "remarks",
              e.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-zinc-300
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            focus:border-zinc-500
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        />

      </div>


      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-zinc-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
            disabled:opacity-50
            dark:bg-white
            dark:text-black
          "
        >
          {
            loading
              ? grn
                ? "Updating..."
                : "Creating..."
              : grn
                ? "Update GRN"
                : "Create GRN"
          }
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/grns")
          }
          className="
            rounded-xl
            border
            border-zinc-300
            px-5
            py-3
            text-sm
            font-medium
            transition
            hover:bg-zinc-100
            dark:border-zinc-800
            dark:hover:bg-zinc-900
          "
        >
          Cancel
        </button>

      </div>

    </form>
  )
}