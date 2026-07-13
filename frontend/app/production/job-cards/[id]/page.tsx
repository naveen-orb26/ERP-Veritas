import JobCardDetail from "@/components/production/tracking/job-card/job-card-detail"

import {
  getJobCard,
} from "@/lib/api/production-server"

interface Props {

  params: Promise<{
    id: string
  }>

}

export default async function JobCardPage({

  params,

}: Props) {

  const { id } = await params

  const jobCard = await getJobCard(id)

  return (

    <JobCardDetail

      jobCard={jobCard}

    />

  )

}