import { Foodstuff, foodstuffSchema } from "@/lib/zod-schemas";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFoodstuff,
  deleteFoodstuff,
  updateFoodstuff,
} from "@/lib/actions/foodstuffs";

export default function useFoodstuffsForm(foodstuff?: Foodstuff) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Foodstuff>({
    resolver: zodResolver(foodstuffSchema),
    defaultValues: {
      name: foodstuff?.name,
      type: foodstuff?.type,
      meals: foodstuff?.meals || [],
      price: foodstuff?.price,
      current_quantity: foodstuff?.current_quantity,
      minimum_quantity: foodstuff?.minimum_quantity,
    },
  });

  async function onSubmit(values: Foodstuff) {
    setIsPending(true);
    const response = foodstuff
      ? await updateFoodstuff(values, foodstuff.id!)
      : await createFoodstuff(values);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Alimento ${foodstuff ? "modificado" : "agregado"}`,
      });
      if (!foodstuff) {
        form.reset();
      }
      setIsOpen(false);
    }
    setIsPending(false);
  }

  async function onDelete() {
    setIsPending(true);
    const response = await deleteFoodstuff(foodstuff?.id!);
    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Alimento eliminado`,
      });
    }
    setIsPending(false);
    setIsOpen(false);
  }

  return {
    form,
    isPending,
    isOpen,
    setIsOpen,
    onSubmit,
    onDelete,
  } as const;
}
