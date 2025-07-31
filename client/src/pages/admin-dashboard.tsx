import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, LogOut, Users, Calendar, Settings, Plus, Search, Download } from "lucide-react";
import { useLocation } from "wouter";
import type { Client } from "@shared/schema";
import ClientCard from "@/components/client-card";
import AddClientModal from "@/components/add-client-modal";
import AppointmentsManagement from "@/components/appointments-management";
import ExportDataModal from "@/components/export-data-modal";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/clients?search=${encodeURIComponent(searchQuery)}`
        : "/api/clients";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="text-white text-sm" />
              </div>
              <span className="text-xl font-semibold text-gray-900">NutriCare Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Dobrodošli, Admin</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="clients" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Klijenti</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Termini</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Postavke</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upravljanje klijentima</h1>
              <Button 
                onClick={() => setShowAddClient(true)}
                className="bg-emerald-500 text-white hover:bg-emerald-600 w-full sm:w-auto text-sm sm:text-base"
              >
                <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Dodaj novog klijenta
              </Button>
            </div>

            {/* Search Bar and Export Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pretraži klijente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowExportModal(true)}
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 w-full sm:w-auto"
                disabled={clients.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Izvezi podatke
              </Button>
            </div>

            {/* Client Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24" />
                          <div className="h-2 sm:h-3 bg-gray-200 rounded w-24 sm:w-32" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 sm:h-3 bg-gray-200 rounded" />
                        <div className="h-2 sm:h-3 bg-gray-200 rounded" />
                        <div className="h-2 sm:h-3 bg-gray-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : clients.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nema klijenata</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? "Nema klijenata koji odgovaraju kriterijumima pretrage. Pokušajte sa drugim terminima."
                      : "Počnite dodavanjem prvog klijenta u sistem."
                    }
                  </p>
                  {!searchQuery && (
                    <Button 
                      onClick={() => setShowAddClient(true)}
                      className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj prvog klijenta
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Upravljanje terminima</h1>
            </div>
            <AppointmentsManagement />
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Podešavanja</h1>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="text-4xl text-gray-400 mb-4 mx-auto h-16 w-16" />
                <p className="text-gray-600">Upravljanje podešavanjima uskoro dostupno.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddClientModal open={showAddClient} onOpenChange={setShowAddClient} />
      <ExportDataModal open={showExportModal} onOpenChange={setShowExportModal} />
    </div>
  );
}
