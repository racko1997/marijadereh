import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sr" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-600"
    >
      <Languages className="w-4 h-4" />
      <span className="font-semibold">
        {language === "en" ? "SR" : "EN"}
      </span>
    </Button>
  );
}