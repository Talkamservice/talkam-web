import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import { PrimaryButton } from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import { adminWorkspace, adminUser, adminPageMeta } from "../../../../fakedata/v2/admin";
import { useAdminModal } from "./adminmodals";

/**
 * Admin (HR) dashboard shell.
 * Spec: "TalkAM B2B Dashboard.dc.html" — sidebar groups MENU / MANAGE.
 */
const at = (path) => `${V2.admin}${path}`;

const NAV_SECTIONS = [
  {
    label: "MENU",
    items: [
      { to: V2.admin, end: true, label: "Overview", icon: <Icon.Grid size={16} /> },
      { to: at("/employees"), label: "Employees", icon: <Icon.Users size={16} />, count: "247" },
      { to: at("/therapists"), label: "Therapist Network", icon: <Icon.Heart size={16} /> },
      { to: at("/my-therapists"), label: "My Therapists", icon: <Icon.UserCheck size={16} />, count: "5", countTone: "tealBright" },
      { to: at("/reports"), label: "Reports", icon: <Icon.BarChart2 size={16} /> },
      { to: at("/billing"), label: "Billing", icon: <Icon.CreditCard size={16} /> },
      { to: at("/trust"), label: "Trust & Safety", icon: <Icon.Shield size={16} />, count: "2", countTone: "red" },
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
const MenuRow = ({ to, icon, children, className }) => (
  <Link
    to={to}
    className={classNames(
      "flex items-center gap-2.5 px-3.5 py-[11px] text-[12.5px] font-boldNunito text-navy-800 hover:bg-[#F8F9FC]",
      className
    )}
  >
    {icon}
    {children}
  </Link>
);

const WorkspaceMenu = () => (
  <>
    <div className="border-b border-ink-100 px-3.5 py-2.5 text-[10px] font-extraboldNunito tracking-[0.06em] text-[#9299A8]">
      WORKSPACE
    </div>
    <div className="flex items-center gap-[9px] border-b border-ink-100 bg-[#F8F9FC] px-3.5 py-[11px]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-brand-400 text-[10px] font-extraboldNunito text-white">
        Z
      </span>
      <div className="flex-1">
        <div className="text-caption font-boldNunito text-navy-800">Zenith Bank Nigeria</div>
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
const ProfileMenu = () => (
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

  const segment = pathname.replace(V2.admin, "").replace(/^\//, "") || "overview";
  const meta = adminPageMeta[segment] ?? adminPageMeta.overview;

  usePageMeta(`${meta.title} — TalkAM for Business`);

  return (
    <DashboardShell
      sections={NAV_SECTIONS}
      workspace={adminWorkspace}
      workspaceMenu={<WorkspaceMenu />}
      user={adminUser}
      userMenu={<ProfileMenu />}
      showSearch
      bellDot
      title={meta.title}
      subtitle={meta.subtitle}
      topbarAction={
        <PrimaryButton onClick={() => open("invite")} className="shrink-0">
          <Icon.Plus size={12} strokeWidth={2.5} />
          <span className="hidden sm:inline">Invite People</span>
        </PrimaryButton>
      }
    />
  );
};
