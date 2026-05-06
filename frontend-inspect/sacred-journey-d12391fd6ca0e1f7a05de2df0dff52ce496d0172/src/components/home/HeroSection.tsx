import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-kaaba.jpg";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-emerald-deep overflow-hidden pt-28 md:pt-32">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--secondary)) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container-custom mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center pb-12">
          {/* Left content */}
          <div className="text-primary-foreground">
            {/* Ornamental headline */}
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <span>۞</span>
              <span className="font-medium tracking-wide text-sm">{t("hero.title_1")}</span>
              <span>۞</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3 text-gold-gradient">
              {t("hero.title_2")}
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
              {t("hero.title_3")}
            </h2>

            <p className="text-lg text-primary-foreground/90 mb-4">{t("hero.join")}</p>

            {/* Stats inline */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="bg-card/95 text-foreground rounded-full pl-2 pr-5 py-2 flex items-center gap-3 shadow-card">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">10K</div>
                <div className="text-xs leading-tight">
                  <div className="font-bold text-primary">10,000</div>
                  <div className="text-muted-foreground">{t("hero.applicants")}</div>
                </div>
              </div>
              <div className="bg-card/95 text-foreground rounded-full pl-2 pr-5 py-2 flex items-center gap-3 shadow-card">
                <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">125</div>
                <div className="text-xs leading-tight">
                  <div className="font-bold text-primary">125</div>
                  <div className="text-muted-foreground">{t("hero.selected")}</div>
                </div>
              </div>
            </div>

            <p className="text-primary-foreground/80 mb-8 max-w-xl">{t("hero.description")}</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/lucky-draw">
                <Button className="btn-primary rounded-xl px-8 py-6 text-base w-full sm:w-auto bg-emerald-deep border border-secondary/40">
                  <Mail className="w-5 h-5 mr-2" />
                  {t("hero.register")}
                </Button>
              </Link>
              <a href="https://wa.me/919213408880" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold rounded-xl px-8 py-6 text-base w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("hero.whatsapp")}
                </Button>
              </a>
            </div>
          </div>

          {/* Right - Image with price badge */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-secondary/30">
              <img src={heroImage} alt="Kaaba" className="w-full h-[420px] md:h-[520px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            {/* Price badge */}
            <div className="absolute -left-2 md:-left-6 top-6 md:top-10">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-secondary to-gold-light flex flex-col items-center justify-center text-secondary-foreground shadow-gold border-4 border-card">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t("hero.only")}</span>
                  <span className="font-serif text-3xl md:text-4xl font-bold">₹1500/-</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t("hero.fee")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
