"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  updateRawMaterial,

} from "@/lib/api/raw-materials"


export default function
RawMaterialEditForm({

  rawMaterial,
}: {
  rawMaterial: any
}) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [errors, setErrors] =
  useState<any>({})

  const [formData, setFormData] =
    useState({

      material_code:
        rawMaterial.material_code,

      material_name:
        rawMaterial.material_name,

      material_category:
        rawMaterial.material_category,

      base_unit:
        rawMaterial.base_unit,

      description:
        rawMaterial.description || "",

      is_active:
        rawMaterial.is_active,
    })


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault()

    const validationErrors: any = {}

        if (!formData.material_code) {

        validationErrors.material_code =
            "Material code is required"
        }

        if (!formData.material_name) {

        validationErrors.material_name =
            "Material name is required"
        }

        if (
        Object.keys(
            validationErrors
        ).length > 0
        ) {

        setErrors(validationErrors)

        return
        }

setErrors({})

    try {

      setLoading(true)

      await updateRawMaterial(

        rawMaterial.id,

        formData
      )

      router.push(
        `/raw-materials`
      )

    } catch (error) {

      console.error(error)

      alert(
        "Failed to update raw material"
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
        max-w-2xl
      "
    >

      <div>

        <label
          className="
            block
            text-sm
            mb-1
          "
        >
          Material Code
        </label>

        <input

          type="text"

          value={
            formData.material_code
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              material_code:
                e.target.value,
            })
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
          "

        />
        {errors.material_code && (

            <p
                className="
                text-red-500
                text-sm
                mt-1
                "
            >
                {errors.material_code}
            </p>
            )}

      </div>

      <div>

        <label
          className="
            block
            text-sm
            mb-1
          "
        >
          Material Name
        </label>

        <input

          type="text"

          value={
            formData.material_name
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              material_name:
                e.target.value,
            })
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
          "

          
        />
        {errors.material_name && (

            <p
                className="
                text-red-500
                text-sm
                mt-1
                "
            >
                {errors.material_name}
            </p>
            )}

      </div>
            <div>

        <label
          className="
            block
            text-sm
            mb-1
          "
        >
          Category
        </label>

        <select

          value={
            formData.material_category
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              material_category:
                e.target.value,
            })
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            bg-white
            text-black
            dark:bg-zinc-900
            dark:text-white
            dark:border-zinc-700
          "
        >

          <option value="GENERAL">
            General
          </option>

          <option value="CHEMICAL">
            Chemical
          </option>

          <option value="PACKAGING">
            Packaging
          </option>

          <option value="CONSUMABLE">
            Consumable
          </option>

        </select>

      </div>

      <div>

        <label
          className="
            block
            text-sm
            mb-1
          "
        >
          Base Unit
        </label>

        <select

          value={
            formData.base_unit
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              base_unit:
                e.target.value,
            })
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            bg-white
            text-black
            dark:bg-zinc-900
            dark:text-white
            dark:border-zinc-700
          "
        >

          <option value="KG">
            KG
          </option>

          <option value="GRAM">
            GRAM
          </option>

          <option value="LITRE">
            LITRE
          </option>

          <option value="ML">
            ML
          </option>

          <option value="PIECE">
            PIECE
          </option>

        </select>

      </div>
      <div>

        <label
          className="
            block
            text-sm
            mb-1
          "
        >
          Description
        </label>

        <textarea

          value={
            formData.description
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              description:
                e.target.value,
            })
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            min-h-[120px]
          "
        />

      </div>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <input

          type="checkbox"

          checked={
            formData.is_active
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              is_active:
                e.target.checked,
            })
          }
        />

        <label>
          Active
        </label>

      </div>

      <button

        type="submit"

        disabled={loading}

        className="
          px-5
          py-2
          rounded-lg
          bg-zinc-900
          text-white
          dark:bg-white
          dark:text-black
        "
      >

        {loading
          ? "Updating..."
          : "Update Raw Material"}

      </button>

    </form>
  )
}
