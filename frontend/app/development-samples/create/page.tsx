import DevelopmentSampleCreateForm
from "@/components/development-samples/create-form"


export default function
CreateDevelopmentSamplePage() {

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Create Development Sample
        </h1>

        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Register a new
          product development
          or sampling request
        </p>

      </div>

      <DevelopmentSampleCreateForm />

    </div>
  )
}