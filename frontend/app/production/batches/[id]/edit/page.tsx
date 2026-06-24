import {
  getBatch,
} from "@/lib/api/batches-server"

import BatchDetail from
  "@/components/production/batch-detail"

 export const dynamic =
  "force-dynamic"
  
  
export default async function
BatchPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await params

  const batch =
    await getBatch(id)

  return (

    <BatchDetail
      batch={batch}
    />
  )
}