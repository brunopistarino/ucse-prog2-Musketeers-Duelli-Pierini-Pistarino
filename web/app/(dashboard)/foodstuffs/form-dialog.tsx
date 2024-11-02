"use client";

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
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Foodstuff } from "@/lib/zod-schemas";
import { Trash2 } from "lucide-react";
import useFoodstuffsForm from "@/hooks/form/use-foodstuffs-form";
import { getFoodstuffTypes, getMeals } from "@/lib/utils";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormMultiSelect from "@/components/form/form-multi-select";

interface Props {
  children: React.ReactNode;
  foodstuff?: Foodstuff;
}

export default function FormDialog({ children, foodstuff }: Props) {
  const { form, isPending, isOpen, setIsOpen, onSubmit, onDelete } =
    useFoodstuffsForm(foodstuff);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {foodstuff ? "Modify Foodstuff" : "Add Foodstuff"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Foodstuffs are used to create recipes and control their quantity in
            stock.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Name"
              placeholder="Tomato"
              control={form.control}
              name="name"
            />
            <FormSelect
              label="Type of foodstuff"
              placeholder="Choose a type of foodstuff"
              options={getFoodstuffTypes()}
              control={form.control}
              name="type"
            />
            <FormMultiSelect
              label="Meals"
              placeholder="Choose meals"
              options={getMeals()}
              control={form.control}
              name="meals"
            />
            <FormInput
              label="Price"
              placeholder="50.00"
              control={form.control}
              name="price"
              type="number"
            />
            <div className="flex gap-4">
              <FormInput
                label="Current quantity"
                placeholder="10"
                control={form.control}
                name="current_quantity"
                type="number"
                className="w-full"
              />
              <FormInput
                label="Minimum quantity"
                placeholder="5"
                control={form.control}
                name="minimum_quantity"
                type="number"
                className="w-full"
              />
            </div>
            <AlertDialogFooter className="pt-4">
              {foodstuff && (
                <Button
                  variant="destructive"
                  className="mr-auto gap-2 mt-2 sm:mt-0 w-full sm:w-auto"
                  disabled={isPending}
                  onClick={onDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
              <AlertDialogCancel
                disabled={isPending}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={isPending}>
                {foodstuff ? "Modify" : "Add"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
