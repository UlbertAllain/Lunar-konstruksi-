import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkProjects } from "./formwork/projects";

export default async function ProjectsPage() {
  const data = await getPublicHomeData();
  return <FormworkProjects data={data} />;
}
