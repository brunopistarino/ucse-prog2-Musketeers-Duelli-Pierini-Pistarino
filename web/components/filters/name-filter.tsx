"use client";
import { useQueryState } from "nuqs";
import { Input } from "../ui/input";

export default function NameFilter() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Input
      placeholder="Buscar por nombre..."
      className="w-64"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
