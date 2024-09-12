"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlimentosType,
  alimentosTypes,
  momentos,
  MomentosType,
} from "@/lib/constants";
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
  const [moment, setMoment] = useQueryState("moment", {
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
      <Select
        value={moment}
        onValueChange={(v) => setMoment(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Todos los momentos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los momentos</SelectItem>
          {Object.keys(momentos).map((key) => (
            <SelectItem key={key} value={key}>
              {momentos[key as MomentosType].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
