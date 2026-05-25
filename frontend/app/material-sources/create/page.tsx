import Link
from "next/link"

import MaterialSourceForm
from "@/components/material-sources/material-sources-form"

import {

  getRawMaterialsServer,

} from "@/lib/api/raw-materials-server"

import {

  getVendors,

} from "@/lib/api/vendors"


export default async function
CreateMaterialSourcePage() {

  const [

    rawMaterials,

    vendors,

  ] = await Promise.all([

    getRawMaterialsServer(),

    getVendors(),
  ])

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <Link

        href="/material-sources"

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
        ← Back to Material Sources
      </Link>

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Create Material Source
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          Link vendors with raw
          materials for procurement
          and inventory traceability
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

        <MaterialSourceForm

          rawMaterials={
            rawMaterials
          }

          vendors={
            vendors
          }
        />

      </div>

    </div>
  )
}