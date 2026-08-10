import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkHeader } from "./formwork/header";

export async function SiteHeader() {
  const data = await getPublicHomeData();

  return (
    <FormworkHeader
      services={data.services}
      projects={data.projects}
    />
  );
}

export default SiteHeader;