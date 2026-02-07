export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  image?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "voice-noob",
    title: "Voice Noob",
    subtitle: "AI Voice Training Platform",
    color: "#2a2a4e",
  },
  {
    slug: "viral-kid",
    title: "Viral-Kid",
    subtitle: "AI Content Generation",
    color: "#1e3348",
  },
  {
    slug: "singularity",
    title: "Singularity",
    subtitle: "AI Research Platform",
    color: "#333",
  },
  {
    slug: "silvr",
    title: "Silvr",
    subtitle: "Revenue-Based Financing",
    color: "#1a2533",
  },
  {
    slug: "lavender",
    title: "Lavender",
    subtitle: "AI Email Coaching",
    color: "#2e1a4e",
  },
];
