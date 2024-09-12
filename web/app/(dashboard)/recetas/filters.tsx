"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlimentosType, alimentosTypes } from "@/lib/constants";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
  });
  const [type, setType] = useQueryState("type", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <>
      <Input
        placeholder="Buscar por nombre..."
        className="w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        value={type}
        onValueChange={(v) => setType(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {Object.keys(alimentosTypes).map((key) => (
            <SelectItem key={key} value={key}>
              {alimentosTypes[key as AlimentosType]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
