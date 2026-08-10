import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const googleVerification =
  process.env
    .NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ?.trim();

export const metadata: Metadata = {
  metadataBase:
    new URL(SITE_URL),

  title: {
    default:
      DEFAULT_SEO_TITLE,
    template:
      `%s | ${SITE_NAME}`,
  },

  description:
    DEFAULT_SEO_DESCRIPTION,

  applicationName:
    SITE_NAME,

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  category:
    "Construction",

  icons: {
    icon:
      "/lunar-logo-mark.png",
    shortcut:
      "/lunar-logo-mark.png",
    apple:
      "/lunar-logo-mark.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-snippet": -1,
      "max-video-preview":
        -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
  },

  verification:
    googleVerification
      ? {
          google:
            googleVerification,
        }
      : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}
