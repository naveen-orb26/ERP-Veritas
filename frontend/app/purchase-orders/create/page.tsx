import PurchaseOrderForm
from "@/components/purchase-orders/purchase-order-form"

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
CreatePurchaseOrderPage() {

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
      "
    >

      <PurchaseOrderForm

        vendors={vendors}

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