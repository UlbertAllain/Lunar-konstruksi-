import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkHome } from "./formwork/home";

export default async function HomePage() {
  const data = await getPublicHomeData();
  return <FormworkHome data={data} />;
}
