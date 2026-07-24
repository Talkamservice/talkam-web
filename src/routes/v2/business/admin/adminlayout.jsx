import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import { PrimaryButton } from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import { adminPortalLabel, adminPageMeta, initialsOf } from "../../../../constants/admindashboard";
import { logOut } from "../../../../services/authSlice";
import { useGetMeV2Query } from "../../../../services/v2/authApiSliceV2";
import { useGetOrganizationQuery } from "../../../../services/v2/businessApiSlice";
import {
  useGetAdminEmployeesQuery,
  useGetAdminTherapistsQuery,
  useGetSafetyReportsQuery,
} from "../../../../services/v2/adminApiSlice";
import { useAdminModal } from "./adminmodals";

/**
 * Admin (HR) dashboard shell.
 * Spec: "TalkAM B2B Dashboard.dc.html" — sidebar groups MENU / MANAGE.
 */
const at = (path) => `${V2.admin}${path}`;

/** Deck: sidebar groups MENU / MANAGE. Counts are live; a zero hides its pill. */
const navSections = ({ seats, bench, openReports }) => [
  {
    label: "MENU",
    items: [
      { to: V2.admin, end: true, label: "Overview", icon: <Icon.Grid size={16} /> },
      { to: at("/employees"), label: "Employees", icon: <Icon.Users size={16} />, count: seats ? String(seats) : undefined },
      { to: at("/therapists"), label: "Therapist Network", icon: <Icon.Heart size={16} /> },
      { to: at("/my-therapists"), label: "My Therapists", icon: <Icon.UserCheck size={16} />, count: bench ? String(bench) : undefined, countTone: "tealBright" },
      { to: at("/reports"), label: "Reports", icon: <Icon.BarChart2 size={16} /> },
      { to: at("/billing"), label: "Billing", icon: <Icon.CreditCard size={16} /> },
      { to: at("/trust"), label: "Trust & Safety", icon: <Icon.Shield size={16} />, count: openReports ? String(openReports) : undefined, countTone: "red" },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { to: at("/settings"), label: "Settings", icon: <Icon.Settings size={16} /> },
      { to: at("/help"), label: "Help & Support", icon: <Icon.HelpCircle size={16} /> },
    ],
  },
];


/** Deck: the company-switcher dropdown under the logo. */
const MenuRow = ({ to, icon, children, className, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={classNames(
      "flex items-center gap-2.5 px-3.5 py-[11px] text-[12.5px] font-boldNunito text-navy-800 hover:bg-[#F8F9FC]",
      className
    )}
  >
    {icon}
    {children}
  </Link>
);

const WorkspaceMenu = ({ company }) => (
  <>
    <div className="border-b border-ink-100 px-3.5 py-2.5 text-[10px] font-extraboldNunito tracking-[0.06em] text-[#9299A8]">
      WORKSPACE
    </div>
    <div className="flex items-center gap-[9px] border-b border-ink-100 bg-[#F8F9FC] px-3.5 py-[11px]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-brand-400 text-[10px] font-extraboldNunito text-white">
        {(company ?? "").charAt(0).toUpperCase()}
      </span>
      <div className="flex-1">
        <div className="text-caption font-boldNunito text-navy-800">{company}</div>
        <div className="text-[10px] text-ink-400">Current workspace</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
    <MenuRow
      to={at("/settings")}
      className="border-b border-ink-100"
      icon={<Icon.Settings size={15} color="#017FC8" />}
    >
      Company settings
    </MenuRow>
    <MenuRow to={at("/activity")} icon={<Icon.Clock size={15} color="#6B44A8" />}>
      Activity log
    </MenuRow>
  </>
);

/** Deck: the profile dropdown above the sidebar footer. */
const ProfileMenu = ({ onSignOut }) => (
  <>
    <MenuRow
      to={at("/settings")}
      className="border-b border-ink-100"
      icon={<Icon.User size={15} color="#017FC8" />}
    >
      My profile
    </MenuRow>
    <MenuRow
      to={at("/activity")}
      className="border-b border-ink-100"
      icon={<Icon.Clock size={15} color="#6B44A8" />}
    >
      Activity log
    </MenuRow>
    <MenuRow
      to={V2.businessLogin}
      onClick={onSignOut}
      className="!text-surface-errorInk hover:!bg-[#FFF5F5]"
      icon={<Icon.LogOut size={15} color="#AC4242" />}
    >
      Sign out
    </MenuRow>
  </>
);

export const AdminLayout = () => {
  const { pathname } = useLocation();
  const { open } = useAdminModal();
  const dispatch = useDispatch();

  const { data: me } = useGetMeV2Query();
  const { data: org } = useGetOrganizationQuery();
  const { data: roster } = useGetAdminEmployeesQuery();
  const { data: therapistData } = useGetAdminTherapistsQuery();
  const { data: safety } = useGetSafetyReportsQuery();

  const organization = org?.organization;
  const company = organization?.name ?? "";
  const seats = roster?.employees?.length ?? 0;
  const bench = (therapistData?.therapists ?? []).filter((t) => t.in_network).length;
  const openReports = (safety ?? []).filter((r) => r.status !== "Resolved").length;

  const workspace = {
    name: company,
    meta: organization
      ? `${organization.seats_used ?? 0} of ${organization.seats_licensed} seats`
      : "",
    initial: company.charAt(0).toUpperCase(),
    accent: "#017FC8",
    portalLabel: adminPortalLabel,
  };

  const fullName = me?.name ?? "";
  const user = {
    name: fullName || me?.username || "",
    role: "HR Manager",
    initials: initialsOf(fullName || me?.username || ""),
    email: me?.email,
    avatarBg: "#E8F7F4",
    avatarColor: "#1F6B59",
  };

  const segment = pathname.replace(V2.admin, "").replace(/^\//, "") || "overview";
  const meta = adminPageMeta[segment] ?? adminPageMeta.overview;

  /* The deck's Overview / Employees / Therapist subtitles quote live numbers. */
  const subtitle =
    segment === "overview"
      ? [company, new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })]
          .filter(Boolean)
          .join(" · ")
      : segment === "employees"
        ? `${seats} seat${seats === 1 ? "" : "s"} · ${organization?.seats_licensed ?? 0} licensed`
        : segment === "therapists"
          ? `${(therapistData?.therapists ?? []).filter((t) => t.is_verified).length} verified therapists serving your team`
          : meta.subtitle;

  usePageMeta(`${meta.title} — TalkAM for Business`);

  return (
    <DashboardShell
      sections={navSections({ seats, bench, openReports })}
      workspace={workspace}
      workspaceMenu={<WorkspaceMenu company={company} />}
      user={user}
      userMenu={<ProfileMenu onSignOut={() => dispatch(logOut())} />}
      showSearch
      bellDot={openReports > 0}
      title={meta.title}
      subtitle={subtitle}
      topbarAction={
        <PrimaryButton onClick={() => open("invite")} className="shrink-0">
          <Icon.Plus size={12} strokeWidth={2.5} />
          <span className="hidden sm:inline">Invite People</span>
        </PrimaryButton>
      }
    />
  );
};
