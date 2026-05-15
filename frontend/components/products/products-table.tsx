"use client"

import Link from "next/link"

import {
  useState,
} from "react"

export default function
ProductsTable({

  products,

}: any) {

  const [
    selectedImage,

    setSelectedImage

  ] = useState<
    string | null
  >(null)

  return (

    <>

      <div
        className="
          border
          border-zinc-800
          rounded-2xl
          overflow-hidden
          bg-zinc-900/40
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-zinc-900
            "
          >

            <tr>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Preview
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                SR Number
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Product
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Category
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Specification
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Color
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                Unit
              </th>

            </tr>

          </thead>

          <tbody>

            {
              products

                .filter(
                  (product: any) =>
                    product.is_active
                )

                .map(
                  (
                    product: any
                  ) => (

                    <tr

                      key={product.id}

                      className="
                        border-t
                        border-zinc-800
                        hover:bg-zinc-900/50
                        transition
                      "
                    >

                      {/* IMAGE */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >

                        {
                          product.image ? (

                            <button

                              type="button"

                              onClick={() =>
                                setSelectedImage(
                                  product.image
                                )
                              }

                              className="
                                w-10
                                h-10
                                rounded-full
                                overflow-hidden
                                border
                                border-zinc-700
                                bg-zinc-950
                                hover:scale-105
                                transition
                              "
                            >

                              <img

                                src={
                                  product.image
                                }

                                alt={
                                  product
                                    .product_name
                                }

                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                              />

                            </button>

                          ) : (

                            <div
                              className="
                                w-10
                                h-10
                                rounded-full
                                border
                                border-zinc-800
                                bg-zinc-950
                                flex
                                items-center
                                justify-center
                                text-zinc-600
                                text-xs
                              "
                            >
                              —
                            </div>
                          )
                        }

                      </td>

                      {/* SR */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >

                        <Link

                          href={
                            `/products/${product.id}`
                          }

                          className="
                            text-blue-400
                            hover:text-blue-300
                            font-medium
                          "
                        >

                          {
                            product
                              .sr_number
                          }

                        </Link>

                      </td>

                      {/* PRODUCT */}

                      <td
                        className="
                          px-4
                          py-4
                          text-white
                        "
                      >

                        {
                          product
                            .product_name
                        }

                      </td>

                      {/* CATEGORY */}

                      <td
                        className="
                          px-4
                          py-4
                          text-zinc-300
                        "
                      >

                        {
                          product.category
                        }

                      </td>

                      {/* SPEC */}

                      <td
                        className="
                          px-4
                          py-4
                          text-zinc-300
                        "
                      >

                        {
                          product
                            .size_or_variant
                        }

                      </td>

                      {/* COLOR */}

                      <td
                        className="
                          px-4
                          py-4
                          text-zinc-300
                        "
                      >

                        {
                          product.color
                        }

                      </td>

                      {/* UNIT */}

                      <td
                        className="
                          px-4
                          py-4
                          text-zinc-300
                        "
                      >

                        {
                          product.base_unit
                        }

                      </td>

                    </tr>
                  )
                )
            }

          </tbody>

        </table>

      </div>
      {/* IMAGE MODAL */}

      {
        selectedImage && (

          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/70
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-6
            "

            onClick={() =>
              setSelectedImage(
                null
              )
            }
          >

            <div
              className="
                relative
                bg-zinc-950
                border
                border-zinc-800
                rounded-2xl
                p-4
                max-w-2xl
                w-full
                flex
                items-center
                justify-center
              "

              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* CLOSE BUTTON */}

              <button

                type="button"

                onClick={() =>
                  setSelectedImage(
                    null
                  )
                }

                className="
                  absolute
                  top-3
                  right-3
                  w-9
                  h-9
                  rounded-full
                  bg-zinc-900
                  border
                  border-zinc-700
                  text-zinc-300
                  hover:bg-zinc-800
                  transition
                  flex
                  items-center
                  justify-center
                  text-lg
                "
              >
                ×
              </button>

              <img

                src={selectedImage}

                alt="Preview"

                className="
                  max-h-[75vh]
                  rounded-xl
                  object-contain
                "
              />

            </div>

          </div>
        )
      }

    </>
  )
}