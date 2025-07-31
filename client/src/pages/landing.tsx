import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import AboutMeSection from "@/components/about-me-section";
import OfficeGallery from "@/components/office-gallery";
import TestimonialsSection from "@/components/testimonials-section";
import AppointmentBooking from "@/components/appointment-booking";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <AboutMeSection />
      <OfficeGallery />
      <TestimonialsSection />
      <AppointmentBooking />
      <Footer />
    </div>
  );
}
