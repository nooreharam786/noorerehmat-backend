import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/i18n";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "dark" }: Props) {
  const { i18n } = useTranslation();
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
          variant === "light"
            ? "border-white/30 text-white hover:bg-white/10"
            : "border-border text-foreground hover:bg-muted"
        )}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span>{current.native}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={cn(
              "cursor-pointer",
              i18n.language === lang.code && "bg-accent text-accent-foreground"
            )}
          >
            <span className="mr-2 text-muted-foreground text-xs uppercase">{lang.code}</span>
            <span>{lang.native}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
