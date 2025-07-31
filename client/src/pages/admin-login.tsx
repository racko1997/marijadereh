import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Leaf, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Uspešna prijava",
        description: "Dobrodošli u admin panel",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Neuspešna prijava",
        description: "Neispravni podaci. Proverite email adresu i lozinku.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="text-white text-lg" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">NutriCare Admin</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Admin prijava</CardTitle>
            <p className="text-center text-gray-600">Prijavite se da pristupite admin panelu</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email adresa
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lozinka
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Unesite vašu lozinku"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                {loginMutation.isPending ? "Prijavljivanje..." : "Prijavite se"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Nazad na sajt
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
