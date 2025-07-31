import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Phone, User, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { BookingRequest } from "@shared/schema";

export default function AppointmentsManagement() {
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch booking requests
  const { data: bookings = [], isLoading } = useQuery<BookingRequest[]>({
    queryKey: ["/api/booking-requests"],
  });

  // Confirm appointment mutation
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      // First confirm the appointment
      const response = await apiRequest("PATCH", `/api/booking-requests/${id}`, { status: "confirmed" });
      const appointment = await response.json();
      
      // Then create a client automatically
      const clientData = {
        fullName: appointment.fullName,
        email: appointment.email,
        phone: appointment.phone,
        dateOfBirth: "" // Don't set a default DOB
      };
      
      try {
        const clientResponse = await apiRequest("POST", "/api/clients", clientData);
        await clientResponse.json();
      } catch (error) {
        // If client already exists, that's fine, continue
        console.log("Client may already exist:", error);
      }
      
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Termin potvrđen",
        description: "Termin je uspešno potvrđen i klijent je automatski dodat u sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom potvrđivanja termina.",
        variant: "destructive",
      });
    },
  });

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/booking-requests/${id}`, { status: "cancelled" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-requests"] });
      toast({
        title: "Termin otkazan",
        description: "Termin je uspešno otkazan.",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom otkazivanja termina.",
        variant: "destructive",
      });
    },
  });

  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/booking-requests/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-requests"] });
      toast({
        title: "Termin obrisan",
        description: "Termin je uspešno uklonjen iz sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom brisanja termina.",
        variant: "destructive",
      });
    },
  });

  // Filter bookings based on selected status
  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === "all") return true;
    return booking.status === selectedStatus;
  });

  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => 
    new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Na čekanju</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Potvrđen</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Otkazan</Badge>;
      default:
        return <Badge variant="outline">Nepoznato</Badge>;
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString('sr-RS')} u ${timeStr}`;
  };

  return (
    <div className="space-y-8">
      {/* Header with status filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Zakazani termini</h2>
          <p className="text-gray-600">Upravljajte svim zahtevima za termine i rezervacije</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status as any)}
              className={selectedStatus === status ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            >
              {status === "all" ? "Svi" : 
               status === "pending" ? "Na čekanju" :
               status === "confirmed" ? "Potvrđeni" : "Otkazani"}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ukupno termina</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Na čekanju</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Potvrđeni</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "confirmed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Otkazani</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "cancelled").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedStatus === "all" ? "Nema termina" : "Nema termina sa ovim statusom"}
              </h3>
              <p className="text-gray-600">
                {selectedStatus === "all" 
                  ? "Trenutno nema zakazanih termina u sistemu."
                  : "Trenutno nema termina sa ovim statusom."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-4 w-4 mr-2 text-emerald-500" />
                            {booking.fullName}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {booking.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {booking.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDateTime(booking.appointmentDate, booking.appointmentTime)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDistanceToNow(new Date(booking.createdAt || new Date()), { addSuffix: true })}
                          </div>
                        </div>
                        
                        {booking.healthGoals && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Zdravstveni ciljevi:</strong> {booking.healthGoals}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => confirmMutation.mutate(booking.id)}
                              disabled={confirmMutation.isPending}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Potvrdi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelMutation.mutate(booking.id)}
                              disabled={cancelMutation.isPending}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Otkaži
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(booking.id)}
                          disabled={deleteMutation.isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}