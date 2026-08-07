"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ContactSettings = { whatsapp?: string; email?: string; phone?: string };
type FormState = { name:string; phone:string; email:string; projectType:string; location:string; message:string; website:string };
const initial:FormState={name:"",phone:"",email:"",projectType:"",location:"",message:"",website:""};

export function PublicContactForm({settings}:{settings?:ContactSettings}){
 const[form,setForm]=useState<FormState>(initial);const[busy,setBusy]=useState(false);const[notice,setNotice]=useState<{kind:"ok"|"error";text:string}|null>(null);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(busy)return;setBusy(true);setNotice(null);try{const response=await fetch("/api/public/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,source:"contact-form"})});const payload=(await response.json().catch(()=>null)) as {ok?:boolean;error?:string|{message?:string}}|null;if(!response.ok||!payload?.ok){const message=typeof payload?.error==="string"?payload.error:payload?.error?.message;throw new Error(message||"Permintaan belum dapat dikirim.")}setForm(initial);setNotice({kind:"ok",text:"Permintaan sudah tercatat. Tim Lunar akan meninjau dan menghubungi kamu kembali."})}catch(error){setNotice({kind:"error",text:error instanceof Error?error.message:"Terjadi kendala saat mengirim permintaan."})}finally{setBusy(false)}}
 const field="min-h-12 w-full border border-[#2C2925]/22 bg-[#F6EEDF] px-3 font-mono text-[10px] uppercase tracking-[0.08em] text-[#241F1B] outline-none placeholder:text-[#2C2925]/30 focus:border-[#C94A28] focus:bg-[#FFF8EB]";
 return <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
  <div className="sm:col-span-2 flex items-center justify-between border-b border-[#2C2925]/18 pb-3"><p className="font-mono text-[8px] font-black uppercase tracking-[0.17em] text-[#C94A28]">Form / New Lead Record</p><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#2C2925]/38">Required fields marked by content</p></div>
  <input className={field} value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} placeholder="01 / NAME" required/>
  <input className={field} value={form.phone} onChange={e=>setForm(v=>({...v,phone:e.target.value}))} placeholder="02 / PHONE OR WHATSAPP" required/>
  <input className={field} value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} placeholder="03 / EMAIL / OPTIONAL"/>
  <select className={field} value={form.projectType} onChange={e=>setForm(v=>({...v,projectType:e.target.value}))}><option value="">04 / PROJECT TYPE</option><option value="Residential construction">Residential construction</option><option value="Renovation">Renovation</option><option value="Interior fit-out">Interior fit-out</option><option value="Commercial project">Commercial project</option><option value="Project supervision">Project supervision</option></select>
  <input className={`${field} sm:col-span-2`} value={form.location} onChange={e=>setForm(v=>({...v,location:e.target.value}))} placeholder="05 / PROJECT LOCATION"/>
  <textarea className={`${field} min-h-[130px] resize-y py-3 sm:col-span-2`} value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))} placeholder="06 / PROJECT BRIEF" required/>
  <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm(v=>({...v,website:e.target.value}))}/>
  {notice?<div className={`sm:col-span-2 border px-4 py-3 font-mono text-[9px] uppercase tracking-[0.08em] ${notice.kind==="ok"?"border-[#48664E]/35 bg-[#DDE7DB] text-[#38503D]":"border-[#B6462A]/35 bg-[#F0D8CF] text-[#8E321F]"}`}>{notice.text}</div>:null}
  <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#231F1B] bg-[#231F1B] px-6 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#F4EBDD] transition hover:bg-[#C94A28] hover:border-[#C94A28] disabled:opacity-50 sm:col-span-2">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:null}{busy?"Filing record...":"Submit project record"}</button>
  {settings?.whatsapp?<p className="sm:col-span-2 font-mono text-[8px] uppercase leading-4 tracking-[0.08em] text-[#2C2925]/34">Follow-up channel may use WhatsApp after the lead has been stored in the CMS.</p>:null}
 </form>
}
