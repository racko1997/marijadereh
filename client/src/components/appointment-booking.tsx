import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CreditCard, User, Mail, Phone } from "lucide-react";
import { insertAppointmentSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/lib/translations";
import { z } from "zod";

const appointmentFormSchema = insertAppointmentSchema.extend({
  appointmentDate: z.string().min(1, "Datum termina je obavezan"),
  appointmentTime: z.string().min(1, "Vreme termina je obavezno"),
});

export default function AppointmentBooking() {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
      paymentStatus: "pending"
    }
  });

  const createAppointment = useMutation({
    mutationFn: async (data: z.infer<typeof appointmentFormSchema>) => {
      // Create both appointment and booking request
      const bookingData = {
        fullName: data.clientName,
        email: data.email,
        phone: data.phone,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        healthGoals: data.notes || null,
        status: "pending"
      };
      
      const response = await fetch('/api/booking-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Termin zakazan",
        description: "Vaš termin je uspešno zakazan. Javiće semo vam se uskoro sa detaljima plaćanja.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/booking-requests'] });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom zakazivanja termina. Molimo pokušajte ponovo.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: z.infer<typeof appointmentFormSchema>) => {
    try {
      setPaymentProcessing(true);
      await createAppointment.mutateAsync(data);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <section id="appointment-booking" className="py-20 bg-gradient-to-br from-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4">
            Zakažite <span className="text-emerald-600">konsultaciju</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Investirajte u svoje zdravlje. Zakažite personalizovanu konsultaciju sa našim 
            stručnjakom za ishranu i počnite putovanje ka boljem zdravlju.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 sm:pb-8 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Online konsultacija - 50€
              </CardTitle>
              <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
                60-minutna personalizovana konsultacija sa detaljnim planom ishrane
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Puno ime
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Unesite vaše puno ime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email adresa
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="vase.ime@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Broj telefona
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+381 60 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appointmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Datum termina
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              min={new Date().toISOString().split('T')[0]}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appointmentTime"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Vreme termina
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Izaberite vreme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dodatne napomene (opciono)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Recite nam o vašim zdravstvenim ciljevima, alergijama ili posebnim potrebama..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-emerald-50 p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Informacije o plaćanju</h3>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <p>• Cena konsultacije: <strong>50€</strong></p>
                      <p>• Plaćanje se vrši online putem sigurne Stripe platforme</p>
                      <p>• Nakon zakazivanja dobićete link za plaćanje na email</p>
                      <p>• Konsultacija se drži nakon potvrde plaćanja</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={createAppointment.isPending || paymentProcessing}
                  >
                    {createAppointment.isPending || paymentProcessing ? (
                      "Zakazivanje..."
                    ) : (
                      "Zakaži konsultaciju - 50€"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center px-2 leading-relaxed">
                    Klikom na dugme pristajete na naše uslove korišćenja i politiku privatnosti.
                    Javiće semo vam se u roku od 2 sata sa linkom za plaćanje.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}