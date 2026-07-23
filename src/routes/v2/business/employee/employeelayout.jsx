import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import { Toast } from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import {
  employeeUser,
  employeePortalLabel,
  employeePageMeta,
  employeeNotifications,
  NOTIF_KIND_COLOR,
} from "../../../../fakedata/v2/employee";
import { EmployeeModals } from "./employeemodals";

/**
 * Employee (member) dashboard shell.
 * Spec: "TalkAM B2B Employee Dashboard.dc.html" — 224px sidebar carrying the
 * privacy assurance strip, no topbar search, teal "Book a Session" CTA.
 */

const EmployeeContext = createContext(null);

export const useEmployee = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used inside EmployeeProvider");
  return ctx;
};

const at = (path) => `${V2.employee}${path}`;

/** Deck: sidebar `<nav>` — order, labels, count pills and their tones. */
const NAV_SECTIONS = [
  {
    items: [
      { to: V2.employee, end: true, label: "Home", icon: <Icon.Home size={16} /> },
      { to: at("/sessions"), label: "My Sessions", icon: <Icon.Calendar size={16} />, count: "1", countTone: "teal" },
      { to: at("/checkins"), label: "Check-ins & Mood", icon: <Icon.Activity size={16} /> },
      { to: at("/community"), label: "Community", icon: <Icon.MessageSquare size={16} /> },
      { to: at("/messages"), label: "Messages", icon: <Icon.MessageCircle size={16} />, count: "2", countTone: "blue" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { to: at("/profile"), label: "Profile & Privacy", icon: <Icon.User size={16} /> },
      { to: at("/help"), label: "Help & Support", icon: <Icon.HelpCircle size={16} /> },
    ],
  },
];

/** Deck: the teal strip directly under the logo block. */
const PrivacySidebarStrip = () => (
  <div className="flex items-center gap-2 rounded-[10px] border border-[rgba(59,168,143,0.25)] bg-[rgba(59,168,143,0.12)] px-2.5 py-2">
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3BA88F"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
    <span className="text-[10.5px] leading-[1.4] text-[#6FCDB6]">
      Private by default — Zenith Bank never sees this
    </span>
  </div>
);

export const EmployeeProvider = () => {
  const [modal, setModal] = useState(null);
  const [context, setContext] = useState(null);
  const [toast, setToast] = useState(null);
  const [homeMood, setHomeMood] = useState(null);
  const [sessionType, setSessionType] = useState("video");
  const timer = useRef(null);

  const open = useCallback((name, ctx = null) => {
    setModal(name);
    setContext(ctx);
  }, []);
  const close = useCallback(() => setModal(null), []);

  const showToast = useCallback((message) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo(
    () => ({ open, close, showToast, homeMood, setHomeMood, sessionType, setSessionType }),
    [open, close, showToast, homeMood, sessionType]
  );

  return (
    <EmployeeContext.Provider value={value}>
      <Outlet />
      {/* Deck: `position:fixed;bottom:24px;right:24px` toast. */}
      {toast ? (
        <div className="fixed bottom-6 right-6 z-[700]">
          <Toast message={toast} />
        </div>
      ) : null}
      <EmployeeModals
        modal={modal}
        context={context}
        close={close}
        open={open}
        showToast={showToast}
        sessionType={sessionType}
        setSessionType={setSessionType}
      />
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
      width={224}
      portalLabel={employeePortalLabel}
      topBlock={<PrivacySidebarStrip />}
      user={employeeUser}
      onSignOut={() => open("signout")}
      notifications={employeeNotifications}
      notifKindColor={NOTIF_KIND_COLOR}
      title={meta.title}
      subtitle={meta.subtitle}
      topbarAction={
        /* Deck: teal `#3BA88F` pill with a 0 4px 12px rgba(59,168,143,0.25) shadow. */
        <button
          type="button"
          onClick={() => open("booking")}
          className="inline-flex shrink-0 cursor-pointer items-center gap-[7px] rounded-[10px] bg-[#3BA88F] px-4 py-[9px] text-[13px] font-boldNunito text-white shadow-[0_4px_12px_rgba(59,168,143,0.25)]"
        >
          <Icon.Plus size={13} strokeWidth={2.5} />
          <span className="hidden sm:inline">Book a Session</span>
        </button>
      }
    />
  );
};
