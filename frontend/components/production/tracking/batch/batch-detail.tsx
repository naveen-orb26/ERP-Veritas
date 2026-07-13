import BatchHeader from "./batch-header"

import OrderProductCard from "./order-product-card"

import ExecutionCard from "./execution-card"

import TimelineCard from "./timeline-card"

import ActionCard from "./action-card"

import ProductionDetailsCard from "./production-details-card"

type Props = {

  batch: any

}

export default function BatchDetail({

  batch,

}: Props) {

  return (

    <div
      className="
        mx-auto
        max-w-7xl
        p-8
        text-white
      "
    >

      <BatchHeader

        batch={batch}

      />

      <div
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        <OrderProductCard

          batch={batch}

        />

        <ExecutionCard

          batch={batch}

        />

      </div>

      <TimelineCard

        batch={batch}

      />

      <ProductionDetailsCard

        batch={batch}

      />

      <ActionCard

        batch={batch}

      />

    </div>

  )

}