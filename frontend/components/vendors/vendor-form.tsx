"use client"

import { useState }
from "react"

import { useRouter }
from "next/navigation"

import {

  createVendor,

  updateVendor,

} from "@/lib/api/vendors-client"


type VendorFormProps = {

  vendor?: any
}


export default function
VendorForm({

  vendor,
}: VendorFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [formData, setFormData] =
    useState({

        vendor_code:
            vendor?.vendor_code || "",

        vendor_name:
            vendor?.vendor_name || "",

        vendor_type:
            vendor?.vendor_type || "TRADER",

        gstin:
            vendor?.gstin || "",

        payment_terms_days:
            vendor?.payment_terms_days || 0,

        contacts:
            vendor?.contacts || [

            {

                name: "",

                designation: "",

                phone: "",

                email: "",

                is_primary: true,
            }
            ],

        address:
            vendor?.address || "",

        state:
            vendor?.state || "",

        country:
            vendor?.country || "India",

        remarks:
            vendor?.remarks || "",

        is_active:
            vendor?.is_active ?? true,
        })
      async function
  handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    setError("")

    try {

      if (vendor) {

        await updateVendor(

          vendor.id,

          formData
        )

      } else {

        await createVendor(
          formData
        )
      }

      router.push("/vendors")

      router.refresh()

    } catch (err: any) {

      setError(

        err.message ||

        "Something went wrong"
      )

    } finally {

      setLoading(false)
    }
  }


  function handleChange(

    field: string,

    value: any
  ) {

    setFormData({

      ...formData,

      [field]: value,
    })
  }

    function updateContact(

    index: number,

    field: string,

    value: any
  ) {

    const updatedContacts = [

      ...formData.contacts
    ]

    updatedContacts[index] = {

      ...updatedContacts[index],

      [field]: value,
    }

    setFormData({

      ...formData,

      contacts:
        updatedContacts,
    })
  }


  function addContact() {

    setFormData({

      ...formData,

      contacts: [

        ...formData.contacts,

        {

          name: "",

          designation: "",

          phone: "",

          email: "",

          is_primary: false,
        }
      ],
    })
  }


  function removeContact(
    index: number
  ) {

    const updatedContacts =
      formData.contacts.filter(

        (_: any, i: number) =>
          i !== index
      )

    setFormData({

      ...formData,

      contacts:
        updatedContacts,
    })
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
        Vendor Name
        </label>

        <input
        value={
            formData.vendor_name
        }
        onChange={(e) =>
            handleChange(
            "vendor_name",
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
        Vendor Type
        </label>

        <select
        value={
            formData.vendor_type
        }
        onChange={(e) =>
            handleChange(
            "vendor_type",
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

        <option value="MANUFACTURER">
            Manufacturer
        </option>

        <option value="DISTRIBUTOR">
            Distributor
        </option>

        <option value="TRADER">
            Trader
        </option>

        <option value="IMPORTER">
            Importer
        </option>

        </select>

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
        GSTIN
        </label>

        <input
        value={
            formData.gstin
        }
        onChange={(e) =>
            handleChange(
            "gstin",
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
        Payment Terms (Days)
        </label>

        <input
        type="number"
        value={
            formData.payment_terms_days
        }
        onChange={(e) =>
            handleChange(
            "payment_terms_days",
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
                State
                </label>

                <input
                value={
                    formData.state
                }
                onChange={(e) =>
                    handleChange(
                    "state",
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
            Country
            </label>

            <input
            value={
                formData.country
            }
            onChange={(e) =>
                handleChange(
                "country",
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
            Remarks
            </label>

            <input
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
            Address
        </label>

        <textarea
            rows={4}
            value={
            formData.address
            }
            onChange={(e) =>
            handleChange(
                "address",
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
            space-y-4
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
                Contacts
            </h2>

            <p
                className="
                text-sm
                text-zinc-500
                "
            >
                Procurement and communication
                contact details
            </p>

            </div>

            <button
            type="button"
            onClick={addContact}
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
            + Add Contact
            </button>

        </div>

        <div
            className="
            space-y-4
            "
        >

            {formData.contacts.map(

            (
                contact: any,

                index: number
            ) => (

                <div

                key={index}

                className="
                    rounded-2xl
                    border
                    border-zinc-200
                    p-4
                    dark:border-zinc-800
                "
                >

                <div
                    className="
                    mb-4
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
                    Contact {index + 1}
                    </h3>

                    {formData.contacts.length > 1 && (

                    <button
                        type="button"
                        onClick={() =>
                        removeContact(index)
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
                    gap-4
                    md:grid-cols-2
                    "
                >

                    <input
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) =>
                        updateContact(

                        index,

                        "name",

                        e.target.value
                        )
                    }
                    className="
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

                    <input
                    placeholder="Designation"
                    value={
                        contact.designation
                    }
                    onChange={(e) =>
                        updateContact(

                        index,

                        "designation",

                        e.target.value
                        )
                    }
                    className="
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

                    <input
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) =>
                        updateContact(

                        index,

                        "phone",

                        e.target.value
                        )
                    }
                    className="
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

                    <input
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) =>
                        updateContact(

                        index,

                        "email",

                        e.target.value
                        )
                    }
                    className="
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
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    "
                >

                    <input
                    type="checkbox"
                    checked={
                        contact.is_primary
                    }
                    onChange={(e) =>
                        updateContact(

                        index,

                        "is_primary",

                        e.target.checked
                        )
                    }
                    />

                    Primary Contact

                </label>

                </div>
            )
            )}

        </div>

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

        Active Vendor

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
              ? "Saving..."
              : vendor
                ? "Update Vendor"
                : "Create Vendor"
          }
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/vendors"
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