import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import EditClientModal from "./edit-client-modal";
import type { Client } from "@shared/schema";

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Klijent obrisan",
        description: "Klijent je uspešno uklonjen iz sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Brisanje neuspešno",
        description: "Došlo je do greške prilikom brisanja klijenta. Pokušajte ponovo.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(client.id);
    setShowDeleteModal(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLastVisitDate = () => {
    // This would normally come from the last checkup date
    // For now, using creation date as placeholder
    return formatDate(client.createdAt?.toString() || client.dateOfBirth);
  };

  return (
    <Card 
      className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <CardContent className="p-4 sm:p-6" onClick={() => setLocation(`/admin/clients/${client.id}`)}>
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="text-emerald-600 text-base sm:text-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{client.fullName}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{client.email}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span className="font-medium">Telefon:</span>
            <span className="text-right truncate ml-2">{client.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Datum rođenja:</span>
            <span className="text-right truncate ml-2">{client.dateOfBirth ? formatDate(client.dateOfBirth) : "Nije unesen"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Dodat:</span>
            <span className="text-right truncate ml-2">{getLastVisitDate()}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between items-stretch sm:items-center mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs sm:text-sm justify-center sm:justify-start"
          >
            <Edit className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Uredi
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-xs sm:text-sm justify-center sm:justify-start"
          >
            <Trash2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {deleteMutation.isPending ? "Briše se..." : "Obriši"}
          </Button>
        </div>
      </CardContent>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Obriši klijenta"
        description="Da li ste sigurni da želite da obrišete ovog klijenta? Ova akcija se ne može poništiti i svi povezani podaci će biti obrisani."
        isLoading={deleteMutation.isPending}
      />
      
      <EditClientModal
        client={client}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </Card>
  );
}
