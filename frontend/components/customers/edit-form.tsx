"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {

  customer: any
}

export default function
EditCustomerForm({
  customer,
}: Props) {

  const router =
    useRouter()

  const [isSubmitting,
    setIsSubmitting] =
      useState(false)

  const [errors,
    setErrors] =
      useState<any>({})

  const [formData,
    setFormData] =
      useState({

        customer_code:
          customer.customer_code || "",

        name:
          customer.name || "",

        billing_gst_number:
          customer.billing_gst_number || "",

        shipping_gst_number:
          customer.shipping_gst_number || "",

        pan_number:
          customer.pan_number || "",

        customer_type:
          customer.customer_type || "",

        state:
          customer.state || "",

        billing_address:
          customer.billing_address || "",

        shipping_address:
          customer.shipping_address || "",

        contact_numbers:
          customer.contact_numbers || [],

        contact_emails:
          customer.contact_emails || [],

        credit_terms:
          customer.credit_terms || "",

        is_active:
          customer.is_active,
      })

    async function
    handleSubmit() {

      try {

        setIsSubmitting(true)

        setErrors({})

        const response =
          await fetch(

            `${API_BASE_URL}/api/customers/${customer.id}/`,

            {
              method: "PATCH",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                formData
              ),
            }
          )

        if (!response.ok) {

          const errorData =
            await response.json()

          setErrors(errorData)

          return
        }

        router.push(
          "/customers"
        )

        router.refresh()

      } catch (error) {

        console.error(error)

      } finally {

        setIsSubmitting(false)
      }
    }


  function
  renderError(field: string) {

    if (!errors[field]) {
      return null
    }

    return (

      <p
        className="
          text-red-500
          text-sm
          mt-2
        "
      >

        {
          Array.isArray(errors[field])
            ? errors[field][0]
            : errors[field]
        }

      </p>
    )
  }


  return (

    <div
      className="
        border
        border-zinc-800
        rounded-xl
        p-8
        space-y-6
      "
    >

      {/* CUSTOMER CODE */}

      <div>

        <label className="block mb-2">
          Customer Code
        </label>

        <input
          type="text"

          value={
            formData.customer_code
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              customer_code:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

      </div>

      {/* NAME */}

      <div>

        <label className="block mb-2">
          Customer Name
        </label>

        <input
          type="text"

          value={
            formData.name
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

      </div>

      {/* GST */}

      <div>

        <label className="block mb-2">
          Billing GSTIN
        </label>

        <input
          type="text"

          value={
            formData
            .billing_gst_number
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              billing_gst_number:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

        {
          renderError(
            "billing_gst_number"
          )
        }

      </div>

      {/* SHIPPING GST */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            mb-2
          "
        >

          <label>
            Shipping GSTIN
          </label>

          <button
            type="button"

            onClick={() =>
              setFormData({

                ...formData,

                shipping_gst_number:
                  formData
                    .billing_gst_number,
              })
            }

            className="
              text-sm
              text-blue-400
              underline
            "
          >

            Same as Billing GSTIN

          </button>

        </div>

        <input
          type="text"

          value={
            formData
              .shipping_gst_number
          }

          onChange={(e) =>
            setFormData({

              ...formData,

              shipping_gst_number:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

        {
          renderError(
            "shipping_gst_number"
          )
        }

      </div>


      {/* PAN */}

      <div>

        <label className="block mb-2">
          PAN Number
        </label>

        <input
          type="text"

          value={
            formData.pan_number
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              pan_number:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

      </div>

      {/* CUSTOMER TYPE */}

      <div>

        <label className="block mb-2">
          Customer Type
        </label>

        <select

          value={
            formData.customer_type
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              customer_type:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        >

          <option value="">
            Select Type
          </option>

          <option value="RETAIL">
            Retail
          </option>

          <option value="WHOLESALE">
            Wholesale
          </option>

          <option value="DISTRIBUTOR">
            Distributor
          </option>

          <option value="OEM">
            OEM
          </option>

          <option value="EXPORT">
            Export
          </option>

          <option value="INSTITUTIONAL">
            Institutional
          </option>

          <option value="OTHERS">
            Others
          </option>

        </select>

      </div>

      {/* STATE */}

      <div>

        <label className="block mb-2">
          State
        </label>

        <input
          type="text"

          value={
            formData.state
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              state:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

      </div>

      {/* BILLING ADDRESS */}

      <div>

        <label className="block mb-2">
          Billing Address
        </label>

        <textarea

          value={
            formData
            .billing_address
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              billing_address:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

      </div>


      {/* SHIPPING ADDRESS */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            mb-2
          "
        >

          <label>
            Shipping Address
          </label>

          <button
            type="button"

            onClick={() =>
              setFormData({

                ...formData,

                shipping_address:
                  formData
                    .billing_address,
              })
            }

            className="
              text-sm
              text-blue-400
              underline
            "
          >

            Same as Billing Address

          </button>

        </div>

        <textarea

          rows={4}

          value={
            formData
            .shipping_address
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              shipping_address:
                e.target.value,
            })
          }

          className="
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            px-4
            py-3
          "
        />

        {
          renderError(
            "shipping_address"
          )
        }

      </div>
      {/* ACTIVE */}

      <div
        className="
          flex
          items-center
          gap-3
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
          Active Customer
        </label>

      </div>

      {/* SUBMIT */}

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
        "
      >

        {
          isSubmitting
            ? "Updating..."
            : "Update Customer"
        }

      </button>

    </div>
  )
}