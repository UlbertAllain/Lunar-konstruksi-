"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import type { SiteSettings, SocialLink } from "@/features/site-settings";

import { adminCmsRequest, revalidatePublicSite } from "./cms-api";
import {
  CmsButton,
  CmsCard,
  CmsField,
  CmsNotice,
  CmsPageHeader,
  inputClass,
  textareaClass,
} from "./cms-ui";

function createId() {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `social-${suffix}`;
}

export function CmsSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSettings(await adminCmsRequest<SiteSettings>("/api/admin/cms/settings"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Site settings gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await adminCmsRequest<SiteSettings>("/api/admin/cms/settings", {
        method: "PUT",
        body: JSON.stringify({
          identity: settings.identity,
          contact: settings.contact,
          socialLinks: settings.socialLinks.map((item, index) => ({ ...item, order: index * 10 })),
          footer: settings.footer,
          defaultSeo: settings.defaultSeo,
        }),
      });
      setSettings(saved);
      await revalidatePublicSite();
      setMessage("Site settings berhasil disimpan dan cache publik direvalidasi.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Site settings belum dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <p className="py-12 text-center text-sm text-zinc-500">Memuat site settings...</p>;
  }

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title="Site settings"
        description="Identitas perusahaan, kontak, logo, social links, footer, dan default SEO dikelola dari satu tempat. Nilai ini menjadi fallback global untuk halaman publik."
        action={<CmsButton onClick={save} loading={saving}><Save className="h-4 w-4" /> Simpan settings</CmsButton>}
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {message ? <CmsNotice tone="success">{message}</CmsNotice> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <CmsCard>
          <SectionTitle title="Identity" description="Brand identity yang digunakan di seluruh website." />
          <div className="mt-5 space-y-4">
            <CmsField label="Site name"><input className={inputClass} value={settings.identity.siteName} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, siteName: event.target.value } })} /></CmsField>
            <CmsField label="Company name"><input className={inputClass} value={settings.identity.companyName} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, companyName: event.target.value } })} /></CmsField>
            <CmsField label="Tagline"><input className={inputClass} value={settings.identity.tagline} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, tagline: event.target.value } })} /></CmsField>
            <CmsField label="Description"><textarea className={textareaClass} value={settings.identity.description} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, description: event.target.value } })} /></CmsField>
            <CmsField label="Logo URL"><input className={inputClass} value={settings.identity.logoUrl} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, logoUrl: event.target.value } })} placeholder="https://..." /></CmsField>
            <CmsField label="Dark logo URL"><input className={inputClass} value={settings.identity.logoDarkUrl} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, logoDarkUrl: event.target.value } })} placeholder="https://..." /></CmsField>
            <CmsField label="Favicon URL"><input className={inputClass} value={settings.identity.faviconUrl} onChange={(event) => setSettings({ ...settings, identity: { ...settings.identity, faviconUrl: event.target.value } })} placeholder="https://..." /></CmsField>
          </div>
        </CmsCard>

        <CmsCard>
          <SectionTitle title="Contact" description="Informasi kontak resmi yang dapat digunakan renderer publik dan CTA." />
          <div className="mt-5 space-y-4">
            <CmsField label="Email"><input className={inputClass} type="email" value={settings.contact.email} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, email: event.target.value } })} /></CmsField>
            <CmsField label="Phone"><input className={inputClass} value={settings.contact.phone} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, phone: event.target.value } })} /></CmsField>
            <CmsField label="WhatsApp"><input className={inputClass} value={settings.contact.whatsapp} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: event.target.value } })} /></CmsField>
            <CmsField label="Address"><textarea className={textareaClass} value={settings.contact.address} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, address: event.target.value } })} /></CmsField>
            <div className="grid gap-4 sm:grid-cols-3">
              <CmsField label="City"><input className={inputClass} value={settings.contact.city} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, city: event.target.value } })} /></CmsField>
              <CmsField label="Province"><input className={inputClass} value={settings.contact.province} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, province: event.target.value } })} /></CmsField>
              <CmsField label="Postal code"><input className={inputClass} value={settings.contact.postalCode} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, postalCode: event.target.value } })} /></CmsField>
            </div>
            <CmsField label="Maps URL"><input className={inputClass} value={settings.contact.mapsUrl} onChange={(event) => setSettings({ ...settings, contact: { ...settings.contact, mapsUrl: event.target.value } })} placeholder="https://..." /></CmsField>
          </div>
        </CmsCard>

        <CmsCard>
          <SectionTitle title="Default SEO" description="Digunakan ketika sebuah page tidak mengisi SEO sendiri." />
          <div className="mt-5 space-y-4">
            <CmsField label="Default title"><input className={inputClass} value={settings.defaultSeo.title ?? ""} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, title: event.target.value } })} /></CmsField>
            <CmsField label="Default description"><textarea className={textareaClass} value={settings.defaultSeo.description ?? ""} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, description: event.target.value } })} /></CmsField>
            <CmsField label="Default OG image"><input className={inputClass} value={settings.defaultSeo.ogImageUrl ?? ""} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, ogImageUrl: event.target.value } })} /></CmsField>
            <CmsField label="Canonical URL"><input className={inputClass} value={settings.defaultSeo.canonicalUrl ?? ""} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, canonicalUrl: event.target.value } })} /></CmsField>
            <label className="flex items-center gap-2 text-sm text-zinc-700"><input type="checkbox" checked={settings.defaultSeo.noIndex} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, noIndex: event.target.checked } })} /> Default no-index</label>
            <label className="flex items-center gap-2 text-sm text-zinc-700"><input type="checkbox" checked={settings.defaultSeo.noFollow} onChange={(event) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, noFollow: event.target.checked } })} /> Default no-follow</label>
          </div>
        </CmsCard>

        <CmsCard>
          <SectionTitle title="Footer" description="Copy footer yang tidak perlu di-hardcode di komponen website." />
          <div className="mt-5 space-y-4">
            <CmsField label="Short description"><textarea className={textareaClass} value={settings.footer.shortDescription} onChange={(event) => setSettings({ ...settings, footer: { ...settings.footer, shortDescription: event.target.value } })} /></CmsField>
            <CmsField label="Copyright"><input className={inputClass} value={settings.footer.copyrightText} onChange={(event) => setSettings({ ...settings, footer: { ...settings.footer, copyrightText: event.target.value } })} /></CmsField>
          </div>
        </CmsCard>
      </div>

      <CmsCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle title="Social links" description="Tautan sosial yang nantinya dapat dirender secara dinamis di footer/contact." />
          <CmsButton variant="secondary" onClick={() => setSettings({
            ...settings,
            socialLinks: [
              ...settings.socialLinks,
              { id: createId(), label: "Social", url: "https://", isVisible: true, order: settings.socialLinks.length * 10 },
            ],
          })}><Plus className="h-4 w-4" /> Tambah social</CmsButton>
        </div>
        <div className="mt-5 space-y-3">
          {settings.socialLinks.length === 0 ? <p className="text-sm text-zinc-500">Belum ada social link.</p> : settings.socialLinks.map((social, index) => (
            <SocialEditor
              key={social.id}
              social={social}
              onChange={(next) => setSettings({ ...settings, socialLinks: settings.socialLinks.map((item, currentIndex) => currentIndex === index ? next : item) })}
              onRemove={() => setSettings({ ...settings, socialLinks: settings.socialLinks.filter((item) => item.id !== social.id) })}
            />
          ))}
        </div>
      </CmsCard>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <div><p className="font-semibold text-zinc-950">{title}</p><p className="mt-1 text-sm text-zinc-500">{description}</p></div>;
}

function SocialEditor({ social, onChange, onRemove }: { social: SocialLink; onChange: (social: SocialLink) => void; onRemove: () => void }) {
  return (
    <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-[220px_1fr_auto_auto] md:items-end">
      <CmsField label="Label"><input className={inputClass} value={social.label} onChange={(event) => onChange({ ...social, label: event.target.value })} /></CmsField>
      <CmsField label="URL"><input className={inputClass} value={social.url} onChange={(event) => onChange({ ...social, url: event.target.value })} /></CmsField>
      <label className="mb-3 flex items-center gap-2 text-sm text-zinc-700"><input type="checkbox" checked={social.isVisible} onChange={(event) => onChange({ ...social, isVisible: event.target.checked })} /> Visible</label>
      <button type="button" className="mb-1 rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={onRemove}><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}
