import Link from "next/link"

import {

  getDevelopmentSamples,

} from "@/lib/api/sampling-server"


export default async function
DevelopmentSamplesPage() {

  const samples =
    await getDevelopmentSamples()

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
            Development Samples
          </h1>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Manage product
            developments and
            sampling workflows
          </p>

        </div>

        <Link

          href="/development-samples/create"

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
          Create Sample
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
              dark:bg-zinc-900
            "
          >

            <tr>

              <th className="p-3 text-left">
                Reference
              </th>

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Color
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {samples.map(
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
                        `/development-samples/${item.id}`
                      }

                      className="
                        text-blue-600
                        hover:underline
                        dark:text-blue-400
                      "
                    >
                      {
                        item.reference_code
                      }
                    </Link>

                  </td>

                  <td className="p-3">

                    {
                      item.product_name
                    }

                  </td>

                  <td className="p-3">

                    {
                      item.category
                    }

                  </td>

                  <td className="p-3">

                    {
                      item.color
                    }

                  </td>

                                    <td className="p-3">

                    <span
                      className="
                        px-2
                        py-1
                        rounded-md
                        text-xs
                        bg-zinc-200
                        dark:bg-zinc-800
                      "
                    >
                      {item.status}
                    </span>

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