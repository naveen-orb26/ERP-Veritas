import {
  getProduct,
} from "@/lib/api/products"

import EditProductForm
from "@/components/products/edit-form"

export default async function
EditProductPage({

  params,

}: any) {

  const resolvedParams =
    await params

  const product =
    await getProduct(
      resolvedParams.id
    )

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Edit Product
      </h1>

      <EditProductForm
        product={product}
      />

    </div>
  )
}