import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { translations } from "@/lib/translations";
import AnimatedCounter from "@/components/animated-counter";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Healthy lifestyle background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-emerald-800/60 to-green-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight px-4"
            >
              {translations.hero.title}{" "}
              <span className="text-emerald-300">{translations.hero.titleHighlight}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-emerald-100 leading-relaxed max-w-4xl mx-auto px-4"
            >
              {translations.hero.subtitle}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 w-full"
          >
            <Button
              onClick={() => scrollToSection("appointment-booking")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-emerald-500 w-full sm:w-auto"
              size="lg"
            >
              {translations.hero.bookConsultation}
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-2 border-white bg-white/10 backdrop-blur-sm text-white font-semibold px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg hover:bg-white hover:text-emerald-800 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              size="lg"
            >
              {translations.hero.learnMore}
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 pt-12"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl text-center min-w-[140px]"
            >
              <AnimatedCounter 
                end={500} 
                suffix="+" 
                className="text-4xl font-bold text-white mb-2" 
              />
              <div className="text-sm text-emerald-100 font-medium">{translations.hero.stats.clients}</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl text-center min-w-[140px]"
            >
              <AnimatedCounter 
                end={5} 
                suffix="+" 
                className="text-4xl font-bold text-white mb-2" 
              />
              <div className="text-sm text-emerald-100 font-medium">{translations.hero.stats.experience}</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl text-center min-w-[140px]"
            >
              <AnimatedCounter 
                end={95} 
                suffix="%" 
                className="text-4xl font-bold text-white mb-2" 
              />
              <div className="text-sm text-emerald-100 font-medium">{translations.hero.stats.successRate}</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
