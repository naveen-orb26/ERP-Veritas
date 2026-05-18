import Link from "next/link"

import {

  getRawMaterial,

} from "@/lib/api/raw-materials-server"


export default async function
RawMaterialDetailPage({

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

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            {rawMaterial.material_name}
          </h1>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {
              rawMaterial.material_code
            }
          </p>

        </div>

        <Link

          href={
            `/raw-materials/${id}/edit`
          }

          className="
            px-4
            py-2
            rounded-lg
            bg-zinc-900
            text-white
            dark:bg-white
            dark:text-black
          "
        >
          Edit
        </Link>

      </div>
      <div
        className="
          border
          rounded-xl
          p-6
          space-y-5
        "
      >

        <div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Material Category
          </p>

          <p className="mt-1">

            {
              rawMaterial
                .material_category
            }

          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Base Unit
          </p>

          <p className="mt-1">

            {
              rawMaterial.base_unit
            }

          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Description
          </p>

          <p className="mt-1">

            {
              rawMaterial.description
                || "-"
            }

          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Status
          </p>

          <p className="mt-1">

            {
              rawMaterial.is_active
                ? "Active"
                : "Inactive"
            }

          </p>

        </div>

      </div>

    </div>
  )
}
