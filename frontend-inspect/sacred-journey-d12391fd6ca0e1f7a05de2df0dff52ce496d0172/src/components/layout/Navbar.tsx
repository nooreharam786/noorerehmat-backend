import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TopBar } from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.program") },
    { href: "/lucky-draw", label: t("nav.selection") },
    { href: "/resources", label: t("nav.results") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <TopBar />
      <div
        className={cn(
          "transition-all duration-300 bg-card/95 backdrop-blur-md",
          isScrolled ? "shadow-soft" : "shadow-none"
        )}
      >
        <nav className="container-custom mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center ring-2 ring-secondary/40">
                <span className="text-secondary font-serif text-xl">۩</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-base md:text-lg font-bold text-primary tracking-wide">
                  {t("brand.name")}
                </span>
                <span className="text-[10px] md:text-xs text-secondary font-medium tracking-[0.2em] uppercase">
                  {t("brand.tagline")}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-secondary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline" className="rounded-full gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="rounded-full gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              )}
              <Link to="/lucky-draw">
                <Button className="btn-primary rounded-full px-6 py-5 text-sm font-semibold">
                  {t("nav.register")}
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className={cn("lg:hidden overflow-hidden transition-all duration-300", isOpen ? "max-h-[32rem] pb-6" : "max-h-0")}>
            <div className="flex flex-col gap-1 pt-4 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium",
                    location.pathname === link.href ? "text-primary bg-primary/10" : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link to="/dashboard" className="mt-2">
                  <Button variant="outline" className="rounded-full w-full gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="mt-2">
                  <Button variant="outline" className="rounded-full w-full gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              )}
              <Link to="/lucky-draw" className="mt-2">
                <Button className="btn-primary rounded-full w-full">{t("nav.register")}</Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
