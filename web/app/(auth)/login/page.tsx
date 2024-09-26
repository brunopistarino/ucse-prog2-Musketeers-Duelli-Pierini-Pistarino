"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/user";
import { Login, loginSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "musketeer@gmail.com.ar.gg",
      password: "Musketeer$01",
    },
  });

  async function onSubmit(values: Login) {
    setIsPending(true);
    const response = await login(values);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      setIsPending(false);
    } else {
      router.push("/estadisticas");
    }
  }

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Inicio de Sesión</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="nombre@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Iniciar sesión
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        ¿Sos un usuario nuevo?{" "}
        <Link href="/register" className="underline">
          Crear una cuenta
        </Link>
      </div>
    </>
  );
}
