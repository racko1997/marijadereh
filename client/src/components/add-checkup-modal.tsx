import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertCheckup } from "@shared/schema";

interface AddCheckupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export default function AddCheckupModal({ open, onOpenChange, clientId }: AddCheckupModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    waistCircumference: "",
    bloodPressure: "",
    bloodSugar: "",
    cholesterol: "",
    notes: "",
  });

  const [bmi, setBmi] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Calculate BMI whenever weight or height changes
  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi("");
    }
  }, [formData.weight, formData.height]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertCheckup) => {
      const response = await apiRequest("POST", `/api/clients/${clientId}/checkups`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "checkups"] });
      toast({
        title: "Pregled dodat",
        description: "Medicinski pregled je uspešno evidentiran.",
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: "",
        height: "",
        waistCircumference: "",
        bloodPressure: "",
        bloodSugar: "",
        cholesterol: "",
        notes: "",
      });
      setBmi("");
    },
    onError: (error: any) => {
      toast({
        title: "Greška pri dodavanju pregleda",
        description: error.message || "Došlo je do greške prilikom dodavanja pregleda. Pokušajte ponovo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkupData: InsertCheckup = {
      clientId,
      date: formData.date,
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height),
      waistCircumference: formData.waistCircumference ? parseInt(formData.waistCircumference) : undefined,
      bloodPressure: formData.bloodPressure || undefined,
      bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : undefined,
      cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : undefined,
      notes: formData.notes || undefined,
    };

    createMutation.mutate(checkupData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getBmiCategory = (bmiValue: string) => {
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return "Pothranjem";
    if (bmiNum < 25) return "Normalno";
    if (bmiNum < 30) return "Prekomernu";
    return "Gojaznost";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">Dodaj medicinski pregled</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="date" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Datum posete *
              </Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <Label htmlFor="weight" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Težina (kg) *
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="70.5"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="height" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Visina (cm) *
              </Label>
              <Input
                id="height"
                type="number"
                required
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="170"
              />
            </div>
            
            <div>
              <Label htmlFor="waistCircumference" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Obim struka (cm)
              </Label>
              <Input
                id="waistCircumference"
                type="number"
                value={formData.waistCircumference}
                onChange={(e) => handleInputChange("waistCircumference", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="80"
              />
            </div>
          </div>
          
          {/* Enhanced Medical Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="bloodPressure" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Krvni pritisak (mmHg)
              </Label>
              <Input
                id="bloodPressure"
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="120/80"
              />
            </div>
            
            <div>
              <Label htmlFor="bloodSugar" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Šećer u krvi (mg/dL)
              </Label>
              <Input
                id="bloodSugar"
                type="number"
                step="0.1"
                value={formData.bloodSugar}
                onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="100"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="cholesterol" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Holesterol (mg/dL)
            </Label>
            <Input
              id="cholesterol"
              type="number"
              step="0.1"
              value={formData.cholesterol}
              onChange={(e) => handleInputChange("cholesterol", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="200"
            />
          </div>
          
          <div>
            <Label htmlFor="bmi" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              BMI (Automatski izračunat)
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="bmi"
                type="text"
                readOnly
                value={bmi}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="Izračunava se automatski"
              />
              {bmi && (
                <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-center sm:text-left ${
                  parseFloat(bmi) < 18.5 ? 'bg-blue-100 text-blue-800' :
                  parseFloat(bmi) < 25 ? 'bg-green-100 text-green-800' :
                  parseFloat(bmi) < 30 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getBmiCategory(bmi)}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Napomene
            </Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Dodajte bilo kakve dodatne napomene o ovom pregledu..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-emerald-500 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              {createMutation.isPending ? "Dodajem..." : "Dodaj pregled"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Otkaži
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
