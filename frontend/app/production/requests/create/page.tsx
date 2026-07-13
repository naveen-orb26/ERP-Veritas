import RequestForm
from "@/components/production/request-form"

import {
  getPendingSalesOrderLines,
} from "@/lib/api/production-server"

interface Props {

    searchParams: Promise<{

    salesOrderLine?: string

  }>

}

export default async function
CreateProductionRequestPage({

  searchParams,

}: Props) {

  const salesLines =
    await getPendingSalesOrderLines()

  const {

    salesOrderLine,

  } = await searchParams

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Create Production Request
      </h1>

      <RequestForm

        mode="create"

        salesLines={salesLines}

        initialSalesOrderLine={

          salesOrderLine
            ? Number(
                salesOrderLine
              )
            : undefined

        }

      />

    </div>
  )
}