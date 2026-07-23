import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import * as Icon from "react-feather";
import TalkamIcon from "../../../assets/svgs/talkam-icon.svg";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2 } from "../../../constants/v2routes";

/**
 * Shared shell for all three B2B dashboards.
 * Spec: "TalkAM B2B Dashboard.dc.html" — 232px fixed navy sidebar, 58px
 * sticky topbar with search / notifications / primary action.
 *
 * The decks are desktop-only (`min-width:1180px` on body). Here the sidebar
 * collapses into a slide-over below `lg` so the dashboards remain usable on
 * tablet and phone, per the PRD's responsiveness requirement.
 */
export const DashboardShell = ({
  sections,
  workspace,
  user,
  accent = "brand",
  topbarAction,
  title,
  subtitle,
}) => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeClass = accent === "therapy" ? "bg-wellness-400/20" : "bg-brand-400/20";

  return (
    <div className="flex min-h-dvh bg-surface-page font-regularNunito">
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
        className={classNames(
          "fixed left-0 top-0 z-[120] flex h-dvh w-[232px] flex-col bg-navy-800 transition-transform lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="border-b border-white/[0.06] px-[18px] pb-3 pt-[18px]">
          <Link to={V2.landing} className="mb-[3px] flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[linear-gradient(135deg,#017FC8,#02D8FD)]">
              <img src={TalkamIcon} alt="" className="h-[17px] w-[17px]" />
            </span>
            <img
              src={TalkamWordmark}
              alt="TalkAM"
              className="h-[15px] w-auto [filter:brightness(0)_invert(1)]"
            />
          </Link>
          <div className="pl-0.5 text-[10px] tracking-[0.05em] text-white/25">
            {workspace.portalLabel}
          </div>
        </div>

        {/* Workspace */}
        <div className="border-b border-white/[0.06] px-3 py-2.5">
          <div className="flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.06] px-2.5 py-2">
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
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-px overflow-y-auto p-2.5">
          {sections.map((section) => (
            <div key={section.label ?? "main"}>
              {section.label ? (
                <div className="px-2 pb-1.5 pt-3 text-[9px] font-boldNunito tracking-[0.1em] text-white/20">
                  {section.label}
                </div>
              ) : null}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13px] font-semiboldNunito transition-colors",
                      isActive
                        ? `${activeClass} text-white`
                        : "text-white/45 hover:bg-white/[0.07] hover:text-white/80"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={classNames(
                          "shrink-0",
                          isActive
                            ? accent === "therapy"
                              ? "text-wellness-400"
                              : "text-brand-400"
                            : ""
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.count ? (
                        <span
                          className={classNames(
                            "rounded-full px-[7px] py-0.5 text-[9px] font-boldNunito",
                            item.countTone === "red"
                              ? "bg-signal-error/30 text-[#FF9B9B]"
                              : item.countTone === "teal"
                                ? "bg-wellness-400/30 text-[#7FDCC6]"
                                : "bg-brand-400/30 text-brand-200"
                          )}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          <Link
            to={V2.businessLogin}
            className="mt-1 flex items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13px] font-semiboldNunito text-white/45 transition-colors hover:bg-white/[0.07] hover:text-white/80"
          >
            <Icon.LogOut size={16} />
            <span>Sign Out</span>
          </Link>
        </nav>

        {/* User */}
        <div className="relative border-t border-white/[0.06] px-3.5 py-3">
          {profileOpen ? (
            <div className="absolute inset-x-3.5 bottom-16 z-[130] overflow-hidden rounded-ds-md bg-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
              <Link
                to={V2.businessLogin}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] font-boldNunito text-surface-errorInk hover:bg-surface-errorField"
              >
                <Icon.LogOut size={15} /> Sign out
              </Link>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex w-full cursor-pointer items-center gap-2.5 text-left"
          >
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito"
              style={{ background: user.avatarBg, color: user.avatarColor }}
            >
              {user.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-caption font-boldNunito text-white">
                {user.name}
              </span>
              <span className="block text-[10px] text-white/35">{user.role}</span>
            </span>
            <Icon.ChevronUp size={12} className="shrink-0 text-white/40" />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[232px]">
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
            <div className="hidden items-center gap-[7px] rounded-[9px] border border-surface-line bg-surface-page px-3 py-[7px] xl:flex">
              <Icon.Search size={14} className="text-ink-400" />
              <input
                placeholder="Search…"
                aria-label="Search"
                className="w-[180px] border-none bg-transparent p-0 text-[13px] text-ink-600 focus:ring-0"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-surface-line bg-surface-page"
            >
              <Icon.Bell size={16} className="text-ink-600" />
              <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-signal-error" />
            </button>
            {topbarAction}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 lg:p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

DashboardShell.propTypes = {
  sections: PropTypes.array.isRequired,
  workspace: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  accent: PropTypes.oneOf(["brand", "therapy"]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
