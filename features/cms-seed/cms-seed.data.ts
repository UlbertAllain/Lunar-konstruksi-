import type { CmsBlock } from "@/cms";
import type { CmsSystemPageKey, UpdateCmsPageInput } from "@/features/pages/page.types";
import type { NavigationSettingsInput } from "@/features/navigation/navigation.types";

function block(
  id: string,
  type: CmsBlock["type"],
  variant: string,
  order: number,
  content: Record<string, unknown> = {},
): CmsBlock {
  return { id, type, variant, order, isVisible: true, content };
}

export const LUNAR_PAGE_SEED: Record<CmsSystemPageKey, UpdateCmsPageInput> = {
  home: {
    status: "published",
    sections: [
      block("home-hero", "hero", "structura", 0, {
        eyebrow: "Architecture · Interior · Construction",
        title: "Ruang yang dirancang dengan jelas, dibangun dengan disiplin.",
        description:
          "Lunar Konstruksi menangani perancangan, interior, renovasi, dan pembangunan melalui proses yang terukur dari konsep sampai penyelesaian.",
        ctaLabel: "Lihat proyek",
        ctaHref: "/projects",
        statOneValue: "08+",
        statTwoValue: "120+",
        statThreeValue: "98%",
        statFourValue: "Integrated",
      }),
      block("home-intro", "intro", "editorial", 10, {
        title: "Satu alur kerja untuk keputusan desain dan pelaksanaan yang lebih rapi.",
        description:
          "Kami membantu klien menyederhanakan koordinasi antara kebutuhan ruang, keputusan desain, dokumentasi teknis, dan pekerjaan lapangan.",
        points: [
          "Ruang dirancang berdasarkan kebutuhan penggunaan, bukan sekadar tampilan.",
          "Keputusan teknis dan material dibahas secara terstruktur sejak awal.",
          "Progres pekerjaan dikomunikasikan dengan jelas sepanjang proyek.",
        ],
      }),
      block("home-stats", "stats", "inline", 20, {
        statOneValue: "08+",
        statTwoValue: "120+",
        statThreeValue: "98%",
        statFourValue: "End-to-end",
      }),
      block("home-services", "services", "poliform", 30, {
        source: "services",
        limit: 6,
      }),
      block("home-process", "process", "timeline", 40, {
        items: [
          { title: "Consult", description: "Memetakan kebutuhan, fungsi ruang, lokasi, target waktu, dan prioritas anggaran." },
          { title: "Draft", description: "Menyusun konsep awal, layout, dan arah desain untuk dibahas bersama." },
          { title: "Develop", description: "Mematangkan detail ruang, material, dan keputusan teknis utama." },
          { title: "Document", description: "Menyiapkan dokumentasi kerja dan kebutuhan koordinasi sebelum eksekusi." },
          { title: "Deliver", description: "Menjalankan dan menyelesaikan pekerjaan dengan kontrol kualitas yang konsisten." },
        ],
      }),
      block("home-projects", "projects", "las-grid", 50, {
        source: "projects",
        featuredOnly: true,
        limit: 6,
      }),
      block("home-testimonials", "testimonials", "minimal", 60, {
        source: "testimonials",
        limit: 6,
      }),
      block("home-cta", "cta", "fnji", 70, {
        title: "Punya proyek yang perlu dirapikan dari sisi desain sampai pelaksanaan?",
        description:
          "Mulai dari pembahasan kebutuhan, ruang lingkup, dan kondisi proyek. Tim Lunar akan membantu menentukan langkah kerja yang paling relevan.",
        ctaLabel: "Diskusikan proyek",
        ctaHref: "/contact",
        secondaryCtaLabel: "Lihat portfolio",
        secondaryCtaHref: "/projects",
      }),
    ],
    seo: {
      title: "Lunar Konstruksi | Architecture, Interior & Construction",
      description:
        "Lunar Konstruksi menyediakan layanan architecture, interior, renovation, construction, dan project coordination dengan proses kerja yang terukur.",
      noIndex: false,
      noFollow: false,
    },
  },
  about: {
    status: "published",
    sections: [
      block("about-hero", "hero", "editorial", 0, {
        eyebrow: "About Lunar",
        title: "Kami bekerja di antara ide desain dan realitas lapangan.",
        description:
          "Lunar Konstruksi dibangun untuk membantu proyek bergerak dengan keputusan yang lebih jelas, koordinasi yang lebih rapi, dan hasil yang tetap relevan terhadap fungsi ruang.",
        ctaLabel: "Diskusikan proyek",
        ctaHref: "/contact",
      }),
      block("about-intro", "intro", "editorial", 10, {
        title: "Desain yang baik harus bisa diterjemahkan menjadi pekerjaan yang masuk akal untuk dibangun.",
        description:
          "Pendekatan kami menghubungkan kebutuhan klien, kualitas visual, pilihan material, dokumentasi teknis, dan kemampuan eksekusi di lapangan.",
        points: [
          "Komunikasi proyek dibuat ringkas dan dapat ditindaklanjuti.",
          "Detail dipertimbangkan bersama fungsi, biaya, dan kemampuan pelaksanaan.",
          "Setiap tahap diarahkan untuk mengurangi keputusan mendadak di lapangan.",
        ],
      }),
      block("about-stats", "stats", "grid", 20, {
        statOneValue: "08+",
        statTwoValue: "120+",
        statThreeValue: "98%",
        statFourValue: "Integrated",
      }),
      block("about-team", "team", "editorial-grid", 30, {
        source: "team",
      }),
      block("about-process", "process", "editorial", 40, {
        items: [
          { title: "Understand", description: "Memahami konteks, kebutuhan, dan kendala proyek sebelum menentukan solusi." },
          { title: "Resolve", description: "Menyelesaikan isu desain dan teknis melalui keputusan yang dapat dijelaskan." },
          { title: "Coordinate", description: "Menjaga informasi, material, dan pekerjaan lintas pihak tetap bergerak dalam satu arah." },
          { title: "Deliver", description: "Menutup proyek dengan perhatian pada kualitas akhir dan fungsi ruang." },
        ],
      }),
      block("about-cta", "cta", "fnji", 50, {
        title: "Kenali cara Lunar menangani kebutuhan proyekmu.",
        description: "Ceritakan ruang, kondisi proyek, dan hasil yang ingin dicapai. Kami mulai dari kebutuhan yang paling konkret.",
        ctaLabel: "Hubungi Lunar",
        ctaHref: "/contact",
        secondaryCtaLabel: "Lihat layanan",
        secondaryCtaHref: "/services",
      }),
    ],
    seo: {
      title: "Tentang Lunar Konstruksi",
      description:
        "Kenali pendekatan Lunar Konstruksi dalam menghubungkan desain, dokumentasi teknis, koordinasi, dan pekerjaan lapangan.",
      noIndex: false,
      noFollow: false,
    },
  },
  services: {
    status: "published",
    sections: [
      block("services-hero", "hero", "editorial", 0, {
        eyebrow: "Services",
        title: "Layanan yang disusun mengikuti kebutuhan nyata sebuah proyek.",
        description:
          "Mulai dari perencanaan ruang sampai pelaksanaan, setiap layanan Lunar dapat digunakan secara terpisah atau dirangkai menjadi alur kerja terintegrasi.",
        ctaLabel: "Konsultasikan kebutuhan",
        ctaHref: "/contact",
      }),
      block("services-list", "services", "poliform", 10, {
        source: "services",
      }),
      block("services-process", "process", "timeline", 20, {
        items: [
          { title: "Brief", description: "Menetapkan kebutuhan, target, ruang lingkup, dan kondisi awal proyek." },
          { title: "Scope", description: "Menentukan layanan dan output yang dibutuhkan agar pekerjaan tidak melebar tanpa arah." },
          { title: "Plan", description: "Menyusun rencana kerja, kebutuhan dokumentasi, material, dan koordinasi." },
          { title: "Execute", description: "Menjalankan pekerjaan berdasarkan scope dan keputusan yang sudah disepakati." },
          { title: "Handover", description: "Menutup pekerjaan dengan pemeriksaan akhir dan penyerahan hasil proyek." },
        ],
      }),
      block("services-faq", "faq", "split", 30, {
        source: "faqs",
      }),
      block("services-cta", "cta", "fnji", 40, {
        title: "Belum yakin layanan mana yang dibutuhkan?",
        description:
          "Kirim gambaran singkat proyekmu. Kami bantu memetakan ruang lingkup yang lebih tepat sebelum masuk ke pembahasan biaya dan jadwal.",
        ctaLabel: "Kirim kebutuhan proyek",
        ctaHref: "/contact",
        secondaryCtaLabel: "Lihat proyek",
        secondaryCtaHref: "/projects",
      }),
    ],
    seo: {
      title: "Layanan | Lunar Konstruksi",
      description:
        "Layanan architecture, interior, renovation, construction, project coordination, dan kebutuhan ruang terintegrasi dari Lunar Konstruksi.",
      noIndex: false,
      noFollow: false,
    },
  },
  projects: {
    status: "published",
    sections: [
      block("projects-hero", "hero", "editorial", 0, {
        eyebrow: "Selected Projects",
        title: "Portfolio sebagai catatan keputusan desain dan kualitas pelaksanaan.",
        description:
          "Setiap proyek menunjukkan konteks yang berbeda: kebutuhan pengguna, kondisi lokasi, material, detail, dan cara ruang tersebut akhirnya diwujudkan.",
        ctaLabel: "Mulai proyek baru",
        ctaHref: "/contact",
      }),
      block("projects-intro", "intro", "minimal", 10, {
        title: "Kami memilih proyek berdasarkan cerita kerjanya, bukan hanya foto akhirnya.",
        description:
          "Portfolio Lunar menampilkan bagaimana kebutuhan awal diterjemahkan menjadi ruang yang lebih terarah, layak dibangun, dan relevan digunakan.",
        points: [
          "Residential dan renovation.",
          "Interior dan fit-out.",
          "Commercial dan project coordination.",
        ],
      }),
      block("projects-list", "projects", "las-grid", 20, {
        source: "projects",
      }),
      block("projects-cta", "cta", "fnji", 30, {
        title: "Punya kondisi proyek yang berbeda dari portfolio di atas?",
        description:
          "Tidak masalah. Setiap proyek dimulai dari konteks yang berbeda. Ceritakan kebutuhan dan kondisi ruangmu agar kami bisa menilai pendekatan yang paling relevan.",
        ctaLabel: "Diskusikan proyek",
        ctaHref: "/contact",
        secondaryCtaLabel: "Lihat layanan",
        secondaryCtaHref: "/services",
      }),
    ],
    seo: {
      title: "Projects | Lunar Konstruksi",
      description:
        "Jelajahi portfolio architecture, interior, renovation, dan construction Lunar Konstruksi.",
      noIndex: false,
      noFollow: false,
    },
  },
  contact: {
    status: "published",
    sections: [
      block("contact-hero", "hero", "minimal", 0, {
        eyebrow: "Project Inquiry",
        title: "Mulai dari kebutuhan proyek yang paling konkret.",
        description:
          "Sampaikan jenis proyek, lokasi, ruang lingkup, dan hasil yang ingin dicapai. Informasi ini membantu tim Lunar menyiapkan tindak lanjut yang lebih relevan.",
        ctaLabel: "Isi project inquiry",
        ctaHref: "#project-inquiry",
      }),
      block("contact-intro", "intro", "minimal", 10, {
        title: "Sebelum bicara solusi, kami perlu memahami konteksnya.",
        description:
          "Semakin jelas informasi awal yang diberikan, semakin mudah bagi kami untuk menilai kebutuhan desain, konstruksi, renovasi, atau koordinasi proyek.",
        points: [
          "Jenis dan fungsi ruang.",
          "Lokasi serta kondisi eksisting.",
          "Target waktu dan prioritas proyek.",
        ],
      }),
    ],
    seo: {
      title: "Contact | Lunar Konstruksi",
      description:
        "Hubungi Lunar Konstruksi untuk mendiskusikan kebutuhan architecture, interior, renovation, construction, dan project coordination.",
      noIndex: false,
      noFollow: false,
    },
  },
};

function navItem(id: string, label: string, href: string, order: number) {
  return {
    id,
    label,
    href,
    target: "internal" as const,
    openInNewTab: false,
    isVisible: true,
    order,
    children: [],
  };
}

export const LUNAR_NAVIGATION_SEED: NavigationSettingsInput = {
  header: [
    navItem("nav-home", "Home", "/", 10),
    navItem("nav-about", "About", "/about", 20),
    navItem("nav-services", "Services", "/services", 30),
    navItem("nav-projects", "Projects", "/projects", 40),
    navItem("nav-contact", "Contact", "/contact", 50),
  ],
  footerPrimary: [
    navItem("footer-home", "Home", "/", 10),
    navItem("footer-about", "About", "/about", 20),
    navItem("footer-services", "Services", "/services", 30),
    navItem("footer-projects", "Projects", "/projects", 40),
    navItem("footer-contact", "Contact", "/contact", 50),
  ],
  footerSecondary: [],
};
