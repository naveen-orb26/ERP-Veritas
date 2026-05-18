import RawMaterialEditForm
from "@/components/raw-materials/edit-form"

import {

  getRawMaterial,

} from "@/lib/api/raw-materials-server"


export default async function
EditRawMaterialPage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const rawMaterial =
    await getRawMaterial(id)

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Edit Raw Material
        </h1>

        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Update raw material
          information
        </p>

      </div>

      <RawMaterialEditForm
        rawMaterial={rawMaterial}
      />

    </div>
  )
}