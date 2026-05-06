import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift, Star, Ticket, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const prizes = [
  {
    icon: Star,
    title: "Grand Prize",
    prize: "₹25,000 Umrah Discount",
    description: "Get a massive discount on your next Umrah package",
    color: "text-yellow-500",
  },
  {
    icon: Gift,
    title: "Second Prize",
    prize: "Free Guidance Kit",
    description: "Complete Hajj & Umrah preparation kit with duas and guides",
    color: "text-primary",
  },
  {
    icon: Ticket,
    title: "Third Prize",
    prize: "₹5,000 Travel Voucher",
    description: "Redeemable on any of our travel services",
    color: "text-secondary",
  },
];

const steps = [
  { step: 1, title: "Fill the Form", description: "Enter your details below" },
  { step: 2, title: "Pay Entry Fee", description: "₹499 via secure payment" },
  { step: 3, title: "Get Confirmation", description: "Receive entry confirmation" },
  { step: 4, title: "Win Prizes!", description: "Winners announced monthly" },
];

const LuckyDraw = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    service: "",
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast({
        title: "Please accept terms",
        description: "You must agree to the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Entry Submitted!",
      description: "Please complete the payment to confirm your entry. (Payment integration coming soon)",
    });

    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto text-primary-foreground">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Win Exciting Rewards for Your Umrah Journey
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Participate in our Lucky Draw for just ₹499 and stand a chance to win
              amazing prizes including Umrah discounts and travel vouchers!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">🎁 Exciting Prizes</h2>
            <p className="text-muted-foreground">Amazing rewards waiting to be won</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {prizes.map((prize, index) => (
              <div
                key={prize.title}
                className={`card-elevated bg-card rounded-2xl p-8 text-center ${
                  index === 0 ? "ring-2 ring-secondary" : ""
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <prize.icon className={`w-8 h-8 ${prize.color}`} />
                </div>
                <span className="text-secondary text-xs font-medium uppercase tracking-wider">
                  {prize.title}
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-2 mb-2">
                  {prize.prize}
                </h3>
                <p className="text-muted-foreground text-sm">{prize.description}</p>
              </div>
            ))}
          </div>

          {/* Entry Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card-elevated bg-card rounded-2xl p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  📝 Enter the Lucky Draw
                </h2>
                <p className="text-muted-foreground">Fill in your details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="input-islamic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      className="input-islamic"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-islamic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="input-islamic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Interested In *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger className="input-islamic">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hajj">Hajj Package</SelectItem>
                      <SelectItem value="umrah">Umrah Package</SelectItem>
                      <SelectItem value="both">Both Hajj & Umrah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the terms and conditions. I understand that the entry fee of ₹499 is
                    non-refundable and winners will be announced on the 1st of every month.
                  </Label>
                </div>

                <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-secondary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Entry Fee: <span className="font-semibold text-foreground">₹499</span> (One-time payment)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="btn-gold w-full rounded-full py-6 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Proceed to Payment"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-12 bg-muted">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Terms & Conditions
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Entry fee is non-refundable</li>
              <li>• Winners will be announced on the 1st of every month</li>
              <li>• Prizes must be claimed within 30 days of announcement</li>
              <li>• Discounts are applicable on new bookings only</li>
              <li>• One entry per person per month</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LuckyDraw;
