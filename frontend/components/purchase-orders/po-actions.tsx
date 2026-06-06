"use client"

import Link
from "next/link"

import {

  approvePurchaseOrder,

  cancelPurchaseOrder,

} from "@/lib/api/purchase-orders-client"

type Props = {

  id: number

  status: string
}

export function POActions({

  id,

  status,
}: Props) {

  async function handleApprove() {

    try {

      await approvePurchaseOrder(id.toString())

      window.location.reload()

    } catch {

      alert(
        "Failed to approve purchase order"
      )
    }
  }

  async function handleCancel() {

    try {

      await cancelPurchaseOrder(id.toString())

      window.location.reload()

    } catch {

      alert(
        "Failed to cancel purchase order"
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

          <>

            <Link

              href={
                `/purchase-orders/${id}/edit`
              }

              className="
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
              "
            >
              Edit
            </Link>

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

          </>
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