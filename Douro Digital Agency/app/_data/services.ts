export interface Service {
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  {
    title: "AI Solutions",
    description:
      "Custom AI integrations, chatbots, and intelligent automation that transform how your business operates.",
    href: "/ai-solutions",
  },
  {
    title: "Custom Development",
    description:
      "Full-stack web applications, platforms, and digital products built with modern technologies.",
    href: "/custom-development",
  },
  {
    title: "AI Consulting",
    description:
      "Strategic guidance on AI adoption, implementation roadmaps, and technology stack decisions.",
    href: "/ai-consulting",
  },
];
