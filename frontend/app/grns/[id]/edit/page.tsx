import Link
from "next/link"

import GRNForm
from "@/components/grns/grn-form"

import {

  getGRNServer,

} from "@/lib/api/grns-server"

import {

  getVendors,

} from "@/lib/api/vendors"

import {

  getMaterialSourcesServer,

} from "@/lib/api/material-sources-server"

import {

  getWarehousesServer,

} from "@/lib/api/warehouses-server"


export default async function
EditGRNPage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const [

    grn,

    vendors,

    materialSources,

    warehouses,

  ] = await Promise.all([

    getGRNServer(id),

    getVendors(),

    getMaterialSourcesServer(),

    getWarehousesServer(),
  ])

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <Link

        href={`/grns/${id}`}

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
        ← Back to GRN
      </Link>

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Edit GRN
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          {grn.grn_number}
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

        <GRNForm

          grn={grn}

          vendors={vendors}

          materialSources={
            materialSources
          }

          warehouses={warehouses}
        />

      </div>

    </div>
  )
}