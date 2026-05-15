import {
  getCustomers,
} from "@/lib/api/customers"

import {
  getProducts,
} from "@/lib/api/products"

import CreateSalesOrderForm
  from "@/components/sales/create-form"

export default async function
CreateSalesOrderPage() {

  const customers =
    await getCustomers()

  const products =
    await getProducts()

  return (

    <CreateSalesOrderForm
      customers={customers}
      products={products}
    />
  )
}