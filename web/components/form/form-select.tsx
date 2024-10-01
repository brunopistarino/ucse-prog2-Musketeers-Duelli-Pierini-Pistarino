"use client";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  name: string;
  emoji?: string;
}

interface FormSelectComponentProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  valueChange?: () => void;
}

export default function FormSelect<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder = "Select an option",
  valueChange,
}: FormSelectComponentProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              valueChange && valueChange();
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                className={field.value ? "" : "text-muted-foreground"}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.emoji && `${option.emoji} `}
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
