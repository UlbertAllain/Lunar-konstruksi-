"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { projectModel, serviceModel } from "./data";

type Props = {
  services?: unknown[];
  projects?: unknown[];
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function FormworkHeader({ services = [], projects = [] }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const serviceLinks = useMemo(
    () => services.map(serviceModel).filter((service) => service.slug).slice(0, 10)
      .map((service) => ({ href: `/services/${service.slug}`, label: service.name })),
    [services],
  );

  const projectLinks = useMemo(
    () => projects.map(projectModel).filter((project) => project.slug).slice(0, 8)
      .map((project) => ({ href: `/projects/${project.slug}`, label: project.title })),
    [projects],
  );

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services", children: serviceLinks },
    { href: "/projects", label: "Projects", children: projectLinks },
    { href: "/#about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="lunar-e-header">
      <div className="e-header-inner">
        <Link className="e-wordmark" href="/" onClick={() => setMobileOpen(false)} aria-label="Lunar Konstruksi home">
          <Image src="/lunar-logo-mark.png" alt="" width={42} height={43} priority />
          <span>Lunar<br />Konstruksi</span>
        </Link>

        <nav className="e-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <div className="group relative" key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrentPath(pathname, link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
              {link.children?.length ? (
                <div className="invisible absolute left-1/2 top-full z-50 w-[250px] -translate-x-1/2 pt-6 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="max-h-[380px] overflow-y-auto border border-[#dedbd5] bg-[#faf8f5] p-3 shadow-xl">
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href}
                        className="block border-b border-[#e6e2dc] px-2 py-3 text-[11px] last:border-none hover:bg-[#eeece7]">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <Link className="e-header-action" href="/contact">
          Discuss a Project <ArrowRight size={13} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="e-mobile-toggle"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="lunar-mobile-navigation"
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="e-mobile-nav" id="lunar-mobile-navigation" aria-label="Mobile navigation">
          {links.map((link) => (
            <div key={link.href}>
              <Link href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
              {link.children?.length ? (
                <details className="px-3 pb-2">
                  <summary className="cursor-pointer py-2 text-xs text-[#75787a]">
                    Browse {link.label.toLowerCase()}
                  </summary>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className="block py-2 text-xs">
                      {child.label}
                    </Link>
                  ))}
                </details>
              ) : null}
            </div>
          ))}
          <Link className="e-mobile-cta" href="/contact" onClick={() => setMobileOpen(false)}>
            Discuss a Project
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
