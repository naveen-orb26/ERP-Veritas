import {

  getSalesOrder,

} from "@/lib/api/sales-server"

import EditForm
from "@/components/sales/edit-form"

import {
  getProducts,
} from "@/lib/api/products"

interface Props {

  params: Promise<{

    id: string

  }>

}

export default async function
EditSalesOrderPage({

  params,

}: Props) {

  const { id } =
    await params

  const [

    order,

    products,

  ] = await Promise.all([

    getSalesOrder(id),

    getProducts(),

  ])

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >

        Edit Sales Order

      </h1>

      <EditForm
        order={order}
        products={products}
      />

    </div>

  )

}