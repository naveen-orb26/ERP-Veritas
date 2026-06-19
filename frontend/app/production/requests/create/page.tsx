import RequestForm
from "@/components/production/request-form"

import {
  getPendingSalesOrderLines,
} from "@/lib/api/production-server"

export default async function
CreateProductionRequestPage() {

  const salesLines =
    await getPendingSalesOrderLines()

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
      />

    </div>
  )
}