import {
  getCustomers,
} from "@/lib/api/customers"

import {
  getProducts,
} from "@/lib/api/products"

export default async function TestPage() {

  const customers =
    await getCustomers()

  const products =
    await getProducts()

  return (

    <div className="p-8 text-white">

      <h1 className="text-2xl font-bold mb-6">
        API Test
      </h1>

      <div className="mb-8">

        <h2 className="text-xl mb-3">
          Customers
        </h2>

        <pre>
          {
            JSON.stringify(
              customers,
              null,
              2
            )
          }
        </pre>

      </div>

      <div>

        <h2 className="text-xl mb-3">
          Products
        </h2>

        <pre>
          {
            JSON.stringify(
              products,
              null,
              2
            )
          }
        </pre>

      </div>

    </div>
  )
}