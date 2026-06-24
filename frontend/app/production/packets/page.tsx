import Link from "next/link"

import {
  getPackets,
} from "@/lib/api/packets-server"

export const dynamic =
  "force-dynamic"

export default async function
PacketsPage() {

  const packets =
    await getPackets()

  return (

    <div className="p-8 text-white">

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Packets
      </h1>

      <div
        className="
          mt-6
          overflow-hidden
          rounded-xl
          border
          border-zinc-800
        "
      >

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead
            className="
              bg-zinc-900
            "
          >

            <tr>

              <th className="p-4 text-left">
                Packet
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Order
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Batch
              </th>

              <th className="p-4 text-left">
                Qty
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {packets.map(
              (packet: any) => (

                <tr
                  key={packet.id}
                  className="
                    border-t
                    border-zinc-800
                  "
                >

                  <td className="p-4">

                    <Link

                      href={
                        `/production/packets/${packet.id}`
                      }

                      className="
                        text-blue-400
                      "
                    >
                      {packet.packet_number}
                    </Link>

                  </td>

                  <td className="p-4">
                    {packet.customer_name}
                  </td>

                  <td className="p-4">
                    {packet.sales_order_number}
                  </td>

                  <td className="p-4">
                    {packet.product_name}
                  </td>

                  <td className="p-4">
                    {packet.batch_number}
                  </td>

                  <td className="p-4">
                    {packet.units_in_packet}
                  </td>

                  <td className="p-4">
                    {packet.status}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}