import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.program") },
    { href: "/lucky-draw", label: t("nav.selection") },
    { href: "/resources", label: t("nav.results") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-5 text-secondary">{t("footer.contact")}</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:+919213408880" className="flex items-center gap-2 hover:text-secondary">
                <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-semibold text-base">9213408880</span>
              </a>
              <a href="mailto:info@nooreharamtrust.org" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground">
                <Mail className="w-4 h-4 text-secondary" />
                info@nooreharamtrust.org
              </a>
              <a href="#" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground">
                <span className="text-secondary">@</span>
                www.nooreharamtrust.org
              </a>
            </div>
          </div>

          {/* Office */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-5 text-secondary">{t("footer.office")}</h4>
            <p className="text-sm text-primary-foreground/80 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
              <span>
                AT POST UMALLA MAIN BAZAR,<br />
                OPP BANK OF INDIA,<br />
                TA - JAGHADIA,<br />
                DIST - BHARUCH 393120
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-5 text-secondary">{t("footer.quick")}</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/80 hover:text-secondary flex items-center gap-1">
                    <span className="text-secondary">›</span> {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-secondary flex items-center gap-1">
                  <span className="text-secondary">›</span> {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-5 text-secondary">{t("footer.follow")}</h4>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:opacity-90 flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-custom mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/70">
          <p>© 2026 {t("brand.name")}. {t("footer.rights")}</p>
          <p className="text-secondary tracking-widest font-medium">{t("brand.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
