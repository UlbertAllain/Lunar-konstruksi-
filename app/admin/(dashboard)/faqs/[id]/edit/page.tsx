import FAQForm from "@/components/admin/forms/faq-form";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <FAQForm mode="edit" faqId={id} />;
}
