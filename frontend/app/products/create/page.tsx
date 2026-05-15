 import CreateProductForm
from "@/components/products/create-form"

export default function
CreateProductPage() {

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Create Product
      </h1>

      <CreateProductForm />

    </div>
  )
}