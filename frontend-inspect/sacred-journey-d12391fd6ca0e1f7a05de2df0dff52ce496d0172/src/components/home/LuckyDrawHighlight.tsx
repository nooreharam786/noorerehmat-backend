import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Star, Ticket, ChevronRight } from "lucide-react";

const prizes = [
  {
    icon: Star,
    title: "Grand Prize",
    prize: "₹25,000 Umrah Discount",
    description: "Get a massive discount on your next Umrah package",
  },
  {
    icon: Gift,
    title: "Second Prize",
    prize: "Free Guidance Kit",
    description: "Complete Hajj & Umrah preparation kit with duas and guides",
  },
  {
    icon: Ticket,
    title: "Third Prize",
    prize: "₹5,000 Travel Voucher",
    description: "Redeemable on any of our travel services",
  },
];

export function LuckyDrawHighlight() {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-custom mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </span>

            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Win Exciting Rewards for Your Umrah Journey
            </h2>

            <p className="text-primary-foreground/80 mb-8 text-lg">
              Participate in our Lucky Draw and stand a chance to win amazing prizes
              including Umrah discounts, free guidance kits, and travel vouchers!
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary text-sm">1</span>
                </div>
                <span className="text-sm">Fill the form</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary text-sm">2</span>
                </div>
                <span className="text-sm">Pay entry fee</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary text-sm">3</span>
                </div>
                <span className="text-sm">Win prizes!</span>
              </div>
            </div>

            <Link to="/lucky-draw">
              <Button className="btn-gold rounded-full px-8 py-6 text-base">
                Join Lucky Draw Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right - Prize Cards */}
          <div className="space-y-4">
            {prizes.map((prize, index) => (
              <div
                key={prize.title}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 flex items-center gap-5 hover:bg-primary-foreground/15 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                  <prize.icon className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <span className="text-secondary text-xs font-medium uppercase tracking-wider">
                    {prize.title}
                  </span>
                  <h4 className="font-serif text-xl font-semibold text-primary-foreground">
                    {prize.prize}
                  </h4>
                  <p className="text-primary-foreground/70 text-sm">
                    {prize.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
