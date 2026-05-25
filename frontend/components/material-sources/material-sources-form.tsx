"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createMaterialSource,

  updateMaterialSource,

} from "@/lib/api/material-sources-client"


type MaterialSourceFormProps = {

  materialSource?: any

  rawMaterials: any[]

  vendors: any[]
}


export default function
MaterialSourceForm({

  materialSource,

  rawMaterials,

  vendors,
}: MaterialSourceFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [formData, setFormData] =
    useState({

      raw_material:

        materialSource
          ?.raw_material || "",

      vendor:

        materialSource
          ?.vendor || "",

      vendor_material_code:

        materialSource
          ?.vendor_material_code
          || "",

      remarks:

        materialSource
          ?.remarks || "",

      is_active:

        materialSource
          ?.is_active ?? true,
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

      if (materialSource) {

        await updateMaterialSource(

          materialSource.id,

          formData
        )

      } else {

        await createMaterialSource(
          formData
        )
      }

      router.push(
        "/material-sources"
      )

      router.refresh()

    } catch (err: any) {

      console.error(err)

      setError(

        err.message ||

        "Failed to save material source"
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
            Raw Material
          </label>

          <select
            value={
              formData.raw_material
            }
            onChange={(e) =>
              handleChange(
                "raw_material",
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
          >

            <option value="">
              Select Raw Material
            </option>

            {rawMaterials.map(
              (material: any) => (

                <option

                  key={material.id}

                  value={material.id}
                >
                  {
                    material.material_code
                  }
                  {" · "}
                  {
                    material.material_name
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
            Vendor
          </label>

          <select
            value={
              formData.vendor
            }
            onChange={(e) =>
              handleChange(
                "vendor",
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
            Vendor Material Code
          </label>

          <input
            value={
              formData
              .vendor_material_code
            }
            onChange={(e) =>
              handleChange(
                "vendor_material_code",
                e.target.value
              )
            }
            placeholder="
              Optional vendor-side code
            "
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

          <p
            className="
              text-xs
              text-zinc-500
            "
          >
            Optional vendor-specific
            material identification code.
          </p>

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
            SM code will be generated
            automatically from raw
            material and vendor.
          </div>

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

        Active Material Source

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
              ? materialSource
                ? "Updating..."
                : "Creating..."
              : materialSource
                ? "Update Material Source"
                : "Create Material Source"
          }
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/material-sources"
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