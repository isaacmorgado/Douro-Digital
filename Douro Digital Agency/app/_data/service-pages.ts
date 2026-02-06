export interface ServiceAccordionItem {
  number: string;
  title: string;
  description: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  heroImage: string;

  overview: {
    title: string;
    body: string[];
  };
  stackTitle: string;
  stackSubtitle: string;
  stack: ServiceAccordionItem[];
  relatedProjects: string[];
}

export const servicePages: ServicePage[] = [
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    subtitle: "ai solutions & automation",
    heroDescription:
      "AI agents, automation workflows, and intelligent integrations that eliminate manual work, cut costs, and give your business an unfair advantage.",
    heroImage: "/assets/images/66c3bb125a3bbd5a3d5b3c41_8.webp",
    overview: {
      title: "What are AI Solutions?",
      body: [
        "AI solutions are production-ready systems that use machine learning, natural language processing, and intelligent automation to solve real business problems — from customer support to data processing to decision-making.",
        "At Douro Digital, we build AI that actually ships. Our systems handle voice interactions, automate complex workflows, integrate with your existing tools via custom APIs, and scale as your business grows — all without requiring a dedicated ML team on your end.",
      ],
    },
    stackTitle: "Our Stack",
    stackSubtitle: "Purpose-built AI technology for real business impact.",
    stack: [
      {
        number: "01",
        title: "Conversational AI Agents",
        description:
          "Conversational AI agents that handle customer support, sales qualification, and internal operations via voice and text. Built on leading LLM platforms with custom fine-tuning for your domain.",
      },
      {
        number: "02",
        title: "Automation Pipelines",
        description:
          "End-to-end automation that connects your tools, eliminates manual data entry, and orchestrates complex multi-step processes. We build pipelines that run 24/7 with built-in error handling and monitoring.",
      },
      {
        number: "03",
        title: "AI Integrations & Strategy",
        description:
          "Custom API layers that connect AI capabilities to your existing software stack. We integrate with CRMs, ERPs, databases, and third-party services to create seamless intelligent workflows.",
      },
    ],
    relatedProjects: ["voice-noob", "pocket-agent"],
  },
  {
    slug: "custom-development",
    title: "Custom Development",
    subtitle: "custom software & systems",
    heroDescription:
      "Bespoke software built to become your competitive moat. 100% ownership, zero vendor lock-in, engineered for scale.",
    heroImage: "/assets/images/66c3bb13c9d1cdce681e0e73_10.webp",
    overview: {
      title: "Engineering-Led Development",
      body: [
        "Every project at Douro Digital is led by senior engineers who own the architecture from day one, ensuring best practices and long-term scalability.",
        "We don't build websites — we build competitive advantages. Every line of code is written to serve your business goals: faster performance, lower costs, and systems that scale without breaking.",
      ],
    },
    stackTitle: "Development Services",
    stackSubtitle: "Full-stack engineering for production systems.",
    stack: [
      {
        number: "01",
        title: "Web Applications",
        description:
          "Full-stack web applications built from the ground up. We handle everything from front-end interfaces to back-end logic, databases, and deployment — delivering production-ready software that your team can maintain and extend.",
      },
      {
        number: "02",
        title: "APIs & Architecture",
        description:
          "RESTful and GraphQL APIs, microservices architecture, and system design that scales. We build the backbone your applications depend on.",
      },
      {
        number: "03",
        title: "Data Infrastructure",
        description:
          "Data pipelines, warehouses, and analytics platforms that turn raw data into actionable intelligence. We build infrastructure that scales from startup to enterprise.",
      },
      {
        number: "04",
        title: "Migration & Modernization",
        description:
          "Legacy system modernization and platform migrations handled end-to-end. We move you off outdated tech stacks while preserving data integrity and minimizing downtime.",
      },
      {
        number: "05",
        title: "DevOps & Infrastructure",
        description:
          "CI/CD pipelines, cloud infrastructure, monitoring, and automated deployments. We set up reliable, repeatable processes so your team ships faster with confidence.",
      },
      {
        number: "06",
        title: "Technical Strategy",
        description:
          "Architecture reviews, technology selection, and technical roadmaps. We help you make the right build-vs-buy decisions and design systems that scale with your growth.",
      },
      {
        number: "07",
        title: "Ongoing Support & Maintenance",
        description:
          "Dedicated support and maintenance for your production systems. We handle updates, performance monitoring, security patches, and feature iterations.",
      },
    ],
    relatedProjects: ["pocket-agent", "viral-kid"],
  },
  {
    slug: "ai-consulting",
    title: "AI Consulting",
    subtitle: "ai consulting & strategy",
    heroDescription:
      "From operations audit to AI roadmap to production deployment. We help you identify the highest-impact AI opportunities, build the implementation plan, and train your team to own it.",
    heroImage: "/assets/images/66c3bb125095523f5ce87a2a_9.webp",
    overview: {
      title: "Strategic AI Consulting built for real deployment",
      body: [
        "We focus on the gap between AI potential and operational reality because that's where most companies get stuck — and where the biggest gains are waiting.",
        "Every recommendation comes with implementation specs, timeline estimates, and success metrics. We design the technical architecture, define the data requirements, and create the training plan so your team can execute with confidence and maintain the systems independently.",
      ],
    },
    stackTitle: "Consulting Services",
    stackSubtitle: "Structured AI advisory for measurable results.",
    stack: [
      {
        number: "01",
        title: "AI Operations Audit",
        description:
          "We map every process, tool, and workflow in your organization to identify where AI can eliminate waste, reduce errors, and free up your team's time for higher-value work.",
      },
      {
        number: "02",
        title: "Use-Case Prioritization",
        description:
          "We score every potential AI use case against impact, feasibility, and time-to-value. You get a ranked shortlist of where to invest first.",
      },
      {
        number: "03",
        title: "AI Roadmap & Architecture",
        description:
          "A phased implementation plan with architecture decisions, vendor recommendations, resource requirements, and success metrics. We map the path from current state to full AI integration.",
      },
      {
        number: "04",
        title: "Team Training & Enablement",
        description:
          "Hands-on workshops, documentation, and playbooks that give your team the skills to operate, maintain, and extend AI systems independently.",
      },
      {
        number: "05",
        title: "AI Governance & Ethics",
        description:
          "Framework for responsible AI deployment including data privacy, bias monitoring, transparency guidelines, and compliance requirements tailored to your industry.",
      },
      {
        number: "06",
        title: "Ongoing Advisory",
        description:
          "AI moves fast. We provide ongoing strategic counsel, quarterly reviews, and ad-hoc support so your AI initiatives stay aligned with business goals and evolving technology.",
      },
    ],
    relatedProjects: ["voice-noob", "viral-kid"],
  },
];
