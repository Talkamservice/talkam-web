import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import * as Icon from "react-feather";
import TalkamIcon from "../../../assets/svgs/talkam-icon.svg";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2 } from "../../../constants/v2routes";

/**
 * Shared shell for the three B2B dashboards.
 *
 * The decks differ from each other in the sidebar width, the block under the
 * logo, and whether the topbar carries a search field, so those are props
 * rather than assumptions:
 *   - admin     "TalkAM B2B Dashboard.dc.html"            232px, company switcher, search
 *   - employee  "TalkAM B2B Employee Dashboard.dc.html"   224px, privacy strip, no search
 *   - therapist "TalkAM B2B Therapist Dashboard.dc.html"  224px, verification strips, no search
 *
 * The decks are desktop-only (`min-width:1180px` on body). Below `lg` the
 * sidebar collapses into a slide-over — the only layout liberty taken here.
 */

/** Deck: the `.nav-item` rule at the top of every dashboard deck. */
const navItemClass = (isActive) =>
  classNames(
    "flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13px] font-semiboldNunito",
    isActive
      ? "bg-[rgba(1,127,200,0.2)] text-white"
      : "text-white/45 hover:bg-white/[0.07] hover:text-white/80"
  );

/** Deck: `<div style="font-size:9px;...letter-spacing:0.1em;padding:12px 8px 6px">`. */
const NavSectionLabel = ({ children, first }) => (
  <div
    className={classNames(
      "px-2 pb-1.5 text-[9px] font-boldNunito tracking-[0.1em] text-white/20",
      first ? "pt-1" : "pt-3"
    )}
  >
    {children}
  </div>
);

const CountPill = ({ tone, children }) => (
  <span
    className={classNames(
      "rounded-full px-[7px] py-0.5 text-[9px] font-boldNunito",
      tone === "red"
        ? "bg-[rgba(172,66,66,0.28)] text-[#FF9B9B]"
        : tone === "teal"
          ? "bg-[rgba(59,168,143,0.28)] text-[#6FCDB6]"
          : tone === "tealBright"
            ? "bg-[rgba(59,168,143,0.28)] text-[#7FDCC6]"
            : "bg-[rgba(1,127,200,0.28)] text-[#68B4E1]"
    )}
  >
    {children}
  </span>
);

export const DashboardShell = ({
  sections,
  workspace,
  workspaceMenu,
  topBlock,
  user,
  userMenu,
  width = 232,
  logoGradient = "linear-gradient(135deg,#017FC8,#02D8FD)",
  portalLabel,
  showSearch = false,
  signOutTo = V2.businessLogin,
  onSignOut,
  notifications = [],
  notifKindColor = {},
  /** Decks without a notification panel still draw the unread dot. */
  bellDot = false,
  topbarAction,
  title,
  subtitle,
}) => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readAll, setReadAll] = useState(false);

  const rows = notifications.map((n) => ({ ...n, read: readAll || n.read }));
  const hasUnread = bellDot || rows.some((n) => !n.read);

  return (
    /* `leading-[normal]`: the decks inherit the browser default line-height and
       set an explicit one only where it matters. Tailwind's preflight would
       otherwise impose 1.5 on every unstyled line box. */
    <div className="flex min-h-dvh bg-surface-page font-regularNunito leading-[normal]">
      {/* Mobile scrim */}
      {navOpen ? (
        <div
          className="fixed inset-0 z-[110] bg-navy-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* SIDEBAR */}
      <aside
        style={{ width }}
        className={classNames(
          "fixed left-0 top-0 z-[120] flex h-dvh flex-col bg-navy-800 transition-transform lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="border-b border-white/[0.06] px-[18px] pb-3 pt-[18px]">
          <Link to={V2.landing} className="mb-[3px] flex items-center gap-[9px]">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
              style={{ background: logoGradient }}
            >
              <img src={TalkamIcon} alt="" className="h-[17px] w-[17px]" />
            </span>
            <img
              src={TalkamWordmark}
              alt="TalkAM"
              className="h-[15px] w-auto [filter:brightness(0)_invert(1)]"
            />
          </Link>
          <div className="pl-0.5 text-[10px] tracking-[0.05em] text-white/25">
            {portalLabel ?? workspace?.portalLabel}
          </div>
        </div>

        {/* Block under the logo — privacy strip / verification / company switcher */}
        {topBlock ? (
          <div className="border-b border-white/[0.06] px-3 py-2.5">{topBlock}</div>
        ) : workspace ? (
          <div className="relative border-b border-white/[0.06] px-3 py-2.5">
            {workspaceMenu && workspaceOpen ? (
              <div className="absolute inset-x-3 top-[60px] z-[120] overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
                {workspaceMenu}
              </div>
            ) : null}
            <div
              role={workspaceMenu ? "button" : undefined}
              tabIndex={workspaceMenu ? 0 : undefined}
              onClick={workspaceMenu ? () => setWorkspaceOpen((v) => !v) : undefined}
              onKeyDown={
                workspaceMenu
                  ? (e) => e.key === "Enter" && setWorkspaceOpen((v) => !v)
                  : undefined
              }
              className={classNames(
                "flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.06] px-2.5 py-2",
                workspaceMenu && "cursor-pointer"
              )}
            >
              <span
                className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-[11px] font-extraboldNunito text-white"
                style={{ background: workspace.accent }}
              >
                {workspace.initial}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-caption font-boldNunito text-white">
                  {workspace.name}
                </div>
                <div className="text-[10px] text-white/35">{workspace.meta}</div>
              </div>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
                className="shrink-0"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        ) : null}

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-px overflow-y-auto p-2.5">
          {sections.map((section, si) => (
            <div key={section.label ?? `s${si}`}>
              {section.label ? (
                <NavSectionLabel first={si === 0}>{section.label}</NavSectionLabel>
              ) : null}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.count ? (
                    <CountPill tone={item.countTone}>{item.count}</CountPill>
                  ) : null}
                </NavLink>
              ))}
            </div>
          ))}

          {onSignOut ? (
            <button type="button" onClick={onSignOut} className={navItemClass(false)}>
              <Icon.LogOut size={16} className="shrink-0" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link to={signOutTo} className={navItemClass(false)}>
              <Icon.LogOut size={16} className="shrink-0" />
              <span>Sign Out</span>
            </Link>
          )}
        </nav>

        {/* User */}
        <div className="relative border-t border-white/[0.06] px-3.5 py-3">
          {userMenu && profileOpen ? (
            <div className="absolute inset-x-3.5 bottom-16 z-[130] overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
              {userMenu === true ? (
                <Link
                  to={signOutTo}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] font-boldNunito text-surface-errorInk hover:bg-surface-errorField"
                >
                  <Icon.LogOut size={15} /> Sign out
                </Link>
              ) : (
                userMenu
              )}
            </div>
          ) : null}
          {userMenu ? (
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex w-full cursor-pointer items-center gap-[9px] text-left"
            >
              <UserIdentity user={user} />
              <Icon.ChevronUp size={12} className="shrink-0 text-white/40" />
            </button>
          ) : (
            <div className="flex items-center gap-[9px]">
              <UserIdentity user={user} />
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div
        className="flex min-w-0 flex-1 flex-col lg:ml-[var(--dash-ml)]"
        style={{ "--dash-ml": `${width}px` }}
      >
        <header className="sticky top-0 z-[90] flex h-[58px] items-center justify-between gap-4 border-b border-surface-line bg-white px-4 shadow-[0_1px_3px_rgba(20,27,52,0.05)] lg:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="Open navigation"
                className="shrink-0 text-navy-800 lg:hidden"
              >
                <Icon.Menu size={22} />
              </button>
              <div className="min-w-0">
                <div className="truncate text-[17px] font-extraboldNunito leading-[1.2] text-navy-800">
                  {title}
                </div>
                <div className="truncate text-[11px] text-ink-400">{subtitle}</div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              {showSearch ? (
                <div className="hidden items-center gap-[7px] rounded-[9px] border border-surface-line bg-surface-page px-3 py-[7px] xl:flex">
                  <Icon.Search size={14} className="text-ink-400" />
                  <input
                    placeholder="Search…"
                    aria-label="Search"
                    className="w-[180px] border-none bg-transparent p-0 text-[13px] text-ink-600 focus:ring-0"
                  />
                </div>
              ) : null}

              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-surface-line bg-surface-page"
                >
                  <Icon.Bell size={16} className="text-ink-600" />
                  {hasUnread ? (
                    <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#AC4242]" />
                  ) : null}
                </button>

                {notifOpen && rows.length ? (
                  <div className="absolute right-0 top-11 z-[300] w-[340px] overflow-hidden rounded-[14px] border border-surface-line bg-white shadow-[0_12px_32px_rgba(20,27,52,0.18)]">
                    <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3.5">
                      <span className="text-[13px] font-extraboldNunito text-navy-800">
                        Notifications
                      </span>
                      <button
                        type="button"
                        onClick={() => setReadAll(true)}
                        className="cursor-pointer text-[11.5px] font-boldNunito text-brand-400"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {rows.map((n) => (
                        <div
                          key={n.id}
                          className={classNames(
                            "flex gap-2.5 border-b border-[#F5F5F5] px-4 py-3",
                            n.read ? "bg-white" : "bg-[#F8F9FC]"
                          )}
                        >
                          <span
                            className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                            style={{
                              background: n.read
                                ? "#E2E2E2"
                                : notifKindColor[n.kind] || "#017FC8",
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-[12.5px] leading-[1.5] text-ink-800">
                              {n.text}
                            </div>
                            <div className="mt-[3px] text-[10.5px] text-ink-300">
                              {n.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {topbarAction}
            </div>
        </header>

        {/* Deck: `padding:26px 28px;gap:20px` */}
        <div className="flex flex-1 flex-col gap-5 p-4 lg:px-7 lg:py-[26px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const UserIdentity = ({ user }) => (
  <>
    <span
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito"
      style={{ background: user.avatarBg, color: user.avatarColor ?? "#fff" }}
    >
      {user.initials}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-caption font-boldNunito text-white">
        {user.name}
      </span>
      <span className="block text-[10px] text-white/35">{user.role}</span>
    </span>
  </>
);

DashboardShell.propTypes = {
  sections: PropTypes.array.isRequired,
  workspace: PropTypes.object,
  workspaceMenu: PropTypes.node,
  topBlock: PropTypes.node,
  user: PropTypes.object.isRequired,
  userMenu: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  width: PropTypes.number,
  logoGradient: PropTypes.string,
  portalLabel: PropTypes.string,
  showSearch: PropTypes.bool,
  notifications: PropTypes.array,
  notifKindColor: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
