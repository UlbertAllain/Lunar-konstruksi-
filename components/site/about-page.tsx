import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkAbout } from "./formwork/about";

export default async function AboutPage() {
  const data = await getPublicHomeData();
  return <FormworkAbout data={data} />;
}
