import {
  getJobCard,
} from "@/lib/api/job-cards-server"

import JobCardDetail from
  "@/components/production/job-card-detail"

export default async function
JobCardEditPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await params

  const jobCard =
    await getJobCard(id)

  return (

    <JobCardDetail
      jobCard={jobCard}
    />
  )
}