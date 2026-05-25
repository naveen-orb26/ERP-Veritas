import Link
from "next/link"

import {

  getMaterialSourcesServer,

} from "@/lib/api/material-sources-server"


export default async function
MaterialSourcesPage() {

  const materialSources =
    await getMaterialSourcesServer()

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Material Sources
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-zinc-500
            "
          >
            Vendor-linked procurement
            source mapping for raw
            materials
          </p>

        </div>

        <Link

          href="/material-sources/create"

          className="
            inline-flex
            items-center
            rounded-xl
            bg-zinc-900
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
            dark:bg-white
            dark:text-black
          "
        >
          Create Material Source
        </Link>

      </div>


      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <table
          className="
            w-full
            border-collapse
          "
        >

          <thead>

            <tr
              className="
                border-b
                border-zinc-200
                bg-zinc-50
                dark:border-zinc-800
                dark:bg-zinc-900
              "
            >

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                SM Code
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Raw Material
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Chemical Identity
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Vendor
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Vendor Material Code
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Status
              </th>

              <th
                className="
                  px-4
                  py-3
                "
              />

            </tr>

          </thead>

          <tbody>

            {materialSources.map(
              (source: any) => (

                <tr

                  key={source.id}

                  className="
                    border-b
                    border-zinc-100
                    dark:border-zinc-900
                  "
                >

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                      font-medium
                    "
                  >
                    {
                      source.sm_code
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      source.material_name
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                      text-zinc-500
                    "
                  >
                    {
                      source
                      .chemical_identity
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      source.vendor_name
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-sm
                    "
                  >
                    {
                      source
                      .vendor_material_code
                      || "-"
                    }
                  </td>

                  <td
                    className="
                      px-4
                      py-4
                    "
                  >

                    <div
                      className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        border

                        ${
                          source.is_active
                            ? `
                              border-green-200
                              bg-green-50
                              text-green-700
                              dark:border-green-900
                              dark:bg-green-950/40
                              dark:text-green-300
                            `
                            : `
                              border-red-200
                              bg-red-50
                              text-red-700
                              dark:border-red-900
                              dark:bg-red-950/40
                              dark:text-red-300
                            `
                        }
                      `}
                    >
                      {
                        source.is_active
                          ? "Active"
                          : "Inactive"
                      }
                    </div>

                  </td>

                  <td
                    className="
                      px-4
                      py-4
                      text-right
                    "
                  >

                    <Link

                      href={
                        `/material-sources/${source.id}`
                      }

                      className="
                        text-sm
                        font-medium
                        text-zinc-700
                        hover:underline
                        dark:text-zinc-300
                      "
                    >
                      View
                    </Link>

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