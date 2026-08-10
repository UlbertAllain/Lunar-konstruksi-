import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getSiteContentSettings } from "@/modules/site-content/site-content.repository";
import { displayFont } from "./decor";

function whatsappHref(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let normalized = digits;

  if (normalized.startsWith("0")) {
    normalized = `62${normalized.slice(1)}`;
  }

  return `https://wa.me/${normalized}`;
}

export async function FormworkFooter() {
  const content = await getSiteContentSettings();

  const profile = content.companyProfile;

  const office = content.officeLocation;

  const companyName = profile.companyName || "Lunar Konstruksi";

  const shortDescription =
    profile.shortDescription ||
    "Perencanaan, koordinasi, dan pekerjaan konstruksi dengan proses yang jelas dari awal sampai serah terima.";

  const email = profile.email || process.env.NEXT_PUBLIC_COMPANY_EMAIL || "";

  const phone = profile.phone || process.env.NEXT_PUBLIC_COMPANY_PHONE || "";

  const whatsapp = whatsappHref(profile.whatsapp);

  const socials = [
    {
      label: "Instagram",
      shortLabel: "IG",
      href: profile.instagramUrl,
    },
    {
      label: "LinkedIn",
      shortLabel: "IN",
      href: profile.linkedinUrl,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="bg-[#101f37] text-[#f8f4ec]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid gap-10 border-b border-white/15 pb-10 xl:grid-cols-[1.08fr_.92fr] xl:gap-16">
          {/* COMPANY */}
          <div>
            <p
              className={`${displayFont} text-[clamp(2rem,3.1vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]`}
            >
              {companyName}
            </p>

            <p className="mt-4 max-w-xl text-[13px] leading-7 text-white/55">
              {shortDescription}
            </p>

            {socials.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="group grid h-10 w-10 place-items-center rounded-full border border-white/15 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white/55 transition duration-300 hover:-translate-y-0.5 hover:border-[#dcb458]/70 hover:bg-[#dcb458] hover:text-[#14243f]"
                  >
                    {social.shortLabel}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* INFO */}
          <div className="grid gap-8 sm:grid-cols-2">
            {/* CONTACT */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#dcb458]">
                Contact
              </p>

              <div className="mt-4 space-y-3 text-[13px] leading-6 text-white/70">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <Mail className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span className="break-all">{email}</span>
                  </a>
                ) : null}

                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <Phone className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span>{phone}</span>
                  </a>
                ) : null}

                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <MessageCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span>WhatsApp</span>

                    <ArrowUpRight className="mt-1 h-3 w-3 text-white/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dcb458]" />
                  </a>
                ) : null}

                {office.address ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span className="max-w-[280px] whitespace-pre-line">
                      {office.address}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* NAVIGATION */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#dcb458]">
                Navigate
              </p>

              <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-white/70">
                <Link
                  href="/"
                  className="group flex w-fit items-center gap-2 transition hover:text-white"
                >
                  Home
                  <span className="h-px w-0 bg-[#dcb458] transition-all duration-300 group-hover:w-5" />
                </Link>

                <Link
                  href="/projects"
                  className="group flex w-fit items-center gap-2 transition hover:text-white"
                >
                  Proyek
                  <span className="h-px w-0 bg-[#dcb458] transition-all duration-300 group-hover:w-5" />
                </Link>

                <Link
                  href="/services"
                  className="group flex w-fit items-center gap-2 transition hover:text-white"
                >
                  Layanan
                  <span className="h-px w-0 bg-[#dcb458] transition-all duration-300 group-hover:w-5" />
                </Link>

                <Link
                  href="/contact"
                  className="group flex w-fit items-center gap-2 transition hover:text-white"
                >
                  Kontak
                  <span className="h-px w-0 bg-[#dcb458] transition-all duration-300 group-hover:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col gap-3 pt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()}{" "}
            {profile.copyrightText || companyName}
          </span>

          <span>Planning / Coordination / Construction</span>
        </div>
      </div>
    </footer>
  );
}
