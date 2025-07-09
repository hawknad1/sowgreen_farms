// // components/MessageBubble.tsx
// import { format } from "date-fns"

// export const MessageBubble = ({
//   message,
//   isCustomer,
// }: {
//   message: {
//     content: string
//     timestamp: Date
//     read?: boolean
//     readAt?: Date
//   }
//   isCustomer: boolean
// }) => {
//   return (
//     <div
//       className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
//     >
//       <div
//         className={`rounded-lg p-3 max-w-[80%] ${
//           isCustomer
//             ? "bg-gray-100 text-gray-800"
//             : message.read
//               ? "bg-blue-400"
//               : "bg-blue-500"
//         } text-white`}
//       >
//         <p className="text-sm">{message.content}</p>
//         <div className="flex justify-between items-center mt-1">
//           <p
//             className={`text-xs ${isCustomer ? "text-gray-500" : "text-blue-100"}`}
//           >
//             {format(new Date(message.timestamp), "h:mm a")}
//           </p>
//           {!isCustomer && message.read && (
//             <span className="text-xs text-blue-100 ml-2">
//               ✓ Read{" "}
//               {message.readAt && format(new Date(message.readAt), "h:mm a")}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// components/MessageBubble.tsx
import { format } from "date-fns"

interface Message {
  content: string
  timestamp: Date | string
  sender?: "customer" | "admin"
  read?: boolean
  readAt?: Date | string
}

export const MessageBubble = ({
  message,
  isCustomer,
}: {
  message: Message
  isCustomer: boolean
}) => {
  // Safely parse dates
  const timestamp =
    typeof message.timestamp === "string"
      ? new Date(message.timestamp)
      : message.timestamp

  const readAt = message.readAt
    ? typeof message.readAt === "string"
      ? new Date(message.readAt)
      : message.readAt
    : undefined

  return (
    <div
      className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
    >
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isCustomer
            ? "bg-gray-100 text-gray-800"
            : message.read
              ? "bg-blue-400"
              : "bg-blue-500"
        } text-black`}
      >
        <p className="text-sm">{message.content}</p>
        <div className="flex justify-between items-center mt-1">
          <p
            className={`text-xs ${isCustomer ? "text-gray-500" : "text-blue-100"}`}
          >
            {format(timestamp, "h:mm a")}
          </p>
          {!isCustomer && message.read && readAt && (
            <span className="text-xs text-blue-100 ml-2">
              ✓ Read {format(readAt, "h:mm a")}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
