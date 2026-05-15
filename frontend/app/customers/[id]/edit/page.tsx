import { cookies }
from "next/headers"

import EditCustomerForm
from "@/components/customers/edit-form"

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
EditCustomerPage({
  params,
}: Props) {

  const { id } =
    await params

  const customer =
    await getCustomer(id)

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Edit Customer
      </h1>

      <EditCustomerForm
        customer={customer}
      />

    </div>
  )
}