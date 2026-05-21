import {

  getDevelopmentSample,

} from "@/lib/api/sampling-server"

import DevelopmentSampleEditForm
from "@/components/development-samples/edit-form"


export default async function
EditDevelopmentSamplePage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const sample =
    await getDevelopmentSample(id)

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Edit Development Sample
        </h1>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          Update development
          and sampling information
        </p>

      </div>

      <DevelopmentSampleEditForm
        sample={sample}
      />

    </div>
  )
}