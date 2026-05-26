
import {

  getRawMaterialInventoryDetailServer,

} from "@/lib/api/raw-material-inventory-server"


type Props = {

  params: Promise<{

    id: string
  }>
}


export default async function
InventoryDetailPage({

  params,
}: Props) {

  const { id } =
    await params

  const inventory =
    await
    getRawMaterialInventoryDetailServer(
      id
    )

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
        "
      >

        <div
          className="
            space-y-2
          "
        >

          <div
            className="
              inline-flex
              items-center
              rounded-full
              bg-zinc-100
              px-3
              py-1
              text-xs
              font-semibold
              text-zinc-700
              dark:bg-zinc-800
              dark:text-zinc-300
            "
          >
            {
              inventory.sm_code
            }
          </div>

          <div>

            <h1
              className="
                text-3xl
                font-bold
              "
            >
              {
                inventory.material_name
              }
            </h1>

            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              {
                inventory.chemical_identity
              }
            </p>

          </div>

        </div>

        <div>

          <div
            className={`

              inline-flex
              items-center
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold

              ${

                inventory.is_below_minimum

                  ? `
                    bg-red-100
                    text-red-700
                  `

                  : `
                    bg-green-100
                    text-green-700
                  `
              }
            `}
          >

            {

              inventory.is_below_minimum

                ? "Low Stock"

                : "Healthy Stock"
            }

          </div>

        </div>

      </div>


      {/* ======================================
          STOCK SUMMARY
      ====================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-4
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Current Quantity
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {
              inventory.current_quantity
            }
          </h2>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Reserved Quantity
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {
              inventory.reserved_quantity
            }
          </h2>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Available Quantity
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {
              inventory.available_quantity
            }
          </h2>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-6
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Warehouse
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-bold
            "
          >
            {
              inventory.warehouse_name
            }
          </h2>

        </div>

      </div>


      {/* ======================================
          DETAILS
      ====================================== */}

      <div
        className="
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-6
          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >

        <h2
          className="
            mb-6
            text-lg
            font-semibold
          "
        >
          Inventory Details
        </h2>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
          "
        >

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Vendor
            </p>

            <p
              className="
                mt-1
                text-sm
                font-medium
              "
            >
              {
                inventory.vendor_name
              }
            </p>

          </div>


          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Material Code
            </p>

            <p
              className="
                mt-1
                text-sm
                font-medium
              "
            >
              {
                inventory.material_code
              }
            </p>

          </div>


          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Last Movement
            </p>

            <p
              className="
                mt-1
                text-sm
                font-medium
              "
            >
              {
                inventory.last_movement_at
              }
            </p>

          </div>


          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              "
            >
              Remarks
            </p>

            <p
              className="
                mt-1
                text-sm
                font-medium
              "
            >
              {
                inventory.remarks
                || "-"
              }
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}