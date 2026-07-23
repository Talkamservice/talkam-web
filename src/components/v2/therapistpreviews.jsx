import classNames from "classnames";
import TalkamWordmark from "../../assets/svgs/talkam-logo.svg";
import {
  therapistHomePreview,
  therapistSessions,
  therapistEarnings,
} from "../../fakedata/v2/fortherapists";

/**
 * Static, decorative screenshots of the therapist dashboard for the For
 * Therapists marketing page.
 * Spec: "TalkAM For Therapists.dc.html".
 *
 * Marketing chrome only — the live Therapist Dashboard is built separately
 * under routes/v2/business/therapist.
 */

const THERAPIST_NAV = ["Home", "Sessions", "Clients", "Availability", "Earnings", "Analytics"];

const PreviewSidebar = () => (
  <div className="w-[158px] shrink-0 bg-navy-800 px-3 py-4">
    <img
      src={TalkamWordmark}
      alt=""
      className="mb-[22px] h-4 w-auto [filter:brightness(0)_invert(1)]"
    />
    <div className="flex flex-col gap-1">
      {THERAPIST_NAV.map((item, i) => (
        <div
          key={item}
          className={classNames(
            "rounded-ds-sm px-2.5 py-2 text-[11px]",
            i === 0
              ? "bg-wellness-400 font-boldNunito text-white"
              : "font-semiboldNunito text-white/50"
          )}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

/** Home: greeting, next-session hero, three KPI cards. */
export const TherapistHomePreview = () => (
  <div className="flex h-[430px] bg-surface-page">
    <PreviewSidebar />
    <div className="flex-1 overflow-hidden p-5">
      <div className="text-[16px] font-extraboldNunito text-navy-800">
        {therapistHomePreview.greeting}
      </div>
      <div className="mb-3.5 text-[11px] text-[#9299A8]">
        {therapistHomePreview.subtitle}
      </div>

      <div className="mb-3 rounded-[14px] bg-[linear-gradient(120deg,#124034,#3BA88F)] p-4 text-white">
        <div className="mb-1.5 text-[10px] font-extraboldNunito tracking-[0.06em] text-white/70">
          {therapistHomePreview.nextSession.kicker}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[15px] font-extraboldNunito">
              {therapistHomePreview.nextSession.title}
            </div>
            <div className="mt-0.5 text-[11px] text-white/75">
              {therapistHomePreview.nextSession.focus}
            </div>
          </div>
          <div className="shrink-0 rounded-[9px] bg-white px-3.5 py-2 text-[11px] font-extraboldNunito text-[#124034]">
            Join
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {therapistHomePreview.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-ds-md border border-[#EDEFF3] bg-white p-3"
          >
            <div className="text-[10px] font-boldNunito text-[#9299A8]">{kpi.label}</div>
            <div
              className={classNames(
                "mt-[3px] text-[19px] font-extraboldNunito",
                kpi.valueClass || "text-navy-800"
              )}
            >
              {kpi.value}
            </div>
            <div className={classNames("text-[10px]", kpi.deltaClass)}>{kpi.delta}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/** Sessions: tabbed list with upcoming sessions. */
export const TherapistSessionsPreview = () => (
  <div className="h-[400px] bg-surface-page p-5">
    <div className="mb-3 text-[16px] font-extraboldNunito text-navy-800">Sessions</div>
    <div className="mb-3.5 flex gap-2">
      <span className="rounded-full bg-wellness-400 px-3 py-1.5 text-[11px] font-extraboldNunito text-white">
        Upcoming · 5
      </span>
      <span className="rounded-full border border-[#EDEFF3] bg-white px-3 py-1.5 text-[11px] font-boldNunito text-[#5B6577]">
        Past
      </span>
      <span className="rounded-full border border-[#EDEFF3] bg-white px-3 py-1.5 text-[11px] font-boldNunito text-[#5B6577]">
        Requests · 2
      </span>
    </div>
    <div className="flex flex-col gap-2.5">
      {therapistSessions.map((session) => (
        <div
          key={session.title + session.time}
          className="flex items-center justify-between gap-3 rounded-ds-md border border-[#EDEFF3] bg-white p-3.5"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white"
              style={{ background: session.bg }}
            >
              {session.ini}
            </span>
            <div>
              <div className="text-[13px] font-extraboldNunito text-navy-800">
                {session.title}
              </div>
              <div className="text-[11px] text-[#9299A8]">
                {session.time} ·{" "}
                <span className="font-boldNunito text-wellness-400">{session.focus}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 rounded-[9px] bg-brand-25 px-3 py-[7px] text-[11px] font-extraboldNunito text-brand-400">
            {session.cta}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Earnings: available balance + recent payouts. */
export const TherapistEarningsPreview = () => (
  <div className="h-[400px] bg-surface-page p-5">
    <div className="mb-3.5 text-[16px] font-extraboldNunito text-navy-800">Earnings</div>

    <div className="mb-3 rounded-[14px] bg-[linear-gradient(120deg,#124034,#3BA88F)] p-[18px] text-white">
      <div className="text-[10px] font-extraboldNunito tracking-[0.06em] text-white/70">
        AVAILABLE BALANCE
      </div>
      <div className="mt-1 text-[30px] font-extraboldNunito">{therapistEarnings.balance}</div>
      <div className="mt-1 text-[11px] text-white/80">{therapistEarnings.payoutNote}</div>
    </div>

    <div className="overflow-hidden rounded-ds-md border border-[#EDEFF3] bg-white">
      <div className="border-b border-[#F0F2F6] px-4 py-[11px] text-[11px] font-extraboldNunito text-navy-800">
        Recent payouts
      </div>
      {therapistEarnings.payouts.map((payout) => (
        <div
          key={payout.date}
          className="flex items-center justify-between border-b border-[#F5F6F9] px-4 py-[11px]"
        >
          <div>
            <div className="text-caption font-boldNunito text-navy-800">{payout.date}</div>
            <div className="text-[10.5px] text-[#9299A8]">{payout.sessions} sessions</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-[12.5px] font-extraboldNunito text-navy-800">
              {payout.amount}
            </div>
            <span className="rounded-full bg-wellness-50 px-2.5 py-[3px] text-[10px] font-extraboldNunito text-wellness-600">
              Paid
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
