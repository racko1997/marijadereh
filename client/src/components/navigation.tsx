import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="text-white text-sm" />
            </div>
            <span className="text-xl font-semibold text-gray-900">NutriCare</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about-me")}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {translations.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {translations.nav.services}
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {translations.nav.testimonials}
            </button>
            
            {/* Language Toggle - Hidden for now since we force Serbian */}
            
            <button
              onClick={() => scrollToSection("appointment-booking")}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
            >
              {translations.nav.bookNow}
            </button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("about-me")}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
            >
              {translations.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
            >
              {translations.nav.services}
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
            >
              {translations.nav.testimonials}
            </button>
            
            <button
              onClick={() => scrollToSection("appointment-booking")}
              className="block w-full mx-3 my-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-center hover:bg-emerald-600 transition-colors font-semibold"
            >
              {translations.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
