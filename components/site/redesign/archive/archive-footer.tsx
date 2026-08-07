import Link from "next/link";

import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

export function ArchiveFooter({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const links = (navigation.footerPrimary.length ? navigation.footerPrimary : navigation.header).filter((item) => item.isVisible).sort((a,b)=>a.order-b.order);

  return (
    <footer className="border-t border-[#D9CDBD]/15 bg-[#1E1A17] text-[#EFE5D6]">
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#D76642]">Archive / Closing record</p>
            <h2 className="mt-4 max-w-xl font-serif text-[38px] leading-[0.98] tracking-[-0.035em]">{brand}</h2>
            <p className="mt-5 max-w-xl text-[11px] leading-6 text-[#EFE5D6]/58">{settings.footer.shortDescription || settings.identity.description || "Design, construction, renovation, and project coordination documented with a clear working process."}</p>
          </div>
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#D76642]">Index</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((item,index)=><Link key={item.id} href={item.href || "#"} className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#EFE5D6]/62 hover:text-white"><span className="mr-2 text-[#D76642]">{String(index+1).padStart(2,"0")}</span>{item.label}</Link>)}
            </div>
          </div>
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#D76642]">Contact record</p>
            <div className="mt-4 space-y-2 font-mono text-[9px] uppercase leading-5 tracking-[0.08em] text-[#EFE5D6]/62">
              {settings.contact.email ? <p>{settings.contact.email}</p> : null}
              {settings.contact.phone ? <p>{settings.contact.phone}</p> : null}
              {[settings.contact.address,settings.contact.city,settings.contact.province].filter(Boolean).length ? <p>{[settings.contact.address,settings.contact.city,settings.contact.province].filter(Boolean).join(", ")}</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.13em] text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.footer.copyrightText || `© ${new Date().getFullYear()} ${brand}`}</p>
          <p>Record classification: public company profile</p>
        </div>
      </div>
    </footer>
  );
}
