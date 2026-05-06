import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Award, Users, Heart, Shield, Star, Target } from "lucide-react";
import medinaImage from "@/assets/medina-mosque.jpg";

const stats = [
  { number: "15+", label: "Years Experience" },
  { number: "10,000+", label: "Happy Pilgrims" },
  { number: "500+", label: "Group Tours" },
  { number: "100%", label: "Visa Success" },
];

const values = [
  {
    icon: Heart,
    title: "Sincerity",
    description: "We approach every pilgrim's journey with genuine care and dedication.",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Transparent dealings and honest communication at every step.",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "Striving for the highest standards in service and support.",
  },
  {
    icon: Target,
    title: "Reliability",
    description: "Delivering on our promises, every single time.",
  },
];

const team = [
  {
    name: "Haji Abdul Rahman",
    role: "Founder & Director",
    description: "25+ years of experience in organizing pilgrimages with a deep commitment to service.",
  },
  {
    name: "Ustaz Mohammed Ali",
    role: "Head Religious Guide",
    description: "Islamic scholar providing spiritual guidance and educational sessions.",
  },
  {
    name: "Fatima Hassan",
    role: "Operations Manager",
    description: "Ensuring smooth operations and excellent pilgrim experience.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${medinaImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container-custom mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Serving Pilgrims with Honesty & Care
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              For over 15 years, we have been dedicated to making the sacred journeys of Hajj and
              Umrah accessible, comfortable, and spiritually enriching for pilgrims from all walks of life.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Journey of Service & Dedication
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010 by Haji Abdul Rahman, our company began with a simple yet powerful
                  mission: to help fellow Muslims fulfill their sacred obligation of Hajj and the
                  blessed journey of Umrah with ease and dignity.
                </p>
                <p>
                  What started as a small operation serving a handful of pilgrims has grown into
                  one of the most trusted names in pilgrimage services, having successfully guided
                  over 10,000 pilgrims to the Holy Cities.
                </p>
                <p>
                  Our success is built on the foundation of honesty, transparency, and genuine care
                  for every pilgrim who entrusts us with their sacred journey.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value.title} className="service-card">
                  <value.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-elevated bg-card rounded-2xl p-8 md:p-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and preferred partner for Muslims embarking on their sacred
                journeys, known for excellence, integrity, and heartfelt service.
              </p>
            </div>
            <div className="card-elevated bg-card rounded-2xl p-8 md:p-10">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide comprehensive, hassle-free pilgrimage services that allow every pilgrim
                to focus entirely on their spiritual journey while we handle every detail with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-muted-foreground">
              Experienced professionals dedicated to making your pilgrimage memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-3xl text-primary font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-secondary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
            Registered & Certified
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl shadow-soft">
              <Award className="w-8 h-8 text-primary" />
              <span className="text-foreground font-medium">Ministry of Hajj Approved</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl shadow-soft">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-foreground font-medium">IATA Registered</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl shadow-soft">
              <Star className="w-8 h-8 text-primary" />
              <span className="text-foreground font-medium">ISO 9001 Certified</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
