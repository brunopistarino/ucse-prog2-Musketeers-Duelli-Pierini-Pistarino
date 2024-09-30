import { useForm, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming you have this component

interface MultiSelectOption {
  value: string;
  name: string;
  emoji?: string;
}

interface FormMultiSelectComponentProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  options: MultiSelectOption[];
  placeholder?: string;
}

export default function FormMultiSelect<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder = "Select options",
}: FormMultiSelectComponentProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
