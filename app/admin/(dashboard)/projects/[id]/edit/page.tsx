import ProjectForm from "@/components/admin/forms/project-form";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProjectForm mode="edit" projectId={id} />;
}
