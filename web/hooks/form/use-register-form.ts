import { useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Register, registerSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/lib/actions/user";
import { pages } from "@/lib/constants";

export default function useRegisterForm() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: Register) {
    setIsPending(true);
    const response = await register(values);
    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      setIsPending(false);
    } else {
      router.push(pages[0].href);
    }
  }

  return { isPending, form, onSubmit } as const;
}
