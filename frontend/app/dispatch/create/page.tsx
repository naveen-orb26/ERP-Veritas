import {
  getSalesOrders,
} from "@/lib/api/sales-server"

import DispatchForm
from "@/components/dispatch/dispatch-form"

interface Props {

  searchParams: Promise<{

    salesOrder?: string

  }>
}

export default async function
CreateDispatchPage({

  searchParams,

}: Props) {

  const params =
    await searchParams

  const salesOrders =
    await getSalesOrders()

  return (

    <DispatchForm

      salesOrders={
        salesOrders
      }

      initialSalesOrderId={
        params.salesOrder
          ? Number(
              params.salesOrder
            )
          : null
      }

    />

  )
}