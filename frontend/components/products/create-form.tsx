"use client"

import {
  useRouter,
} from "next/navigation"

import {
  useState,
} from "react"

const API_BASE_URL =
  process.env
    .NEXT_PUBLIC_API_BASE_URL

export default function
CreateProductForm() {

  const router =
    useRouter()

  const [
    isSubmitting,

    setIsSubmitting

  ] = useState(false)

  const [
    imagePreview,

    setImagePreview

  ] = useState<string | null>(
    null
  )

  const [
    errors,

    setErrors

  ] = useState<any>({})

  const [
    formData,

    setFormData

  ] = useState({

    sr_number: "",

    product_name: "",

    description: "",

    category: "",

    size_or_variant: "",

    color: "",

    base_unit: "PCS",

    units_per_base_unit: 1,

    default_units_per_packet: 1,

    hsn_code: "",

    gst_percentage: 18,

    reorder_level: "",

    image: null as File | null,

    is_active: true,
  })

  function
  renderError(
    field: string
  ) {

    if (!errors[field]) {
      return null
    }

    return (

      <p
        className="
          text-red-400
          text-sm
          mt-2
        "
      >

        {
          Array.isArray(
            errors[field]
          )

            ? errors[field][0]

            : errors[field]
        }

      </p>
    )
  }

  async function
  handleSubmit() {

    setIsSubmitting(true)

    setErrors({})

    const validationErrors:
      any = {}

    if (
      !formData
      .sr_number
      .trim()
    ) {

      validationErrors
        .sr_number = [

        "SR Number is required"
      ]
    }

    if (
      !formData
      .product_name
      .trim()
    ) {

      validationErrors
        .product_name = [

        "Product name is required"
      ]
    }

    if (
      !formData
      .category
      .trim()
    ) {

      validationErrors
        .category = [

        "Category is required"
      ]
    }

    if (
      !formData
      .size_or_variant
      .trim()
    ) {

      validationErrors
        .size_or_variant = [

        "Specification is required"
      ]
    }

    if (
      !formData
      .color
      .trim()
    ) {

      validationErrors
        .color = [

        "Color is required"
      ]
    }

    if (
      !formData
      .hsn_code
      .trim()
    ) {

      validationErrors
        .hsn_code = [

        "HSN Code is required"
      ]
    }

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

    try {

      const payload =
        new FormData()

      payload.append(
        "sr_number",
        formData.sr_number
      )

      payload.append(
        "product_name",
        formData.product_name
      )

      payload.append(
        "description",
        formData.description
      )

      payload.append(
        "category",
        formData.category
      )

      payload.append(
        "size_or_variant",
        formData
          .size_or_variant
      )

      payload.append(
        "color",
        formData.color
      )

      payload.append(
        "base_unit",
        formData.base_unit
      )

      payload.append(
        "units_per_base_unit",
        String(
          formData
            .units_per_base_unit
        )
      )

      payload.append(
        "default_units_per_packet",

        String(
          formData
            .default_units_per_packet
        )
      )

      payload.append(
        "hsn_code",
        formData.hsn_code
      )

      payload.append(
        "gst_percentage",

        String(
          formData
            .gst_percentage
        )
      )

      if (
        formData.reorder_level !==
        ""
      ) {

        payload.append(

          "reorder_level",

          String(
            formData
              .reorder_level
          )
        )
      }

      payload.append(
        "is_active",

        String(
          formData.is_active
        )
      )

      if (formData.image) {

        payload.append(
          "image",
          formData.image
        )
      }

      const response =
        await fetch(

          `${API_BASE_URL}/api/products/`,

          {
            method: "POST",

            credentials:
              "include",

            body: payload,
          }
        )

      const data =
        await response.json()

      if (!response.ok) {

        setErrors(data)

        setIsSubmitting(false)

        return
      }

      router.push(
        "/products"
      )

      router.refresh()

    } catch {

      setErrors({

        non_field_errors: [

          "Something went wrong. Please try again."
        ]
      })

    } finally {

      setIsSubmitting(false)
    }
  }

  return (

    <div
      className="
        max-w-6xl
        mx-auto
        space-y-8
      "
    >

      {/* HEADER */}

      <div>

        <h2
          className="
            text-2xl
            font-semibold
            text-white
          "
        >
          Product Information
        </h2>

        <p
          className="
            text-zinc-400
            mt-2
          "
        >
          Create and manage
          product master data.
        </p>

      </div>

      {/* IDENTITY + IMAGE */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        <div
          className="
            lg:col-span-2
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            space-y-6
          "
        >

          <h3
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Identity
          </h3>

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
                  text-zinc-300
                  mb-2
                "
              >
                SR Number
              </label>

              <input
                type="text"

                value={
                  formData
                    .sr_number
                }

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    sr_number:
                      e.target.value,
                  })
                }

                className="
                  w-full
                  bg-zinc-950
                  border
                  border-zinc-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-zinc-500
                "
              />

              {
                renderError(
                  "sr_number"
                )
              }

            </div>

            <div>

              <label
                className="
                  block
                  text-sm
                  text-zinc-300
                  mb-2
                "
              >
                Product Name
              </label>

              <input
                type="text"

                value={
                  formData
                    .product_name
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
                  bg-zinc-950
                  border
                  border-zinc-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-zinc-500
                "
              />

              {
                renderError(
                  "product_name"
                )
              }

            </div>

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Description
            </label>

            <textarea

              rows={5}

              value={
                formData
                  .description
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
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

          </div>

        </div>

        {/* IMAGE */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            flex
            flex-col
            items-center
            justify-center
            gap-4
          "
        >

          <div
            className="
              w-28
              h-28
              rounded-xl
              border
              border-zinc-700
              overflow-hidden
              bg-zinc-950
              flex
              items-center
              justify-center
            "
          >

            {
              imagePreview ? (

                <img
                  src={imagePreview}

                  alt="Preview"

                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <span
                  className="
                    text-zinc-500
                    text-sm
                  "
                >
                  No Image
                </span>
              )
            }

          </div>

          <label
            className="
              cursor-pointer
              bg-zinc-800
              hover:bg-zinc-700
              transition
              px-4
              py-2
              rounded-lg
              text-sm
              text-white
            "
          >
            Upload Image

            <input
              type="file"

              accept="image/*"

              hidden

              onChange={(e) => {

                const file =
                  e.target.files?.[0]

                if (!file) {
                  return
                }

                setFormData({

                  ...formData,

                  image: file,
                })

                setImagePreview(

                  URL.createObjectURL(
                    file
                  )
                )
              }}
            />

          </label>

        </div>

      </div>

      {/* PRODUCT SPECIFICATION */}

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

        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Product Specification
        </h3>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Category
            </label>

            <input
              type="text"

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
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

            {
              renderError(
                "category"
              )
            }

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Specification
            </label>

            <input
              type="text"

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
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

            {
              renderError(
                "size_or_variant"
              )
            }

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Color
            </label>

            <input
              type="text"

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
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

            {
              renderError(
                "color"
              )
            }

          </div>

        </div>

      </div>

      {/* MEASUREMENT */}

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

        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Measurement
        </h3>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
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
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            >

              <option value="PCS">
                Pieces
              </option>

              <option value="GROSS">
                Gross
              </option>

              <option value="METER">
                Meter
              </option>

              <option value="ROLL">
                Roll
              </option>

              <option value="SET">
                Set
              </option>

            </select>

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Units Per Base Unit
            </label>

            <input
              type="number"

              value={
                formData
                  .units_per_base_unit
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  units_per_base_unit:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Default Units Per Packet
            </label>

            <input
              type="number"

              value={
                formData
                  .default_units_per_packet
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  default_units_per_packet:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

          </div>

        </div>

      </div>

      {/* COMMERCIAL */}

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

        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Commercial
        </h3>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              HSN Code
            </label>

            <input
              type="text"

              value={
                formData.hsn_code
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  hsn_code:
                    e.target.value,
                })
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

            {
              renderError(
                "hsn_code"
              )
            }

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              GST Percentage
            </label>

            <input
              type="number"

              value={
                formData
                  .gst_percentage
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  gst_percentage:
                    Number(
                      e.target.value
                    ),
                })
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

          </div>

          <div>

            <label
              className="
                block
                text-sm
                text-zinc-300
                mb-2
              "
            >
              Reorder Level
            </label>

            <input
              type="number"

              value={
                formData
                  .reorder_level
              }

              onChange={(e) =>
                setFormData({

                  ...formData,

                  reorder_level:
                    e.target.value,
                })
              }

              className="
                w-full
                bg-zinc-950
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-zinc-500
              "
            />

          </div>

        </div>

      </div>

      {/* STATUS */}

      <div
        className="
          flex
          items-center
          gap-3
          px-1
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

        <label
          className="
            text-zinc-300
          "
        >
          Active Product
        </label>

      </div>

      {
        errors
          .non_field_errors && (

          <div
            className="
              bg-red-500/10
              border
              border-red-500/20
              text-red-300
              px-4
              py-3
              rounded-xl
            "
          >

            {
              errors
                .non_field_errors[0]
            }

          </div>
        )
      }

      <div
        className="
          flex
          justify-end
          pt-2
        "
      >

        <button
          type="button"

          onClick={
            handleSubmit
          }

          disabled={
            isSubmitting
          }

          className="
            bg-white
            hover:bg-zinc-200
            transition
            text-black
            px-8
            py-3
            rounded-xl
            font-medium
            disabled:opacity-50
          "
        >

          {
            isSubmitting

              ? "Creating Product..."

              : "Create Product"
          }

        </button>

      </div>

    </div>
  )
}