"use client"

import { useMemo }
from "react"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createDevelopmentSample,

} from "@/lib/api/sampling"


export default function
DevelopmentSampleCreateForm() {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [errors, setErrors] =
    useState<any>({})

  const [formData, setFormData] =
    useState({

      mid_code: "",

      product_name: "",

      description: "",

      category: "",

      size_or_variant: "",

      color: "",

      base_unit: "GROSS",

      units_per_base_unit: 144,

      customer_name: "",

      remarks: "",
    })


  const referencePreview =
    useMemo(() => {

      if (!formData.mid_code) {

        return "VRT-XXX-###"
      }

      return (
        `VRT-${
          formData.mid_code
        }-###`
      )

    }, [
      formData.mid_code
    ])


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault()

    const validationErrors: any = {}

    if (!formData.mid_code) {

      validationErrors.mid_code =
        "Mid code is required"
    }

    if (!formData.product_name) {

      validationErrors.product_name =
        "Product name is required"
    }

    if (!formData.category) {

      validationErrors.category =
        "Category is required"
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

      const response =
        await createDevelopmentSample(
          formData
        )

      router.push(

        `/development-samples/${response.id}`
      )

    } catch (error) {

      console.error(error)

      alert(
        "Failed to create sample"
      )

    } finally {

      setLoading(false)
    }
  }
    return (

    <form
      onSubmit={handleSubmit}
      className="
        max-w-5xl
        space-y-8
      "
    >

      <div
        className="
          border
          rounded-2xl
          p-6
          bg-gradient-to-br
          from-zinc-100
          to-zinc-50
          dark:from-zinc-900
          dark:to-zinc-950
          shadow-sm
        "
      >

        <p
          className="
            text-sm
            text-zinc-500
            mb-2
          "
        >
          Development Reference
        </p>

        <h2
          className="
            text-3xl
            font-bold
            tracking-wide
          "
        >
          {referencePreview}
        </h2>

        <p
          className="
            text-sm
            mt-3
            text-zinc-500
          "
        >
          Sequence number will be
          automatically generated
          after creation.
        </p>

      </div>
            <div
        className="
          border
          rounded-2xl
          p-6
          space-y-6
          shadow-sm
        "
      >

        <div>

          <h3
            className="
              text-lg
              font-semibold
            "
          >
            Identity Information
          </h3>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Primary development
            classification details
          </p>

        </div>

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
                text-sm
                mb-1
              "
            >
              Mid Code
            </label>

            <input

              type="text"

              placeholder="BTN"

              value={
                formData.mid_code
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  mid_code:
                    e.target.value
                      .toUpperCase(),
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

            {errors.mid_code && (

              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {errors.mid_code}
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

            <input

              type="text"

              placeholder="Button"

              value={
                formData.category
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  category:
                    e.target.value,
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

            {errors.category && (

              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {errors.category}
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
              Product Name
            </label>

            <input

              type="text"

              placeholder="Pearl Button"

              value={
                formData.product_name
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  product_name:
                    e.target.value,
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

            {errors.product_name && (

              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {
                  errors.product_name
                }
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
              Color
            </label>

            <input

              type="text"

              placeholder="White Pearl"

              value={
                formData.color
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  color:
                    e.target.value,
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

          </div>
                    <div>

            <label
              className="
                block
                text-sm
                mb-1
              "
            >
              Size / Variant
            </label>

            <input

              type="text"

              placeholder="18L-4H"

              value={
                formData
                  .size_or_variant
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  size_or_variant:
                    e.target.value,
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

          </div>

        </div>

      </div>
            <div
        className="
          border
          rounded-2xl
          p-6
          space-y-6
          shadow-sm
        "
      >

        <div>

          <h3
            className="
              text-lg
              font-semibold
            "
          >
            Commercial Details
          </h3>

        </div>

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
                rounded-xl
                px-4
                py-3
                bg-white
                text-black
                dark:bg-zinc-900
                dark:text-white
                dark:border-zinc-700
              "
            >

              <option value="PCS">
                PCS
              </option>

              <option value="GROSS">
                GROSS
              </option>

              <option value="METER">
                METER
              </option>

              <option value="ROLL">
                ROLL
              </option>

              <option value="SET">
                SET
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
              Customer Name
            </label>

            <input

              type="text"

              placeholder="Optional"

              value={
                formData.customer_name
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  customer_name:
                    e.target.value,
                })
              }

              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-white
                dark:bg-zinc-900
              "
            />

          </div>

        </div>

      </div>
            <div
        className="
          border
          rounded-2xl
          p-6
          space-y-6
          shadow-sm
        "
      >

        <div>

          <h3
            className="
              text-lg
              font-semibold
            "
          >
            Notes & Remarks
          </h3>

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
              rounded-xl
              px-4
              py-3
              min-h-[140px]
              bg-white
              dark:bg-zinc-900
            "
          />

        </div>

        <div>

          <label
            className="
              block
              text-sm
              mb-1
            "
          >
            Remarks
          </label>

          <textarea

            value={
              formData.remarks
            }

            onChange={(e) =>
              setFormData({

                ...formData,

                remarks:
                  e.target.value,
              })
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

      </div>

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
            px-6
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            transition
          "
        >

          {loading
            ? "Creating..."
            : "Create Development Sample"}

        </button>

      </div>

    </form>
  )
}
