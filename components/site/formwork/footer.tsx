import Image from "next/image";
import Link from "next/link";

import type { SiteContentSettings } from "@/modules/site-content/site-content.types";
import { serviceModel } from "./data";

type Props = {
  content: SiteContentSettings;
  services?: unknown[];
};

function validPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /812[\s-]*0{4}/.test(trimmed)) return "";
  return trimmed;
}

function whatsappLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits.startsWith("0") ? `62${digits.slice(1)}` : digits}`;
}

export function FormworkFooter({ content, services = [] }: Props) {
  const profile = content.companyProfile;
  const companyName = profile.companyName?.trim() || "Lunar Konstruksi";
  const email = profile.email?.trim() && profile.email !== "hello@lunarkonstruksi.id"
    ? profile.email.trim()
    : "";
  const phone = validPhone(profile.phone ?? "");
  const location = content.officeLocation.address?.trim();
  const serviceItems = services.map(serviceModel).filter((service) => service.slug).slice(0, 5);
  const whatsapp = whatsappLink(profile.whatsapp || "");

  const socials = [
    { label: "Instagram", href: profile.instagramUrl },
    { label: "LinkedIn", href: profile.linkedinUrl },
  ].filter((social) => social.href?.trim());

  return (
    <footer className="lunar-e-footer">
      <div className="e-footer-inner">
        <div className="e-footer-grid">
          <div>
            <Link className="e-footer-brand" href="/" aria-label="Lunar Konstruksi home">
              <Image src="/lunar-logo-mark.png" alt="" width={41} height={43} />
              <span>Lunar<br />Konstruksi</span>
            </Link>
            <p className="e-footer-summary">
              Construction, technical planning, and interior works in Surakarta and the surrounding area.
            </p>
          </div>
          <div className="e-footer-col">
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/#about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="e-footer-col">
            <h3>Services</h3>
            {serviceItems.length ? serviceItems.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                {service.name}
              </Link>
            )) : (
              <Link href="/services">Explore our services</Link>
            )}
          </div>
          <div className="e-footer-col">
            <h3>Get in Touch</h3>
            {location ? <p>{location}</p> : <p>Surakarta, Central Java</p>}
            {email ? <a href={`mailto:${email}`}>{email}</a> : null}
            {phone ? <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a> : null}
            {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
            {!email && !phone && !whatsapp ? <Link href="/contact">Contact the team</Link> : null}
          </div>
        </div>
        <div className="e-footer-bottom">
          <span>© {new Date().getFullYear()} {profile.copyrightText || companyName}. All rights reserved.</span>
          <div className="e-footer-socials">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
