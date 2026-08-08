"use client";

import { useEffect, useState } from "react";

import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type { ConstructionService } from "@/modules/services/service.types";

export function ServiceSelect({
  value,
  onChange,
  optional = false,
}: {
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}) {
  const [services, setServices] = useState<ConstructionService[]>([]);

  useEffect(() => {
    let active = true;
    adminFetch<ApiEnvelope<ConstructionService[]>>("/api/admin/services")
      .then((result) => {
        if (active) setServices(result.data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="admin-input">
      <option value="">{optional ? "Semua layanan / tidak spesifik" : "Pilih layanan"}</option>
      {services.map((service) => (
        <option key={service.id} value={service.id}>{service.name}</option>
      ))}
    </select>
  );
}
