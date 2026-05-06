import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, Book, BookOpen } from "lucide-react";

const guides = [
  {
    title: "Complete Umrah Guide",
    description: "Step-by-step guide covering all rituals, duas, and practical tips for Umrah.",
    pages: "32 pages",
    icon: Book,
  },
  {
    title: "Hajj Rituals Guide",
    description: "Comprehensive guide to all Hajj rituals with detailed explanations.",
    pages: "48 pages",
    icon: BookOpen,
  },
  {
    title: "First-Timer's Handbook",
    description: "Essential preparation guide for those performing Hajj or Umrah for the first time.",
    pages: "24 pages",
    icon: FileText,
  },
];

const duas = [
  {
    title: "Travel Duas Collection",
    description: "Essential duas for travel, entering/leaving home, and journey safety.",
    icon: FileText,
  },
  {
    title: "Umrah Duas",
    description: "Complete collection of duas for Tawaf, Sa'i, and all Umrah rituals.",
    icon: Book,
  },
  {
    title: "Hajj Duas",
    description: "All duas for the days of Hajj including Arafat, Mina, and Muzdalifah.",
    icon: BookOpen,
  },
  {
    title: "Masjid al-Haram Duas",
    description: "Special duas for visiting the Holy Kaaba and Masjid al-Haram.",
    icon: Book,
  },
  {
    title: "Masjid an-Nabawi Duas",
    description: "Duas for visiting the Prophet's Mosque in Medina.",
    icon: BookOpen,
  },
];

const Resources = () => {
  const handleDownload = (title: string) => {
    // Placeholder for download functionality
    alert(`Download for "${title}" will be available soon. Please check back later or contact us for the guide.`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
              Resources
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Guides & Duas
            </h1>
            <p className="text-muted-foreground text-lg">
              Download our comprehensive guides and dua collections to prepare for your sacred journey.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">📄 Pilgrimage Guides</h2>
            <p className="text-muted-foreground">
              Comprehensive PDF guides to help you prepare for your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.title} className="card-elevated bg-card rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <guide.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>
                <p className="text-secondary text-sm font-medium mb-6">{guide.pages}</p>
                <Button
                  onClick={() => handleDownload(guide.title)}
                  className="btn-primary w-full rounded-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Duas Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">🤲 Dua Collections</h2>
            <p className="text-muted-foreground">
              Essential duas for every step of your pilgrimage
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {duas.map((dua) => (
              <div
                key={dua.title}
                className="bg-card rounded-xl p-6 flex items-start gap-4 shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                  <dua.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{dua.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{dua.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(dua.title)}
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-primary">
        <div className="container-custom mx-auto px-4 md:px-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-4">
            Need Personalized Guidance?
          </h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our experienced scholars are available to answer your questions and provide
            personalized guidance for your pilgrimage.
          </p>
          <Button
            onClick={() => window.open("https://wa.me/919876543210", "_blank")}
            className="btn-gold rounded-full px-8"
          >
            Chat with Us on WhatsApp
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
