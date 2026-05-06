import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Khan",
    location: "Mumbai",
    rating: 5,
    text: "Alhamdulillah! Our Umrah journey was made absolutely seamless by the team. From visa processing to hotel arrangements, everything was perfectly organized. The guides were knowledgeable and caring.",
    year: "2025",
  },
  {
    name: "Fatima Begum",
    location: "Delhi",
    rating: 5,
    text: "This was my first Hajj and I was nervous about many things. The team took care of every detail and the religious guidance provided was invaluable. Truly a life-changing experience.",
    year: "2024",
  },
  {
    name: "Mohammed Rafiq",
    location: "Hyderabad",
    rating: 5,
    text: "We traveled as a family of 6 and the personalized attention we received was exceptional. The proximity of our hotel to Masjid al-Haram made our prayers so convenient. Highly recommended!",
    year: "2025",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-secondary font-medium text-sm uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Pilgrims Say
          </h2>
          <p className="text-muted-foreground">
            Hear from those who have completed their sacred journey with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.location} • {testimonial.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
