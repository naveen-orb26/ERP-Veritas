import Image from "next/image"

type Props = {
  batch?: any
  data?: any
}

function Row({
  label,
  value,
}: {
  label: string
  value: any
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-zinc-800
        py-3
      "
    >
      <span
        className="
          text-sm
          text-zinc-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          font-medium
        "
      >
        {value ?? "-"}
      </span>
    </div>
  )
}

export default function OrderProductCard({
  batch,
  data,
}: Props) {

  // Supports both Batch Detail and Job Card Detail

  const source = batch ?? data

  const header = source.header ?? source

  const product = source.product ?? source

  return (
    <div
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >
      <h2
        className="
          mb-6
          text-xl
          font-semibold
        "
      >
        Order & Product
      </h2>

      {product.image && (
        <div
          className="
            mb-6
            flex
            justify-center
          "
        >
          <Image
            src={product.image}
            alt={product.product_name}
            width={170}
            height={170}
            className="
              rounded-lg
              border
              border-zinc-800
              object-cover
            "
          />
        </div>
      )}

      <Row
        label="Sales Order"
        value={header.sales_order_number}
      />

      <Row
        label="Customer"
        value={header.customer_name}
      />

      <Row
        label="Production Request"
        value={header.production_request_number}
      />

      <Row
        label="Job Card"
        value={header.job_card_number}
      />

      <div
        className="
          my-6
          border-t
          border-zinc-800
        "
      />

      <Row
        label="SR Number"
        value={product.sr_number}
      />

      <Row
        label="Product"
        value={product.product_name}
      />

      <Row
        label="Category"
        value={product.category}
      />

      <Row
        label="Variant"
        value={product.variant}
      />

      <Row
        label="Colour"
        value={product.color}
      />

      <Row
        label="Base Unit"
        value={product.base_unit}
      />

      <Row
        label="Units / Base Unit"
        value={product.units_per_base_unit}
      />
    </div>
  )
}