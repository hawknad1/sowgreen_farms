// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"

// export function WhatsappOptIn() {
//   return (
//     <FormField
//       name="whatsappOptIn"
//       render={({ field }) => (
//         <FormItem>
//           <div className="items-top flex space-x-2">
//             <FormControl>
//               <Checkbox
//                 id="whatsapp-opt-in"
//                 checked={field.value}
//                 onCheckedChange={field.onChange}
//                 className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
//               />
//             </FormControl>
//             <div className="grid gap-1.5 leading-none">
//               <FormLabel
//                 htmlFor="whatsapp-opt-in"
//                 className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 I agree to receive order updates via WhatsApp
//               </FormLabel>
//               <p className="text-xs md:text-sm text-muted-foreground">
//                 You'll get shipping confirmations and delivery alerts.
//               </p>
//             </div>
//           </div>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   )
// }

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"

export function WhatsappOptIn() {
  return (
    <FormField
      name="whatsappOptIn"
      render={({ field }) => (
        <FormItem>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <FormControl>
                  <Checkbox
                    id="whatsapp-opt-in"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1 h-5 w-5 rounded border-black border-2 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel
                    htmlFor="whatsapp-opt-in"
                    className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Receive order updates via WhatsApp
                  </FormLabel>
                  <p className="text-xs text-gray-500">
                    Get real-time shipping confirmations and delivery alerts on
                    WhatsApp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
