export const LOCAL_MEDIA = {
  hero: "/lunar-static/home-hero.jpg",
  heroEngineer: "/lunar-static/home-hero-engineer.jpg",

  capabilityStructure: "/lunar-static/home-capability-structure.jpg",
  capabilityBuilding: "/lunar-static/home-capability-building.jpg",
  capabilityDetail: "/lunar-static/home-capability-detail.jpg",

  processPlanning: "/lunar-static/home-process-plan.jpg",
  processNote: "/lunar-static/home-process-site.jpg",

  aboutHero: "/lunar-static/about.png",
  servicesHero: "/lunar-static/services.png",
  projectsHero: "/lunar-static/project.png",

  decorative: [
    "/lunar-static/home-capability-structure.jpg",
    "/lunar-static/home-capability-building.jpg",
    "/lunar-static/home-capability-detail.jpg",
    "/lunar-static/home-process-plan.jpg",
    "/lunar-static/home-process-site.jpg",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}
