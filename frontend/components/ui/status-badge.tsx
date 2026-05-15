interface Props {

  status: string
}

export default function
StatusBadge({
  status,
}: Props) {

  const styles = {

    DRAFT:
      "bg-zinc-700 text-white",

    CONFIRMED:
      "bg-blue-600 text-white",

    HOLD:
      "bg-yellow-500 text-black",

    CANCELLED:
      "bg-red-600 text-white",

    CLOSED:
      "bg-green-600 text-white",
  }

  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${
          styles[
            status as keyof typeof styles
          ] ||
          "bg-zinc-800 text-white"
        }
      `}
    >

      {status}

    </span>
  )
}