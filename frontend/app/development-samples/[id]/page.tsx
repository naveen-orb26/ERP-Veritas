import Link from "next/link"

import {

  getDevelopmentSample,

} from "@/lib/api/sampling-server"

import WorkflowActions
from "@/components/development-samples/workflow-actions"

import {

  getRecipeBySampleServer,

} from "@/lib/api/recipes-server"


export default async function
DevelopmentSampleDetailPage({

  params,
  searchParams,
}: {
  params: Promise<{
  id: string
  }>

  searchParams: Promise<{
    recipe_created?: string
  }>
}) {

  const { id } =
    await params

  const {
    recipe_created,
  } = await searchParams

  const sample =
    await getDevelopmentSample(id)
  
  const recipe =
  await getRecipeBySampleServer(id) 

  return (

    <div className="p-6 space-y-8">

      <a

        href="/development-samples"

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
        ← Back to Samples
      </a>

      {recipe_created && (

        <div
          className="
            rounded-2xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
            dark:border-green-900
            dark:bg-green-950/40
            dark:text-green-300
          "
        >
          Recipe added successfully.
        </div>
      )}


      <div
        className="
          border
          rounded-2xl
          p-6
          bg-gradient-to-br
          from-zinc-100
          to-zinc-50
          dark:from-zinc-900
          dark:to-zinc-950
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-sm
                text-zinc-500
                mb-2
              "
            >
              Development Reference
            </p>

            <h1
              className="
                text-3xl
                font-bold
                tracking-wide
              "
            >
              {
                sample.reference_code
              }
            </h1>

            <p
              className="
                mt-3
                text-zinc-500
              "
            >
              {
                sample.product_name
              }
            </p>

          </div>
                    <div
            className="
              flex
              gap-3
              flex-wrap
            "
          >

            <div
              className={`
                inline-flex
                items-center
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                border

                ${
                  sample.status === "APPROVED"
                    ? `
                      border-green-200
                      bg-green-50
                      text-green-700
                      dark:border-green-900
                      dark:bg-green-950/40
                      dark:text-green-300
                    `
                    : sample.status === "REJECTED"
                    ? `
                      border-red-200
                      bg-red-50
                      text-red-700
                      dark:border-red-900
                      dark:bg-red-950/40
                      dark:text-red-300
                    `
                    : `
                      border-zinc-200
                      bg-zinc-100
                      text-zinc-700
                      dark:border-zinc-800
                      dark:bg-zinc-900
                      dark:text-zinc-300
                    `
                }
              `}
            >
              {sample.status}
            </div>

            {sample.status !== "APPROVED" && (

            <Link

              href={
                `/development-samples/${id}/edit`
              }

              className="
                px-4
                py-2
                rounded-xl
                bg-zinc-900
                text-white
                dark:bg-white
                dark:text-black
              "
            >
              Edit
            </Link>
          )}

            <Link

              href={
                `/development-samples/${id}/recipe`
              }

              className="
                px-4
                py-2
                rounded-xl
                border
              "
            >
              Recipe
            </Link>

          </div>

        </div>

      </div>
            <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        <div
          className="
            border
            rounded-2xl
            p-6
            space-y-5
            shadow-sm
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Product Information
            </h2>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Category
            </p>

            <p className="mt-1">

              {sample.category}

            </p>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Color
            </p>

            <p className="mt-1">

              {sample.color || "-"}

            </p>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Size / Variant
            </p>

            <p className="mt-1">

              {
                sample.size_or_variant
                  || "-"
              }

            </p>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Base Unit
            </p>

            <p className="mt-1">

              {sample.base_unit}

            </p>

          </div>

        </div>
                <div
          className="
            border
            rounded-2xl
            p-6
            space-y-5
            shadow-sm
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Commercial Information
            </h2>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Customer Name
            </p>

            <p className="mt-1">

              {
                sample.customer_name
                  || "-"
              }

            </p>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Description
            </p>

            <p className="mt-1">

              {
                sample.description
                  || "-"
              }

            </p>

          </div>

          <div>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Remarks
            </p>

            <p className="mt-1">

              {
                sample.remarks
                  || "-"
              }

            </p>

          </div>

        </div>

      </div>



          <div
      className="
        rounded-2xl
        border
        border-zinc-200
        dark:border-zinc-800
        bg-white/60
        dark:bg-zinc-950/40
        p-6
        shadow-sm
        space-y-4
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Recipe Summary
          </h2>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Formulation linked to
            this sample
          </p>

        </div>

        <Link

          href={
            `/development-samples/${id}/recipe`
          }

          className="
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
          {recipe
            ? "View Recipe"
            : "Add Recipe"}
        </Link>

      </div>

      {recipe ? (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          <div
            className="
              rounded-xl
              border
              border-zinc-200
              dark:border-zinc-800
              p-4
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Ingredients
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
              "
            >
              {recipe.items.length}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-zinc-200
              dark:border-zinc-800
              p-4
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Last Updated
            </p>

            <p
              className="
                mt-2
                text-sm
                text-zinc-700
                dark:text-zinc-300
              "
            >
              {
                new Date(
                  recipe.updated_at
                ).toLocaleString()
              }
            </p>
          </div>

        </div>

      ) : (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-zinc-300
            dark:border-zinc-700
            p-6
            text-sm
            text-zinc-500
          "
        >
          No recipe added yet.
        </div>
      )}

    </div>

            <div
        className="
          border
          rounded-2xl
          p-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            flex-wrap
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Workflow Actions
            </h2>

            <p
              className="
                text-sm
                text-zinc-500
                mt-1
              "
            >
              Approve or reject
              development lifecycle
            </p>

          </div>

          <WorkflowActions
            sample={sample}
          />

        </div>

      </div>

    </div>
  )
}