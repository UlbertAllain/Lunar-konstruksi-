import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Lunar Konstruksi — Build with clarity",
    template: "%s | Lunar Konstruksi",
  },
  description: "Perusahaan konstruksi, renovasi, interior, dan manajemen proyek dengan proses yang transparan dan terukur.",
  keywords: ["konstruksi", "kontraktor", "renovasi", "interior", "manajemen proyek"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
