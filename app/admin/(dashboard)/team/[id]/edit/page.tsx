import TeamForm from "@/components/admin/forms/team-form";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TeamForm mode="edit" memberId={id} />;
}
