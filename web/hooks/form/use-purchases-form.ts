import { useState } from "react";
import { useToast } from "../use-toast";
import { createPruchase } from "@/lib/actions/purchases";
import { Alimento } from "@/lib/zod-schemas";

export default function usePurchasesForm(foodstuffs: Alimento[]) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const onSubmit = async () => {
    setIsPending(true);
    const foodstuffIds = foodstuffs.map((foodstuff) => foodstuff.id);
    const response = await createPruchase(foodstuffIds);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Compra realizada",
      });
      setIsOpen(false);
    }
    setIsPending(false);
  };

  return { isPending, isOpen, setIsOpen, onSubmit } as const;
}
