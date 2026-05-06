import { useTranslation } from "react-i18next";
import { Plane, Building2, Bus, Landmark, HandHeart, BadgeCheck } from "lucide-react";

export function FeaturesStrip() {
  const { t } = useTranslation();
  const items = [
    { icon: BadgeCheck, label: t("features.visa"), sub: t("features.visaSub") },
    { icon: Plane, label: t("features.ticket"), sub: t("features.ticketSub") },
    { icon: Building2, label: t("features.hotel"), sub: t("features.hotelSub") },
    { icon: Bus, label: t("features.transport"), sub: t("features.transportSub") },
    { icon: Landmark, label: t("features.ziyarat"), sub: t("features.ziyaratSub") },
    { icon: HandHeart, label: t("features.support"), sub: t("features.supportSub") },
  ];

  return (
    <section className="bg-background py-8 md:py-10">
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {items.map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/5 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-semibold text-foreground text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
