export const LOCAL_MEDIA = {
  hero: "/lunar-static/home-hero.png",
  heroEngineer: "/lunar-static/home-hero-engineer.png",

  capabilityStructure: "/lunar-static/home-capability-structure.png",
  capabilityBuilding: "/lunar-static/home-capability-building.png",
  capabilityDetail: "/lunar-static/home-capability-detail.png",

  processPlanning: "/lunar-static/home-process-plan.png",
  processNote: "/lunar-static/home-process-site.png",

  aboutHero: "/lunar-static/about-hero.png",
  servicesHero: "/lunar-static/services-hero.png",
  projectsHero: "/lunar-static/projects-hero.png",
  contactHero: "/lunar-static/contact-hero.png",

  decorative: [
    "/lunar-static/home-capability-structure.png",
    "/lunar-static/home-capability-building.png",
    "/lunar-static/home-capability-detail.png",
    "/lunar-static/home-process-plan.png",
    "/lunar-static/home-process-site.png",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}