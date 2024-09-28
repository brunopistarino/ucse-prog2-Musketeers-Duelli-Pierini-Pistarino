import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputType = React.InputHTMLAttributes<HTMLInputElement>["type"];

interface FormItemComponentProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  type?: InputType;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function FormInput<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  className = "",
  defaultValue = "",
  placeholder = "",
}: FormItemComponentProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue as any}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
