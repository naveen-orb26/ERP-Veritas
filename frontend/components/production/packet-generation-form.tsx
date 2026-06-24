"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  generatePackets,
} from "@/lib/api/packets-client"

export default function
PacketGenerationForm({
  inspection,
}: {
  inspection: any
}) {

  const router =
    useRouter()

  const [
    unitsPerPacket,
    setUnitsPerPacket,
  ] = useState(0)

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  const preview =
    useMemo(() => {

      if (
        !unitsPerPacket
      ) {

        return []
      }

      let remaining =
        inspection.remaining_to_pack

      const packets =
        []

      while (
        remaining > 0
      ) {

        const qty =
          Math.min(
            unitsPerPacket,
            remaining
          )

        packets.push(qty)

        remaining -= qty
      }

      return packets

    }, [
      unitsPerPacket,
      inspection,
    ])

  async function
  handleGenerate() {

    try {

      setLoading(true)

      setError("")

      await generatePackets({

        inspection:
          inspection.id,

        units_per_packet:
          unitsPerPacket,
      })

      router.push(
        "/production/packets"
      )

    } catch (
      error: any
    ) {

      setError(
        error.message
      )

    } finally {

      setLoading(false)
    }
  }

  if (
    inspection.remaining_to_pack <= 0
  ) {

    return (

      <div className="p-8 text-white">

        <div
          className="
            rounded-xl
            border
            border-green-800
            bg-green-900/20
            p-6
          "
        >

          Packing Complete

        </div>

      </div>
    )
  }

  return (

    <div
      className="
        p-8
        text-white
      "
    >

      <h1
        className="
          mb-6
          text-3xl
          font-bold
        "
      >
        Generate Packets
      </h1>

      <div
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >

        <Metric
          label="Customer"
          value={
            inspection.customer_name
          }
        />

        <Metric
          label="Order"
          value={
            inspection.order_number
          }
        />

        <Metric
          label="Product"
          value={
            inspection.product_name
          }
        />

        <Metric
          label="Batch"
          value={
            inspection.batch_number
          }
        />

        <Metric
          label="Accepted"
          value={
            inspection.accepted_quantity
          }
        />

        <Metric
          label="Packed"
          value={
            inspection.packed_quantity
          }
        />

        <Metric
          label="Remaining"
          value={
            inspection.remaining_to_pack
          }
        />

      </div>

      <div
        className="
          mt-8
          rounded-xl
          border
          border-zinc-800
          p-6
        "
      >

        <label
          className="
            block
            text-sm
            text-zinc-400
          "
        >
          Units Per Packet
        </label>

        <input

          type="number"

          value={
            unitsPerPacket
          }

          onChange={(e) =>
            setUnitsPerPacket(
              Number(
                e.target.value
              )
            )
          }

          className="
            mt-2
            w-full
            rounded-lg
            border
            border-zinc-700
            bg-zinc-900
            p-3
          "
        />

      </div>

      <div
        className="
          mt-8
          rounded-xl
          border
          border-zinc-800
          p-6
        "
      >

        <h2
          className="
            mb-4
            text-xl
          "
        >
          Preview
        </h2>

        <div
          className="
            space-y-2
          "
        >

          {
            preview.map(
              (
                qty,
                index
              ) => (

                <div
                  key={index}
                >

                  Packet
                  {" "}
                  {index + 1}
                  :
                  {" "}
                  {qty}

                </div>
              )
            )
          }

        </div>

      </div>

      {
        error && (

          <div
            className="
              mt-4
              text-red-400
            "
          >
            {error}
          </div>
        )
      }

      <button

        onClick={
          handleGenerate
        }

        disabled={
          loading
          ||
          !unitsPerPacket
        }

        className="
          mt-6
          rounded-lg
          bg-green-600
          px-4
          py-2
        "
      >

        {
          loading
          ? "Generating..."
          : "Generate Packets"
        }

      </button>

    </div>
  )
}

function Metric({
  label,
  value,
}: any) {

  return (

    <div
      className="
        rounded-xl
        border
        border-zinc-800
        p-4
      "
    >

      <p
        className="
          text-xs
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          font-semibold
        "
      >
        {value}
      </p>

    </div>
  )
}