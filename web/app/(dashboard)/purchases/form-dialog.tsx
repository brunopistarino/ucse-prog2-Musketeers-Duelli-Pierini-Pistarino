import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Alimento } from "@/lib/zod-schemas";

import { useState } from "react";

interface Props {
  children: React.ReactNode;
  foodstuffs: Alimento[];
}

export default function FormDialog({ children, foodstuffs }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const total = foodstuffs.reduce((acc, foodstuff) => {
    const quantity = foodstuff.minimum_quantity - foodstuff.current_quantity;
    return acc + quantity * foodstuff.price;
  }, 0);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Realizar compra</AlertDialogTitle>
          <AlertDialogDescription>...</AlertDialogDescription>
        </AlertDialogHeader>
        {foodstuffs.map((foodstuff) => {
          const quantity =
            foodstuff.minimum_quantity - foodstuff.current_quantity;
          return (
            <div key={foodstuff.id} className="flex items-center gap-2">
              <p className="shrink-0">
                {foodstuff.name} x {quantity}
              </p>
              <div className="border-b w-full border-dashed border-gray-300" />
              <p className="shrink-0">
                {formatCurrency(quantity * foodstuff.price)}
              </p>
            </div>
          );
        })}
        <AlertDialogFooter className="pt-4 items-center">
          <p className="mr-auto">Total: {formatCurrency(total)}</p>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction type="submit" disabled={isPending}>
            Comprar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
