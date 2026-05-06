import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye, CheckCircle2, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppStatus = "Pending" | "Under Review" | "Selected" | "Not Selected";

interface Props {
  status: AppStatus;
  onRefresh: () => void;
  refreshing?: boolean;
}

const STATUS_CONFIG: Record<AppStatus, { color: string; bg: string; ring: string; icon: any; message: string }> = {
  "Pending": {
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    ring: "ring-yellow-300/50",
    icon: Clock,
    message: "Your application is received and awaiting review.",
  },
  "Under Review": {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    ring: "ring-blue-300/50",
    icon: Eye,
    message: "Our team is reviewing your application.",
  },
  "Selected": {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    ring: "ring-emerald-300/50",
    icon: CheckCircle2,
    message: "MashaAllah! You have been selected for the Umrah journey.",
  },
  "Not Selected": {
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    ring: "ring-red-300/50",
    icon: XCircle,
    message: "You were not selected this time. Please try again next round.",
  },
};

export function StatusCard({ status, onRefresh, refreshing }: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Card className="card-elevated p-6 lg:p-8 animate-fade-up relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

      <div className="flex items-center justify-between mb-6 relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Application Status
          </p>
          <h2 className="font-serif text-2xl text-foreground mt-1">Your Journey</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className={cn("rounded-xl p-6 ring-2 transition-all", config.bg, config.ring)}>
        <div className="flex items-start gap-4">
          <div className={cn("w-14 h-14 rounded-full bg-card flex items-center justify-center shrink-0 shadow-soft", config.color)}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className={cn("text-xs uppercase font-bold tracking-wider mb-1", config.color)}>Current Status</div>
            <div className={cn("text-2xl font-serif font-bold", config.color)}>{status}</div>
            <p className="text-sm text-muted-foreground mt-2">{config.message}</p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {(["Pending", "Under Review", "Selected"] as const).map((s, i) => {
          const stages: AppStatus[] = ["Pending", "Under Review", "Selected"];
          const currentIdx = status === "Not Selected" ? -1 : stages.indexOf(status);
          const active = i <= currentIdx;
          return (
            <div key={s} className="text-center">
              <div className={cn("h-1.5 rounded-full transition-all", active ? "bg-primary" : "bg-muted")} />
              <div className={cn("text-[10px] mt-1.5 font-medium", active ? "text-primary" : "text-muted-foreground")}>
                {s}
              </div>
            </div>
          );
        })}
        <div className="text-center">
          <div className={cn("h-1.5 rounded-full", status === "Not Selected" ? "bg-red-500" : "bg-muted")} />
          <div className={cn("text-[10px] mt-1.5 font-medium", status === "Not Selected" ? "text-red-500" : "text-muted-foreground")}>
            Closed
          </div>
        </div>
      </div>
    </Card>
  );
}
