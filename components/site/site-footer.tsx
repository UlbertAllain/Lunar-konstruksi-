import { getSiteContentSettings } from "@/modules/site-content/site-content.repository";
import { FormworkFooter } from "./formwork/footer";

export async function SiteFooter() {
  const content =
    await getSiteContentSettings();

  return (
    <FormworkFooter
      content={content}
    />
  );
}

export default SiteFooter;
