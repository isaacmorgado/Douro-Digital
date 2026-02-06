import type { Metadata } from "next";
import RefokusButton from "@/app/_components/RefokusButton";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Stay up to date with the latest news, insights, and thought leadership from Douro Digital Agency.",
};

export default function NewsPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1
        className="text-6xl md:text-7xl lg:text-[10em] font-medium leading-[0.9] mb-6"
        data-reveal="heading-lg"
      >
        News &amp; Insights
      </h1>
      <p
        className="text-2xl md:text-3xl font-medium text-white/70 mb-4"
        data-reveal="text"
      >
        Coming Soon
      </p>
      <p
        className="text-sm md:text-base text-white/50 leading-relaxed mb-10"
        data-reveal="text"
      >
        We&apos;re preparing something great.
      </p>
      <RefokusButton href="/work" label="View Our Work" />
    </section>
  );
}
