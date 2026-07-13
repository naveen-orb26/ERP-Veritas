import RequestForm
from "@/components/production/request-form"

import {

  getPendingSalesOrderLines,

  getProductionRequest,

} from "@/lib/api/production-server"

export default async function
EditProductionRequestPage({

  params,

}: {

  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const [

    request,

    salesLines,

  ] = await Promise.all([

    getProductionRequest(id),

    getPendingSalesOrderLines(),
  ])

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >

        View Production Request

      </h1>

      <RequestForm

        mode="edit"

        initialData={request}

        salesLines={salesLines}

         fromSalesOrder={
          request.source_type === "SALES_ORDER"
        }

      />

    </div>
  )
}