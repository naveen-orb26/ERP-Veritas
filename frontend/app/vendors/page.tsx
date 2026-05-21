import Link
from "next/link"

import {

  getVendors,

} from "@/lib/api/vendors"


export default async function
VendorsPage() {

  const vendors =
    await getVendors()

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
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Vendors
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-zinc-500
            "
          >
            Supplier and procurement
            source management
          </p>

        </div>

        <Link

          href="/vendors/new"

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
          Add Vendor
        </Link>

      </div>

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          dark:border-zinc-800
          bg-white
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
                dark:border-zinc-800
                bg-zinc-50
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
                Vendor Code
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
                Vendor Name
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
                Contact
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

            {vendors.map(
              (vendor: any) => (

                <tr

                  key={vendor.id}

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
                      vendor.vendor_code
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
                      vendor.vendor_name
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
                      vendor.contact_person
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
                          vendor.is_active
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
                        vendor.is_active
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
                        `/vendors/${vendor.id}`
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