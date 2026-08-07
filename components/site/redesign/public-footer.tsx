import Link from "next/link";

import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

import { initials } from "./public-helpers";

function FooterGroup({ title, items }: { title: string; items: NavigationSettings["header"] }) {
  const visible = items.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  if (!visible.length) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B88B5A]">{title}</p>
      <div className="mt-4 flex flex-col gap-3">
        {visible.map((item) => {
          const target = item.openInNewTab || item.target === "external" ? "_blank" : undefined;
          const rel = target === "_blank" ? "noreferrer" : undefined;
          return (
            <Link key={item.id} href={item.href || "#"} target={target} rel={rel} className="text-sm leading-6 text-white/75 transition hover:text-white">
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PublicFooter({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const mark = initials(brand);

  return (
    <footer className="border-t border-white/10 bg-[#0B0B0A] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] lg:px-8 lg:py-20">
        <div>
          <div className="flex items-center gap-4">
            {settings.identity.logoDarkUrl || settings.identity.logoUrl ? (
              <img src={settings.identity.logoDarkUrl || settings.identity.logoUrl} alt={brand} className="h-12 w-auto object-contain" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B88B5A]/40 bg-[#16120F] text-sm font-semibold tracking-[0.18em] text-[#E6C699]">
                {mark}
              </span>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C7A878]">Design & Build</p>
              <h3 className="text-xl font-semibold tracking-tight text-white">{brand}</h3>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
            {settings.footer.shortDescription ||
              settings.identity.description ||
              "Lunar Konstruksi menangani perancangan, pembangunan, dan penyempurnaan ruang dengan pendekatan yang terukur, rapi, dan dapat dipertanggungjawabkan."}
          </p>
        </div>

        <FooterGroup title="Navigation" items={navigation.footerPrimary.length ? navigation.footerPrimary : navigation.header} />
        <FooterGroup title="Resources" items={navigation.footerSecondary} />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B88B5A]">Contact</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            {settings.contact.email ? <p>{settings.contact.email}</p> : null}
            {settings.contact.phone ? <p>{settings.contact.phone}</p> : null}
            {[settings.contact.address, settings.contact.city, settings.contact.province].filter(Boolean).length ? (
              <p>{[settings.contact.address, settings.contact.city, settings.contact.province].filter(Boolean).join(", ")}</p>
            ) : null}
          </div>
          {settings.contact.whatsapp ? (
            <a
              href={`https://wa.me/${settings.contact.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#B88B5A]/45 px-5 text-sm font-medium text-[#F3E6D4] transition hover:bg-[#B88B5A] hover:text-[#16120F]"
            >
              Start a discussion
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`}</p>
          <p>Crafted for clarity, built for trust.</p>
        </div>
      </div>
    </footer>
  );
}
