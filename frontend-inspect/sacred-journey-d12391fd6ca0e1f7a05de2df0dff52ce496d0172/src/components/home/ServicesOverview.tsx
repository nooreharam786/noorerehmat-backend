import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Building, Users, FileCheck, ChevronRight } from "lucide-react";
import medinaImage from "@/assets/medina-mosque.jpg";

const services = [
  {
    icon: Building,
    title: "Hajj Packages",
    description: "Complete Hajj packages with premium accommodation near Haram, experienced guides, and all-inclusive services.",
    features: ["5-star hotels", "Guided rituals", "Meals included"],
  },
  {
    icon: Plane,
    title: "Umrah Packages",
    description: "Flexible Umrah packages for individuals, families, and groups throughout the year.",
    features: ["Economy to Luxury", "Visa assistance", "Airport transfers"],
  },
  {
    icon: Users,
    title: "Group Tours",
    description: "Join our organized group tours with like-minded pilgrims for a shared spiritual experience.",
    features: ["Expert scholars", "Educational sessions", "Community bonding"],
  },
  {
    icon: FileCheck,
    title: "Visa & Documentation",
    description: "Hassle-free visa processing and documentation services for a smooth travel experience.",
    features: ["Fast processing", "Document guidance", "Application support"],
  },
];

export function ServicesOverview() {
  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${medinaImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="container-custom mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Pilgrimage Services
          </h2>
          <p className="text-muted-foreground">
            From the moment you decide to embark on your sacred journey until your safe return,
            we're with you every step of the way.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="card-elevated bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 group"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <service.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/services">
            <Button className="btn-primary rounded-full px-8 py-6 text-base">
              View All Packages
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
