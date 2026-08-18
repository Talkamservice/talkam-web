import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import { Toast } from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import {
  employeePortalLabel,
  employeePageMeta,
  NOTIF_KIND_COLOR,
  initialsOf,
} from "../../../../constants/employeedashboard";
import { useGetMeV2Query } from "../../../../services/v2/authApiSliceV2";
import {
  useGetBookingsQuery,
  useGetConversationsQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsMutation,
} from "../../../../services/v2/employeeApiSlice";
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

/** Deck: the teal strip directly under the logo block. */
const PrivacySidebarStrip = ({ company }) => (
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
      Private by default — {company} never sees this
    </span>
  </div>
);

/**
 * Maps a notification's type onto the deck's four dot colours. The API's
 * notification `type` vocabulary is broader than the deck's four, so anything
 * unrecognised falls back to the reminder blue rather than rendering colourless.
 */
const notificationKind = (notification) => {
  const type = String(notification?.type ?? "").toLowerCase();

  if (type.includes("message")) return "message";
  if (type.includes("checkin") || type.includes("mood") || type.includes("wellness")) return "checkin";
  if (type.includes("review") || type.includes("feedback") || type.includes("rate")) return "feedback";
  return "reminder";
};

export const EmployeeProvider = () => {
  const [modal, setModal] = useState(null);
  const [context, setContext] = useState(null);
  const [toast, setToast] = useState(null);
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
    () => ({ open, close, showToast, sessionType, setSessionType }),
    [open, close, showToast, sessionType]
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

  const { data: me } = useGetMeV2Query();
  const { data: bookings } = useGetBookingsQuery();
  const { data: conversationPage } = useGetConversationsQuery();
  const { data: notificationPage } = useGetNotificationsQuery();
  const [markAllNotifications] = useMarkAllNotificationsMutation();

  const company = me?.business?.organization?.name ?? "Your employer";
  // v1 UserResource exposes one `name` (full name) — there is no first_name.
  const fullName = me?.name ?? "";

  const user = {
    name: fullName || me?.username || "",
    role: company,
    initials: initialsOf(fullName || me?.username || ""),
    avatarBg: "#EEF4FC",
    avatarColor: "#015C94",
  };

  const upcomingCount = bookings?.summary?.upcoming ?? 0;
  const pastCount = bookings?.past?.length ?? 0;

  // Calculate total unread messages from conversations
  const conversations = conversationPage?.data ?? [];
  const unreadMessagesCount = Array.isArray(conversations)
    ? conversations.reduce((total, conv) => total + (conv.unread_count ?? 0), 0)
    : 0;

  const rawNotifications = notificationPage?.data ?? notificationPage ?? [];
  const notifications = (Array.isArray(rawNotifications) ? rawNotifications : []).map((n) => ({
    id: n.id,
    text: n.message ?? n.title ?? "",
    time: n.created_at_human ?? n.created_at ?? "",
    read: !!n.read_at,
    kind: notificationKind(n),
  }));
  const unread = notifications.filter((n) => !n.read).length;

  /* Deck: sidebar nav — order, labels, count pills and their tones. Counts
     are live; a zero count hides the pill rather than showing "0". */
  const navSections = [
    {
      items: [
        { to: V2.employee, end: true, label: "Home", icon: <Icon.Home size={16} /> },
        {
          to: at("/sessions"),
          label: "My Sessions",
          icon: <Icon.Calendar size={16} />,
          count: upcomingCount ? String(upcomingCount) : undefined,
          countTone: "teal",
        },
        { to: at("/checkins"), label: "Check-ins & Mood", icon: <Icon.Activity size={16} /> },
        { to: at("/community"), label: "Community", icon: <Icon.MessageSquare size={16} /> },
        {
          to: at("/messages"),
          label: "Messages",
          icon: <Icon.MessageCircle size={16} />,
          count: unreadMessagesCount ? String(unreadMessagesCount) : undefined,
          countTone: "blue",
        },
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

  const segment = pathname.replace(V2.employee, "").replace(/^\//, "") || "home";
  const meta = employeePageMeta[segment] ?? employeePageMeta.home;

  /* The deck's Home and Sessions subtitles quote live numbers. */
  const subtitle =
    segment === "home"
      ? [fullName.split(" ")[0], company].filter(Boolean).join(" · ")
      : segment === "sessions"
        ? `${upcomingCount} upcoming · ${pastCount} past session${pastCount === 1 ? "" : "s"}`
        : meta.subtitle;

  usePageMeta(`${meta.title} — TalkAM`);

  return (
    <DashboardShell
      sections={navSections}
      width={224}
      portalLabel={employeePortalLabel}
      topBlock={<PrivacySidebarStrip company={company} />}
      user={user}
      onSignOut={() => open("signout")}
      notifications={notifications}
      notifKindColor={NOTIF_KIND_COLOR}
      onMarkAllRead={() => markAllNotifications()}
      title={meta.title}
      subtitle={subtitle}
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
