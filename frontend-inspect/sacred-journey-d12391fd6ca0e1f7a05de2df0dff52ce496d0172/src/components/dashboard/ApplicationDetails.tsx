import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CalendarDays, CreditCard, Hash } from "lucide-react";

interface Props {
  applicationRef: string;
  appliedAt: string;
  paymentStatus: string;
}

export function ApplicationDetails({ applicationRef, appliedAt, paymentStatus }: Props) {
  const date = new Date(appliedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const paymentVariant = paymentStatus === "Paid" ? "default" : paymentStatus === "Pending" ? "secondary" : "outline";

  const rows = [
    { icon: Hash, label: "Application ID", value: applicationRef, mono: true },
    { icon: CalendarDays, label: "Date Applied", value: date },
    { icon: CreditCard, label: "Payment Status", value: paymentStatus, badge: paymentVariant as any },
  ];

  return (
    <Card className="card-elevated p-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-xl text-foreground">Application Details</h2>
      </div>

      <div className="space-y-4">
        {rows.map(({ icon: Icon, label, value, mono, badge }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4" />
              {label}
            </div>
            {badge ? (
              <Badge variant={badge}>{value}</Badge>
            ) : (
              <span className={mono ? "font-mono text-sm font-semibold text-primary" : "text-sm font-medium text-foreground"}>
                {value}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
