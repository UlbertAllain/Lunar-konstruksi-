export const LOCAL_MEDIA = {
  hero: "/lunar-static/home-hero.png",
  aboutHero: "/lunar-static/formwork-about-placeholder.svg",
  servicesHero: "/lunar-static/formwork-services-placeholder.svg",
  projectsHero: "/lunar-static/formwork-projects-placeholder.svg",
  processPlanning: "/lunar-static/formwork-process-planning.svg",
  processNote: "/lunar-static/formwork-site-note.svg",
  decorative: [
    "/home-process-plan.png",
    "/lunar-static/formwork-detail-02.svg",
    "/lunar-static/formwork-detail-03.svg",
    "/lunar-static/formwork-detail-04.svg",
    "/lunar-static/formwork-detail-05.svg",
    "/lunar-static/formwork-detail-06.svg",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}
