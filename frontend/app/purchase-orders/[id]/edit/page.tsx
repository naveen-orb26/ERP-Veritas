import {

  notFound,

  redirect,

} from "next/navigation"

import PurchaseOrderForm
from "@/components/purchase-orders/purchase-order-form"

import {

  getPurchaseOrderServer,

} from "@/lib/api/purchase-orders-server"

import {

  getVendors,

} from "@/lib/api/vendors"

import {

  getMaterialSourcesServer,

} from "@/lib/api/material-sources-server"

import {

  getWarehousesServer,

} from "@/lib/api/warehouses-server"


type Props = {

  params: Promise<{
    id: string
  }>
}


export default async function
EditPurchaseOrderPage({

  params,
}: Props) {

  const { id } =
    await params

  const [

    purchaseOrder,

    vendors,

    materialSources,

    warehouses,

  ] = await Promise.all([

    getPurchaseOrderServer(id),

    getVendors(),

    getMaterialSourcesServer(),

    getWarehousesServer(),
  ])


  if (!purchaseOrder) {

    notFound()
  }


  if (

    purchaseOrder.status ===
      "APPROVED"

    ||

    purchaseOrder.status ===
      "CANCELLED"

    ||

    purchaseOrder.status ===
      "CLOSED"
  ) {

    redirect(
      `/purchase-orders/${id}`
    )
  }

  return (

    <div
      className="
        p-6
      "
    >

      <PurchaseOrderForm

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
  )
}