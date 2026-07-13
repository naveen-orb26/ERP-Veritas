"use client"

import {

  useMemo,
  useState,

} from "react"

import {

  useRouter,

} from "next/navigation"

import {

  updateSalesOrder,

} from "@/lib/api/sales"

interface Line {

  id:number

  product:number

  product_name:string

  sr_number:string

  quantity:number

  unit_price:number

  gst_percentage:number

  fulfilled_quantity:number

  remarks:string

}

interface Order{

  id:number

  customer:number

  customer_name:string

  order_number:string

  order_date:string

  expected_delivery_date:string

  delivery_lead_days:number

  priority_flag:boolean

  remarks:string

  status:string

  lines:Line[]

}

interface Product{

  id:number

  product_name:string

  sr_number:string

  gst_percentage:number

}

interface Props{

  order:Order

  products:Product[]

}

function InfoCard({

  label,

  value,

}:{

  label:string

  value:any

}){

  return(

    <div
      className="
        rounded-xl
        border
        border-zinc-700
        p-4
      "
    >

      <p
        className="
          text-xs
          text-zinc-400
        "
      >

        {label}

      </p>

      <p
        className="
          mt-1
          font-semibold
        "
      >

        {value}

      </p>

    </div>

  )

}

export default function
EditForm({

  order,
  products,

}:Props){

  const router=
    useRouter()

  const[

    loading,

    setLoading,

  ]=useState(false)

  const[

    error,

    setError,

  ]=useState("")

  const[

    remarks,

    setRemarks,

  ]=useState(

    order.remarks || ""

  )

  const [

    deliveryLeadDays,

    setDeliveryLeadDays,

    ] = useState(

    order.delivery_lead_days

    )

    const [

    expectedDeliveryDate,

    setExpectedDeliveryDate,

    ] = useState(

    order.expected_delivery_date

    )

  const[

    lines,

    setLines,

  ]=useState<Line[]>(

    order.lines

  )
    const subtotal=

    useMemo(()=>{

      return lines.reduce(

        (sum,line)=>

          sum+

          (

            Number(line.quantity)

            *

            Number(line.unit_price)

          ),

        0

      )

    },[lines])

  const tax=

    useMemo(()=>{

      return lines.reduce(

        (sum,line)=>{

          const total=

            Number(line.quantity)

            *

            Number(line.unit_price)

          return(

            sum+

            (

              total*

              Number(line.gst_percentage)

              /100

            )

          )

        },

        0

      )

    },[lines])

  const grandTotal=

    subtotal+tax
    function updateLine(

    index:number,

    field:keyof Line,

    value:any

){

    const copy=[...lines]

    copy[index]={

      ...copy[index],

      [field]:value,

    }

    setLines(copy)

}

function removeLine(

index:number

){

if(lines.length===1){

setError(

"Sales order must contain at least one product."

)

return

}

const copy=[...lines]

copy.splice(index,1)

setLines(copy)

}

function addLine(){

setLines([

...lines,

{

id:Date.now(),

product:0,

product_name:"",

sr_number:"",

quantity:1,

unit_price:0.00,

gst_percentage:0.00,

fulfilled_quantity:0,

remarks:"",

},

])

}

async function handleSubmit(

e:React.FormEvent

){

e.preventDefault()

setLoading(true)

setError("")

try{

await updateSalesOrder(

String(order.id),

{

customer:order.customer,

order_date:order.order_date,

delivery_lead_days: deliveryLeadDays,

expected_delivery_date: expectedDeliveryDate,

priority_flag:

order.priority_flag,

status:

order.status,

remarks,

lines:lines.map(

line=>({

product:line.product,

quantity:line.quantity,

unit_price:line.unit_price,

remarks:line.remarks,

})

),

}

)

router.push(

`/sales/${order.id}`

)

router.refresh()

}catch(err:any){

setError(

err.message||

"Failed to update."

)

}finally{

setLoading(false)

}

} return(

<form

onSubmit={handleSubmit}

className="space-y-8"

>

{error&&(

<div

className="

rounded-lg

bg-red-900/30

border

border-red-600

p-3

text-red-300

"

>

{error}

</div>

)}
<div

className="

grid

md:grid-cols-2

gap-5

"

>

<InfoCard

label="Order"

value={order.order_number}

/>

<InfoCard

label="Customer"

value={order.customer_name}

/>

<div>

<label

className="

block

text-xs

text-zinc-400

mb-2

"

>

Delivery Lead Days

</label>

<input

type="number"

min={0}

value={deliveryLeadDays}

onChange={(e)=>{

const days=

Number(e.target.value)

setDeliveryLeadDays(days)

const date=

new Date(order.order_date)

date.setDate(

date.getDate()+days

)

setExpectedDeliveryDate(

date.toISOString()

.slice(0,10)

)

}}

className="

w-full

rounded-lg

bg-zinc-900

border

border-zinc-700

px-3

py-2

"

/>

</div>

<div>

<label

className="

block

text-xs

text-zinc-400

mb-2

"

>

Expected Delivery

</label>

<input

type="date"

value={expectedDeliveryDate}

onChange={(e)=>{

const value=

e.target.value

setExpectedDeliveryDate(value)

const start=

new Date(order.order_date)

const end=

new Date(value)

const diff=

Math.ceil(

(

end.getTime()

-

start.getTime()

)

/(

1000*60*60*24

)

)

setDeliveryLeadDays(diff)

}}

className="

w-full

rounded-lg

bg-zinc-900

border

border-zinc-700

px-3

py-2

"

/>

</div>

</div>
<div>

<h2

className="

text-xl

font-semibold

mb-4

"

>

Order Items

</h2>

<div

className="

overflow-x-auto

rounded-xl

border

border-zinc-700

"

>

<table

className="

w-full

text-sm

"

>

<thead>

<tr

className="

border-b

border-zinc-700

bg-zinc-900

"

>

<th className="p-3">

SR

</th>

<th>

Product

</th>

<th>

Qty

</th>

<th>

Price

</th>

<th>

GST

</th>

<th>

Total

</th>

<th>

Action

</th>

</tr>

</thead>

<tbody>
    {

lines.map((line,index)=>(

<tr

key={line.id}

className="

border-b

border-zinc-800

"

>

<td>

<select

value={line.product}

onChange={(e)=>{

const selected=

products.find(

p=>p.id===Number(e.target.value)

)

if(!selected)return

const copy=[...lines]

copy[index]={

...copy[index],

product:selected.id,

product_name:selected.product_name,

sr_number:selected.sr_number,

gst_percentage:Number(selected.gst_percentage),

}

setLines(copy)

}}

className="

rounded-lg

bg-zinc-900

border

border-zinc-700

px-2

py-2

"

>

{

products.map(product=>(

<option

key={product.id}

value={product.id}

>

{product.sr_number}

</option>

))

}

</select>

</td>

<td>

<select

value={line.product}

onChange={(e)=>{

const id=

Number(

e.target.value

)

const product=

products.find(

p=>p.id===id

)

if(!product)return

const copy=[...lines]

copy[index]={

...copy[index],

product:id,

product_name:

product.product_name,

sr_number:

product.sr_number,

gst_percentage:

Number(

product.gst_percentage

),

}

setLines(copy)

}}

className="

rounded-lg

bg-zinc-900

border

border-zinc-700

px-2

py-2

"

>

<option value={0}>

Select Product

</option>

{

products.map(product=>(

<option

key={product.id}

value={product.id}

>

{product.product_name}

</option>

))

}

</select>

</td>

<td>

<input

type="number"

min={1}

value={line.quantity}

onChange={(e)=>

updateLine(

index,

"quantity",

Number(e.target.value)

)

}

className="

w-24

rounded-lg

bg-zinc-900

border

border-zinc-700

px-3

py-2

"

/>

</td>

<td>

<input

  type="number"

  min={0}

  step="0.01"

  value={

    Number(line.unit_price).toFixed(2)

  }

  onChange={(e)=>

    updateLine(

      index,

      "unit_price",

      parseFloat(e.target.value) || 0

    )

  }

className="

w-28

rounded-lg

bg-zinc-900

border

border-zinc-700

px-3

py-2

"

/>

</td>

<td>

{Number(line.gst_percentage).toFixed(2)}%

</td>

<td>

₹{

(

Number(line.quantity)

*

Number(line.unit_price)

).toFixed(2)

}

</td>
<td>

<button

type="button"

onClick={()=>

removeLine(index)

}

className="

rounded-lg

bg-red-600

px-3

py-2

hover:bg-red-700

"

>

🗑

</button>

</td>
</tr>

))

}
</tbody>

</table>
<button

type="button"

onClick={addLine}

className="

rounded-lg

bg-emerald-600

px-4

py-2

"

>

+ Add Product

</button>

</div>

</div>
<div>

<label

className="

block

mb-2

text-sm

"

>

Remarks

</label>

<textarea

value={remarks}

onChange={(e)=>

setRemarks(

e.target.value

)
}



rows={4}

className="

w-full

rounded-xl

bg-zinc-900

border

border-zinc-700

p-3

"

/>

</div>
<div

className="

grid

gap-3

justify-end

"

>

<p>

Subtotal :

₹{subtotal.toFixed(2)}

</p>

<p>

GST :

₹{tax.toFixed(2)}

</p>

<p

className="

text-xl

font-bold

"

>

Grand Total :

₹{grandTotal.toFixed(2)}

</p>

</div>
<div

className="

flex

justify-end

"

>

<button

type="submit"

disabled={loading}

className="

rounded-lg

bg-blue-600

px-6

py-3

font-semibold

"

>

{

loading

?

"Saving..."

:

"Save Changes"

}

</button>

</div>
</form>

)

}