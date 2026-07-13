type Props = {

  footer: {

    created_at: string

    updated_at: string

    created_by: string

  }

}

export default function FooterCard({

  footer,

}: Props) {

  return (

    <div
      className="
        mt-6
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-6
      "
    >

      <div
        className="
          grid
          gap-6
          md:grid-cols-3
        "
      >

        <Info

          label="Created"

          value={footer.created_at}

        />

        <Info

          label="Last Updated"

          value={footer.updated_at}

        />

        <Info

          label="Created By"

          value={footer.created_by}

        />

      </div>

    </div>

  )

}

function Info({

  label,

  value,

}: {

  label: string

  value: any

}) {

  return (

    <div>

      <p
        className="
          text-xs
          uppercase
          tracking-wide
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-sm
          text-zinc-300
        "
      >
        {value || "-"}
      </p>

    </div>

  )

}