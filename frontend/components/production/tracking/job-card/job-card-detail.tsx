import JobHeader from "./job-header"

import OrderProductCard from "../batch/order-product-card"

import PlanningSummaryCard from "./planning-summary-card"

import QuantitySummaryCard from "./quantity-summary-card"

import BatchSummaryCard from "./batch-summary-card"

import ProgressSummaryCard from "./progress-summary-card"

import WorkflowCard from "./workflow-card"

import FooterCard from "./footer-card"

type Props = {

  jobCard: any

}

export default function JobCardDetail({

  jobCard,

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

      <JobHeader

        header={jobCard.header}

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

          data={jobCard}

        />

        <PlanningSummaryCard

          planning={jobCard.planning_summary}

        />

      </div>

      <div
        className="
          mt-6
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        <QuantitySummaryCard

          quantity={jobCard.quantity_summary}

        />

        <ProgressSummaryCard

          progress={jobCard.progress_summary}

        />

      </div>

      <BatchSummaryCard

        batches={jobCard.batch_summary}

      />

      <WorkflowCard

        workflow={jobCard.workflow}

      />

      <FooterCard

        footer={jobCard.footer}

      />

    </div>

  )

}