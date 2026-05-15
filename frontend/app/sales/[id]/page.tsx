import {

  getSalesOrder,

} from "@/lib/api/sales-server"

import SalesDetailView
from "@/components/sales/detail-view"

export default async function
SalesOrderDetailPage({

  params,

}: any) {

  const resolvedParams =
    await params

  const salesOrder =
    await getSalesOrder(
      resolvedParams.id
    )

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <SalesDetailView
        salesOrder={salesOrder}
      />

    </div>
  )
}