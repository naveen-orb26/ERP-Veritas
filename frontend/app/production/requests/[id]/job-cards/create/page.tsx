import JobCardForm
from "@/components/production/job-card-form"

import {
  getProductionRequest,
} from "@/lib/api/job-cards-server"

export default async function
CreateJobCardPage({

  params,

}: {

  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const request =
    await getProductionRequest(id)

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

        Create Job Card

      </h1>

      <JobCardForm
        request={request}
      />

    </div>
  )
}