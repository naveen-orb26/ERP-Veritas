import {
  getSalesOrderOverview,
} from "@/lib/api/sales-server"

import DetailView
from "@/components/sales/detail-view"

interface Props {

  params: Promise<{

    id: string

  }>

}

export default async function
SalesOrderPage({

  params,

}: Props) {

  const { id } =
    await params

  const order =
    await getSalesOrderOverview(
      id
    )

  return (

    <DetailView
      order={order}
    />

  )

}