"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import type { MediaImage } from "@/types/media";
import { uploadImage, uploadMultipleImages } from "@/utils/upload-client";

type SingleProps = {
  label: string;
  folder: string;
  value: MediaImage | null | undefined;
  onChange: (value: MediaImage | null) => void;
  required?: boolean;
};

export function MediaUploader({
  label,
  folder,
  value,
  onChange,
  required,
}: SingleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await uploadImage(file, folder);
      onChange({ ...uploaded, alt: value?.alt ?? "" });
      toast.success("Gambar berhasil diunggah ke storage.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    if (!value) return;
    onChange(null);
    toast.success("Gambar akan dilepas saat data disimpan.");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="admin-label">
          {label} {required ? <span className="text-orange-600">*</span> : null}
        </label>
        <span className="text-xs text-slate-400">JPG/PNG/WEBP/AVIF · maks. 5 MB</span>
      </div>

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.url} alt={value.alt || label} className="h-56 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-slate-950/75 p-3 backdrop-blur">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="admin-button-secondary border-white/20 bg-white/10 text-white hover:bg-white/20"
              disabled={uploading}
            >
              <UploadCloud size={16} /> Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="admin-button-danger border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25"
            >
              <Trash2 size={16} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-700 disabled:opacity-60"
        >
          {uploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
          <span className="text-sm font-semibold">
            {uploading ? "Mengunggah ke storage..." : "Pilih gambar dari perangkat"}
          </span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={handleFile} />
    </div>
  );
}

type MultipleProps = {
  label: string;
  folder: string;
  value: MediaImage[];
  onChange: (value: MediaImage[]) => void;
  max?: number;
};

export function MultipleMediaUploader({
  label,
  folder,
  value,
  onChange,
  max = 10,
}: MultipleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (value.length + files.length > max) {
      toast.error(`Gallery maksimal ${max} gambar.`);
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadMultipleImages(files, folder);
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} gambar berhasil diunggah.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gallery gagal.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(image: MediaImage) {
    onChange(value.filter((item) => item.publicId !== image.publicId));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="admin-label">{label}</label>
        <span className="text-xs text-slate-400">{value.length}/{max} gambar</span>
      </div>

      {value.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {value.map((image) => (
            <div key={image.publicId} className="group relative overflow-hidden rounded-xl border bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt || "Gallery"} className="h-32 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-2 top-2 rounded-lg bg-slate-950/75 p-2 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Hapus gambar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || value.length >= max}
        className="admin-button-secondary"
      >
        {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <UploadCloud size={16} />}
        {uploading ? "Mengunggah..." : "Tambah gambar gallery"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={handleFiles}
      />
    </div>
  );
}
