"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createRawMaterial,
  
  updateRawMaterial,

} from "@/lib/api/raw-materials"


type RawMaterialFormProps = {

  rawMaterial?: any
}


export default function
RawMaterialForm({

  rawMaterial,
}: RawMaterialFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [formData, setFormData] =
    useState({

      material_name:
        rawMaterial?.material_name || "",

      chemical_identity:
        rawMaterial?.chemical_identity || "",

      material_category:
        rawMaterial?.material_category
        || "CHEMICAL",

      base_unit:
        rawMaterial?.base_unit
        || "KG",

      minimum_quantity:
        rawMaterial?.minimum_quantity
        || 0,

      reorder_quantity:
        rawMaterial?.reorder_quantity
        || 0,

      description:
        rawMaterial?.description || "",

      is_active:
        rawMaterial?.is_active ?? true,
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
    async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    setError("")

    try {

      if (rawMaterial) {

      await updateRawMaterial(

        rawMaterial.id,

        formData
      )

    } else {

      await createRawMaterial(
        formData
      )
    }

      router.push(
        "/raw-materials"
      )

      router.refresh()

    } catch (err: any) {

      setError(

        err.message ||

        "Failed to create raw material"
      )

    } finally {

      setLoading(false)
    }
  }


  return (

    <form
      onSubmit={handleSubmit}
      className="
        space-y-6
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
            Material Name
          </label>

          <input
            value={
              formData.material_name
            }
            onChange={(e) =>
              handleChange(
                "material_name",
                e.target.value
              )
            }
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
            Chemical Identity
          </label>

          <input
            value={
              formData.chemical_identity
            }
            onChange={(e) =>
              handleChange(
                "chemical_identity",
                e.target.value
              )
            }
            placeholder="
              Example:
              Acetone / Resin / HDPE
            "
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
              uppercase
              outline-none
              transition
              focus:border-zinc-500
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          />

          <p
            className="
              text-xs
              text-zinc-500
            "
          >
            Used for duplicate detection,
            procurement traceability,
            and automatic material code
            generation.
          </p>

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
            Material Category
          </label>

          <select
            value={
              formData.material_category
            }
            onChange={(e) =>
              handleChange(
                "material_category",
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

            <option value="CHEMICAL">
              Chemical
            </option>

            <option value="PACKAGING">
              Packaging
            </option>

            <option value="CONSUMABLE">
              Consumable
            </option>

            <option value="GENERAL">
              General
            </option>

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
            Base Unit
          </label>

          <select
            value={
              formData.base_unit
            }
            onChange={(e) =>
              handleChange(
                "base_unit",
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

            <option value="KG">
              Kilogram
            </option>

            <option value="GRAM">
              Gram
            </option>

            <option value="LITRE">
              Litre
            </option>

            <option value="ML">
              Millilitre
            </option>

            <option value="PIECE">
              Piece
            </option>

          </select>

        </div>

        <div
          className="
            flex
            items-end
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-blue-200
              bg-blue-50
              px-4
              py-3
              text-sm
              text-blue-700
              dark:border-blue-900
              dark:bg-blue-950/40
              dark:text-blue-300
            "
          >
            Material code will be
            generated automatically.
          </div>

        </div>

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
            Minimum Quantity Alert
          </label>

          <input
            type="number"
            min="0"
            step="0.0001"
            value={
              formData.minimum_quantity
            }
            onChange={(e) =>
              handleChange(
                "minimum_quantity",
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
            Suggested Reorder Quantity
          </label>

          <input
            type="number"
            min="0"
            step="0.0001"
            value={
              formData.reorder_quantity
            }
            onChange={(e) =>
              handleChange(
                "reorder_quantity",
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
          Description
        </label>

        <textarea
          rows={4}
          value={
            formData.description
          }
          onChange={(e) =>
            handleChange(
              "description",
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


      <label
        className="
          inline-flex
          items-center
          gap-3
          text-sm
        "
      >

        <input
          type="checkbox"
          checked={
            formData.is_active
          }
          onChange={(e) =>
            handleChange(
              "is_active",
              e.target.checked
            )
          }
        />

        Active Raw Material

      </label>


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
            ? rawMaterial
              ? "Updating..."
              : "Creating..."
            : rawMaterial
              ? "Update Raw Material"
              : "Create Raw Material"
        }
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/raw-materials"
            )
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