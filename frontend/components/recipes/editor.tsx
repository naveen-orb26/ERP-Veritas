"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createRecipe,

  updateRecipe,

} from "@/lib/api/recipes"


export default function
RecipeEditor({

  sample,

  recipe,

  rawMaterials,
}: {

  sample: any

  recipe: any

  rawMaterials: any[]
}) 
{

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
  useState("")

  const [notes, setNotes] =
    useState(
      recipe?.notes || ""
    )

  const [items, setItems] =
    useState(

      recipe?.items?.length
        ? recipe.items
        : [

            {

              raw_material: "",

              quantity: "",

              unit: "",

              remarks: "",
            },
          ]
    )


  const isApproved =
    sample.status ===
    "APPROVED"
  function addRow() {

    setItems([

      ...items,

      {

        raw_material: "",

        quantity: "",

        unit: "",

        remarks: "",
      },
    ])
  }


  function removeRow(
    index: number
  ) {

    const updated = [...items]

    updated.splice(index, 1)

    setItems(updated)
  }


  function updateRow(

    index: number,

    field: string,

    value: any
  ) {

    const updated = [...items]

    updated[index] = {

      ...updated[index],

      [field]: value,
    }

    setItems(updated)
  }
  async function handleSave() {
    setError("")

    if (!items.length) {

      setError(
        "At least one ingredient is required."
      )

      return
    }

    for (const item of items) {

      if (!item.raw_material) {

        setError(
          "Raw material is required."
        )

        return
      }

      if (!item.quantity) {

        setError(
          "Quantity is required."
        )

        return
      }

      if (
        Number(item.quantity) <= 0
      ) {

        setError(
          "Quantity must be greater than zero."
        )

        return
      }

      if (!item.unit) {

        setError(
          "Unit is required."
        )

        return
      }
    }
    try {

      setLoading(true)

      const payload = {

        development_sample:
          sample.id,

        notes,

        items,
      }

      if (recipe) {

        await updateRecipe(

          recipe.id.toString(),

          payload
        )

        setError("")

        router.refresh()

      } else {

        await createRecipe(
          payload
        )

        router.push(
          `/development-samples/${sample.id}?recipe_created=1`
        )
      }

    } catch (error) {

      console.error(error)

      console.error(error)

      if (error instanceof Error) {

        setError(error.message)

      } else {

        setError(
          "Failed to save recipe"
        )
      }

    } finally {

      setLoading(false)
    }
  }
    return (
    
    <div className="space-y-4">

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
    <div className="space-y-6">

      <div
        className="
          border
          rounded-2xl
          p-6
          shadow-sm
          space-y-4
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Recipe Notes
          </h2>

        </div>

        <textarea

          value={notes}

          disabled={isApproved}

          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }

          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            min-h-[120px]
            bg-white
            dark:bg-zinc-900
          "
        />

      </div>
            <div
        className="
          border
          rounded-2xl
          p-6
          shadow-sm
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

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Ingredients
            </h2>

          </div>

          {!isApproved && (

            <button

              type="button"

              onClick={addRow}

              className="
                px-4
                py-2
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
              "
            >
              Add Row
            </button>
          )}

        </div>
                <div className="space-y-4">
                  {!items.length && (

                  <div
                    className="
                      border
                      border-dashed
                      rounded-2xl
                      p-10
                      text-center
                      text-sm
                      text-zinc-500
                    "
                  >
                    No ingredients added yet.
                  </div>
                )}
          {items.map(

            (
              item: any,

              index: number
            ) => (

              <div

                key={index}

                className="
                grid
                grid-cols-1
                md:grid-cols-5
                gap-4
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-2xl
                p-5
                bg-white/60
                dark:bg-zinc-950/40
                shadow-sm
              "
              >

                <select

                disabled={isApproved}

                value={
                  item.raw_material || ""
                }

                onChange={(e) =>
                  updateRow(

                    index,

                    "raw_material",

                    e.target.value
                  )
                }

                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-3
                  py-2
                  bg-white
                  dark:bg-zinc-900
                  text-sm
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
                      {" | "}
                      {
                        material.material_name
                      }

                    </option>
                  )
                )}

              </select>

                <input

                  type="number"

                  placeholder="Quantity"

                  disabled={isApproved}

                  value={
                    item.quantity
                  }

                  onChange={(e) =>
                    updateRow(

                      index,

                      "quantity",

                      e.target.value
                    )
                  }

                  className="
                    border
                    rounded-xl
                    px-3
                    py-2
                    bg-white
                    dark:bg-zinc-900
                  "
                />

                <select

                  disabled={isApproved}

                  value={item.unit || ""}

                  onChange={(e) =>
                    updateRow(

                      index,

                      "unit",

                      e.target.value
                    )
                  }

                  className="
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-xl
                    px-3
                    py-2
                    bg-white
                    dark:bg-zinc-900
                    text-sm
                  "
                >

                  <option value="">
                    Select Unit
                  </option>

                  <option value="KG">
                    KG
                  </option>

                  <option value="GRAM">
                    Gram
                  </option>

                  <option value="LITRE">
                    Litre
                  </option>

                  <option value="ML">
                    ML
                  </option>

                  <option value="CC">
                    CC
                  </option>

                </select>

                <input

                  type="text"

                  placeholder="Remarks"

                  disabled={isApproved}

                  value={
                    item.remarks
                  }

                  onChange={(e) =>
                    updateRow(

                      index,

                      "remarks",

                      e.target.value
                    )
                  }

                  className="
                    border
                    rounded-xl
                    px-3
                    py-2
                    bg-white
                    dark:bg-zinc-900
                  "
                />
                                {!isApproved && (

                  <button

                    type="button"

                    onClick={() =>
                      removeRow(index)
                    }

                    className="
                      rounded-xl
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-3
                      py-2
                    "
                  >
                    Remove
                  </button>
                )}

              </div>
            )
          )}

        </div>

      </div>
            {!isApproved && (

        <div
          className="
            flex
            justify-end
          "
        >

          <button

            type="button"

            disabled={loading}

            onClick={handleSave}

            className="
              px-6
              py-3
              rounded-xl
              bg-green-600
              hover:bg-green-700
              text-white
              font-medium
            "
          >

            {loading
              ? "Saving..."
              : recipe
              ? "Update Recipe"
              : "Create Recipe"}

          </button>

        </div>
      )}

    </div>
    </div>
  )
}