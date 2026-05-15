import {
  getProduct,
} from "@/lib/api/products"

import ProductDetailView
from "@/components/products/detail-view"

export default async function
ProductDetailPage({

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

      <ProductDetailView
        product={product}
      />

    </div>
  )
}