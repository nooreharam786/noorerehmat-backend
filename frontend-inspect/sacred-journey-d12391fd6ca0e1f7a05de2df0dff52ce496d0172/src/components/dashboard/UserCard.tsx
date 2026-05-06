import { Card } from "@/components/ui/card";
import { Mail, Calendar, User as UserIcon } from "lucide-react";

interface Props {
  fullName?: string | null;
  email?: string | null;
  joinedAt?: string | null;
}

export function UserCard({ fullName, email, joinedAt }: Props) {
  const initial = (fullName || email || "U").charAt(0).toUpperCase();
  const joined = joinedAt ? new Date(joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <Card className="card-elevated p-6 animate-fade-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-2xl font-serif ring-2 ring-secondary/40">
          {initial}
        </div>
        <div>
          <h2 className="font-serif text-xl text-foreground">{fullName || "Pilgrim"}</h2>
          <p className="text-xs uppercase tracking-wider text-secondary font-semibold">Account Holder</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Mail className="w-4 h-4 text-primary" />
          <span className="text-foreground">{email}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Joined {joined}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <UserIcon className="w-4 h-4 text-primary" />
          <span>Verified Member</span>
        </div>
      </div>
    </Card>
  );
}
