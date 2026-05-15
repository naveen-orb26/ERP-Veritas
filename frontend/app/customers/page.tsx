import {
  getCustomers,
} from "@/lib/api/customers"

export default async function
CustomersPage() {

  const customers =
    await getCustomers()

  return (

    <div className="p-8 text-white">

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Customers
        </h1>

        <a
          href="/customers/create"

          className="
            bg-white
            text-black
            px-4
            py-2
            rounded-lg
          "
        >
          Add Customer
        </a>

      </div>

      <div
        className="
          border
          border-zinc-800
          rounded-xl
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-zinc-900
            "
          >

            <tr>

              <th className="p-4 text-left">
                Code
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                State
              </th>

              <th className="p-4 text-left">
                GSTIN
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              customers.map(
                (customer: any) => (

                  <tr
                    key={customer.id}

                    className="
                      border-t
                      border-zinc-800
                    "
                  >

                    <td className="p-4">

                      <a
                        href={`/customers/${customer.id}`}

                        className="
                          text-blue-400
                        "
                      >
                        {
                          customer.customer_code
                        }
                      </a>

                    </td>

                    <td className="p-4">
                      {
                        customer.name
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.state
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer
                        .billing_gst_number
                          || "-"
                      }
                    </td>

                    <td className="p-4">

                      <span
                        className={

                          customer.is_active

                            ? `
                                text-green-400
                                font-medium
                              `

                            : `
                                text-red-400
                                font-medium
                              `
                        }
                      >

                        {
                          customer.is_active
                            ? "Active"
                            : "Inactive"
                        }

                      </span>

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  )
}