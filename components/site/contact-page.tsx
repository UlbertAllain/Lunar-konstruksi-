import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkContact } from "./formwork/contact";

export default async function ContactPage() {
  const data = await getPublicHomeData();
  return <FormworkContact data={data} />;
}
