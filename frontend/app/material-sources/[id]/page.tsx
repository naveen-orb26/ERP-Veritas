import Link
from "next/link"

import {

  getMaterialSourceServer,

} from "@/lib/api/material-sources-server"


export default async function
MaterialSourceDetailPage({

  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const materialSource =
    await getMaterialSourceServer(id)

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      <Link

        href="/material-sources"

        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-zinc-200
          px-4
          py-2
          text-sm
          transition
          hover:bg-zinc-100
          dark:border-zinc-800
          dark:hover:bg-zinc-900
        "
      >
        ← Back to Material Sources
      </Link>

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

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {
                materialSource
                .material_name
              }
            </h1>

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
                  materialSource
                  .is_active

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
                materialSource
                .is_active
                  ? "Active"
                  : "Inactive"
              }
            </div>

          </div>

          <p
            className="
              mt-2
              text-sm
              text-zinc-500
            "
          >
            {
              materialSource.sm_code
            }
          </p>

        </div>

        <Link

          href={
            `/material-sources/${id}/edit`
          }

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
          Edit Material Source
        </Link>

      </div>


      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Raw Material
          </h2>

          <div
            className="
              space-y-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Material Code
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  materialSource
                  .material_code
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Chemical Identity
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  materialSource
                  .chemical_identity
                }
              </p>

            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
            "
          >
            Vendor Information
          </h2>

          <div
            className="
              space-y-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Vendor
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  materialSource
                  .vendor_name
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-zinc-500
                "
              >
                Vendor Material Code
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                "
              >
                {
                  materialSource
                  .vendor_material_code
                  || "-"
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      <div
        className="
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-6
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >

        <h2
          className="
            mb-4
            text-lg
            font-semibold
          "
        >
          Remarks
        </h2>

        <p
          className="
            text-sm
            leading-6
            text-zinc-600
            dark:text-zinc-300
          "
        >
          {
            materialSource.remarks
            || "No remarks provided."
          }
        </p>

      </div>

    </div>
  )
}