// import Link from "next/link"
// import StageActions from
//   "./stage-actions"

// export default function
// BatchDetail({
//   batch,
// }: {
//   batch: any
// }) {

//   return (

//     <div className="p-8 text-white">

//       <h1
//         className="
//           text-3xl
//           font-bold
//         "
//       >
//         {batch.batch_number}
//       </h1>
//       {
//         batch.status === "PRODUCTION_COMPLETE"
//         && (
//           <Link
//             href={
//               `/production/inspections/create?batch=${batch.id}`
//             }

//             className="
//               mt-4
//               inline-block
//               rounded-lg
//               bg-green-600
//               px-4
//               py-2
//               text-white
//             "
//           >
//             Create Inspection
//           </Link>
//         )
//       }
//       <div
//         className="
//           mt-6
//           grid
//           gap-4
//           md:grid-cols-4
//         "
//       >

//         <Metric
//           label="Planned Qty"
//           value={batch.planned_quantity}
//         />

//         <Metric
//           label="Actual Qty"
//           value={
//             batch.actual_quantity
//             || 0
//           }
//         />

//         <Metric
//           label="Current Stage"
//           value={
//             batch.current_stage
//           }
//         />

//         <Metric
//           label="Status"
//           value={batch.status}
//         />

//       </div>

//       {batch.inspection_complete ? (

//         <div
//           className="
//             mt-6
//             rounded-xl
//             border
//             border-green-800
//             bg-green-900/20
//             p-6
//           "
//         >

//           <h3
//             className="
//               text-lg
//               font-semibold
//               text-green-400
//             "
//           >
//             Inspection Complete
//           </h3>

//           <p
//             className="
//               mt-2
//               text-zinc-300
//             "
//           >
//             All units have been inspected.
//             Packing can begin.
//           </p>

//           <Link
//             href={
//               `/production/packets/create?batch=${batch.id}`
//             }

//             className="
//               mt-4
//               inline-block
//               rounded-lg
//               bg-green-600
//               px-4
//               py-2
//             "
//           >
//             Generate Packets
//           </Link>

//         </div>

//       ) : (

//         <div
//           className="
//             mt-6
//             rounded-xl
//             border
//             border-yellow-800
//             bg-yellow-900/20
//             p-6
//           "
//         >

//           <h3
//             className="
//               text-lg
//               font-semibold
//               text-yellow-400
//             "
//           >
//             Inspection Pending
//           </h3>

//           <p>
//             Remaining for inspection:
//             {" "}
//             {batch.remaining_for_inspection}
//           </p>

//         </div>

//       )}

//       <div
//         className="
//           mt-8
//           rounded-xl
//           border
//           border-zinc-800
//           p-6
//         "
//       >

//         <h2
//           className="
//             mb-4
//             text-xl
//             font-semibold
//           "
//         >
//           Stages
//         </h2>

//         <div className="space-y-4">

//           {
//             batch.stages.map(
//               (stage: any) => (

//                 <div
//                   key={stage.id}

//                   className="
//                     flex
//                     items-center
//                     justify-between

//                     rounded-lg
//                     border
//                     border-zinc-800

//                     p-4
//                   "
//                 >

//                   <div>

//                     <div>

//                       {stage.stage_name}

//                     </div>

//                     <div
//                       className="
//                         text-sm
//                         text-zinc-500
//                       "
//                     >

//                       Sequence:
//                       {" "}
//                       {stage.sequence}

//                     </div>

//                   </div>

//                   <span
//                     className={

//                         stage.status === "PRODUCTION_COMPLETE"

//                         ? "text-green-400"

//                         : stage.status === "IN_PROGRESS"

//                         ? "text-blue-400"

//                         : "text-zinc-400"
//                     }
//                     >

//                     {stage.status}

//                     </span>
//                     <StageActions

//                       batchId={batch.id}

//                       stage={stage}

//                     />
//                 </div>
//               )
//             )
//           }

//         </div>

//       </div>

//     </div>
//   )
// }

// function Metric({
//   label,
//   value,
// }: {
//   label: string
//   value: any
// }) {

//   return (

//     <div
//       className="
//         rounded-xl
//         border
//         border-zinc-800
//         p-6
//       "
//     >

//       <p
//         className="
//           text-sm
//           text-zinc-400
//         "
//       >
//         {label}
//       </p>

//       <p
//         className="
//           mt-2
//           text-xl
//           font-bold
//         "
//       >
//         {value}
//       </p>

//     </div>
//   )
// }


//////////////////////////////////////////////////REPLACED WITH NEW BATCH DETAIL PAGE INSIDE TRACKING/////////////////////////////////////////////////