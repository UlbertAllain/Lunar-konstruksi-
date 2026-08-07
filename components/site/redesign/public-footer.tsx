import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

import { initials } from "./public-helpers";

export function PublicFooter({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const primary = (navigation.footerPrimary.length ? navigation.footerPrimary : navigation.header)
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);
  const secondary = navigation.footerSecondary.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);

  return (
    <footer className="bg-[#202020] text-white">
      <div className="border-b border-white/10 bg-[#292929]">
        <div className="mx-auto grid w-full max-w-[1440px] gap-0 lg:grid-cols-3">
          {settings.contact.email ? (
            <a href={`mailto:${settings.contact.email}`} className="flex min-h-24 items-center gap-4 border-b border-white/10 px-5 sm:px-8 lg:border-b-0 lg:border-r">
              <span className="grid h-10 w-10 place-items-center bg-[#F26722] text-white"><Mail className="h-4 w-4" /></span>
              <span><small className="block text-[9px] uppercase tracking-[0.18em] text-white/45">Email</small><strong className="mt-1 block text-sm font-medium">{settings.contact.email}</strong></span>
            </a>
          ) : null}
          {settings.contact.phone ? (
            <a href={`tel:${settings.contact.phone}`} className="flex min-h-24 items-center gap-4 border-b border-white/10 px-5 sm:px-8 lg:border-b-0 lg:border-r">
              <span className="grid h-10 w-10 place-items-center bg-[#F26722] text-white"><Phone className="h-4 w-4" /></span>
              <span><small className="block text-[9px] uppercase tracking-[0.18em] text-white/45">Phone</small><strong className="mt-1 block text-sm font-medium">{settings.contact.phone}</strong></span>
            </a>
          ) : null}
          {[settings.contact.address, settings.contact.city, settings.contact.province].filter(Boolean).length ? (
            <div className="flex min-h-24 items-center gap-4 px-5 sm:px-8">
              <span className="grid h-10 w-10 place-items-center bg-[#F26722] text-white"><MapPin className="h-4 w-4" /></span>
              <span><small className="block text-[9px] uppercase tracking-[0.18em] text-white/45">Office</small><strong className="mt-1 block text-sm font-medium">{[settings.contact.address, settings.contact.city, settings.contact.province].filter(Boolean).join(", ")}</strong></span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_.65fr_.65fr_.9fr] lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            {settings.identity.logoDarkUrl || settings.identity.logoUrl ? (
              <img src={settings.identity.logoDarkUrl || settings.identity.logoUrl} alt={brand} className="h-12 w-auto max-w-[180px] object-contain" />
            ) : (
              <span className="grid h-12 w-12 place-items-center border-2 border-[#F26722] text-sm font-black">{initials(brand)}</span>
            )}
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
            {settings.footer.shortDescription || settings.identity.description || "Perencanaan, konstruksi, renovasi, dan interior dengan alur kerja yang jelas dari tahap awal sampai penyelesaian."}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F58A50]">Company</p>
          <div className="mt-5 space-y-3">
            {primary.map((item) => <Link key={item.id} href={item.href || "#"} className="block text-sm text-white/60 transition hover:text-white">{item.label}</Link>)}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F58A50]">Information</p>
          <div className="mt-5 space-y-3">
            {secondary.length ? secondary.map((item) => <Link key={item.id} href={item.href || "#"} className="block text-sm text-white/60 transition hover:text-white">{item.label}</Link>) : (
              <><Link href="/services" className="block text-sm text-white/60 hover:text-white">Services</Link><Link href="/projects" className="block text-sm text-white/60 hover:text-white">Projects</Link><Link href="/contact" className="block text-sm text-white/60 hover:text-white">Contact</Link></>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F58A50]">Start a project</p>
          <h3 className="mt-4 text-2xl font-bold leading-tight">Have a project that needs clearer direction?</h3>
          <Link href="/contact" className="mt-6 inline-flex h-11 items-center bg-[#F26722] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#D95113]">Talk to our team</Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-5 text-[11px] text-white/35 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`}</p>
          <p>Architecture · Interior · Construction</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
