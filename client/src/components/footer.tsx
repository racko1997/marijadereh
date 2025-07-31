import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="text-white text-sm" />
              </div>
              <span className="text-xl font-semibold">NutriCare</span>
            </div>
            <p className="text-gray-400 mb-4">
              Profesionalne usluge ishrane za ostvarivanje vaših wellness ciljeva uz personalizovano vođenje i podršku.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@nutricare.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Knez Mihailova 15, Beograd 11000</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Brzi linkovi</h3>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("about-me")}
                className="text-gray-400 hover:text-emerald-400 transition-colors block text-left"
              >
                O meni
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-400 hover:text-emerald-400 transition-colors block text-left"
              >
                Usluge
              </button>
              <button
                onClick={() => scrollToSection("appointment-booking")}
                className="text-gray-400 hover:text-emerald-400 transition-colors block text-left"
              >
                Zakaži konsultaciju
              </button>
              <button
                onClick={() => setLocation("/admin-login")}
                className="text-gray-400 hover:text-emerald-400 transition-colors block text-left"
              >
                Admin prijava
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NutriCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
