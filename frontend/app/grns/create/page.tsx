import Link
from "next/link"

import GRNForm
from "@/components/grns/grn-form"

import {

  getVendors,

} from "@/lib/api/vendors"

import {

  getMaterialSourcesServer,

} from "@/lib/api/material-sources-server"

import {

  getWarehousesServer,

} from "@/lib/api/warehouses-server"

import {

  getPurchaseOrderServer,

} from "@/lib/api/purchase-orders-server"

type Props = {

    searchParams: Promise<{
      po?: string
    }>
  }

  export default async function
  CreateGRNPage({

    searchParams,
  }: Props) {
    
  const { po } =
  await searchParams

  let purchaseOrder = null

  if (po) {

    purchaseOrder =

      await getPurchaseOrderServer(
        po
      )
  }

  const [

    vendors,

    materialSources,

    warehouses,

  ] = await Promise.all([

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

        href="/grns"

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
        ← Back to GRNs
      </Link>

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Create GRN
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          Record incoming raw
          material receipts and
          update inventory
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

          purchaseOrder={
            purchaseOrder
          }

          vendors={
            vendors
          }

          materialSources={
            materialSources
          }

          warehouses={
            warehouses
          }
        />

      </div>

    </div>
  )
}