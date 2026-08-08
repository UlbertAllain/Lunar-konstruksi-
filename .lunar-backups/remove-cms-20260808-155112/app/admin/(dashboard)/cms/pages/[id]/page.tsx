import { CmsPageEditor } from "@/components/admin/cms/cms-page-editor";

export default async function CmsPageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CmsPageEditor pageId={id} />;
}
