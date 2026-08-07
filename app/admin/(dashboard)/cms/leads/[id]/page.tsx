import { CmsLeadEditor } from "@/components/admin/cms/cms-lead-editor";

export default async function CmsLeadEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CmsLeadEditor leadId={id} />;
}
