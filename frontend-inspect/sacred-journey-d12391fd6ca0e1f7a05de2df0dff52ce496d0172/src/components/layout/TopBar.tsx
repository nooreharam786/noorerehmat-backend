import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function TopBar() {
  const { t } = useTranslation();
  return (
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="container-custom mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-2 text-secondary">
          <span className="opacity-80">۞</span>
          <span className="font-medium tracking-wide">{t("topbar.bismillah")}</span>
          <span className="opacity-80">۞</span>
        </div>
        <div className="md:hidden font-medium text-secondary">{t("topbar.bismillah")}</div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="light" />
          <span className="hidden sm:inline opacity-80">{t("topbar.follow")}</span>
          <div className="flex items-center gap-2">
            <a href="#" aria-label="Facebook" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="YouTube" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
