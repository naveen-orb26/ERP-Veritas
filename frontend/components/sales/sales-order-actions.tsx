"use client"

import { useRouter }
from "next/navigation"

import {

    confirmSalesOrder,
    holdSalesOrder,
    resumeSalesOrder,
    cancelSalesOrder,

} from "@/lib/api/sales-actions"

interface Props {

  orderId: string

  status: string
}

export default function
SalesOrderActions({

  orderId,
  status,

}: Props) {

  const router =
    useRouter()

  async function
  handleConfirm() {

    try {

      await confirmSalesOrder(
        orderId
      )

      router.refresh()

    } catch (error) {

      console.error(error)
    }
  }

  async function
  handleHold() {

    try {

      await holdSalesOrder(
        orderId
      )

      router.refresh()

    } catch (error) {

      console.error(error)
    }
  }

async function 
handleResume() {

  try {

    await resumeSalesOrder(
      orderId
    )

    router.refresh()

  } catch (error) {

    console.error(error)
  }
}


  async function
  handleCancel() {

    try {

      await cancelSalesOrder(
        orderId
      )

      router.refresh()

    } catch (error) {

      console.error(error)
    }
  }

  return (

    <div
      className="
        flex
        gap-3
      "
    >

      {
        status === "DRAFT" && (

          <>

            <button
              onClick={
                handleConfirm
              }

              className="
                bg-blue-600
                px-4
                py-2
                rounded-lg
              "
            >
              Confirm
            </button>

            <button
              onClick={
                handleHold
              }

              className="
                bg-yellow-500
                text-black
                px-4
                py-2
                rounded-lg
              "
            >
              Hold
            </button>

            <button
              onClick={
                handleCancel
              }

              className="
                bg-red-600
                px-4
                py-2
                rounded-lg
              "
            >
              Cancel
            </button>

          </>

        )
      }

      {
        status === "ON_HOLD" && (

          <>

            <button
              onClick={
                handleResume
              }

              className="
                bg-blue-600
                px-4
                py-2
                rounded-lg
              "
            >
              Resume
            </button>

            <button
              onClick={
                handleCancel
              }

              className="
                bg-red-600
                px-4
                py-2
                rounded-lg
              "
            >
              Cancel
            </button>

          </>

        )
      }

    </div>
  )
}