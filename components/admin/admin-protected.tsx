"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { adminFetch } from "@/lib/api";
import { logoutAdmin } from "@/lib/firebase/auth";

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }

    let active = true;
    adminFetch("/api/admin/session")
      .then(() => {
        if (active) setAuthorized(true);
      })
      .catch(async () => {
        await logoutAdmin();
        router.replace("/admin/login");
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [loading, router, user]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-sm font-medium">
          <LoaderCircle className="animate-spin text-orange-500" size={20} />
          Memverifikasi akses admin...
        </div>
      </div>
    );
  }

  return authorized ? children : null;
}
