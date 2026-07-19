import ServiceForm from "@/components/admin/forms/service-form";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ServiceForm mode="edit" serviceId={id} />;
}
