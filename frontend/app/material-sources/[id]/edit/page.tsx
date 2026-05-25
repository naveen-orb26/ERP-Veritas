import Link
from "next/link"

import MaterialSourceForm
from "@/components/material-sources/material-sources-form"

import {

  getMaterialSourceServer,

} from "@/lib/api/material-sources-server"

import {

  getRawMaterialsServer,

} from "@/lib/api/raw-materials-server"

import {

  getVendors,

} from "@/lib/api/vendors"


export default async function
EditMaterialSourcePage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const [

    materialSource,

    rawMaterials,

    vendors,

  ] = await Promise.all([

    getMaterialSourceServer(id),

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

        href={
          `/material-sources/${id}`
        }

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
        ← Back to Material Source
      </Link>

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Edit Material Source
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          {
            materialSource.sm_code
          }
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

          materialSource={
            materialSource
          }

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