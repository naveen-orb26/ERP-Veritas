  "use client"

  import { useState } from "react"
  import { useRouter } from "next/navigation"

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL

  export default function
  CreateCustomerForm() {

    const router =
      useRouter()

    const [
      isSubmitting,
      setIsSubmitting,
    ] = useState(false)

    const [
      errors,
      setErrors,
    ] = useState<any>({})

    const [
      formData,
      setFormData,
    ] = useState({

      customer_code: "",

      name: "",

      billing_gst_number: "",

      shipping_gst_number: "",

      pan_number: "",

      customer_type: "",

      state: "",

      billing_address: "",

      shipping_address: "",

      contact_numbers: [],

      contact_emails: [],

      credit_terms: "",
    })

    async function handleSubmit() {
      setIsSubmitting(true)

      setErrors({})

      const validationErrors: any = {}

      if (!formData.customer_code?.trim()) {

        validationErrors.customer_code =
          ["Customer code is required"]
      }

      if (!formData.name?.trim()) {

        validationErrors.name =
          ["Customer name is required"]
      }

      if (!formData.state?.trim()) {

        validationErrors.state =
          ["State is required"]
      }

      if (
        !formData.billing_gst_number?.trim()
      ) {

        validationErrors
          .billing_gst_number =

          ["Billing GSTIN is required"]
      }

      if (
        !formData.shipping_gst_number?.trim()
      ) {

        validationErrors
          .shipping_gst_number =

          ["Shipping GSTIN is required"]
      }

      if (
        !formData.billing_address?.trim()
      ) {

        validationErrors
          .billing_address =

          ["Billing address is required"]
      }

      if (
        !formData.shipping_address?.trim()
      ) {

        validationErrors
          .shipping_address =

          ["Shipping address is required"]
      }

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {

        setErrors(validationErrors)

        setIsSubmitting(false)

        return
      }

      try {

        const response =
          await fetch(

            `${API_BASE_URL}/api/customers/`,

            {
              method: "POST",

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

        const data =
          await response.json()

        if (!response.ok) {

          setErrors(data)

          return
        }

        router.push(
          `/customers/${data.id}`
        )

        router.refresh()

      } catch {

        setErrors({
          non_field_errors: []
        })
        

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

          {
            renderError(
              "customer_code"
            )
          }

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

          {
            renderError("name")
          }

        </div>

        {/* BILLING GST */}

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
            py-2
          "
        />
        {
          errors.billing_gst_number && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >

              {
                errors
                .billing_gst_number
              }

            </p>
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
            py-2
          "
        />
        {
          errors.shipping_gst_number && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >

              {
                errors
                .shipping_gst_number
              }

            </p>
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

          {
            renderError(
              "pan_number"
            )
          }

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

          {
            renderError(
              "customer_type"
            )
          }

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

          {
            renderError("state")
          }

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

        {
          errors.billing_address && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >

              {
                errors
                .billing_address
              }

            </p>
          )
        }

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

        {
          errors.shipping_address && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >

              {
                errors
                .shipping_address
              }

            </p>
          )
        }

      </div>

        {/* CREDIT TERMS */}

        <div>

          <label className="block mb-2">
            Credit Terms
          </label>

          <input
            type="text"

            value={
              formData.credit_terms
            }

            onChange={(e) =>
              setFormData({
                ...formData,
                credit_terms:
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
              "credit_terms"
            )
          }

        </div>

        {/* NON FIELD ERRORS */}

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
              ? "Creating Customer..."
              : "Create Customer"
          }

        </button>

      </div>
    )
  }