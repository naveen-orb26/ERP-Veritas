import Link
from "next/link"

import VendorForm
from "@/components/vendors/vendor-form"


export default function
NewVendorPage() {

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

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Add Vendor
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          Create procurement supplier
          and sourcing information
        </p>

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

        <VendorForm />

      </div>

    </div>
  )
}