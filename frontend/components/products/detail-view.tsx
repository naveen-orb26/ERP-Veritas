import Link from "next/link"

const API_BASE_URL =
  process.env
    .NEXT_PUBLIC_API_BASE_URL

export default function
ProductDetailView({

  product,

}: any) {

  return (

    <div
      className="
        max-w-6xl
        mx-auto
        space-y-8
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
              mb-3
            "
          >

            <h1
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              {
                product.product_name
              }
            </h1>

            {
              !product.is_active && (

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-300
                    text-sm
                  "
                >
                  Archived
                </span>
              )
            }

          </div>

          <p
            className="
              text-zinc-400
              text-lg
            "
          >
            SR Number:
            {" "}
            <span
              className="
                text-white
                font-medium
              "
            >
              {
                product.sr_number
              }
            </span>
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <Link

            href="/products"

            className="
              px-5
              py-3
              rounded-xl
              border
              border-zinc-700
              text-zinc-300
              hover:bg-zinc-900
              transition
            "
          >
            Back
          </Link>

          <Link

            href={
              `/products/${product.id}/edit`
            }

            className="
              px-6
              py-3
              rounded-xl
              bg-white
              text-black
              font-medium
              hover:bg-zinc-200
              transition
            "
          >
            Edit Product
          </Link>

        </div>

      </div>

      {/* HERO */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* IMAGE */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            flex
            items-center
            justify-center
            min-h-[320px]
          "
        >

          {
            product.image ? (

              <img

                src={product.image}

                alt={
                  product.product_name
                }

                className="
                  max-h-[280px]
                  rounded-xl
                  object-contain
                "
              />

            ) : (

              <div
                className="
                  text-zinc-500
                  text-sm
                "
              >
                No Product Image
              </div>
            )
          }

        </div>

        {/* SUMMARY */}

        <div
          className="
            lg:col-span-2
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            space-y-8
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-white
                mb-4
              "
            >
              Product Overview
            </h2>

            <p
              className="
                text-zinc-300
                leading-relaxed
              "
            >

              {
                product.description ||

                "No description available."
              }

            </p>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            <div
              className="
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                p-5
              "
            >

              <p
                className="
                  text-zinc-500
                  text-sm
                  mb-2
                "
              >
                Category
              </p>

              <p
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product.category
                }
              </p>

            </div>

            <div
              className="
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                p-5
              "
            >

              <p
                className="
                  text-zinc-500
                  text-sm
                  mb-2
                "
              >
                Specification
              </p>

              <p
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product
                    .size_or_variant
                }
              </p>

            </div>

            <div
              className="
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                p-5
              "
            >

              <p
                className="
                  text-zinc-500
                  text-sm
                  mb-2
                "
              >
                Color
              </p>

              <p
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product.color
                }
              </p>

            </div>

          </div>

        </div>

      </div>
      {/* MEASUREMENT + COMMERCIAL */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* MEASUREMENT */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            space-y-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Measurement
          </h2>

          <div
            className="
              space-y-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                pb-4
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                Base Unit
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product.base_unit
                }
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                pb-4
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                Units Per Base Unit
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product
                    .units_per_base_unit
                }
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                Default Units Per Packet
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product
                    .default_units_per_packet
                }
              </span>

            </div>

          </div>

        </div>

        {/* COMMERCIAL */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-2xl
            p-6
            space-y-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Commercial
          </h2>

          <div
            className="
              space-y-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                pb-4
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                HSN Code
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product.hsn_code
                }
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                pb-4
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                GST Percentage
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product
                    .gst_percentage
                }
                %
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-zinc-400
                "
              >
                Reorder Level
              </span>

              <span
                className="
                  text-white
                  font-medium
                "
              >
                {
                  product
                    .reorder_level ||

                  "Not Set"
                }
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* FUTURE ERP PLACEHOLDERS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        <div
          className="
            bg-zinc-900/40
            border
            border-dashed
            border-zinc-700
            rounded-2xl
            p-6
          "
        >

          <h3
            className="
              text-white
              font-semibold
              mb-2
            "
          >
            Inventory
          </h3>

          <p
            className="
              text-zinc-500
              text-sm
              leading-relaxed
            "
          >
            Current stock,
            inward, outward,
            warehouse and
            inventory movement
            will appear here.
          </p>

        </div>

        <div
          className="
            bg-zinc-900/40
            border
            border-dashed
            border-zinc-700
            rounded-2xl
            p-6
          "
        >

          <h3
            className="
              text-white
              font-semibold
              mb-2
            "
          >
            Sales Usage
          </h3>

          <p
            className="
              text-zinc-500
              text-sm
              leading-relaxed
            "
          >
            Sales orders,
            customers and
            dispatch references
            will appear here.
          </p>

        </div>

        <div
          className="
            bg-zinc-900/40
            border
            border-dashed
            border-zinc-700
            rounded-2xl
            p-6
          "
        >

          <h3
            className="
              text-white
              font-semibold
              mb-2
            "
          >
            Production & QC
          </h3>

          <p
            className="
              text-zinc-500
              text-sm
              leading-relaxed
            "
          >
            Production batches,
            inspection status and
            quality history will
            appear here.
          </p>

        </div>

      </div>

    </div>
  )
}