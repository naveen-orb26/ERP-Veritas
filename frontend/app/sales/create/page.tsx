import CreateSalesForm
from "@/components/sales/create-form"


import {

  getCustomers,

} from "@/lib/api/customers"

import {

  getProducts,

} from "@/lib/api/products"



export default async function
CreateSalesPage() {

  const customers =
    await getCustomers()

  const products =
    await getProducts()

  const companyState =
  "Karnataka"

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Create Sales Order
        </h1>

        <p
          className="
            text-zinc-400
            mt-2
          "
        >
          SR-driven sales order
          creation and delivery
          planning.
        </p>

      </div>

      <CreateSalesForm

        customers={customers}

        products={products}

        companyState={
          companyState
        }
      />

    </div>
  )
}