import {

  getDevelopmentSample,

} from "@/lib/api/sampling-server"

import {

  getRecipeBySampleServer,

} from "@/lib/api/recipes-server"

import RecipeEditor
from "@/components/recipes/editor"

import {

  getRawMaterialsServer,

} from "@/lib/api/raw-materials-server"


export default async function
RecipePage({

  params,
}: {

  params: Promise<{
    id: string
  }>
}) {

  const { id } =
    await params

  const sample =
    await getDevelopmentSample(id)

  const recipe =
    await getRecipeBySampleServer(id)

  const rawMaterials =
    await getRawMaterialsServer()

  return (

    <div className="p-6 space-y-6">

      <a

        href={
          `/development-samples/${sample.id}`
        }

        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-zinc-200
          dark:border-zinc-800
          px-4
          py-2
          text-sm
          hover:bg-zinc-100
          dark:hover:bg-zinc-900
          transition
        "
      >
        ← Back to Sample
      </a>

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Recipe Formulation
        </h1>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          {
            sample.reference_code
          }
          {" · "}
          {
            sample.product_name
          }
        </p>

      </div>

      <RecipeEditor

        sample={sample}

        recipe={recipe}

        rawMaterials={
          rawMaterials
        }
      />

    </div>
  )
}