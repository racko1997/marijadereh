import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { translations } from "@/lib/translations";

const testimonials = [
  {
    name: "Marija Petrović",
    role: "Marketing menadžer",
    content: "Personalizovani plan ishrane potpuno je promenio moj odnos sa hranom. Smršala sam 11 kilograma i imam više energije nego ikad!",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    name: "Stefan Nikolić",
    role: "Softverski inženjer",
    content: "Profesionalno, stručno i iskreno brižno. Planovi obroka su praktični i ukusni. Toplo preporučujem!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    name: "Ana Jovanović",
    role: "Instruktor joge",
    content: "Neverojna podrška tokom mog wellness putovanja. Praćenje napretka stvarno pomaže da ostanem motivisana i na pravom putu.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    name: "Miloš Đorđević",
    role: "Fitnes trener",
    content: "Stručnost na najvišem nivou! Plan ishrane je savršeno prilagođen mojim potrebama kao sportiste. Rezultati su fantastični.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    name: "Jelena Milic",
    role: "Nastavnica",
    content: "Dr Ana je promenila moj život! Konačno razumem kako da se hranim zdravo i ukusno. Preporučujem svima koji žele pravu promenu.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    name: "Nikola Stojanović",
    role: "Menadžer prodaje",
    content: "Individualni pristup i stalna podrška čine razliku. Smršao sam 15kg i osećam se fantastično. Hvala na profesionalnosti!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            {translations.testimonials.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.testimonials.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden h-full flex flex-col">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                
                <CardContent className="p-8 flex-1 flex flex-col justify-between">
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} testimonial`} 
                      className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-emerald-200"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
