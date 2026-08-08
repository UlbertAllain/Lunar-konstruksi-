import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkServices } from "./formwork/services";

export default async function ServicesPage() {
  const data = await getPublicHomeData();
  return <FormworkServices data={data} />;
}
