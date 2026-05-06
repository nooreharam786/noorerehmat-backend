import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Check your email for the reset link");
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 bg-muted/30">
        <Card className="w-full max-w-md p-8 card-elevated">
          <h1 className="text-2xl font-serif text-primary text-center mb-2">Reset Password</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">We'll email you a reset link</p>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-sm">If an account exists for <strong>{email}</strong>, you'll receive an email shortly.</p>
              <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="btn-primary w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-primary">Back to sign in</Link>
            </form>
          )}
        </Card>
      </div>
    </Layout>
  );
}
