export const LOCAL_MEDIA = {
  hero: "/lunar-static/hero-blueprint.svg",
  aboutHero: "/lunar-static/about-grid.svg",
  servicesHero: "/lunar-static/services-grid.svg",
  projectsHero: "/lunar-static/projects-grid.svg",
  decorative: [
    "/lunar-static/hero-blueprint.svg",
    "/lunar-static/about-grid.svg",
    "/lunar-static/services-grid.svg",
    "/lunar-static/projects-grid.svg",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}