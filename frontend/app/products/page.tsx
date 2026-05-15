import {

  getProducts,

} from "@/lib/api/products"

import ProductsTable
from "@/components/products/products-table"

export default async function
ProductsPage() {

  const products =
    await getProducts()

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

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Products
          </h1>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            Product master and
            SR-based catalog
            management.
          </p>

        </div>

        <a
          href="/products/create"

          className="
            bg-white
            hover:bg-zinc-200
            transition
            text-black
            px-5
            py-3
            rounded-xl
            font-medium
          "
        >
          Add Product
        </a>

      </div>

      <ProductsTable
        products={products}
      />

    </div>
  )
}