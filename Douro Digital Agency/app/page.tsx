import Navbar from "./_components/home/Navbar";
import Hero from "./_components/home/Hero";
import MissionServices from "./_components/home/MissionServices";
import WorkGrid from "./_components/home/WorkGrid";
import HomeTestimonial from "./_components/home/HomeTestimonial";
import ClientLogos from "./_components/home/ClientLogos";
import HomeCTA from "./_components/home/HomeCTA";
import Footer from "./_components/home/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main style={{ padding: "0 48px 180px", display: "flex", flexDirection: "column", gap: 160 }}>
        <MissionServices />
        <WorkGrid />
        <HomeTestimonial />
        <ClientLogos />
        <HomeCTA />
      </main>
      <Footer />
    </>
  );
}
