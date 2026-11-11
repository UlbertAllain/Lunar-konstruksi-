import Link from "next/link";
import {
  ArrowRight,
  Building2,
  DraftingCompass,
  Hammer,
  House,
  Layers3,
} from "lucide-react";

import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import {
  projectModel,
  serviceModel,
  testimonialModel,
  type SiteData,
} from "./data";

const processSteps = [
  {
    title: "Site Survey",
    description: "We review the site, discuss the brief, and identify the conditions that will shape the work.",
  },
  {
    title: "Planning & Coordination",
    description: "We establish the scope, prepare technical requirements, and coordinate the work before construction begins.",
  },
  {
    title: "Construction & Site Review",
    description: "Work progresses on site, with attention to materials, progress, and the agreed scope.",
  },
  {
    title: "Final Inspection & Handover",
    description: "We review completed work, address remaining details, and prepare for handover.",
  },
] as const;

const serviceIcons = [House, Building2, Hammer, Layers3, DraftingCompass] as const;

function EditorialLabel({ children }: { children: React.ReactNode }) {
  return <span className="e-kicker">{children}</span>;
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="e-image">
      <DatabaseImage
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        sizes="(max-width: 590px) 90vw, (max-width: 1000px) 46vw, 30vw"
        placeholderLabel="Project photo pending"
      />
    </div>
  );
}

export function FormworkHome({ data }: { data: SiteData }) {
  const services = data.services.map(serviceModel)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  const projects = data.projects.map(projectModel)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  const testimonials = data.testimonials.map(testimonialModel)
    .filter((testimonial) => testimonial.quote.trim().length > 0);

  const partners = data.siteContent.partners
    .filter((partner) => partner.isPublished)
    .sort((a, b) => a.order - b.order);

  const heroImage = data.siteContent.homeHero?.url
    || LOCAL_MEDIA.capabilityBuilding;

  return (
    <div className="lunar-public-page lunar-editorial-page">
      <FormworkHeader services={data.services} projects={data.projects} />

      <main>
        <section className="e-hero" aria-labelledby="home-heading">
          <div className="e-container">
            <div className="e-hero-stage">
              <h1 id="home-heading" className="e-hero-title">
                <span>Lunar</span>
                <span>Konstruksi</span>
              </h1>
              <div className="e-hero-facts" aria-label="Company overview">
                <div className="e-hero-fact">
                  <strong>{projects.length.toLocaleString("en-US")}</strong>
                  <span>Documented projects</span>
                </div>
                <div className="e-hero-fact">
                  <strong>{services.length.toLocaleString("en-US")}</strong>
                  <span>Listed services</span>
                </div>
                <div className="e-hero-fact">
                  <strong>Solo Raya</strong>
                  <span>Service region</span>
                </div>
              </div>
              <div className="e-hero-photo">
                <DatabaseImage
                  src={heroImage}
                  alt="Lunar Konstruksi architectural and construction work"
                  className="h-full w-full object-cover"
                  sizes="(max-width: 600px) 100vw, 95vw"
                  quality={90}
                  hero
                />
              </div>
            </div>
            <div className="e-hero-statement" aria-label="Our approach from survey to handover">
              <span>From the first site survey,</span>
              <span>through planning and construction,</span>
              <span>to the final handover.</span>
            </div>
          </div>
        </section>

        <section id="about" className="e-section" aria-labelledby="about-heading">
          <div className="e-container">
            <EditorialLabel>About Lunar</EditorialLabel>
            <div className="e-about-layout">
              <h2 id="about-heading" className="e-about-heading">
                <span>
                  The thinking
                  <span className="e-about-thumb" aria-hidden="true">
                    <DatabaseImage src={LOCAL_MEDIA.capabilityStructure} alt="" className="h-full w-full object-cover" sizes="150px" />
                  </span>
                </span>
                <span>
                  <span className="e-about-thumb e-about-thumb--second" aria-hidden="true">
                    <DatabaseImage src={LOCAL_MEDIA.capabilityDetail} alt="" className="h-full w-full object-cover" sizes="150px" />
                  </span>
                  behind
                </span>
                <span>the build.</span>
              </h2>
              <div className="e-about-aside">
                <p className="e-body">
                  A construction project involves hundreds of decisions,
                  from the first measurements to the final finish.
                </p>
                <p className="e-body">
                  At Lunar Konstruksi, we bring planning, technical
                  documentation, and on-site execution together so every
                  stage has a clear direction.
                </p>
                <a className="e-link" href="#process">
                  How We Work <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="e-about-photo">
              <DatabaseImage
                src={LOCAL_MEDIA.capabilityStructure}
                alt="Architectural details in concrete and timber"
                className="h-full w-full object-cover"
                sizes="95vw"
              />
            </div>
            {partners.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[#d9d7d1] pt-6" aria-label="Project partners">
                <span className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#777b7d]">Our partners</span>
                {partners.map((partner) => partner.website ? (
                  <a key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold underline-offset-4 hover:underline">{partner.name}</a>
                ) : <span key={partner.id} className="text-[11px] font-semibold">{partner.name}</span>)}
              </div>
            ) : null}
          </div>
        </section>

        <section id="services" className="e-section e-services" aria-labelledby="services-heading">
          <div className="e-container">
            <EditorialLabel>What We Do</EditorialLabel>
            <div className="e-services-board">
              <div className="e-service-backdrop" aria-hidden="true" />
              <div className="e-service-display">
                <h2 id="services-heading"><strong>Our<br />Services</strong></h2>
              </div>
              {services.slice(0, 5).map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                return (
                  <Link
                    key={service.id}
                    href={service.slug ? `/services/${service.slug}` : "/services"}
                    className={`e-service-note e-service-note--${index + 1}`}
                  >
                    <div className="e-service-note-head">
                      <Icon aria-hidden="true" />
                      <h3>{service.name}</h3>
                    </div>
                    {service.shortDescription ? (
                      <p>{service.shortDescription}</p>
                    ) : null}
                  </Link>
                );
              })}
              {services.length === 0 ? (
                <p className="e-service-fallback">Service information will appear when it is published.</p>
              ) : null}
              <Link className="e-link e-service-more" href="/services">
                Explore Our Services <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="projects" className="e-section e-projects" aria-labelledby="projects-heading">
          <div className="e-container">
            <div className="e-project-top">
              <EditorialLabel>The Work</EditorialLabel>
              <Link className="e-link" href="/projects">
                View All Projects <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="e-project-grid">
              <div className="e-project-intro">
                <h2 id="projects-heading">Selected<br />Projects</h2>
                <p>Spaces, structures, and details</p>
              </div>
              {projects.slice(0, 5).map((project, index) => (
                <Link
                  key={project.id}
                  href={project.slug ? `/projects/${project.slug}` : "/projects"}
                  className={`e-project-tile e-project-tile--${index + 1}`}
                >
                  <ProjectImage src={project.image} alt={project.title} />
                  <div className="e-project-meta">
                    <span className="e-project-category">
                      {project.category}{project.location ? ` / ${project.location}` : ""}
                    </span>
                    <strong>{project.title}</strong>
                    {project.year ? <small>{project.year}</small> : null}
                  </div>
                </Link>
              ))}
              {projects.length === 0 ? (
                <p className="e-project-empty">Project documentation will appear here when published.</p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="process" className="e-section" aria-labelledby="process-heading">
          <div className="e-container">
            <EditorialLabel>Our Process</EditorialLabel>
            <div className="e-process-grid">
              <div>
                <h2 id="process-heading" className="e-process-heading">
                  <span>The way</span>
                  <span>we work.</span>
                </h2>
                <div className="e-process-photo">
                  <DatabaseImage
                    src={LOCAL_MEDIA.processPlanning}
                    alt="Architectural construction detail"
                    className="h-full w-full object-cover"
                    sizes="(max-width: 800px) 90vw, 50vw"
                  />
                </div>
              </div>
              <div className="e-process-list">
                {processSteps.map((step, index) => (
                  <div className="e-process-item" key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
                <Link className="e-link" href="/contact">
                  Discuss Your Project <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section id="testimonials" className="e-section" aria-labelledby="testimonials-heading">
            <div className="e-container">
              <EditorialLabel>Client Feedback</EditorialLabel>
              <div className="e-feedback-layout">
                <h2 id="testimonials-heading" className="e-feedback-intro">
                  Words from our clients about working with us.
                </h2>
                <div>
                  <blockquote className="e-feedback-primary">
                    “{testimonials[0].quote}”
                  </blockquote>
                  <p className="e-feedback-author">
                    <strong>{testimonials[0].name}</strong>
                    {testimonials[0].role ? <span>/ &nbsp;{testimonials[0].role}</span> : null}
                  </p>
                  {testimonials.length > 1 ? (
                    <div className="e-feedback-secondary">
                      {testimonials.slice(1, 3).map((testimonial) => (
                        <div key={testimonial.id}>
                          <blockquote>“{testimonial.quote}”</blockquote>
                          <p className="e-feedback-author">
                            <strong>{testimonial.name}</strong>
                            {testimonial.role ? <span>/ &nbsp;{testimonial.role}</span> : null}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section id="contact-cta" className="e-section e-final-cta" aria-labelledby="contact-cta-heading">
          <div className="e-container">
            <EditorialLabel>Start a Conversation</EditorialLabel>
            <h2 id="contact-cta-heading" className="e-cta-heading">
              <span>Have a site</span>
              <span>in mind?</span>
            </h2>
            <div className="e-cta-bottom">
              <p className="e-body">
                Tell us what you’re planning, where the property is, and
                what stage you’re at. We’ll help you work out the next practical step.
              </p>
              <Link href="/contact" className="e-cta-button">
                Discuss Your Project <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FormworkFooter content={data.siteContent} services={data.services} />
    </div>
  );
}
