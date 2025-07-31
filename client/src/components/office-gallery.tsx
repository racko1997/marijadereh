import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function OfficeGallery() {
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Moderna ordinacija za konsultacije o ishrani",
      title: "Konsultaciona sala"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Profesionalna oblast za procenu ishrane",
      title: "Oblast za procenu"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Udobna čekaonica",
      title: "Čekaonica"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Privatni prostor za savetovanje",
      title: "Privatno savetovanje"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Kuhinja za demonstracije zdravih obroka",
      title: "Demo kuhinja"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Laboratorija za analizu ishrane",
      title: "Analitička laboratorija"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Prostor za grupe i radionice",
      title: "Grupne radionice"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Recepcija i ulazni hol",
      title: "Recepcija"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Biblioteka sa stručnom literaturom",
      title: "Stručna biblioteka"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1582560469781-1965b9af903d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700",
      alt: "Relaks zona za odmor",
      title: "Relaks zona"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Naša <span className="text-emerald-600">ordinacija</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dobrodošli u našu modernu i udobnu ordinaciju, dizajniranu da pružimo najbolju moguću uslugu 
            i iskustvo tokom vaše nutrition konsultacije.
          </p>
        </motion.div>

        {/* Horizontal Scrolling Gallery */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-80">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-white font-bold text-xl mb-2">
                            {image.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Floating badge for image number */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center font-bold text-emerald-600">
                        {index + 1}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {galleryImages.slice(0, 5).map((_, index) => (
              <div key={index} className="w-2 h-2 bg-emerald-300 rounded-full opacity-50"></div>
            ))}
            <div className="w-6 h-2 bg-emerald-600 rounded-full"></div>
            {galleryImages.slice(6).map((_, index) => (
              <div key={index + 6} className="w-2 h-2 bg-emerald-300 rounded-full opacity-50"></div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Zašto izabrati našu ordinaciju?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Moderna oprema</h4>
                <p className="text-gray-600 text-sm">
                  Najsavremenija oprema za preciznu analizu i praćenje vašeg napretka
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Opuštajuća atmosfera</h4>
                <p className="text-gray-600 text-sm">
                  Mirno i prijatno okruženje koje omogućava opuštenu konsultaciju
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Potpuna privatnost</h4>
                <p className="text-gray-600 text-sm">
                  Diskretnost i privatnost u svim aspektima vaše konsultacije
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}