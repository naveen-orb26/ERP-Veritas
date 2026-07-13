import Link from "next/link"

import {
  getJobCardsBySalesLine,
} from "@/lib/api/production-server"

interface Props {

  params: Promise<{

    id: string

  }>

}

export default async function
JobCardsBySalesLinePage({

  params,

}: Props) {


  const { id } =
    await params

  const jobCards =
    await getJobCardsBySalesLine(id)

    
    const first = jobCards[0]

  return (

    <div className="p-8 text-white">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Job Cards

        </h1>

        <p className="mt-2 text-zinc-400">

            {first?.order_number}

            </p>

            <p className="text-zinc-500">

            {first?.sr_number}

            </p>
      </div>

      {

        jobCards.length === 0

        ?

        (

          <div className="rounded-xl border border-zinc-800 p-6">

            No Job Cards created yet.

          </div>

        )

        :

        (

          <div className="space-y-4">

            {

              jobCards.map(

                (jobCard:any)=>(

                  <div

                    key={jobCard.id}

                    className="rounded-xl border border-zinc-800 p-6 flex justify-between items-center"

                  >

                    <div>

                      <h2 className="text-xl font-semibold">

                        {jobCard.job_card_number}

                      </h2>

                      <p className="text-zinc-400 mt-1">

                        {jobCard.sr_number}

                      </p>

                      <p className="text-zinc-500 text-sm mt-1">

                        {jobCard.product_name}

                      </p>

                      <p className="text-sm mt-2">

                        Planned Qty : {jobCard.planned_quantity}

                      </p>

                    </div>

                    <div className="text-right">

                      <div className="mb-4">

                        {jobCard.status}

                      </div>

                      <Link

                        href={`/production/job-cards/${jobCard.id}`}

                        className="rounded-lg bg-blue-600 px-4 py-2"

                      >

                        Open Job Card

                      </Link>

                    </div>

                  </div>

                )

              )

            }

          </div>

        )

      }

      <div className="mt-10 flex justify-between">

        <Link

          href={`/sales/${first.sales_order_id}`}

          className="rounded-lg bg-zinc-700 px-5 py-2"

        >

          ← Back to Order details

        </Link>

        <Link

          href="/production/job-cards"

          className="rounded-lg bg-emerald-600 px-5 py-2"

        >

          Go to Job Cards →

        </Link>

      </div>

    </div>

  )

}