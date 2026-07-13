type Props = {
  batch:any
}

const statusColors:Record<string,string>={

  COMPLETED:
    "text-green-400",

  IN_PROGRESS:
    "text-blue-400",

  PENDING:
    "text-zinc-400",

}

export default function TimelineCard({
  batch,
}:Props){

  return(

    <div
      className="
        mt-6
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

        Production Timeline

      </h2>

      <div
        className="
          space-y-4
        "
      >

        {

          batch.stages.map(
            (stage:any)=>{

              return(

                <div

                  key={stage.id}

                  className="
                    rounded-xl
                    border
                    border-zinc-800
                    p-5
                  "

                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <h3
                      className="
                        text-lg
                        font-semibold
                      "
                    >

                      {stage.stage_name}

                    </h3>

                    <span
                      className={

                        statusColors[
                          stage.status
                        ]

                      }
                    >

                      {

                        stage.status.replaceAll(
                          "_",
                          " "
                        )

                      }

                    </span>

                  </div>

                  <div
                    className="
                      mt-5
                      grid
                      gap-4
                      md:grid-cols-2
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xs
                          uppercase
                          text-zinc-500
                        "
                      >

                        Started

                      </p>

                      <p>

                        {

                          stage.started_at

                          ?

                          new Date(

                            stage.started_at

                          ).toLocaleString()

                          :

                          "-"

                        }

                      </p>

                    </div>

                    <div>

                      <p
                        className="
                          text-xs
                          uppercase
                          text-zinc-500
                        "
                      >

                        Completed

                      </p>

                      <p>

                        {

                          stage.completed_at

                          ?

                          new Date(

                            stage.completed_at

                          ).toLocaleString()

                          :

                          "-"

                        }

                      </p>

                    </div>

                  </div>

                </div>

              )

            }

          )

        }

      </div>

    </div>

  )

}