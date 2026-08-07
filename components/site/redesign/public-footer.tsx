import Link from "next/link";

import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

function Links({ items }: { items: NavigationSettings["header"] }) {
  return (
    <div className="space-y-3">
      {items
        .filter((item) => item.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <Link key={item.id} href={item.href || "#"} className="block text-sm text-white/60 transition hover:text-white">
            {item.label}
          </Link>
        ))}
    </div>
  );
}

export function PublicFooter({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const description = settings.footer.shortDescription || settings.identity.description || "Design, build, and project coordination for residential and commercial spaces.";

  return (
    <footer className="bg-[#0d0d0c] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-7 pt-16 sm:px-7 lg:px-10 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.6fr_0.55fr_0.55fr_0.8fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a36d]">Lunar Konstruksi</p>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-[#f5f1ea] sm:text-5xl">
              Spaces shaped with purpose, detail, and technical discipline.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/58">{description}</p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">Explore</p>
            <Links items={navigation.footerPrimary.length ? navigation.footerPrimary : navigation.header} />
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">Info</p>
            <Links items={navigation.footerSecondary} />
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">Contact</p>
            <div className="space-y-3 text-sm leading-6 text-white/60">
              {settings.contact.email ? <p>{settings.contact.email}</p> : null}
              {settings.contact.phone ? <p>{settings.contact.phone}</p> : null}
              {[settings.contact.city, settings.contact.province].filter(Boolean).length ? <p>{[settings.contact.city, settings.contact.province].filter(Boolean).join(", ")}</p> : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] uppercase tracking-[0.14em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${brand}`}</p>
          <p>Architecture · Interior · Construction</p>
        </div>
      </div>
    </footer>
  );
}
