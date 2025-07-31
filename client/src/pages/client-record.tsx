import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, User, Download } from "lucide-react";
import type { Client, Checkup } from "@shared/schema";
import CheckupRecord from "@/components/checkup-record";
import AddCheckupModal from "@/components/add-checkup-modal";
import ClientFileUpload from "@/components/client-file-upload";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ClientRecord() {
  const [, params] = useRoute("/admin/clients/:id");
  const [, setLocation] = useLocation();
  const [showAddCheckup, setShowAddCheckup] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const clientId = params?.id;

  const { data: client, isLoading: clientLoading } = useQuery<Client>({
    queryKey: ["/api/clients", clientId],
    enabled: !!clientId,
  });

  const { data: checkups = [], isLoading: checkupsLoading } = useQuery<Checkup[]>({
    queryKey: ["/api/clients", clientId, "checkups"],
    enabled: !!clientId,
  });

  const generatePDF = async () => {
    if (!client || checkups.length === 0) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create PDF content
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Title
      pdf.setFontSize(20);
      pdf.text("Medicinski karton", pageWidth / 2, 20, { align: 'center' });
      
      // Client info
      pdf.setFontSize(14);
      pdf.text(`Klijent: ${client.fullName}`, 20, 40);
      pdf.text(`Email: ${client.email}`, 20, 50);
      pdf.text(`Telefon: ${client.phone || 'Nije unesen'}`, 20, 60);
      pdf.text(`Datum rođenja: ${client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString('sr-RS') : 'Nije unesen'}`, 20, 70);
      
      // Line separator
      pdf.line(20, 80, pageWidth - 20, 80);
      
      // Checkups history
      pdf.setFontSize(16);
      pdf.text("Istorija pregleda", 20, 95);
      
      let yPosition = 110;
      
      checkups.forEach((checkup, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(12);
        pdf.text(`Pregled ${index + 1} - ${new Date(checkup.date).toLocaleDateString('sr-RS')}`, 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.text(`Težina: ${checkup.weight} kg`, 25, yPosition);
        pdf.text(`Visina: ${checkup.height} cm`, 100, yPosition);
        yPosition += 8;
        
        pdf.text(`BMI: ${checkup.bmi}`, 25, yPosition);
        if (checkup.waistCircumference) {
          pdf.text(`Obim struka: ${checkup.waistCircumference} cm`, 100, yPosition);
        }
        yPosition += 8;
        
        if (checkup.bloodPressure) {
          pdf.text(`Krvni pritisak: ${checkup.bloodPressure} mmHg`, 25, yPosition);
          yPosition += 8;
        }
        
        if (checkup.bloodSugar) {
          pdf.text(`Šećer u krvi: ${checkup.bloodSugar} mmol/L`, 25, yPosition);
          yPosition += 8;
        }
        
        if (checkup.cholesterol) {
          pdf.text(`Holesterol: ${checkup.cholesterol} mmol/L`, 25, yPosition);
          yPosition += 8;
        }
        
        if (checkup.notes) {
          pdf.text(`Napomene: ${checkup.notes}`, 25, yPosition);
          yPosition += 8;
        }
        
        yPosition += 10;
      });
      
      // Save PDF
      const filename = `${client.fullName.replace(/\s+/g, '_')}_medicinski_karton_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Greška pri generisanju PDF fajla. Pokušajte ponovo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!clientId) {
    return <div>Client ID not found</div>;
  }

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam klijenta...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Client not found</p>
            <Button onClick={() => setLocation("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Record Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin")}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Nazad na klijente
              </Button>
              <div className="h-4 sm:h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-white text-xs sm:text-sm" />
                </div>
                <span className="text-base sm:text-xl font-semibold text-gray-900 truncate">{client.fullName}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                onClick={() => setShowAddCheckup(true)}
                className="bg-emerald-500 text-white hover:bg-emerald-600 text-sm py-2.5 px-4 touch-manipulation"
              >
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Dodaj pregled
              </Button>
              <Button
                onClick={generatePDF}
                disabled={isGeneratingPDF || checkups.length === 0}
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-sm py-2.5 px-4 touch-manipulation"
              >
                <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {isGeneratingPDF ? 'Generiše PDF...' : 'Preuzmi PDF'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Info Summary - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 break-words">{client.fullName}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Ime i prezime</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 break-all">{client.email}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Email</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">{client.phone || 'Nije unesen'}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Telefon</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">
                  {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString('sr-RS') : "Nije unesen"}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Datum rođenja</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile-First Layout for Checkups and Files */}
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {/* Medical Checkups History */}
          <Card className="order-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Istorija pregleda</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {checkupsLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="p-3 bg-gray-50 rounded-lg">
                            <div className="h-6 bg-gray-200 rounded mb-2" />
                            <div className="h-3 bg-gray-200 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : checkups.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-3xl sm:text-4xl text-gray-400 mb-4">📊</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nema evidentiranih pregleda</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                    Počnite praćenje napretka ovog klijenta dodavanjem prvog pregleda.
                  </p>
                  <Button
                    onClick={() => setShowAddCheckup(true)}
                    className="bg-emerald-500 text-white hover:bg-emerald-600 py-2.5 px-4 text-sm touch-manipulation"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj prvi pregled
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {checkups.map((checkup) => (
                    <CheckupRecord key={checkup.id} checkup={checkup} />
                  ))}
                  
                  {/* Progress Overview - Mobile Optimized */}
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Pregled napretka</h3>
                    <div className="text-center text-gray-600">
                      <div className="text-3xl sm:text-4xl text-emerald-400 mb-2">📈</div>
                      <p className="text-sm sm:text-base">Grafikoni napretka će biti prikazani ovde</p>
                      {checkups.length >= 2 && (
                        <div className="text-xs sm:text-sm mt-2 space-y-1">
                          <p>Promena težine: {(parseFloat(checkups[0].weight) - parseFloat(checkups[checkups.length - 1].weight)).toFixed(1)}kg</p>
                          <p>Promena BMI: {(parseFloat(checkups[0].bmi) - parseFloat(checkups[checkups.length - 1].bmi)).toFixed(1)} poena</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Files Upload - Mobile Optimized */}
          <div className="order-2">
            <ClientFileUpload clientId={clientId} />
          </div>
        </div>
      </div>

      <AddCheckupModal 
        open={showAddCheckup} 
        onOpenChange={setShowAddCheckup} 
        clientId={clientId}
      />
    </div>
  );
}
