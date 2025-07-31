import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, Trash2, Download } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ClientFile } from "@shared/schema";

interface ClientFileUploadProps {
  clientId: string;
}

export default function ClientFileUpload({ clientId }: ClientFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['/api/clients', clientId, 'files'],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}/files`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json() as Promise<ClientFile[]>;
    }
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/clients/${clientId}/files`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Fajl otpremljen",
        description: "Fajl je uspešno otpremljen.",
      });
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'files'] });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom otpremanja fajla.",
        variant: "destructive",
      });
    }
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete file');
    },
    onSuccess: () => {
      toast({
        title: "Fajl obrisan",
        description: "Fajl je uspešno obrisan.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'files'] });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom brisanja fajla.",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Fajl je prevelik",
          description: "Maksimalna veličina fajla je 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📋';
    if (fileType.includes('document') || fileType.includes('word')) return '📄';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    return '📁';
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          <File className="w-4 h-4 sm:w-5 sm:h-5" />
          Dokumenti klijenta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
        {/* Upload Section - Mobile Optimized */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
          <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 touch-manipulation"
              >
                Izaberi fajl
              </label>
            </div>
            
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-3 sm:p-4 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(selectedFile.type)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{selectedFile.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploadFile.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm py-2.5 px-4 touch-manipulation"
                  >
                    {uploadFile.isPending ? "Otpremanje..." : "Otpremi"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2">
            Podržani formati: PDF, DOC, DOCX, JPG, PNG, TXT (max 10MB)
          </p>
        </div>

        {/* Files List - Mobile Optimized */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Otpremljeni fajlovi</h4>
          
          {isLoading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <File className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">Nema otpremljenih fajlova</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-lg sm:text-xl flex-shrink-0">{getFileIcon(file.fileType)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{file.fileName}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt || '').toLocaleDateString('sr-RS')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex-1 sm:flex-none py-2.5 touch-manipulation"
                    >
                      <Download className="w-4 h-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Preuzmi</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteFile.mutate(file.id)}
                      disabled={deleteFile.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none py-2.5 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Obriši</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}