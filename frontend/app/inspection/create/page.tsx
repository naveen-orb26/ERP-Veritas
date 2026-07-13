import InspectionForm
  from "@/components/production/inspection-form"

export default async function
CreateInspectionPage({
  searchParams,
}: {
  searchParams: Promise<{
    batch?: string
  }>
}) {

  const params =
    await searchParams

  return (

    <InspectionForm

      batchId={
        Number(
          params.batch
        )
      }

    />
  )
}