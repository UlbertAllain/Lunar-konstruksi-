"use client";

import { useEffect, useState } from "react";

import { publicFetch, type ApiEnvelope } from "@/lib/api";
import { fallbackOverview, type PublicOverview } from "./public-data";

export function usePublicOverview() {
  const [data, setData] = useState<PublicOverview>(fallbackOverview);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;
    publicFetch<ApiEnvelope<PublicOverview>>("/api/public/overview")
      .then((result) => {
        if (!active) return;
        const hasContent =
          result.data.services.length ||
          result.data.projects.length ||
          result.data.team.length ||
          result.data.testimonials.length ||
          result.data.faqs.length;
        if (hasContent) {
          setData({
            services: result.data.services.length ? result.data.services : fallbackOverview.services,
            projects: result.data.projects.length ? result.data.projects : fallbackOverview.projects,
            team: result.data.team.length ? result.data.team : fallbackOverview.team,
            testimonials: result.data.testimonials.length ? result.data.testimonials : fallbackOverview.testimonials,
            faqs: result.data.faqs.length ? result.data.faqs : fallbackOverview.faqs,
          });
          setUsingFallback(false);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return { data, usingFallback };
}
