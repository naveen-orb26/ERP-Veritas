import CreateCustomerForm
from "@/components/customers/create-form"

export default function
CreateCustomerPage() {

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Create Customer
      </h1>

      <CreateCustomerForm />

    </div>
  )
}