import { useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  Toggle,
  Table,
  Td,
  Tr,
  InfoStrip,
  PrimaryButton,
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { DsAccordion } from "../../../../../components/v2/accordion";
import { useAdminModal } from "../adminmodals";
import {
  safetyReports,
  activityLog,
  adminFaqs,
  adminUser,
} from "../../../../../fakedata/v2/admin";

/** Admin › Trust & Safety, Settings, Activity Log, Help & Support. */

/* ── TRUST & SAFETY ───────────────────────────────────────────────────── */

export const AdminTrust = () => {
  const { open } = useAdminModal();

  return (
    <>
      <InfoStrip tone="red" icon={<Icon.Shield size={15} className="shrink-0" />}>
        Reports never include session content, chat text, or clinical notes.
        TalkAM&apos;s Trust &amp; Safety team investigates; this view only shows category
        and resolution status.
      </InfoStrip>

      <PanelCard>
        <Table head={["REPORT ID", "REPORTED", "CATEGORY", "FILED BY", "DATE", "STATUS", "ACTION"]}>
          {safetyReports.map((r) => (
            <Tr key={r.id}>
              <Td first>{r.id}</Td>
              <Td>
                {r.reported}{" "}
                <span className="font-regularNunito text-ink-400">({r.reportedRole})</span>
              </Td>
              <Td>
                <Badge tone={r.categoryTone}>{r.category}</Badge>
              </Td>
              <Td className="text-ink-500">{r.filedBy}</Td>
              <Td className="text-ink-500">{r.date}</Td>
              <Td>
                <Badge tone={r.statusTone} dot={r.statusTone === "green"}>
                  {r.status}
                </Badge>
              </Td>
              <Td>
                <SecondaryButton
                  onClick={() => open("report")}
                  className="!px-2.5 !py-1.5 !text-[11px]"
                >
                  View
                </SecondaryButton>
              </Td>
            </Tr>
          ))}
        </Table>
      </PanelCard>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Anonymous reporting is always available
        </div>
        <p className="text-caption leading-[1.6] text-ink-400">
          Both employees and therapists can report a concern from any session or chat.
          Reports route directly to TalkAM&apos;s moderation team — never to company
          admins by default — unless it involves a policy the company itself sets (e.g.
          code of conduct escalation).
        </p>
      </Card>
    </>
  );
};

/* ── SETTINGS ─────────────────────────────────────────────────────────── */

const NOTIFICATION_PREFS = [
  { key: "digest", title: "Monthly usage digest", note: "Sent on the 1st of each month", on: true },
  { key: "seats", title: "Seat limit alerts", note: "When <10% seats remain", on: true },
  { key: "invoice", title: "Invoice notifications", note: "3 days before auto-debit", on: true },
  { key: "therapists", title: "New therapist announcements", note: "When new therapists join the network", on: false },
];

export const AdminSettings = () => {
  const { open, showToast } = useAdminModal();
  const [prefs, setPrefs] = useState(
    NOTIFICATION_PREFS.reduce((acc, p) => ({ ...acc, [p.key]: p.on }), {})
  );
  const [twoFa, setTwoFa] = useState(true);
  const [capOn, setCapOn] = useState(true);
  const [cap, setCap] = useState(6);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {/* Company info */}
      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
          Company Information
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-2 block text-[11px] font-boldNunito text-ink-400">
              Business Profile Image
            </label>
            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-brand-400 text-h3 font-extraboldNunito text-white">
                Z
              </span>
              <SecondaryButton onClick={() => showToast("Image picker opens here")}>
                Upload Image
              </SecondaryButton>
            </div>
            <p className="mt-2 text-[10.5px] text-ink-400">
              Shown in the sidebar and used to personalize your organization&apos;s
              dashboard. PNG or JPG, at least 256×256px.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-ink-400">Company Name</span>
            <input
              defaultValue="Zenith Bank Nigeria"
              className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-ink-400">Industry</span>
            <select className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800">
              <option>Banking &amp; Finance</option>
              <option>Technology</option>
              <option>Professional Services</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-brand-400">
              HR Contact Email
            </span>
            <input
              defaultValue={adminUser.email}
              className="h-[42px] rounded-[10px] border-[1.5px] border-brand-400 px-3.5 text-[13px] text-ink-800 shadow-focus-brand"
            />
          </label>
          <PrimaryButton
            className="w-fit"
            onClick={() => showToast("Company information saved")}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
          Notification Preferences
        </div>
        <div className="flex flex-col">
          {NOTIFICATION_PREFS.map((p, i) => (
            <div
              key={p.key}
              className={classNames(
                "flex items-center justify-between gap-4 py-3",
                i < NOTIFICATION_PREFS.length - 1 && "border-b border-[#F5F5F5]"
              )}
            >
              <div>
                <div className="text-[13px] font-semiboldNunito text-ink-800">{p.title}</div>
                <div className="text-[11px] text-ink-400">{p.note}</div>
              </div>
              <Toggle
                on={prefs[p.key]}
                label={p.title}
                onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Security</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Protect your account with an extra verification step
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-3">
          <div className="max-w-[380px]">
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Two-factor authentication (2FA)
            </div>
            <div className="text-[11px] text-ink-400">
              Email a one-time code to your registered work email at every sign-in
            </div>
          </div>
          <Toggle on={twoFa} label="Two-factor authentication" onClick={() => setTwoFa((v) => !v)} />
        </div>
        <div
          className={classNames(
            "mt-3 flex gap-2.5 rounded-[10px] px-3.5 py-3",
            twoFa ? "bg-wellness-50" : "bg-[#FFF5E8]"
          )}
        >
          {twoFa ? (
            <Icon.Check size={15} className="mt-px shrink-0 text-wellness-600" />
          ) : (
            <Icon.AlertTriangle size={15} className="mt-px shrink-0 text-gold-600" />
          )}
          <span
            className={classNames(
              "text-[11.5px] leading-[1.6]",
              twoFa ? "text-wellness-600" : "text-gold-600"
            )}
          >
            {twoFa ? (
              <>
                2FA is on. A 6-digit code will be emailed to{" "}
                <strong className="font-boldNunito">{adminUser.email}</strong> each time
                you sign in.
              </>
            ) : (
              "2FA is off. Turn it on to require an email code at every sign-in."
            )}
          </span>
        </div>
      </Card>

      {/* Session policy */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Session Policy</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Control how the shared session bundle is used across your team
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-3">
          <div className="max-w-[360px]">
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Cap sessions per employee
            </div>
            <div className="text-[11px] text-ink-400">
              Stops a few heavy users from depleting the shared pool early
            </div>
          </div>
          <Toggle on={capOn} label="Cap sessions per employee" onClick={() => setCapOn((v) => !v)} />
        </div>

        {capOn ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-1 pt-3.5">
              <span className="text-[12.5px] text-ink-600">
                Maximum sessions per employee, per billing cycle
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  aria-label="Decrease cap"
                  onClick={() => setCap((c) => Math.max(1, c - 1))}
                  className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-ink-200 bg-surface-page text-[17px] font-boldNunito text-ink-600"
                >
                  −
                </button>
                <span className="min-w-[24px] text-center text-h4 font-extraboldNunito text-navy-800">
                  {cap}
                </span>
                <button
                  type="button"
                  aria-label="Increase cap"
                  onClick={() => setCap((c) => c + 1)}
                  className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-ink-200 bg-surface-page text-[17px] font-boldNunito text-ink-600"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 rounded-[10px] bg-brand-25 px-3.5 py-3 text-[11.5px] leading-[1.55] text-brand-600">
              Employees see their remaining allowance in-app. Anyone reaching the cap can
              request more — you&apos;ll be notified to approve or top up.
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-[10px] bg-[#FFF5E8] px-3.5 py-3 text-[11.5px] leading-[1.55] text-gold-600">
            No cap — any employee can book until the shared bundle runs out. Best paired
            with the low-balance alert on Billing.
          </div>
        )}

        <PrimaryButton
          className="mt-3.5 w-fit"
          onClick={() => showToast("Session policy saved")}
        >
          Save session policy
        </PrimaryButton>
      </Card>

      {/* SSO */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">
          Single Sign-On (SSO)
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          Let employees log in with their corporate credentials
        </div>
        {[
          { name: "Azure AD / Microsoft Entra", note: "Connect via SAML 2.0 or OIDC", bg: "bg-brand-25", color: "#017FC8" },
          { name: "Google Workspace", note: "OAuth 2.0 integration", bg: "bg-[#FFF5E8]", color: "#9A6E0A" },
        ].map((sso, i) => (
          <div
            key={sso.name}
            className={classNames(
              "flex items-center gap-3 rounded-ds-md bg-ink-50 p-3.5",
              i === 0 && "mb-3.5"
            )}
          >
            <span
              className={classNames(
                "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]",
                sso.bg
              )}
            >
              <Icon.Lock size={17} color={sso.color} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[13px] font-boldNunito text-ink-800">{sso.name}</div>
              <div className="text-[11px] text-ink-500">{sso.note}</div>
            </div>
            <SecondaryButton className="!px-3 !py-1.5 !text-[12px]">Configure</SecondaryButton>
          </div>
        ))}
      </Card>

      {/* Privacy & compliance */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">
          Privacy &amp; Compliance
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          Controls that protect employee anonymity — not editable below the NDPA floor
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-3">
          <div>
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Minimum anonymisation threshold
            </div>
            <div className="text-[11px] text-ink-400">
              Metrics with &lt;5 users show &quot;&lt;5&quot;, never a real number
            </div>
          </div>
          <Badge tone="purple">Locked · 5</Badge>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-3">
          <div>
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Data Protection Officer
            </div>
            <div className="text-[11px] text-ink-400">Contact for NDPA requests</div>
          </div>
          <span className="text-caption font-boldNunito text-navy-800">dpo@talkam.net</span>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <div>
            <div className="text-[13px] font-semiboldNunito text-ink-800">Data residency</div>
            <div className="text-[11px] text-ink-400">Session data storage region</div>
          </div>
          <Badge tone="green" dot>
            AWS af-south-1 (Nigeria)
          </Badge>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="!border-[#FFCDD2]">
        <div className="text-body font-extraboldNunito text-surface-errorInk">Danger Zone</div>
        <div className="mb-3.5 text-caption text-ink-400">
          These actions are permanent and cannot be undone
        </div>
        <div className="flex flex-col gap-2.5">
          {[
            { title: "Suspend all employee access", note: "Temporarily removes access for all 247 employees", label: "Suspend", solid: true },
            { title: "Cancel subscription", note: "Access ends at the end of current billing period", label: "Cancel", solid: false },
            { title: "Delete company account", note: "Removes all company data after a 30-day grace period", label: "Delete", solid: true },
          ].map((row) => (
            <div
              key={row.title}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#FFCDD2] bg-surface-errorField px-3.5 py-3"
            >
              <div>
                <div className="text-[13px] font-boldNunito text-surface-errorInk">
                  {row.title}
                </div>
                <div className="text-[11px] text-signal-error">{row.note}</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  open("confirm", {
                    title: `${row.label} — are you sure?`,
                    body: row.note,
                    confirmLabel: row.label,
                    toast: `${row.title} requested`,
                  })
                }
                className={classNames(
                  "shrink-0 cursor-pointer rounded-ds-sm px-3.5 py-[7px] text-[12px] font-boldNunito",
                  row.solid
                    ? "bg-signal-error text-white"
                    : "border border-signal-error bg-transparent text-signal-error"
                )}
              >
                {row.label}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ── ACTIVITY LOG ─────────────────────────────────────────────────────── */

const ACTIVITY_TINT = {
  blue: "bg-brand-25 text-brand-400",
  teal: "bg-wellness-50 text-wellness-400",
  gold: "bg-gold-50 text-gold-600",
  purple: "bg-[#F5F0FF] text-[#6B44A8]",
  green: "bg-wellness-25 text-wellness-600",
  red: "bg-surface-errorTint text-signal-error",
};

const ACTIVITY_ICON = {
  "user-plus": Icon.UserPlus,
  heart: Icon.Heart,
  download: Icon.Download,
  "credit-card": Icon.CreditCard,
  lock: Icon.Lock,
  check: Icon.Check,
  settings: Icon.Settings,
  "user-minus": Icon.UserMinus,
};

export const AdminActivity = () => (
  <>
    <InfoStrip icon={<Icon.Clock size={15} className="shrink-0 text-brand-600" />}>
      A record of administrative actions taken in your workspace — invites, billing
      changes, therapist and policy updates. Employee session content is never logged
      here.
    </InfoStrip>

    <div className="flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex gap-2">
        <select
          aria-label="Filter by admin"
          className="cursor-pointer rounded-[9px] border border-surface-line bg-white px-3 py-2 text-[13px] text-ink-600"
        >
          <option>All admins</option>
          <option>Adaeze Okonkwo</option>
          <option>Tunde Balogun</option>
        </select>
        <select
          aria-label="Filter by activity"
          className="cursor-pointer rounded-[9px] border border-surface-line bg-white px-3 py-2 text-[13px] text-ink-600"
        >
          <option>All activity</option>
          <option>Invites</option>
          <option>Billing</option>
          <option>Therapists</option>
          <option>Security</option>
        </select>
      </div>
      <SecondaryButton>Export log</SecondaryButton>
    </div>

    <PanelCard>
      {activityLog.map((entry, i) => {
        const IconEl = ACTIVITY_ICON[entry.icon] ?? Icon.Activity;
        return (
          <div
            key={i}
            className="flex items-center gap-3.5 border-b border-[#F5F5F5] px-[18px] py-3.5 last:border-b-0"
          >
            <span
              className={classNames(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                ACTIVITY_TINT[entry.tone]
              )}
            >
              <IconEl size={16} />
            </span>
            <div className="min-w-0 flex-1 text-[13px] leading-[1.5] text-ink-800">
              <span className="font-extraboldNunito text-navy-800">{entry.actor}</span>{" "}
              {entry.action}
            </div>
            <span className="shrink-0 text-[11px] font-semiboldNunito text-[#9299A8]">
              {entry.when}
            </span>
          </div>
        );
      })}
    </PanelCard>
  </>
);

/* ── HELP & SUPPORT ───────────────────────────────────────────────────── */

export const AdminHelp = () => (
  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Frequently asked questions
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          Quick answers for admins — check here before starting a live chat.
        </div>
        <DsAccordion items={adminFaqs} marker="none" />
      </Card>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Knowledge base
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          Full guides, walkthroughs, and troubleshooting — powered by our Informly help
          center.
        </div>
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[#C9CEDA] bg-[#FAFBFD] p-6 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-brand-25">
            <Icon.BookOpen size={18} className="text-brand-400" />
          </span>
          <div className="text-[12.5px] font-boldNunito text-ink-600">
            Informly knowledge base embed
          </div>
          <p className="max-w-[320px] text-[11px] leading-[1.6] text-[#9299A8]">
            This panel is reserved for the Informly widget (help center + live chat).
            Swap this placeholder for the Informly embed script when the integration is
            ready.
          </p>
        </div>
      </Card>
    </div>

    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">
          Still need help?
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400">
              <Icon.MessageCircle size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">Live chat</div>
              <div className="text-[11px] text-ink-400">
                Informly widget · replies in minutes
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-wellness-400">
              <Icon.Mail size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">
                support@talkam.net
              </div>
              <div className="text-[11px] text-ink-400">Replies within 1 business day</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="!bg-navy-800">
        <div className="mb-1.5 text-[13px] font-extraboldNunito text-white">
          Trust &amp; privacy, always
        </div>
        <p className="text-[11.5px] leading-[1.7] text-white/55">
          No admin — including support staff — can view an employee&apos;s individual
          sessions, messages, or community posts. Every request is handled with that
          boundary in place.
        </p>
      </Card>
    </div>

    {/* Deck: fixed Informly launcher */}
    <button
      type="button"
      title="Informly widget launcher — replace with real embed"
      aria-label="Open live chat"
      className="fixed bottom-7 right-7 z-[200] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-[#017FC8] shadow-[0_10px_28px_rgba(1,127,200,0.4)]"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </button>
  </div>
);
