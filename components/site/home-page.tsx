import { JsonLd } from "@/components/seo/json-ld";
import { buildBusinessJsonLd } from "@/lib/seo";
import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkHome } from "./formwork/home";

export default async function HomePage() {
  const data =
    await getPublicHomeData();

  return (
    <>
      <JsonLd
        data={buildBusinessJsonLd(
          data.siteContent,
        )}
      />

      <FormworkHome
        data={data}
      />
    </>
  );
}
