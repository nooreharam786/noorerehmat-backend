import { useTranslation } from "react-i18next";
import { Users, Star, ShieldCheck, Handshake } from "lucide-react";

export function StatsBar() {
  const { t } = useTranslation();
  const items = [
    { icon: Users, value: "10,000+", label: t("stats.registrations") },
    { icon: Star, value: "125", label: t("stats.lucky") },
    { icon: ShieldCheck, value: "100%", label: t("stats.transparent") },
    { icon: Handshake, value: "✦", label: t("stats.trust") },
  ];
  return (
    <section className="bg-primary py-8">
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-primary-foreground">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif text-xl md:text-2xl font-bold text-secondary">{item.value}</div>
                <div className="text-xs md:text-sm text-primary-foreground/80">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
