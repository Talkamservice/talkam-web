import { useLocation } from "react-router-dom";
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
    label: "Menu",
    items: [
      { to: V2.admin, end: true, label: "Overview", icon: <Icon.Grid size={16} /> },
      { to: at("/employees"), label: "Employees", icon: <Icon.Users size={16} />, count: "247" },
      { to: at("/therapists"), label: "Therapist Network", icon: <Icon.Heart size={16} /> },
      { to: at("/my-therapists"), label: "My Therapists", icon: <Icon.UserCheck size={16} />, count: "5", countTone: "teal" },
      { to: at("/reports"), label: "Reports", icon: <Icon.BarChart2 size={16} /> },
      { to: at("/billing"), label: "Billing", icon: <Icon.CreditCard size={16} /> },
      { to: at("/trust"), label: "Trust & Safety", icon: <Icon.Shield size={16} />, count: "2", countTone: "red" },
    ],
  },
  {
    label: "Manage",
    items: [
      { to: at("/settings"), label: "Settings", icon: <Icon.Settings size={16} /> },
      { to: at("/activity"), label: "Activity Log", icon: <Icon.Clock size={16} /> },
      { to: at("/help"), label: "Help & Support", icon: <Icon.HelpCircle size={16} /> },
    ],
  },
];

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
      user={adminUser}
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
