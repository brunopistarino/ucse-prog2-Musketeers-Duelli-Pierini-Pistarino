import { cn } from "@/lib/utils";

interface Props {
  currentQuantity: number;
  minimumQuantity: number;
}

export default function QuantityBar({
  currentQuantity,
  minimumQuantity,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-full h-4 border-2 w-32 overflow-clip",
        currentQuantity === 0 && "border-red-500"
      )}
    >
      <div
        className={cn(
          "h-full rounded-full",
          currentQuantity >= minimumQuantity
            ? "bg-green-500"
            : currentQuantity / minimumQuantity > 0.66
            ? "bg-yellow-500"
            : currentQuantity / minimumQuantity > 0.33
            ? "bg-orange-500"
            : "bg-red-500"
        )}
        style={{
          width: `${(currentQuantity / minimumQuantity) * 100}%`,
        }}
      />
    </div>
  );
}
