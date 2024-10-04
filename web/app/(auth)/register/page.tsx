"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import useRegisterForm from "@/hooks/form/use-register-form";
import FormInput from "@/components/form/form-input";

export default function RegisterPage() {
  const { isPending, form, onSubmit } = useRegisterForm();

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear una cuenta</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            control={form.control}
            name="email"
          />
          <FormInput
            label="Contraseña"
            control={form.control}
            name="password"
            type="password"
          />
          <FormInput
            label="Confirmar contraseña"
            control={form.control}
            name="confirm_password"
            type="password"
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Crear cuenta
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        ¿Ya tenés una cuenta?{" "}
        <Link href="/login" className="underline">
          Iniciar sesión
        </Link>
      </div>
    </>
  );
}
