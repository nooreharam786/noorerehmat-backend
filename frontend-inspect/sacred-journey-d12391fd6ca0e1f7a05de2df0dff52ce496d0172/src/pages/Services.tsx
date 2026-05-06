import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Star, ChevronRight, Plane, Building, Calendar, Users } from "lucide-react";

const hajjPackages = [
  {
    name: "Economy Hajj",
    price: "₹3,50,000",
    duration: "21 Days",
    hotel: "3-Star",
    features: [
      "Visa processing",
      "Return flights",
      "3-star accommodation",
      "Ground transport",
      "Guided rituals",
      "Meals included",
    ],
  },
  {
    name: "Premium Hajj",
    price: "₹5,00,000",
    duration: "25 Days",
    hotel: "4-Star",
    popular: true,
    features: [
      "Visa processing",
      "Return flights",
      "4-star near Haram",
      "Private transport",
      "Senior scholar guide",
      "All meals included",
      "Ziyarat tours",
      "Medical support",
    ],
  },
  {
    name: "Luxury Hajj",
    price: "₹7,50,000",
    duration: "30 Days",
    hotel: "5-Star",
    features: [
      "VIP visa processing",
      "Business class flights",
      "5-star Haram view",
      "Luxury transport",
      "Personal guide",
      "Gourmet meals",
      "Extended Ziyarat",
      "24/7 concierge",
    ],
  },
];

const umrahPackages = [
  {
    name: "Budget Umrah",
    price: "₹75,000",
    duration: "10 Days",
    features: ["Visa", "Flights", "3-star hotel", "Guided tours"],
  },
  {
    name: "Standard Umrah",
    price: "₹1,20,000",
    duration: "14 Days",
    features: ["Visa", "Flights", "4-star hotel", "All meals", "Ziyarat"],
  },
  {
    name: "Premium Umrah",
    price: "₹2,00,000",
    duration: "21 Days",
    features: ["Visa", "Flights", "5-star hotel", "VIP treatment", "Personal guide"],
  },
];

const additionalServices = [
  {
    icon: Plane,
    title: "Flight Booking",
    description: "Best rates on flights to Jeddah and Medina",
  },
  {
    icon: Building,
    title: "Hotel Reservations",
    description: "Premium accommodations near Haram",
  },
  {
    icon: Calendar,
    title: "Custom Itineraries",
    description: "Tailored packages for your needs",
  },
  {
    icon: Users,
    title: "Group Discounts",
    description: "Special rates for groups of 10+",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
              Our Packages
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hajj & Umrah Packages
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose from our carefully curated packages designed to make your sacred journey
              comfortable, meaningful, and memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Hajj Packages */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Hajj Packages 2026</h2>
            <p className="text-muted-foreground">All-inclusive packages for the sacred pilgrimage</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hajjPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-8 ${
                  pkg.popular
                    ? "bg-primary text-primary-foreground ring-4 ring-secondary"
                    : "bg-card shadow-card"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-serif text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className={pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
                      /person
                    </span>
                  </div>
                  <div className={`mt-2 text-sm ${pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {pkg.duration} • {pkg.hotel}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className={`w-5 h-5 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <Button
                    className={`w-full rounded-full ${
                      pkg.popular ? "btn-gold" : "btn-primary"
                    }`}
                  >
                    Enquire Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Umrah Packages */}
      <section className="section-padding bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Umrah Packages</h2>
            <p className="text-muted-foreground">Flexible packages available year-round</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {umrahPackages.map((pkg) => (
              <div key={pkg.name} className="card-elevated bg-card rounded-2xl p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground text-sm">/person</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{pkg.duration}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="outline" className="w-full rounded-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Additional Services</h2>
            <p className="text-muted-foreground">Complete support for your journey</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service) => (
              <div key={service.title} className="service-card text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Need a Custom Package?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We can create a personalized package tailored to your specific needs, budget, and preferences.
          </p>
          <Link to="/contact">
            <Button className="btn-gold rounded-full px-8 py-6 text-base">
              Contact Us Today
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
