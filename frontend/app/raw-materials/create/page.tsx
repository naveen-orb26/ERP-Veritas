import RawMaterialCreateForm
from "@/components/raw-materials/create-form"


export default function
CreateRawMaterialPage() {

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Create Raw Material
        </h1>

        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Add a new raw material
          to the master
        </p>

      </div>

      <RawMaterialCreateForm />

    </div>
  )
}