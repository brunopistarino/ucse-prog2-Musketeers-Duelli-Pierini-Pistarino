import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Inicio de Sesión</h1>
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
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        ¿Sos un usuario nuevo?{" "}
        <Link href="/signup" className="underline">
          Crear una cuenta
        </Link>
      </div>
    </>
  );
}
