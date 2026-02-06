import TestimonialCarousel from "@/app/_components/TestimonialCarousel";
import { contactTestimonials } from "@/app/_data/testimonials";

export default function ContactTestimonials() {
  return (
    <div className="hidden md:block py-8" data-reveal="fade">
      <TestimonialCarousel testimonials={contactTestimonials} />
    </div>
  );
}
