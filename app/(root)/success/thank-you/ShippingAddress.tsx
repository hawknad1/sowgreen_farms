export const ShippingAddress = ({
  shippingAddress,
}: {
  shippingAddress: any
}) => (
  <div className="flex flex-col">
    <h2 className="text-sm font-bold mb-3">Shipping Address</h2>
    <p className="text-sm font-medium text-neutral-500/80 mb-2">
      {shippingAddress?.name || "N/A"}
    </p>
    <p className="text-sm font-medium text-neutral-500/80">
      {shippingAddress?.address || "N/A"}, {shippingAddress?.city || "N/A"},
    </p>
    <p className="text-sm font-medium text-neutral-500/80 mb-2">
      {shippingAddress?.region || "N/A"}
    </p>
    <p className="text-sm font-medium text-neutral-500/80">
      {shippingAddress?.phone || "N/A"}
    </p>
  </div>
)
