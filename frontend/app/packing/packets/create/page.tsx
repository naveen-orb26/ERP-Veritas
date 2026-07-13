import {
  getInspectionByBatch,
} from "@/lib/api/inspections-server"

import PacketGenerationForm
from "@/components/production/packet-generation-form"

export default async function
PacketCreatePage({
  searchParams,
}: {
  searchParams: Promise<{
    batch?: string
  }>
}) {

  const params =
    await searchParams

  const inspection =
    await getInspectionByBatch(
      params.batch!
    )

  return (

    <PacketGenerationForm

      inspection={
        inspection
      }

    />
  )
}