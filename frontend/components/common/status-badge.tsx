type Props = {
  status: string
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    className: string
    dot: string
  }
> = {

  DRAFT: {
    label: "Draft",
    className:
      "border-zinc-600 bg-zinc-900 text-zinc-400",
    dot: "bg-zinc-500",
  },

  READY: {
    label: "Ready",
    className:
      "border-cyan-600 bg-cyan-900/20 text-cyan-400",
    dot: "bg-cyan-400",
  },

  PLANNED: {
    label: "Planned",
    className:
      "border-zinc-600 bg-zinc-800 text-zinc-300",
    dot: "bg-zinc-400",
  },

  PENDING: {
    label: "Pending",
    className:
      "border-yellow-600 bg-yellow-900/20 text-yellow-400",
    dot: "bg-yellow-400",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "border-blue-600 bg-blue-900/20 text-blue-400",
    dot: "bg-blue-400",
  },

  PRODUCTION_COMPLETE: {
    label: "Production Complete",
    className:
      "border-green-600 bg-green-900/20 text-green-400",
    dot: "bg-green-400",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-green-600 bg-green-900/20 text-green-400",
    dot: "bg-green-400",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-red-600 bg-red-900/20 text-red-400",
    dot: "bg-red-400",
  },

}

export default function StatusBadge({
  status,
}: Props) {

  const config =
    STATUS_CONFIG[status] ?? {

      label: status,

      className:
        "border-zinc-700 bg-zinc-900 text-zinc-300",

      dot: "bg-zinc-400",

    }

  return (

    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-md
        border
        px-3
        py-1.5
        text-sm
        font-medium
        ${config.className}
      `}
    >

      <span
        className={`
          h-2
          w-2
          rounded-full
          ${config.dot}
        `}
      />

      {config.label}

    </div>

  )

}