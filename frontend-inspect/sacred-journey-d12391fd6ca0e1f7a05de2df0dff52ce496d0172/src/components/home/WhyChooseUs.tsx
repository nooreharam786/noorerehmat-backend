import { Shield, Users, Clock, Wallet, HeartHandshake, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Government Registered",
    description: "Fully licensed and registered with all government authorities for your peace of mind.",
  },
  {
    icon: Users,
    title: "Experienced Guides",
    description: "Our knowledgeable guides ensure a spiritually enriching and smooth pilgrimage experience.",
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description: "From visa processing to accommodation, we handle everything so you can focus on worship.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden costs. Clear, upfront pricing with detailed breakdowns of all inclusions.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description: "Small group sizes ensure personal attention and care throughout your journey.",
  },
  {
    icon: Award,
    title: "15+ Years Experience",
    description: "Trusted by thousands of pilgrims over 15 years of dedicated service.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Trusted Partner for Sacred Journeys
          </h2>
          <p className="text-muted-foreground">
            We combine years of experience with genuine care to make your Hajj and Umrah
            journey memorable and spiritually fulfilling.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="service-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
