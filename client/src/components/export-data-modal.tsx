import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Table } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Client, Checkup } from "@shared/schema";

interface ExportDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExportDataModal({ open, onOpenChange }: ExportDataModalProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [includeCheckups, setIncludeCheckups] = useState(true);
  const [includePersonalData, setIncludePersonalData] = useState(true);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  const { data: allCheckups = {} } = useQuery<Record<string, Checkup[]>>({
    queryKey: ["/api/clients/checkups", selectedClients],
    queryFn: async () => {
      if (!includeCheckups || selectedClients.length === 0) return {};
      
      const checkupsData: Record<string, Checkup[]> = {};
      for (const clientId of selectedClients) {
        const response = await fetch(`/api/clients/${clientId}/checkups`);
        if (response.ok) {
          checkupsData[clientId] = await response.json();
        }
      }
      return checkupsData;
    },
    enabled: open && includeCheckups && selectedClients.length > 0,
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleClientSelect = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
      setSelectAll(false);
    }
  };

  const formatDateForExport = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const exportToCSV = () => {
    const selectedClientData = clients.filter(client => selectedClients.includes(client.id));
    
    let csvContent = "";
    
    if (includePersonalData) {
      // Client data headers
      csvContent += "Ime i Prezime,Email,Telefon,Datum Rođenja\n";
      
      // Client data rows
      selectedClientData.forEach(client => {
        const row = [
          client.fullName,
          client.email,
          client.phone || "",
          client.dateOfBirth ? formatDateForExport(client.dateOfBirth) : "Nije unesen"
        ].map(field => `"${field}"`).join(",");
        csvContent += row + "\n";
      });
      
      csvContent += "\n";
    }

    if (includeCheckups) {
      // Checkups data headers
      csvContent += "Klijent,Datum Pregleda,Težina (kg),Visina (cm),Obim Struka (cm),BMI,BMI Kategorija,Krvni Pritisak,Šećer u Krvi,Holesterol,Napomene\n";
      
      // Checkups data rows
      selectedClientData.forEach(client => {
        const clientCheckups = allCheckups[client.id] || [];
        clientCheckups.forEach((checkup: Checkup) => {
          const getBmiCategory = (bmi: string) => {
            const bmiNum = parseFloat(bmi);
            if (bmiNum < 18.5) return "Pothranjem";
            if (bmiNum < 25) return "Normalno";
            if (bmiNum < 30) return "Prekomernu";
            return "Gojaznost";
          };

          const row = [
            client.fullName,
            formatDateForExport(checkup.date),
            checkup.weight,
            checkup.height,
            checkup.waistCircumference || "",
            checkup.bmi,
            getBmiCategory(checkup.bmi),
            checkup.bloodPressure || "",
            checkup.bloodSugar || "",
            checkup.cholesterol || "",
            (checkup.notes || "").replace(/"/g, '""')
          ].map(field => `"${field}"`).join(",");
          csvContent += row + "\n";
        });
      });
    }

    return csvContent;
  };

  const exportToJSON = () => {
    const selectedClientData = clients.filter(client => selectedClients.includes(client.id));
    
    const exportData = selectedClientData.map(client => {
      const clientData: any = {};
      
      if (includePersonalData) {
        clientData.personalInfo = {
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          dateOfBirth: client.dateOfBirth ? formatDateForExport(client.dateOfBirth) : "Nije unesen"
        };
      }
      
      if (includeCheckups) {
        const clientCheckups = allCheckups[client.id] || [];
        clientData.checkups = clientCheckups.map((checkup: Checkup) => ({
          date: formatDateForExport(checkup.date),
          weight: checkup.weight,
          height: checkup.height,
          waistCircumference: checkup.waistCircumference,
          bmi: checkup.bmi,
          bloodPressure: checkup.bloodPressure,
          bloodSugar: checkup.bloodSugar,
          cholesterol: checkup.cholesterol,
          notes: checkup.notes
        }));
      }
      
      return clientData;
    });

    return JSON.stringify(exportData, null, 2);
  };

  const handleExport = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Nema odabranih klijenata",
        description: "Molimo odaberite najmanje jednog klijenta za izvoz.",
        variant: "destructive",
      });
      return;
    }

    if (!includePersonalData && !includeCheckups) {
      toast({
        title: "Nema odabranih podataka",
        description: "Molimo odaberite tip podataka za izvoz.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === "csv") {
        content = exportToCSV();
        filename = `klijenti_podaci_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = "text/csv;charset=utf-8;";
      } else {
        content = exportToJSON();
        filename = `klijenti_podaci_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = "application/json;charset=utf-8;";
      }

      // Create download
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Izvoz uspešan",
        description: `Podaci su uspešno izvezeni u ${exportFormat.toUpperCase()} formatu.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Greška pri izvozu",
        description: "Došlo je do greške prilikom izvoza podataka. Pokušajte ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
            Izvezi podatke klijenata
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Export Format Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Format izvoza
            </Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV (Excel kompatibilno)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (strukturirani podaci)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Type Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Tip podataka za izvoz
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-data"
                  checked={includePersonalData}
                  onCheckedChange={(checked) => setIncludePersonalData(checked === true)}
                />
                <Label htmlFor="personal-data" className="text-sm text-gray-700">
                  Lični podaci (ime, email, telefon, datum rođenja)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="checkups-data"
                  checked={includeCheckups}
                  onCheckedChange={(checked) => setIncludeCheckups(checked === true)}
                />
                <Label htmlFor="checkups-data" className="text-sm text-gray-700">
                  Medicinski pregledi (težina, visina, BMI, napomene)
                </Label>
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Odabir klijenata ({selectedClients.length} od {clients.length})
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-semibold text-gray-700">
                  Odaberi sve klijente
                </Label>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg animate-pulse">
                      <div className="w-4 h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleClientSelect(client.id, checked as boolean)}
                      />
                      <Label htmlFor={`client-${client.id}`} className="text-sm text-gray-700 flex-1 truncate">
                        {client.fullName} ({client.email})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedClients.length === 0}
              className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Izvozim..." : `Izvezi ${exportFormat.toUpperCase()}`}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
              className="sm:flex-none px-4 sm:px-6"
            >
              Otkaži
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}