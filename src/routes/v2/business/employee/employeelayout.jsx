import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import { PrimaryButton, Toast } from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import {
  employeeWorkspace,
  employeeUser,
  employeePageMeta,
} from "../../../../fakedata/v2/employee";
import { EmployeeModals } from "./employeemodals";

/**
 * Employee (member) dashboard shell.
 * Spec: "TalkAM B2B Employee Dashboard.dc.html".
 *
 * The sidebar carries a persistent privacy assurance strip — the PRD calls for
 * it on every employee surface.
 */

const EmployeeContext = createContext(null);

export const useEmployee = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used inside EmployeeProvider");
  return ctx;
};

const at = (path) => `${V2.employee}${path}`;

const NAV_SECTIONS = [
  {
    items: [
      { to: V2.employee, end: true, label: "Home", icon: <Icon.Home size={16} /> },
      { to: at("/sessions"), label: "My Sessions", icon: <Icon.Calendar size={16} />, count: "1", countTone: "teal" },
      { to: at("/checkins"), label: "Check-ins & Mood", icon: <Icon.Activity size={16} /> },
      { to: at("/community"), label: "Community", icon: <Icon.MessageSquare size={16} /> },
      { to: at("/messages"), label: "Messages", icon: <Icon.MessageCircle size={16} />, count: "2" },
    ],
  },
  {
    label: "Account",
    items: [
      { to: at("/profile"), label: "Profile & Privacy", icon: <Icon.User size={16} /> },
      { to: at("/help"), label: "Help & Support", icon: <Icon.HelpCircle size={16} /> },
    ],
  },
];

export const EmployeeProvider = () => {
  const [modal, setModal] = useState(null);
  const [context, setContext] = useState(null);
  const [toast, setToast] = useState(null);
  const [homeMood, setHomeMood] = useState(null);
  const timer = useRef(null);

  const open = useCallback((name, ctx = null) => {
    setModal(name);
    setContext(ctx);
  }, []);
  const close = useCallback(() => setModal(null), []);

  const showToast = useCallback((message) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const value = useMemo(
    () => ({ open, close, showToast, homeMood, setHomeMood }),
    [open, close, showToast, homeMood]
  );

  return (
    <EmployeeContext.Provider value={value}>
      <Outlet />
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2">
          <Toast message={toast} />
        </div>
      ) : null}
      <EmployeeModals modal={modal} context={context} close={close} showToast={showToast} />
    </EmployeeContext.Provider>
  );
};

export const EmployeeLayout = () => {
  const { pathname } = useLocation();
  const { open } = useEmployee();

  const segment = pathname.replace(V2.employee, "").replace(/^\//, "") || "home";
  const meta = employeePageMeta[segment] ?? employeePageMeta.home;

  usePageMeta(`${meta.title} — TalkAM`);

  return (
    <DashboardShell
      sections={NAV_SECTIONS}
      workspace={employeeWorkspace}
      user={employeeUser}
      title={meta.title}
      subtitle={meta.subtitle}
      topbarAction={
        <PrimaryButton onClick={() => open("booking")} className="shrink-0">
          <Icon.Plus size={12} strokeWidth={2.5} />
          <span className="hidden sm:inline">Book a session</span>
        </PrimaryButton>
      }
    />
  );
};
