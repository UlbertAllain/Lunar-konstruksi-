"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { displayFont } from "./decor";
import { projectModel, serviceModel } from "./data";

type Props = {
  services?: unknown[];
  projects?: unknown[];
};

function activePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FormworkHeader({ services = [], projects = [] }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<
    "projects" | "services" | null
  >(null);

  const serviceItems = useMemo(
    () => services.map(serviceModel).filter((item) => item.slug),
    [services],
  );

  const projectItems = useMemo(
    () => projects.map(projectModel).filter((item) => item.slug),
    [projects],
  );

  const groups = [
    {
      key: "projects" as const,
      href: "/projects",
      label: "Proyek",
      items: projectItems.map((item) => ({
        href: `/projects/${item.slug}`,
        label: item.title,
        meta: item.location,
      })),
    },
    {
      key: "services" as const,
      href: "/services",
      label: "Layanan",
      items: serviceItems.map((item) => ({
        href: `/services/${item.slug}`,
        label: item.name,
        meta: "Layanan",
      })),
    },
  ];

  function closeMobile() {
    setOpen(false);
    setMobileGroup(null);
  }

  return (
    <>
      <div className="h-[76px] sm:h-[82px]" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d8d1c6] bg-[#f5f1e8]/95 text-[#182d4d] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:h-[82px] sm:px-8 lg:px-10">
          <Link
            href="/"
            onClick={closeMobile}
            className="group flex min-w-0 items-center gap-3"
            aria-label="Lunar Konstruksi"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center sm:h-11 sm:w-11">
              <Image
                src="/lunar-logo-mark.png"
                alt=""
                width={750}
                height={770}
                priority
                className="h-10 w-10 object-contain transition duration-300 group-hover:scale-[1.04] sm:h-11 sm:w-11"
              />
            </span>

            <span className="hidden sm:block">
              <span
                className={`${displayFont} block text-[1.02rem] font-black uppercase leading-none tracking-[0.12em]`}
              >
                Lunar
              </span>
              <span className="mt-1 block font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-[#b58c2f]">
                Konstruksi
              </span>
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-[#d8d1c6] bg-white/35 p-1 lg:flex">
            <Link
              href="/"
              className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                activePath(pathname, "/")
                  ? "bg-[#14243f] text-[#f8f4ec]"
                  : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
              }`}
            >
              Home
            </Link>

            {groups.map((group) => (
              <div key={group.key} className="group/nav relative">
                <Link
                  href={group.href}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                    activePath(pathname, group.href)
                      ? "bg-[#14243f] text-[#f8f4ec]"
                      : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
                  }`}
                >
                  {group.label}
                  <ChevronDown className="h-3 w-3 transition duration-200 group-hover/nav:rotate-180" />
                </Link>

                {group.items.length ? (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                    <div className="lunar-dropdown-panel overflow-hidden border border-[#d8d1c6] bg-[#f8f4ec] shadow-[0_24px_60px_rgba(20,36,63,0.16)]">
                      <div className="border-b border-[#ded7cb] px-4 py-3">
                        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#b58c2f]">
                          Pilih {group.label}
                        </p>
                      </div>

                      <div className="max-h-[360px] overflow-y-auto p-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group/item flex items-center justify-between gap-4 border-b border-[#e5ded3] px-3 py-3 last:border-b-0 hover:bg-[#eee8df]"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[12px] font-semibold text-[#14243f]">
                                {item.label}
                              </span>
                              <span className="mt-1 block truncate font-mono text-[7px] uppercase tracking-[0.13em] text-[#89919c]">
                                {item.meta}
                              </span>
                            </span>

                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#b58c2f] transition duration-200 group-hover/item:translate-x-1" />
                          </Link>
                        ))}
                      </div>

                      <Link
                        href={group.href}
                        className="group/all flex items-center justify-between bg-[#14243f] px-4 py-3 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#f8f4ec]"
                      >
                        Lihat semua {group.label}
                        <ArrowRight className="h-3.5 w-3.5 text-[#dcb458] transition group-hover/all:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            <Link
              href="/contact"
              className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                activePath(pathname, "/contact")
                  ? "bg-[#14243f] text-[#f8f4ec]"
                  : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
              }`}
            >
              Kontak
            </Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="h-px w-8 bg-[#dcb458]" />
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:bg-[#14243f] hover:text-[#f8f4ec]"
            >
              Konsultasikan proyek
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] sm:h-11 sm:w-11 lg:hidden"
            aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="lunar-mobile-menu border-t border-[#d8d1c6] bg-[#f5f1e8] px-4 pb-6 pt-2 sm:px-8 lg:hidden">
            <nav className="mx-auto flex max-w-[1480px] flex-col">
              <Link
                href="/"
                onClick={closeMobile}
                className={`border-b border-[#ddd5c8] py-4 text-sm font-semibold ${
                  pathname === "/" ? "text-[#b58c2f]" : "text-[#14243f]"
                }`}
              >
                Home
              </Link>

              {groups.map((group) => {
                const expanded = mobileGroup === group.key;

                return (
                  <div key={group.key} className="border-b border-[#ddd5c8]">
                    <div className="flex items-center">
                      <Link
                        href={group.href}
                        onClick={closeMobile}
                        className={`flex-1 py-4 text-sm font-semibold ${
                          activePath(pathname, group.href)
                            ? "text-[#b58c2f]"
                            : "text-[#14243f]"
                        }`}
                      >
                        {group.label}
                      </Link>

                      {group.items.length ? (
                        <button
                          type="button"
                          onClick={() =>
                            setMobileGroup(expanded ? null : group.key)
                          }
                          className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d1c6]"
                          aria-label={`Buka daftar ${group.label}`}
                          aria-expanded={expanded}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : null}
                    </div>

                    {expanded ? (
                      <div className="mb-3 border-l border-[#dcb458] pl-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobile}
                            className="group/mobile flex items-center justify-between gap-3 py-3 text-[12px] text-[#526074]"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#b58c2f] transition group-hover/mobile:translate-x-1" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <Link
                href="/contact"
                onClick={closeMobile}
                className={`border-b border-[#ddd5c8] py-4 text-sm font-semibold ${
                  activePath(pathname, "/contact")
                    ? "text-[#b58c2f]"
                    : "text-[#14243f]"
                }`}
              >
                Kontak
              </Link>

              <Link
                href="/contact"
                onClick={closeMobile}
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#f8f4ec]"
              >
                Konsultasikan proyek
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
