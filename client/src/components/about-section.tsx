import { Button } from "@/components/ui/button";
import { UserCheck, TrendingUp, GraduationCap } from "lucide-react";

export default function AboutSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Naše <span className="text-emerald-600">usluge</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Potrebe svakog pojedinca u ishrani su jedinstvene. Naš personalizovani pristup osigurava da dobijete 
            odgovarajuće vođenje za vaše specifične zdravstvene ciljeve i način života.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-green-50 p-6 sm:p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <UserCheck className="text-white text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Personalizovani planovi</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Prilagođene strategije ishrane zasnovane na vašem jedinstvenom zdravstvenom profilu, ciljevima i preferencijama.
            </p>
          </div>

          <div className="bg-green-50 p-6 sm:p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <TrendingUp className="text-white text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Praćenje napretka</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Redovno praćenje i prilagođavanja kako biste osigurali da ste na pravom putu ka ostvarivanju vaših wellness ciljeva.
            </p>
          </div>

          <div className="bg-green-50 p-6 sm:p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <GraduationCap className="text-white text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Stručno znanje</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Preporuke zasnovane na nauci od sertifikovanog nutricioniste sa godinama praktičnog iskustva.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">Spremni ste da započnete svoje wellness putovanje?</h3>
              <p className="text-emerald-100 mb-4 sm:mb-6 text-sm sm:text-base">
                Pridružite se stotinama zadovoljnih klijenata koji su transformisali svoje zdravlje uz naše profesionalno vođenje. 
                Rezervišite svoju konsultaciju danas i učinite prvi korak ka zdravijem vama.
              </p>
              <Button
                onClick={() => scrollToSection("appointment-booking")}
                className="bg-white text-emerald-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Zakažite konsultaciju
              </Button>
            </div>
            <div className="text-center lg:text-right">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Healthy lifestyle with fresh vegetables and fruits" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
