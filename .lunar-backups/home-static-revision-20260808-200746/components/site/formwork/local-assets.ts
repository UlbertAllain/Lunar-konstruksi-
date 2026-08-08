export const LOCAL_MEDIA = {
  hero: "",
  aboutHero: "",
  servicesHero: "",
  projectsHero: "",
  decorative: [

  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}