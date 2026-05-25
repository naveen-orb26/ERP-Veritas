"use client"
import {

  approveGRN,

  cancelGRN,

} from "@/lib/api/grns-client"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL
type Props = {

  id: number

  status: string
}

export function GRNActions({

  id,

  status,
}: Props) {

  async function handleApprove() {

  try {

    await approveGRN(id)

    window.location.reload()

  } catch {

    alert(
      "Failed to approve GRN"
    )
  }
}

  async function handleCancel() {

  try {

    await cancelGRN(id)

    window.location.reload()

  } catch {

    alert(
      "Failed to cancel GRN"
    )
  }
}
  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      {
        status === "DRAFT"

        && (

          <button

            onClick={
              handleApprove
            }

            className="
              rounded-xl
              bg-green-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
            "
          >
            Approve
          </button>
        )
      }

      {
        status === "APPROVED"

        && (

          <button

            onClick={
              handleCancel
            }

            className="
              rounded-xl
              bg-red-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
            "
          >
            Cancel
          </button>
        )
      }
    </div>
  )
}