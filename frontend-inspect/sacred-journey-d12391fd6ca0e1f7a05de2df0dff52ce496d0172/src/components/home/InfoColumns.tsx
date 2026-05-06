import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import medina from "@/assets/medina-mosque.jpg";

export function InfoColumns() {
  const { t } = useTranslation();
  const programItems = t("program.items", { returnObjects: true }) as string[];
  const selectionSteps = t("selection.steps", { returnObjects: true }) as string[];

  return (
    <section className="section-padding bg-muted">
      <div className="container-custom mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* About */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden flex flex-col">
            <img src={medina} alt="Mosque" className="w-full h-44 object-cover" />
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
                {t("about.label")}
              </span>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">{t("about.title")}</h3>
              <p className="text-sm text-muted-foreground flex-1">{t("about.body")}</p>
              <Link to="/about" className="mt-5">
                <Button className="btn-primary rounded-full text-xs px-5">{t("about.more")}</Button>
              </Link>
            </div>
          </div>

          {/* Program */}
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
              {t("program.label")}
            </span>
            <h3 className="font-serif text-xl font-bold text-primary mb-4">{t("program.title")}</h3>
            <ul className="space-y-3 flex-1">
              {programItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/services" className="mt-5">
              <Button className="btn-primary rounded-full text-xs px-5">{t("program.view")}</Button>
            </Link>
          </div>

          {/* Selection */}
          <div className="bg-accent/30 rounded-2xl shadow-card p-6 flex flex-col border border-secondary/20">
            <span className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
              {t("selection.label")}
            </span>
            <h3 className="font-serif text-xl font-bold text-primary mb-4">{t("selection.title")}</h3>
            <ol className="space-y-3 flex-1">
              {selectionSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link to="/lucky-draw" className="mt-5">
              <Button className="btn-primary rounded-full text-xs px-5">{t("selection.view")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
