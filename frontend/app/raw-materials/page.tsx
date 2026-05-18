import Link from "next/link"

import {

  getRawMaterials,

} from "@/lib/api/raw-materials-server"


export default async function
RawMaterialsPage() {

  const rawMaterials =
    await getRawMaterials()

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
            Raw Materials
          </h1>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Manage raw material
            master records
          </p>

        </div>

        <Link

          href="/raw-materials/create"

          className="
            px-4
            py-2
            rounded-lg
            bg-black
            text-white
            text-sm
          "
        >
          Add Raw Material
        </Link>

      </div>

      <div
        className="
          overflow-x-auto
          border
          rounded-xl
        "
      >

        <table
          className="
            min-w-full
            text-sm
          "
        >

          <thead
            className="
              bg-gray-100
            "
          >

            <tr>

              <th className="p-3 text-left">
                Code
              </th>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Base Unit
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {rawMaterials.map(
              (item: any) => (

                <tr
                  key={item.id}
                  className="
                    border-t
                  "
                >

                  <td className="p-3">
                    <Link

                        href={
                        `/raw-materials/${item.id}`
                        }

                        className="
                        text-blue-600
                        hover:underline
                        dark:text-blue-400
                        "
                    >
                        {item.material_code}
                    </Link>

                    </td>

                  <td className="p-3">
                    {item.material_name}
                  </td>

                  <td className="p-3">
                    {item.material_category}
                  </td>

                  <td className="p-3">
                    {item.base_unit}
                  </td>

                  <td className="p-3">

                    {item.is_active
                      ? "Active"
                      : "Inactive"}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}