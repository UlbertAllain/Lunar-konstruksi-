import Link from "next/link";
import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";
import { initials } from "./public-helpers";

export function PublicFooter({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const nav = (navigation.footerPrimary.length ? navigation.footerPrimary : navigation.header).filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  const resources = navigation.footerSecondary.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  return (
    <footer className="bg-[#222224] text-white">
      <div className="border-b border-white/8">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:px-7 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              {settings.identity.logoDarkUrl || settings.identity.logoUrl ? <img src={settings.identity.logoDarkUrl || settings.identity.logoUrl} alt={brand} className="h-10 w-auto" /> : <span className="grid h-10 w-10 place-items-center border border-[#F26422] text-[10px] font-black">{initials(brand)}</span>}
              <div><p className="text-[14px] font-black">{brand}</p><p className="mt-1 text-[7px] font-bold uppercase tracking-[0.16em] text-white/35">Construction · Interior · Renovation</p></div>
            </div>
            <p className="mt-6 max-w-[340px] text-[12px] leading-6 text-white/50">{settings.footer.shortDescription || settings.identity.description || "Perencanaan, pembangunan, renovasi, dan interior dengan koordinasi proyek yang jelas dari awal sampai penyelesaian."}</p>
          </div>
          <div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#FF9A68]">Navigation</p><div className="mt-4 space-y-2">{nav.map((item) => <Link key={item.id} href={item.href || "#"} className="block text-[11px] text-white/55 hover:text-white">{item.label}</Link>)}</div></div>
          <div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#FF9A68]">Resources</p><div className="mt-4 space-y-2">{resources.map((item) => <Link key={item.id} href={item.href || "#"} className="block text-[11px] text-white/55 hover:text-white">{item.label}</Link>)}</div></div>
          <div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#FF9A68]">Contact</p><div className="mt-4 space-y-2 text-[11px] leading-6 text-white/55">{settings.contact.email ? <p>{settings.contact.email}</p> : null}{settings.contact.phone ? <p>{settings.contact.phone}</p> : null}{settings.contact.address ? <p>{settings.contact.address}</p> : null}{settings.contact.city ? <p>{settings.contact.city}{settings.contact.province ? `, ${settings.contact.province}` : ""}</p> : null}</div></div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.1em] text-white/30 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-8"><p>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`}</p><p>Built with clear process and accountable execution.</p></div>
    </footer>
  );
}
