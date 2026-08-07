import type { SeoMetadata } from "@/features/seo/seo.types";

export function PublicSeoTags({ metadata }: { metadata: SeoMetadata }) {
  const robots = [
    metadata.noIndex ? "noindex" : "index",
    metadata.noFollow ? "nofollow" : "follow",
  ].join(", ");

  return (
    <>
      {metadata.title ? <title>{metadata.title}</title> : null}
      {metadata.description ? (
        <meta name="description" content={metadata.description} />
      ) : null}
      <meta name="robots" content={robots} />
      {metadata.title ? (
        <meta property="og:title" content={metadata.title} />
      ) : null}
      {metadata.description ? (
        <meta property="og:description" content={metadata.description} />
      ) : null}
      {metadata.ogImageUrl ? (
        <meta property="og:image" content={metadata.ogImageUrl} />
      ) : null}
      {metadata.canonicalUrl ? (
        <link rel="canonical" href={metadata.canonicalUrl} />
      ) : null}
    </>
  );
}
