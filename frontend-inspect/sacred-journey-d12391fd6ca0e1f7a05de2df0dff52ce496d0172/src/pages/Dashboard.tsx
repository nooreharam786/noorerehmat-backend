import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserCard } from "@/components/dashboard/UserCard";
import { StatusCard, type AppStatus } from "@/components/dashboard/StatusCard";
import { ApplicationDetails } from "@/components/dashboard/ApplicationDetails";
import { LogOut, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProfileRow {
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface ApplicationRow {
  id: string;
  application_ref: string;
  status: AppStatus;
  payment_status: string;
  applied_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [application, setApplication] = useState<ApplicationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: profileData }, { data: appData }] = await Promise.all([
      supabase.from("profiles").select("full_name,email,created_at").eq("user_id", user.id).maybeSingle(),
      supabase.from("applications").select("id,application_ref,status,payment_status,applied_at")
        .eq("user_id", user.id).order("applied_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    setProfile(profileData as ProfileRow | null);
    setApplication(appData as ApplicationRow | null);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
    toast.success("Status refreshed");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen pt-28 md:pt-32 pb-16 bg-muted/30">
        <div className="container-custom mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <p className="text-xs uppercase tracking-wider text-secondary font-bold">Dashboard</p>
              <h1 className="font-serif text-3xl md:text-4xl text-primary">Assalamu Alaikum{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
              <p className="text-muted-foreground text-sm mt-1">Track your Umrah Support Program application</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 self-start md:self-auto">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          {loading ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 lg:col-span-1" />
              <Skeleton className="h-64 lg:col-span-2" />
              <Skeleton className="h-48 lg:col-span-3" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserCard fullName={profile?.full_name} email={profile?.email ?? user?.email} joinedAt={profile?.created_at} />
              </div>

              <div className="lg:col-span-2">
                {application ? (
                  <StatusCard status={application.status} onRefresh={handleRefresh} refreshing={refreshing} />
                ) : (
                  <Card className="card-elevated p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl text-primary mb-2">No Application Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Register for the Umrah Support Program to begin your blessed journey.</p>
                    <Link to="/lucky-draw">
                      <Button className="btn-primary">Register Now</Button>
                    </Link>
                  </Card>
                )}
              </div>

              {application && (
                <div className="lg:col-span-3">
                  <ApplicationDetails
                    applicationRef={application.application_ref}
                    appliedAt={application.applied_at}
                    paymentStatus={application.payment_status}
                  />
                </div>
              )}

              {/* Contact support */}
              <div className="lg:col-span-3">
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-primary">Need Help?</h3>
                      <p className="text-sm text-muted-foreground">Our team is available to answer any questions about your application.</p>
                    </div>
                    <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                      <Button className="btn-gold gap-2">
                        <MessageCircle className="w-4 h-4" /> Contact Support
                      </Button>
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
