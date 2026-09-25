import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import { useDispatch } from "react-redux";
import { DashboardShell } from "../../../components/v2/dashboard/dashboardshell";
import { Toast } from "../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2 } from "../../../constants/v2routes";
import { logOut } from "../../../services/authSlice";
import { useGetPlatformSessionQuery, useGetPlatformNavCountsQuery } from "../../../services/v2/platformAdminApiSlice";

/**
 * Platform Admin panel shell — mirrors therapistlayout.jsx's Provider+Layout
 * split, minus the modal system (no page here needs a modal yet; actions
 * are inline row buttons + a toast, same as the rest of this deck's forms).
 */

const PlatformContext = createContext(null);

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used inside PlatformProvider");
  return ctx;
};

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "P";

const at = (path) => `${V2.platform}${path}`;

/** Every item's own role gate mirrors the backend "platform.role:" groups
 *  in routes/api_v2.php exactly — a role never sees a nav item it would get
 *  a 403 from. `count` keys (when present) are read off /platform-admin/
 *  nav-counts at render time — see navSections() below. Grouping/labels/
 *  order match the design mockup's sidebar 1:1. */
const NAV_SECTIONS = [
  {
    label: "OVERVIEW",
    items: [
      { to: V2.platform, end: true, label: "Dashboard", icon: <Icon.Grid size={16} />, roles: ["Super Admin", "Admin"] },
    ],
  },
  {
    label: "USER MANAGEMENT",
    items: [
      { to: at("/users"), label: "All Users", icon: <Icon.Users size={16} />, roles: ["Super Admin", "Admin"] },
      { to: at("/businesses"), label: "Businesses & Orgs", icon: <Icon.Briefcase size={16} />, roles: ["Super Admin", "Admin"] },
      { to: at("/therapist-verification"), label: "Therapist Verification", icon: <Icon.CheckCircle size={16} />, roles: ["Super Admin", "Admin"], countKey: "pending_therapist_applications", countTone: "red" },
      { to: at("/performance"), label: "Performance Watch", icon: <Icon.Activity size={16} />, roles: ["Super Admin", "Admin"], countKey: "flagged_therapists", countTone: "gold" },
      { to: at("/deactivations"), label: "Deactivation Reqs", icon: <Icon.UserX size={16} />, roles: ["Super Admin", "Admin", "Support Staff"], countKey: "pending_deactivations" },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { to: at("/payouts"), label: "Payout Management", icon: <Icon.DollarSign size={16} />, roles: ["Super Admin"] },
      { to: at("/billing"), label: "Billing & Invoices", icon: <Icon.FileText size={16} />, roles: ["Super Admin"] },
      { to: at("/disputes"), label: "Payment Disputes", icon: <Icon.Clock size={16} />, roles: ["Super Admin", "Admin", "Support Staff"], countKey: "open_disputes", countTone: "gold" },
    ],
  },
  {
    label: "SESSIONS",
    items: [
      { to: at("/sessions"), label: "All Sessions", icon: <Icon.Calendar size={16} />, roles: ["Super Admin", "Admin"] },
    ],
  },
  {
    label: "CONTENT & CMS",
    items: [
      { to: at("/cms"), label: "Journal Articles", icon: <Icon.Edit2 size={16} />, roles: ["Super Admin", "Admin", "Content Manager"] },
      { to: at("/community"), label: "Community & Groups", icon: <Icon.MessageSquare size={16} />, roles: ["Super Admin", "Admin"] },
      { to: at("/waitlist"), label: "Waitlist", icon: <Icon.List size={16} />, roles: ["Super Admin", "Admin"] },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { to: at("/feedback"), label: "Feedbacks", icon: <Icon.MessageCircle size={16} />, roles: ["Super Admin", "Admin", "Support Staff"] },
      { to: at("/legal"), label: "Legal & Compliance", icon: <Icon.Shield size={16} />, roles: ["Super Admin", "Admin"] },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { to: at("/growth"), label: "Growth Analytics", icon: <Icon.TrendingUp size={16} />, roles: ["Super Admin", "Admin"] },
      { to: at("/activity-logs"), label: "Activity Logs", icon: <Icon.Activity size={16} />, roles: ["Super Admin", "Admin"] },
      { to: at("/roles"), label: "Roles & Auth", icon: <Icon.Lock size={16} />, roles: ["Super Admin"] },
      { to: at("/settings"), label: "System Settings", icon: <Icon.Settings size={16} />, roles: ["Super Admin"] },
    ],
  },
];

export const PAGE_META = {
  "": { title: "Dashboard", subtitle: "Platform overview" },
  users: { title: "All Users", subtitle: "Every user account on TalkAM" },
  businesses: { title: "Businesses & Orgs", subtitle: "Every organization on TalkAM" },
  "therapist-verification": { title: "Therapist Verification", subtitle: "Applications awaiting review" },
  performance: { title: "Performance Watch", subtitle: "Flagged therapists — rating & no-show rate" },
  deactivations: { title: "Deactivation Reqs", subtitle: "Account deactivation requests" },
  payouts: { title: "Payout Management", subtitle: "Therapist payouts" },
  billing: { title: "Billing & Invoices", subtitle: "Revenue & invoices" },
  disputes: { title: "Payment Disputes", subtitle: "Open disputes queue" },
  sessions: { title: "All Sessions", subtitle: "Platform-wide session activity" },
  cms: { title: "Journal Articles", subtitle: "CMS" },
  community: { title: "Community & Groups", subtitle: "Reported posts, comments & groups" },
  waitlist: { title: "Waitlist", subtitle: "Signups & waitlist mode" },
  feedback: { title: "Feedbacks", subtitle: "User-submitted feedback" },
  legal: { title: "Legal & Compliance", subtitle: "Privacy Policy & Terms" },
  growth: { title: "Growth Analytics", subtitle: "Signups & funnel" },
  "activity-logs": { title: "Activity Logs", subtitle: "Platform-wide audit trail" },
  roles: { title: "Roles & Auth", subtitle: "Platform Admin access" },
  settings: { title: "System Settings", subtitle: "Platform-wide settings" },
};

export const PlatformProvider = () => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const dispatch = useDispatch();

  const showToast = useCallback((message) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const { data: session, isLoading, isError } = useGetPlatformSessionQuery();

  const value = useMemo(
    () => ({ showToast, session, role: session?.platform_role?.role, signOut: () => dispatch(logOut()) }),
    [showToast, session, dispatch]
  );

  // The "platform.role" middleware already rejects non-staff at the API —
  // this is just the client-side mirror so a signed-in-but-unauthorized
  // account doesn't sit on a half-loaded page waiting for every query to 403.
  if (isError) {
    return <Navigate to={V2.platformLogin} replace />;
  }

  if (isLoading) {
    return <div className="flex min-h-dvh items-center justify-center bg-surface-page text-caption text-ink-400">Loading…</div>;
  }

  return (
    <PlatformContext.Provider value={value}>
      <Outlet />
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2">
          <Toast message={toast} />
        </div>
      ) : null}
    </PlatformContext.Provider>
  );
};

export const PlatformLayout = () => {
  const { pathname } = useLocation();
  const { session, role, signOut } = usePlatform();
  const { data: counts } = useGetPlatformNavCountsQuery();

  const segment = pathname.replace(V2.platform, "").replace(/^\//, "").split("/")[0] ?? "";
  const meta = PAGE_META[segment] ?? PAGE_META[""];
  usePageMeta(`${meta.title} — TalkAM Platform Admin`);

  const sections = NAV_SECTIONS.map((section) => ({
    label: section.label,
    items: section.items
      .filter((item) => !role || item.roles.includes(role))
      .map((item) => ({
        ...item,
        count: item.countKey && counts?.[item.countKey] ? String(counts[item.countKey]) : undefined,
      })),
  })).filter((section) => section.items.length > 0);

  const user = {
    name: session?.user?.name || session?.user?.email || "",
    role: role ?? "Platform Admin",
    initials: initialsOf(session?.user?.name || session?.user?.email || "P"),
    avatarBg: "#141B34",
    avatarColor: "#DBB66E",
  };

  return (
    <DashboardShell
      sections={sections}
      width={224}
      portalLabel="PLATFORM ADMIN"
      user={user}
      onSignOut={signOut}
      signOutTo={V2.platformLogin}
      title={meta.title}
      subtitle={meta.subtitle}
    />
  );
};
