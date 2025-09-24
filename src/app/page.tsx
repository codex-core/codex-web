import Navbar from "@/components/Navbar";
import Industries from "@/components/Industries";
import Solutions from "@/components/Solutions";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Industries />
      <Solutions />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
