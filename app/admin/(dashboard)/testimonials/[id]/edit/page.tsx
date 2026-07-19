import TestimonialForm from "@/components/admin/forms/testimonial-form";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TestimonialForm mode="edit" testimonialId={id} />;
}
