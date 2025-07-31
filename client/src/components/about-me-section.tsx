import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export default function AboutMeSection() {
  // Force Serbian language for this component
  const language = 'sr';

  const content = {
    en: {
      title: "About Me",
      name: "Dr. Ana Marković",
      credentials: "Licensed Nutritionist & Wellness Expert",
      description: [
        "With over 10 years of experience in clinical nutrition and wellness coaching, I am passionate about helping individuals achieve their health goals through personalized nutrition strategies.",
        "I hold a Master's degree in Nutritional Sciences from the University of Belgrade and am certified by the Serbian Association of Nutritionists. My approach combines evidence-based nutrition science with practical, sustainable lifestyle changes.",
        "I believe that proper nutrition is the foundation of good health, and I work closely with each client to develop individualized plans that fit their unique needs, preferences, and lifestyle. My goal is to empower you with the knowledge and tools necessary for long-term success.",
        "When I'm not working with clients, I enjoy researching the latest developments in nutritional science, cooking healthy meals, and spending time in nature with my family."
      ]
    },
    sr: {
      title: "O meni",
      name: "Dr Ana Marković",
      credentials: "Licencirani nutricionista i ekspert za wellness",
      description: [
        "Sa više od 10 godina iskustva u kliničkoj ishrani i wellness treningu, strastvena sam u pomaganju pojedincima da ostvare svoje zdravstvene ciljeve kroz personalizovane strategije ishrane.",
        "Imam magistarsku diplomu iz nauka o ishrani sa Univerziteta u Beogradu i sertifikovana sam od strane Srpskog udruženja nutricionista. Moj pristup kombinuje nauku o ishrani zasnovanu na dokazima sa praktičnim, održivim promenama načina života.",
        "Verujem da je pravilna ishrana osnova dobrog zdravlja, i tesno sarađujem sa svakim klijentom da razvijemo individualne planove koji odgovaraju njihovim jedinstvenim potrebama, preferencijama i načinu života. Moj cilj je da vas osnaže znanjem i alatima potrebnim za dugoročan uspeh.",
        "Kada ne radim sa klijentima, uživam u istraživanju najnovijih dostignuća u nauci o ishrani, kuvanju zdravih obroka i provodnju vremena u prirodi sa svojom porodicom."
      ]
    }
  };

  const currentContent = content[language];

  return (
    <section id="about-me" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Professional Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt={currentContent.name}
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
            </div>
            
            {/* Floating credential card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl shadow-xl p-3 sm:p-6 border border-emerald-100"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 text-center px-1">{currentContent.credentials}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
              >
                {currentContent.title}
              </motion.h2>
              
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl font-semibold text-emerald-600 mb-2"
              >
                {currentContent.name}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg text-emerald-700 font-medium"
              >
                {currentContent.credentials}
              </motion.p>
            </div>

            <div className="space-y-6">
              {currentContent.description.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Professional highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">10+</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Godina iskustva
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Zadovoljnih klijenata
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}