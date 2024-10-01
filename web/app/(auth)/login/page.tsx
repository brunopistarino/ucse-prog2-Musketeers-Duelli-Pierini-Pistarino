"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import useLoginForm from "@/hooks/form/use-login-form";
import FormInput from "@/components/form/form-input";

export default function LoginPage() {
  const { isPending, form, onSubmit } = useLoginForm();

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Inicio de Sesión</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            control={form.control}
            name="username"
          />
          <FormInput
            label="Contraseña"
            control={form.control}
            name="password"
            type="password"
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
