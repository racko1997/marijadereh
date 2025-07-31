import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import EditCheckupModal from "./edit-checkup-modal";
import type { Checkup } from "@shared/schema";

interface CheckupRecordProps {
  checkup: Checkup;
}

export default function CheckupRecord({ checkup }: CheckupRecordProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/checkups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", checkup.clientId, "checkups"] });
      toast({
        title: "Pregled obrisan",
        description: "Pregled je uspešno obrisan.",
      });
    },
    onError: () => {
      toast({
        title: "Brisanje neuspešno",
        description: "Došlo je do greške prilikom brisanja pregleda. Pokušajte ponovo.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(checkup.id);
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBmiCategory = (bmi: string) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { category: "Pothranjem", color: "blue" };
    if (bmiNum < 25) return { category: "Normalno", color: "emerald" };
    if (bmiNum < 30) return { category: "Prekomernu", color: "amber" };
    return { category: "Gojaznost", color: "red" };
  };

  const bmiInfo = getBmiCategory(checkup.bmi);

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{formatDate(checkup.date)}</h3>
          <p className="text-xs sm:text-sm text-gray-600">Medicinski pregled</p>
        </div>
        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors p-1 sm:p-2"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors p-1 sm:p-2"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
      
      {/* Basic Measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
          <div className="text-base sm:text-xl font-bold text-gray-900">{checkup.weight}</div>
          <div className="text-xs sm:text-sm text-gray-600">Težina (kg)</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
          <div className="text-base sm:text-xl font-bold text-gray-900">{checkup.height}</div>
          <div className="text-xs sm:text-sm text-gray-600">Visina (cm)</div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
          <div className="text-base sm:text-xl font-bold text-gray-900">
            {checkup.waistCircumference || "N/A"}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Struk (cm)</div>
        </div>
        <div className={`text-center p-2 sm:p-3 rounded-lg ${
          bmiInfo.color === 'emerald' ? 'bg-emerald-50' :
          bmiInfo.color === 'amber' ? 'bg-amber-50' :
          bmiInfo.color === 'red' ? 'bg-red-50' :
          'bg-blue-50'
        }`}>
          <div className={`text-base sm:text-xl font-bold ${
            bmiInfo.color === 'emerald' ? 'text-emerald-600' :
            bmiInfo.color === 'amber' ? 'text-amber-600' :
            bmiInfo.color === 'red' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {checkup.bmi}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">BMI</div>
        </div>
        <div className={`col-span-2 sm:col-span-1 text-center p-2 sm:p-3 rounded-lg ${
          bmiInfo.color === 'emerald' ? 'bg-emerald-50' :
          bmiInfo.color === 'amber' ? 'bg-amber-50' :
          bmiInfo.color === 'red' ? 'bg-red-50' :
          'bg-blue-50'
        }`}>
          <div className={`text-xs sm:text-sm font-bold break-words ${
            bmiInfo.color === 'emerald' ? 'text-emerald-600' :
            bmiInfo.color === 'amber' ? 'text-amber-600' :
            bmiInfo.color === 'red' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {bmiInfo.category}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Status</div>
        </div>
      </div>

      {/* Enhanced Medical Data */}
      {(checkup.bloodPressure || checkup.bloodSugar || checkup.cholesterol) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {checkup.bloodPressure && (
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-base sm:text-lg font-bold text-blue-700">{checkup.bloodPressure}</div>
              <div className="text-xs sm:text-sm text-blue-600">Krvni pritisak (mmHg)</div>
            </div>
          )}
          {checkup.bloodSugar && (
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-base sm:text-lg font-bold text-purple-700">{checkup.bloodSugar}</div>
              <div className="text-xs sm:text-sm text-purple-600">Šećer u krvi (mmol/L)</div>
            </div>
          )}
          {checkup.cholesterol && (
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-base sm:text-lg font-bold text-orange-700">{checkup.cholesterol}</div>
              <div className="text-xs sm:text-sm text-orange-600">Holesterol (mmol/L)</div>
            </div>
          )}
        </div>
      )}
      
      {checkup.notes && (
        <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-200">
          <h4 className="text-sm sm:text-base font-semibold text-emerald-800 mb-1 sm:mb-2">Napomene:</h4>
          <p className="text-xs sm:text-sm text-emerald-700 break-words whitespace-pre-wrap overflow-hidden">{checkup.notes}</p>
        </div>
      )}
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Obriši pregled"
        description="Da li ste sigurni da želite da obrišete ovaj pregled? Ova akcija se ne može poništiti."
        isLoading={deleteMutation.isPending}
      />
      
      <EditCheckupModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        checkup={checkup}
      />
    </div>
  );
}
