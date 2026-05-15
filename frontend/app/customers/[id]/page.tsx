import { cookies }
from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

async function
getCustomer(
  id: string
) {

  const cookieStore =
    await cookies()

  const response =
    await fetch(

      `${API_BASE_URL}/api/customers/${id}/`,

      {
        cache: "no-store",

        headers: {
          Cookie:
            cookieStore.toString(),
        },
      }
    )

  if (!response.ok) {

    throw new Error(
      "Failed to fetch customer"
    )
  }

  return response.json()
}

interface Props {

  params: Promise<{
    id: string
  }>
}

export default async function
CustomerDetailPage({
  params,
}: Props) {

  const { id } =
    await params

  const customer =
    await getCustomer(id)

  return (

    <div className="p-8 text-white">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            {
              customer.name
            }
          </h1>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            {
              customer.customer_code
            }
          </p>

        </div>

        <a
          href={`/customers/${id}/edit`}

          className="
            bg-white
            text-black
            px-4
            py-2
            rounded-lg
          "
        >
          Edit Customer
        </a>

      </div>

      {/* DETAILS */}

      <div
        className="
          grid
          grid-cols-2
          gap-6
        "
      >

        <div
          className="
            border
            border-zinc-800
            rounded-xl
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >
            Business Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>
                Customer Type:
              </strong>{" "}
              {
                customer.customer_type
              }
            </p>

            <p>
              <strong>
                State:
              </strong>{" "}
              {
                customer.state
              }
            </p>

            <p>
              <strong>
                PAN:
              </strong>{" "}
              {
                customer.pan_number
              }
            </p>

            <p>
              <strong>
                Billing GST:
              </strong>{" "}
              {
                customer
                .billing_gst_number
              }
            </p>

            <p>
              <strong>
                Shipping GST:
              </strong>{" "}
              {
                customer
                .shipping_gst_number
              }
            </p>

            <p>
              <strong>
                Credit Terms:
              </strong>{" "}
              {
                customer.credit_terms
              }
            </p>

          </div>

        </div>

        <div
          className="
            border
            border-zinc-800
            rounded-xl
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >
            Address Details
          </h2>

          <div className="space-y-5">

            <div>

              <h3
                className="
                  font-medium
                  mb-2
                "
              >
                Billing Address
              </h3>

              <p
                className="
                  text-zinc-300
                "
              >
                {
                  customer
                  .billing_address
                }
              </p>

            </div>

            <div>

              <h3
                className="
                  font-medium
                  mb-2
                "
              >
                Shipping Address
              </h3>

              <p
                className="
                  text-zinc-300
                "
              >
                {
                  customer
                  .shipping_address
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}