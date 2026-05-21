import Link
from "next/link"

import {

  getVendor,

} from "@/lib/api/vendors"

import VendorForm
from "@/components/vendors/vendor-form"


export default async function
VendorDetailPage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const vendor =
    await getVendor(id)

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <Link

        href="/vendors"

        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-zinc-200
          px-4
          py-2
          text-sm
          transition
          hover:bg-zinc-100
          dark:border-zinc-800
          dark:hover:bg-zinc-900
        "
      >
        ← Back to Vendors
      </Link>

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {
                vendor.vendor_name
              }
            </h1>

            <div
              className={`
                inline-flex
                items-center
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                border

                ${
                  vendor.is_active
                    ? `
                      border-green-200
                      bg-green-50
                      text-green-700
                      dark:border-green-900
                      dark:bg-green-950/40
                      dark:text-green-300
                    `
                    : `
                      border-red-200
                      bg-red-50
                      text-red-700
                      dark:border-red-900
                      dark:bg-red-950/40
                      dark:text-red-300
                    `
                }
              `}
            >
              {
                vendor.is_active
                  ? "Active"
                  : "Inactive"
              }
            </div>

          </div>

          <p
            className="
              mt-2
              text-sm
              text-zinc-500
            "
          >
            {
              vendor.vendor_code
            }
            {" · "}
            {
              vendor.vendor_type
            }
          </p>

        </div>

      </div>

      <div
        className="
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-6
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <VendorForm
          vendor={vendor}
        />

      </div>

    </div>
  )
}