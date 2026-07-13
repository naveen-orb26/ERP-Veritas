import JobCardForm
from "@/components/production/job-card-form"

import {
  getProductionRequest,
} from "@/lib/api/job-cards-server"

interface Props{

  searchParams:Promise<{

    productionRequest?:string

  }>

}

export default async function
CreateJobCardPage({

  searchParams,

}:Props){

  const{

    productionRequest,

  }=await searchParams

  if(!productionRequest){

    throw new Error(

      "Production Request ID is required."

    )

  }

  const request=

    await getProductionRequest(

      productionRequest

    )

  return(

    <div
      className="p-8 text-white"
    >

      <h1
        className="mb-8 text-3xl font-bold"
      >

        Create Job Card

      </h1>

      <JobCardForm
        request={request}
      />

    </div>

  )

}