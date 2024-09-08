import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ModeToggle() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear un cuenta</h1>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Crear cuenta
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        ¿Ya tenes una cuenta?{" "}
        <Link href="/login" className="underline">
          Iniciar sesión
        </Link>
      </div>
    </>
  );
}
