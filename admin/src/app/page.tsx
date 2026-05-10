"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Gauge,
  Loader2,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Users,
  WalletCards
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { api, clearToken, getToken, toQuery } from "@/lib/api";
import type { Applicant, ApplicationStatus, DrawResult, Feedback, Paginated, PaymentStatus, PublicDocument, Stats, User } from "@/types/api";

type Tab = "Dashboard" | "Users" | "Lucky Draw Applicants" | "Draw Control" | "Feedback" | "Settings";
type SortOrder = "asc" | "desc";

const tabs: { name: Tab; icon: typeof Gauge }[] = [
  { name: "Dashboard", icon: Gauge },
  { name: "Users", icon: Users },
  { name: "Lucky Draw Applicants", icon: Trophy },
  { name: "Draw Control", icon: Sparkles },
  { name: "Feedback", icon: MessageSquare },
  { name: "Settings", icon: Settings }
];

const statusTone: Record<string, string> = {
  selected: "bg-emerald-mist text-emerald-deep",
  not_selected: "bg-stone-100 text-stone-600",
  pending: "bg-gold-soft text-stone-700",
  paid: "bg-emerald-mist text-emerald-deep",
  failed: "bg-red-50 text-red-700",
  admin: "bg-gold-soft text-emerald-deep",
  user: "bg-stone-100 text-stone-600"
};

function formatDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, h:mm a");
}

function Badge({ value }: { value: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[value] ?? statusTone.pending}`}>{value.replace("_", " ")}</span>;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-stone-100 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</span>
      <span className="max-w-[68%] text-right text-sm font-medium text-stone-700">{value}</span>
    </div>
  );
}

function SkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <tr key={row} className="border-t border-stone-100">
          {Array.from({ length: cols }).map((__, col) => (
            <td key={col} className="px-4 py-4">
              <div className="h-4 w-full max-w-32 animate-pulse rounded bg-stone-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-stone-100 px-4 py-3 sm:justify-end">
      <button className="btn-secondary h-9 px-3" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-stone-500">
        Page {page} of {Math.max(pages, 1)}
      </span>
      <button className="btn-secondary h-9 px-3" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<Paginated<User> | null>(null);
  const [applicants, setApplicants] = useState<Paginated<Applicant> | null>(null);
  const [drawHistory, setDrawHistory] = useState<DrawResult[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [settings, setSettings] = useState({
    imbPaymentLink: "",
    resultsYoutubeUrl: "",
    galleryImageUrls: "",
    termsDocumentUrl: "",
    umrahPackagePrice: 0,
    socialFacebookUrl: "",
    socialInstagramUrl: "",
    socialYoutubeUrl: "",
    socialWhatsappUrl: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    adminName: "",
    adminEmail: ""
  });
  const [newFeedback, setNewFeedback] = useState({ name: "", rating: 5, location: "", message: "" });
  const [documentForm, setDocumentForm] = useState({ title: "", description: "", kind: "dua" });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersQuery, setUsersQuery] = useState({ page: 1, search: "", sortBy: "createdAt", sortOrder: "desc" as SortOrder });
  const [appQuery, setAppQuery] = useState({
    page: 1,
    search: "",
    status: "" as ApplicationStatus | "",
    paymentStatus: "" as PaymentStatus | "",
    sortBy: "createdAt",
    sortOrder: "desc" as SortOrder
  });
  const [drawMode, setDrawMode] = useState<"fixed" | "percentage">("fixed");
  const [fixedCount, setFixedCount] = useState(125);
  const [percentage, setPercentage] = useState(1.25);
  const [confirmDraw, setConfirmDraw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  async function loadDashboard() {
    const [nextStats, history] = await Promise.all([api<Stats>("/admin/stats"), api<DrawResult[]>("/admin/draw/history")]);
    setStats(nextStats);
    setDrawHistory(history);
  }

  async function loadUsers() {
    const query = toQuery({ ...usersQuery, limit: 10 });
    setUsers(await api<Paginated<User>>(`/admin/users${query}`));
  }

  async function loadApplicants() {
    const query = toQuery({ ...appQuery, limit: 10 });
    setApplicants(await api<Paginated<Applicant>>(`/admin/applicants${query}`));
  }

  async function loadSettings() {
    const data = await api<{
      imbPaymentLink?: string;
      resultsYoutubeUrl?: string;
      galleryImageUrls?: string;
      termsDocumentUrl?: string;
      umrahPackagePrice?: number;
      socialFacebookUrl?: string;
      socialInstagramUrl?: string;
      socialYoutubeUrl?: string;
      socialWhatsappUrl?: string;
      contactAddress?: string;
      contactPhone?: string;
      contactEmail?: string;
      admin?: { name: string; email: string };
    }>("/admin/settings");
    setSettings({
      imbPaymentLink: data.imbPaymentLink ?? "",
      resultsYoutubeUrl: data.resultsYoutubeUrl ?? "",
      galleryImageUrls: data.galleryImageUrls ?? "",
      termsDocumentUrl: data.termsDocumentUrl ?? "",
      umrahPackagePrice: data.umrahPackagePrice ?? 0,
      socialFacebookUrl: data.socialFacebookUrl ?? "",
      socialInstagramUrl: data.socialInstagramUrl ?? "",
      socialYoutubeUrl: data.socialYoutubeUrl ?? "",
      socialWhatsappUrl: data.socialWhatsappUrl ?? "",
      contactAddress: data.contactAddress ?? "",
      contactPhone: data.contactPhone ?? "",
      contactEmail: data.contactEmail ?? "",
      adminName: data.admin?.name ?? "",
      adminEmail: data.admin?.email ?? ""
    });
  }

  async function loadFeedback() {
    setFeedback(await api<Feedback[]>("/admin/feedback"));
  }

  async function loadDocuments() {
    setDocuments(await api<PublicDocument[]>("/admin/documents"));
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    Promise.all([loadDashboard(), loadUsers(), loadApplicants(), loadSettings(), loadFeedback(), loadDocuments()])
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load dashboard");
        if (error instanceof Error && error.message.toLowerCase().includes("token")) router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (getToken()) loadUsers().catch((error) => toast.error(error.message));
  }, [usersQuery]);

  useEffect(() => {
    if (getToken()) loadApplicants().catch((error) => toast.error(error.message));
  }, [appQuery]);

  const statCards = useMemo(
    () => [
      { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users },
      { label: "Total Applicants", value: stats?.totalApplicants ?? 0, icon: Trophy },
      { label: "Paid Users", value: stats?.paidUsers ?? 0, icon: WalletCards },
      { label: "Selected Users", value: stats?.selectedUsers ?? 0, icon: BadgeCheck }
    ],
    [stats]
  );

  function logout() {
    clearToken();
    router.replace("/login");
  }

  async function runDraw() {
    setSaving(true);
    try {
      const result = await api<DrawResult>("/admin/draw/run", {
        method: "POST",
        body: JSON.stringify({ mode: drawMode, fixedCount, percentage })
      });
      toast.success(`Lucky draw complete: ${result.selectedCount} selected`);
      setConfirmDraw(false);
      await Promise.all([loadDashboard(), loadApplicants()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draw failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await api("/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings)
      });
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function addFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await api<Feedback>("/admin/feedback", {
        method: "POST",
        body: JSON.stringify({ ...newFeedback, location: newFeedback.location || undefined })
      });
      setNewFeedback({ name: "", rating: 5, location: "", message: "" });
      await loadFeedback();
      toast.success("Feedback added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add feedback");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFeedback(id: string) {
    if (!window.confirm("Delete this feedback permanently?")) return;

    setSaving(true);
    try {
      await api(`/admin/feedback/${id}`, { method: "DELETE" });
      setFeedback((items) => items.filter((item) => item.id !== id));
      toast.success("Feedback deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete feedback");
    } finally {
      setSaving(false);
    }
  }

  async function uploadDocument() {
    if (!documentFile) {
      toast.info("Choose a PDF first");
      return;
    }
    const formData = new FormData();
    formData.append("title", documentForm.title);
    formData.append("description", documentForm.description);
    formData.append("kind", documentForm.kind);
    formData.append("document", documentFile);

    setSaving(true);
    try {
      const document = await api<PublicDocument>("/admin/documents", { method: "POST", body: formData });
      if (document.kind === "terms") {
        setSettings((value) => ({ ...value, termsDocumentUrl: document.url }));
      }
      setDocumentForm({ title: "", description: "", kind: "dua" });
      setDocumentFile(null);
      await loadDocuments();
      toast.success("PDF uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload PDF");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDocument(id: string) {
    setSaving(true);
    try {
      await api(`/admin/documents/${id}`, { method: "DELETE" });
      await loadDocuments();
      toast.success("PDF removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove PDF");
    } finally {
      setSaving(false);
    }
  }

  async function uploadGalleryImages() {
    if (!galleryFiles?.length) {
      toast.info("Choose at least one image first");
      return;
    }

    const formData = new FormData();
    Array.from(galleryFiles).forEach((file) => formData.append("images", file));

    setSaving(true);
    try {
      const data = await api<{ galleryImageUrls: string }>("/admin/gallery/upload", {
        method: "POST",
        body: formData
      });
      setSettings((value) => ({ ...value, galleryImageUrls: data.galleryImageUrls }));
      setGalleryFiles(null);
      toast.success("Gallery images uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload images");
    } finally {
      setSaving(false);
    }
  }

  async function removeGalleryImage(imageUrl: string) {
    setSaving(true);
    try {
      const data = await api<{ galleryImageUrls: string }>("/admin/gallery/image", {
        method: "DELETE",
        body: JSON.stringify({ imageUrl })
      });
      setSettings((value) => ({ ...value, galleryImageUrls: data.galleryImageUrls }));
      toast.success("Photo removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove photo");
    } finally {
      setSaving(false);
    }
  }

  const galleryImages = settings.galleryImageUrls
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  function exportApplicants() {
    if (!applicants?.items.length) {
      toast.info("No applicants to export");
      return;
    }

    const rows = applicants.items.map((item) => ({
      Name: item.user.name,
      Email: item.user.email,
      Phone: item.phone,
      Cover: item.coverId,
      State: item.stateName,
      Persons: item.persons,
      Travellers: item.travellers.map((traveller) => `${traveller.fullName} (${traveller.phone})`).join("; "),
      Fee: item.entryFee,
      Status: item.status,
      Payment: item.paymentStatus,
      Applied: item.createdAt
    }));
    const csv = [Object.keys(rows[0]).join(","), ...rows.map((row) => Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lucky-draw-applicants.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Toaster richColors position="top-right" />
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-stone-200 bg-emerald-deep p-5 text-white lg:block">
          <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gold">Sacred Journey</p>
            <h1 className="mt-1 text-2xl font-semibold">Admin Panel</h1>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                  activeTab === tab.name ? "bg-gold text-emerald-deep shadow-gold" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-3 py-3 backdrop-blur md:px-8 md:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold sm:text-sm">Premium Operations</p>
                <h2 className="truncate text-xl font-semibold text-emerald-deep sm:text-2xl md:text-3xl">{activeTab}</h2>
              </div>
              <button className="btn-secondary h-10 shrink-0 px-3 sm:h-11 sm:px-4" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex min-h-12 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[11px] font-semibold leading-tight sm:text-sm ${
                    activeTab === tab.name ? "bg-emerald-deep text-white" : "bg-white text-stone-600 gold-ring"
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{tab.name}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="p-3 sm:p-4 md:p-8">
            {activeTab === "Dashboard" && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => (
                    <div key={card.label} className="rounded-lg border border-stone-200 bg-white p-4 shadow-card sm:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-stone-500">{card.label}</p>
                          <p className="mt-2 text-3xl font-bold text-emerald-deep">{loading ? "--" : card.value}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-soft text-emerald-deep">
                          <card.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-emerald-deep">Last Draw Result</h3>
                  {stats?.lastDraw ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <p className="rounded-lg bg-cream p-4 text-sm">Paid seats: <strong>{stats.lastDraw.totalUsers}</strong></p>
                      <p className="rounded-lg bg-cream p-4 text-sm">Selected seats: <strong>{stats.lastDraw.selectedCount}</strong></p>
                      <p className="rounded-lg bg-cream p-4 text-sm">Run at: <strong>{formatDate(stats.lastDraw.createdAt)}</strong></p>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-stone-500">No lucky draw has been run yet.</p>
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === "Users" && (
              <TableShell
                title="Registered Users"
                action={
                  <div className="grid w-full gap-2 sm:grid-cols-[minmax(220px,1fr)_160px_120px] lg:w-auto">
                    <SearchBox value={usersQuery.search} onChange={(search) => setUsersQuery((query) => ({ ...query, page: 1, search }))} />
                    <select className="input" value={usersQuery.sortBy} onChange={(event) => setUsersQuery((query) => ({ ...query, sortBy: event.target.value }))}>
                      <option value="createdAt">Created At</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="role">Role</option>
                    </select>
                    <select className="input" value={usersQuery.sortOrder} onChange={(event) => setUsersQuery((query) => ({ ...query, sortOrder: event.target.value as SortOrder }))}>
                      <option value="desc">Desc</option>
                      <option value="asc">Asc</option>
                    </select>
                  </div>
                }
              >
                <div className="grid gap-3 p-3 md:hidden">
                  {!users ? (
                    Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-stone-100" />)
                  ) : (
                    users.items.map((user) => (
                      <article key={user.id} className="rounded-lg border border-stone-200 bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="truncate font-semibold text-emerald-deep">{user.name}</h4>
                            <p className="mt-1 break-all text-sm text-stone-500">{user.email}</p>
                          </div>
                          <Badge value={user.role} />
                        </div>
                        <DetailRow label="Joined" value={formatDate(user.createdAt)} />
                      </article>
                    ))
                  )}
                </div>
                <table className="hidden w-full min-w-[760px] text-left text-sm md:table">
                  <thead className="bg-cream text-xs font-semibold text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!users ? <SkeletonRows cols={4} /> : users.items.map((user) => (
                      <tr key={user.id} className="border-t border-stone-100">
                        <td className="px-4 py-4 font-semibold text-stone-800">{user.name}</td>
                        <td className="px-4 py-4 text-stone-600">{user.email}</td>
                        <td className="px-4 py-4"><Badge value={user.role} /></td>
                        <td className="px-4 py-4 text-stone-500">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination page={usersQuery.page} pages={users?.meta.pages ?? 1} onPage={(page) => setUsersQuery((query) => ({ ...query, page }))} />
              </TableShell>
            )}

            {activeTab === "Lucky Draw Applicants" && (
              <TableShell
                title="Lucky Draw Applicants"
                action={
                  <div className="grid w-full gap-2 sm:grid-cols-[minmax(220px,1fr)_150px_150px_auto] lg:w-auto">
                    <SearchBox value={appQuery.search} onChange={(search) => setAppQuery((query) => ({ ...query, page: 1, search }))} />
                    <select className="input" value={appQuery.status} onChange={(event) => setAppQuery((query) => ({ ...query, page: 1, status: event.target.value as ApplicationStatus | "" }))}>
                      <option value="">All status</option>
                      <option value="pending">Pending</option>
                      <option value="selected">Selected</option>
                      <option value="not_selected">Not selected</option>
                    </select>
                    <select className="input" value={appQuery.paymentStatus} onChange={(event) => setAppQuery((query) => ({ ...query, page: 1, paymentStatus: event.target.value as PaymentStatus | "" }))}>
                      <option value="">All payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <button className="btn-secondary" onClick={exportApplicants}>
                      <Download className="h-4 w-4" />
                      CSV
                    </button>
                  </div>
                }
              >
                <div className="grid gap-3 p-3 md:hidden">
                  {!applicants ? (
                    Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg bg-stone-100" />)
                  ) : (
                    applicants.items.map((item) => (
                      <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-4">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-sm font-semibold text-gold">{item.coverId}</p>
                            <h4 className="mt-1 truncate font-semibold text-emerald-deep">{item.user.name}</h4>
                            <p className="mt-1 break-all text-xs text-stone-500">{item.user.email}</p>
                          </div>
                          <div className="grid gap-1 text-right">
                            <Badge value={item.status} />
                            <Badge value={item.paymentStatus} />
                          </div>
                        </div>
                        <DetailRow label="Phone" value={item.phone} />
                        <DetailRow label="State" value={item.stateName} />
                        <DetailRow label="Persons" value={item.persons} />
                        <DetailRow label="Fee" value={`Rs.${item.entryFee.toLocaleString("en-IN")}`} />
                        <DetailRow
                          label="Travellers"
                          value={
                            <span className="grid gap-1">
                              {item.travellers.map((traveller) => (
                                <span key={traveller.id}>{traveller.fullName}</span>
                              ))}
                            </span>
                          }
                        />
                        <DetailRow label="Applied" value={formatDate(item.createdAt)} />
                      </article>
                    ))
                  )}
                </div>
                <table className="hidden w-full min-w-[1180px] text-left text-sm md:table">
                  <thead className="bg-cream text-xs font-semibold text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Cover ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Persons</th>
                      <th className="px-4 py-3">Travellers</th>
                      <th className="px-4 py-3">Fee</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Payment Status</th>
                      <th className="px-4 py-3">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!applicants ? <SkeletonRows cols={11} /> : applicants.items.map((item) => (
                      <tr key={item.id} className="border-t border-stone-100">
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-deep">{item.coverId}</td>
                        <td className="px-4 py-4 font-semibold text-stone-800">{item.user.name}</td>
                        <td className="px-4 py-4 text-stone-600">{item.user.email}</td>
                        <td className="px-4 py-4 text-stone-600">{item.phone}</td>
                        <td className="px-4 py-4 text-stone-600">{item.stateName}</td>
                        <td className="px-4 py-4 text-stone-600">{item.persons}</td>
                        <td className="px-4 py-4 text-stone-600">
                          <div className="max-w-xs space-y-1">
                            {item.travellers.map((traveller) => (
                              <p key={traveller.id}>{traveller.fullName} <span className="text-stone-400">({traveller.phone})</span></p>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-stone-700">Rs.{item.entryFee.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-4"><Badge value={item.status} /></td>
                        <td className="px-4 py-4"><Badge value={item.paymentStatus} /></td>
                        <td className="px-4 py-4 text-stone-500">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination page={appQuery.page} pages={applicants?.meta.pages ?? 1} onPage={(page) => setAppQuery((query) => ({ ...query, page }))} />
              </TableShell>
            )}

            {activeTab === "Draw Control" && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3 sm:items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-soft text-emerald-deep">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-deep">Run Lucky Draw</h3>
                      <p className="text-sm text-stone-500">Paid traveller seats only are included in the draw pool.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <button className={`rounded-lg border p-4 text-left ${drawMode === "fixed" ? "border-gold bg-gold-soft" : "border-stone-200 bg-white"}`} onClick={() => setDrawMode("fixed")}>
                      <p className="font-semibold text-emerald-deep">Fixed number</p>
                      <input className="input mt-3 w-full" type="number" min={1} value={fixedCount} onChange={(event) => setFixedCount(Number(event.target.value))} />
                    </button>
                    <button className={`rounded-lg border p-4 text-left ${drawMode === "percentage" ? "border-gold bg-gold-soft" : "border-stone-200 bg-white"}`} onClick={() => setDrawMode("percentage")}>
                      <p className="font-semibold text-emerald-deep">Percentage</p>
                      <input className="input mt-3 w-full" type="number" min={0.01} step={0.01} value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} />
                    </button>
                  </div>
                  <button className="btn-primary mt-6" onClick={() => setConfirmDraw(true)}>
                    <Sparkles className="h-4 w-4" />
                    Run Lucky Draw
                  </button>
                </div>

                <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-emerald-deep">Recent Results</h3>
                  <div className="mt-4 space-y-3">
                    {drawHistory.length === 0 ? <p className="text-sm text-stone-500">No results yet.</p> : drawHistory.map((result) => (
                      <div key={result.id} className="rounded-lg bg-cream p-4 text-sm">
                        <p className="font-semibold text-emerald-deep">{result.selectedCount} selected seats from {result.totalUsers}</p>
                        <p className="mt-1 text-stone-500">{formatDate(result.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "Feedback" && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[380px_1fr]">
                <form onSubmit={addFeedback} className="rounded-lg border border-stone-200 bg-white p-4 shadow-card sm:p-6">
                  <h3 className="text-xl font-semibold text-emerald-deep">Add feedback</h3>
                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Name
                      <input className="input" value={newFeedback.name} onChange={(event) => setNewFeedback((value) => ({ ...value, name: event.target.value }))} required />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Stars
                      <select className="input" value={newFeedback.rating} onChange={(event) => setNewFeedback((value) => ({ ...value, rating: Number(event.target.value) }))}>
                        {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Location
                      <input className="input" value={newFeedback.location} onChange={(event) => setNewFeedback((value) => ({ ...value, location: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Feedback
                      <textarea className="input min-h-28" value={newFeedback.message} onChange={(event) => setNewFeedback((value) => ({ ...value, message: event.target.value }))} required />
                    </label>
                  </div>
                  <button className="btn-primary mt-5" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                    Add feedback
                  </button>
                </form>

                <TableShell title="Feedback received" action={<span className="text-sm text-stone-500">{feedback.length} total</span>}>
                  <div className="grid gap-3 p-3 md:hidden">
                    {feedback.length === 0 ? (
                      <p className="rounded-lg bg-stone-50 p-4 text-sm text-stone-500">No feedback yet.</p>
                    ) : (
                      feedback.map((item) => (
                        <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-emerald-deep">{item.name}</h4>
                              <p className="text-sm text-gold">{item.rating}/5 stars</p>
                            </div>
                            <Badge value={item.source} />
                          </div>
                          <p className="text-sm leading-6 text-stone-600">{item.message}</p>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-xs text-stone-400">{formatDate(item.createdAt)}</p>
                            <button type="button" className="btn-secondary h-9 px-3 text-red-600" onClick={() => deleteFeedback(item.id)} disabled={saving}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                  <table className="hidden w-full min-w-[840px] text-left text-sm md:table">
                    <thead className="bg-cream text-xs font-semibold text-stone-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Stars</th>
                        <th className="px-4 py-3">Feedback</th>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.map((item) => (
                        <tr key={item.id} className="border-t border-stone-100">
                          <td className="px-4 py-4 font-semibold text-stone-800">{item.name}</td>
                          <td className="px-4 py-4 text-gold">{item.rating}/5</td>
                          <td className="px-4 py-4 text-stone-600">{item.message}</td>
                          <td className="px-4 py-4"><Badge value={item.source} /></td>
                          <td className="px-4 py-4 text-stone-500">{formatDate(item.createdAt)}</td>
                          <td className="px-4 py-4 text-right">
                            <button type="button" className="btn-secondary h-9 px-3 text-red-600" onClick={() => deleteFeedback(item.id)} disabled={saving}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </motion.section>
            )}

            {activeTab === "Settings" && (
              <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={saveSettings} className="max-w-5xl rounded-lg border border-stone-200 bg-white p-4 shadow-card sm:p-6">
                <h3 className="text-xl font-semibold text-emerald-deep">Payment, Content, and Profile Settings</h3>
                <div className="mt-6 grid gap-5">
                  <label className="grid gap-2 text-sm font-medium text-stone-700">
                    IMB payment link
                    <input className="input" value={settings.imbPaymentLink} onChange={(event) => setSettings((value) => ({ ...value, imbPaymentLink: event.target.value }))} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-stone-700">
                    YouTube live/result link
                    <input
                      className="input"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={settings.resultsYoutubeUrl}
                      onChange={(event) => setSettings((value) => ({ ...value, resultsYoutubeUrl: event.target.value }))}
                    />
                  </label>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Full Umrah package price
                      <input className="input" type="number" min={0} value={settings.umrahPackagePrice} onChange={(event) => setSettings((value) => ({ ...value, umrahPackagePrice: Number(event.target.value) }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Terms PDF URL
                      <input className="input" value={settings.termsDocumentUrl} onChange={(event) => setSettings((value) => ({ ...value, termsDocumentUrl: event.target.value }))} />
                    </label>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Facebook URL
                      <input className="input" value={settings.socialFacebookUrl} onChange={(event) => setSettings((value) => ({ ...value, socialFacebookUrl: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Instagram URL
                      <input className="input" value={settings.socialInstagramUrl} onChange={(event) => setSettings((value) => ({ ...value, socialInstagramUrl: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      YouTube URL
                      <input className="input" value={settings.socialYoutubeUrl} onChange={(event) => setSettings((value) => ({ ...value, socialYoutubeUrl: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      WhatsApp link
                      <input className="input" value={settings.socialWhatsappUrl} onChange={(event) => setSettings((value) => ({ ...value, socialWhatsappUrl: event.target.value }))} />
                    </label>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Contact phone
                      <input className="input" value={settings.contactPhone} onChange={(event) => setSettings((value) => ({ ...value, contactPhone: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Contact email
                      <input className="input" type="email" value={settings.contactEmail} onChange={(event) => setSettings((value) => ({ ...value, contactEmail: event.target.value }))} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-stone-700 md:col-span-2">
                      Address
                      <textarea className="input min-h-24" value={settings.contactAddress} onChange={(event) => setSettings((value) => ({ ...value, contactAddress: event.target.value }))} />
                    </label>
                  </div>
                  <div className="grid gap-3 rounded-lg border border-stone-200 bg-cream p-4">
                    <label className="grid gap-2 text-sm font-medium text-stone-700">
                      Gallery images
                      <input
                        className="input bg-white"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        onChange={(event) => setGalleryFiles(event.target.files)}
                      />
                    </label>
                    <button type="button" className="btn-secondary w-fit" onClick={uploadGalleryImages} disabled={saving || !galleryFiles?.length}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Upload images
                    </button>
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {galleryImages.map((imageUrl) => (
                          <div key={imageUrl} className="group relative overflow-hidden rounded-lg border border-stone-200 bg-white">
                            <img src={imageUrl} alt="" className="h-24 w-full object-cover" />
                            <button
                              type="button"
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-card transition hover:bg-red-50"
                              onClick={() => removeGalleryImage(imageUrl)}
                              disabled={saving}
                              aria-label="Remove photo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 rounded-lg border border-stone-200 bg-cream p-4">
                    <h4 className="font-semibold text-emerald-deep">PDF documents</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input className="input bg-white" placeholder="PDF title" value={documentForm.title} onChange={(event) => setDocumentForm((value) => ({ ...value, title: event.target.value }))} />
                      <select className="input bg-white" value={documentForm.kind} onChange={(event) => setDocumentForm((value) => ({ ...value, kind: event.target.value }))}>
                        <option value="dua">Dua PDF</option>
                        <option value="terms">Terms PDF</option>
                      </select>
                      <input className="input bg-white md:col-span-2" placeholder="Short description" value={documentForm.description} onChange={(event) => setDocumentForm((value) => ({ ...value, description: event.target.value }))} />
                      <input className="input bg-white md:col-span-2" type="file" accept="application/pdf" onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)} />
                    </div>
                    <button type="button" className="btn-secondary w-fit" onClick={uploadDocument} disabled={saving || !documentFile || !documentForm.title}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      Upload PDF
                    </button>
                    {documents.length > 0 && (
                      <div className="grid gap-2">
                        {documents.map((document) => (
                          <div key={document.id} className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-semibold text-stone-800">{document.title} <span className="text-xs text-stone-400">({document.kind})</span></p>
                              <a className="text-emerald-deep underline" href={document.url} target="_blank" rel="noreferrer">{document.filename}</a>
                            </div>
                            <button type="button" className="btn-secondary w-fit text-red-600" onClick={() => deleteDocument(document.id)} disabled={saving}>
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-stone-700">
                    Admin name
                    <input className="input" value={settings.adminName} onChange={(event) => setSettings((value) => ({ ...value, adminName: event.target.value }))} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-stone-700">
                    Admin email
                    <input className="input" type="email" value={settings.adminEmail} onChange={(event) => setSettings((value) => ({ ...value, adminEmail: event.target.value }))} />
                  </label>
                </div>
                <button className="btn-primary mt-6" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                  Save settings
                </button>
              </motion.form>
            )}
          </div>
        </section>
      </div>

      {confirmDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-deep/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-elevated">
            <h3 className="text-2xl font-semibold text-emerald-deep">Confirm lucky draw</h3>
            <p className="mt-3 text-sm text-stone-600">
              This will reset all paid applicants to not selected, then select winners using Fisher-Yates shuffle.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setConfirmDraw(false)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={runDraw} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 focus-within:border-emerald-deep focus-within:ring-4 focus-within:ring-emerald-deep/10 sm:min-w-64">
      <Search className="h-4 w-4 text-stone-400" />
      <input className="w-full border-0 bg-transparent text-sm outline-none" placeholder="Search" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TableShell({ title, action, children }: { title: string; action: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-card">
      <div className="flex flex-col gap-4 border-b border-stone-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-lg font-semibold text-emerald-deep sm:text-xl">{title}</h3>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </motion.section>
  );
}
