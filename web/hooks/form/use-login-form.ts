import { useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Login, loginSchema } from "@/lib/zod-schemas";
import { login } from "@/lib/actions/user";
import { pages } from "@/lib/constants";

export default function useLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "test@formato#importa?ok",
      password: "Musketeer$01",
    },
  });

  async function onSubmit(values: Login) {
    setIsPending(true);
    const response = await login(values);
    if (response?.error) {
      toast({
        title: "Error",
        description:
          response.error === "invalid_grant"
            ? "Wrong email or password"
            : response.error,
        variant: "destructive",
      });
      setIsPending(false);
    } else {
      router.push(pages[0].href);
    }
  }

  return { isPending, form, onSubmit } as const;
}
