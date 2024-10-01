"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import useRegisterFrom from "@/hooks/form/use-register-from";
import FormInput from "@/components/form/form-input";

export default function ModeToggle() {
  const { isPending, form, onSubmit } = useRegisterFrom();

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear un cuenta</h1>
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
        ¿Ya tenes una cuenta?{" "}
        <Link href="/login" className="underline">
          Iniciar sesión
        </Link>
      </div>
    </>
  );
}
