import { useMemo, useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  Table,
  Td,
  Tr,
  InfoStrip,
  PrimaryButton,
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { useAdminModal } from "../adminmodals";
import {
  therapists,
  specialtyOptions,
  teamNeeds,
  networkStats,
  naira,
} from "../../../../../fakedata/v2/admin";

/** Admin › Therapist Network and My Therapists. */

const InfoIcon = () => <Icon.Info size={15} className="shrink-0 text-brand-600" />;

export const AdminTherapistNetwork = () => {
  const { open, showToast } = useAdminModal();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [added, setAdded] = useState([]);

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    return therapists
      .filter((t) => t.provider !== "own")
      .filter((t) => specialty === "All Specialties" || t.specialty === specialty)
      .filter((t) => (q ? `${t.name} ${t.specialty}`.toLowerCase().includes(q) : true));
  }, [search, specialty]);

  const seatsAvailable = networkStats.seatsTotal - networkStats.seatsUsed;
  const sessionsRemaining = networkStats.sessionsBundle - networkStats.sessionsUsed;

  return (
    <>
      <InfoStrip icon={<InfoIcon />}>
        Credential verification happens on TalkAM&apos;s internal review tool, not here.
        This view shows which verified therapists are actively serving your team.
      </InfoStrip>

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-[7px] rounded-[9px] border border-surface-line bg-white px-3 py-[7px] shadow-[0_1px_3px_rgba(20,27,52,0.04)]">
            <Icon.Search size={13} className="text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialty…"
              aria-label="Search therapists"
              className="w-[180px] border-none bg-transparent p-0 text-[13px] text-ink-600 focus:ring-0 sm:w-[220px]"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            aria-label="Specialty filter"
            className="cursor-pointer rounded-[9px] border border-surface-line bg-white px-3 py-2 text-[13px] text-ink-600"
          >
            {specialtyOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <PrimaryButton onClick={() => open("capacity")}>
          <Icon.Plus size={12} strokeWidth={2.5} />
          Request More Capacity
        </PrimaryButton>
      </div>

      {/* Team needs */}
      <Card>
        <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2">
          <div className="text-body font-extraboldNunito text-navy-800">Team Needs</div>
          <Badge tone="purple">ANONYMISED · n=214</Badge>
        </div>
        <p className="mb-4 text-caption leading-[1.5] text-ink-400">
          From employees&apos; private onboarding self-check-ins — never individual
          answers, only company-wide patterns once at least 5 people respond. Use this
          to prioritise which specialties to onboard next.
        </p>
        <div className="flex flex-col gap-[11px]">
          {teamNeeds.map((need) => (
            <div key={need.label}>
              <div className="mb-1.5 flex justify-between gap-3">
                <span className="text-[12.5px] font-semiboldNunito text-ink-800">
                  {need.label}
                </span>
                <span className="text-[12.5px] font-boldNunito text-navy-800">
                  {need.pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-[3px] bg-ink-100">
                <div
                  className="h-1.5 rounded-[3px]"
                  style={{ width: `${need.pct * 2}%`, backgroundColor: need.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats strip */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        {[
          {
            label: "THERAPIST ACCESS SEATS",
            value: `${networkStats.seatsUsed} / ${networkStats.seatsTotal}`,
            note: `${seatsAvailable} available`,
          },
          {
            label: "SESSIONS REMAINING",
            value: `${sessionsRemaining} / ${networkStats.sessionsBundle}`,
            note: "This month's bundle",
          },
          { label: "NEXT RESET", value: networkStats.nextReset, note: "Unused sessions expire" },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              {stat.label}
            </div>
            <div className="text-h2 font-extraboldNunito text-navy-800">{stat.value}</div>
            <div className="text-[11px] text-ink-500">{stat.note}</div>
          </Card>
        ))}
      </div>

      {/* Therapist cards */}
      {visible.length ? (
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((t) => {
            const inNetwork = t.inNetwork || added.includes(t.id);
            return (
              <Card key={t.id}>
                <div className="mb-3 flex items-center gap-[11px]">
                  <div className="relative shrink-0">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-extraboldNunito text-white"
                      style={{ background: t.avatarBg }}
                    >
                      {t.initials}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-brand-400">
                      <Icon.Check size={9} color="#fff" strokeWidth={3.5} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-extraboldNunito text-navy-800">
                        {t.name}
                      </span>
                      <span className="text-[11px] text-gold-600">✦</span>
                    </div>
                    <div className="truncate text-[11px] text-ink-400">{t.specialty}</div>
                  </div>
                </div>

                <div className="mb-2.5 flex gap-4 border-y border-ink-100 py-2.5">
                  <div>
                    <div className="text-[15px] font-extraboldNunito text-navy-800">
                      {t.sessions}
                    </div>
                    <div className="text-[10px] text-ink-400">sessions</div>
                  </div>
                  <div>
                    <div className="text-[15px] font-extraboldNunito text-navy-800">
                      {t.rating}
                    </div>
                    <div className="text-[10px] text-ink-400">avg rating</div>
                  </div>
                  <div>
                    <div className="text-[15px] font-extraboldNunito text-brand-400">
                      {t.availability}
                    </div>
                    <div className="text-[10px] text-ink-400">next slot</div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-1.5 rounded-ds-sm bg-ink-50 px-2.5 py-[7px]">
                  <Icon.DollarSign size={13} className="text-brand-400" />
                  <span className="text-[11.5px] font-boldNunito text-navy-800">
                    {t.billing === "self"
                      ? "Settled directly with you"
                      : `${naira(8000)} / session (B2B rate)`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => open("therapist", t)}
                    className="flex-1 cursor-pointer rounded-[9px] border border-surface-line bg-surface-page py-2 text-center text-caption font-boldNunito text-ink-600"
                  >
                    View Profile
                  </button>
                  {inNetwork ? (
                    <span className="flex-1 rounded-[9px] border border-[#BFE6DC] bg-wellness-50 py-2 text-center text-caption font-boldNunito text-wellness-600">
                      In your network ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAdded((p) => [...p, t.id]);
                        showToast(`${t.name} added to your network`);
                      }}
                      className="flex-1 cursor-pointer rounded-[9px] bg-brand-400 py-2 text-center text-caption font-boldNunito text-white hover:bg-brand-600"
                    >
                      Add to network
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-9 text-center">
          <div className="mb-1 text-[13px] font-boldNunito text-navy-800">
            No therapists match your filters
          </div>
          <div className="text-caption text-ink-400">
            Try a different search term or specialty
          </div>
        </Card>
      )}
    </>
  );
};

export const AdminMyTherapists = () => {
  const { open } = useAdminModal();
  const mine = therapists.filter((t) => t.inNetwork);
  const seatsAvailable = networkStats.seatsTotal - networkStats.seatsUsed;

  return (
    <>
      <InfoStrip icon={<InfoIcon />}>
        Therapists currently active in your organisation — both your own providers and
        TalkAM-verified therapists. Each B2B session draws down from your session bundle
        at ₦8,000/session; self-billed providers you settle directly.
      </InfoStrip>

      <div className="grid gap-3.5 sm:grid-cols-3">
        {[
          { label: "THERAPISTS ACTIVE", value: String(mine.length), tone: "text-navy-800" },
          { label: "SEATS USED", value: String(networkStats.seatsUsed), tone: "text-navy-800" },
          { label: "SEATS AVAILABLE", value: String(seatsAvailable), tone: "text-[#1F8A5B]" },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              {stat.label}
            </div>
            <div className={classNames("text-h2 font-extraboldNunito", stat.tone)}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      <PanelCard
        title="Active Therapists"
        subtitle="Your own providers and TalkAM-verified therapists serving your team"
        action={
          <div className="flex gap-2">
            <SecondaryButton onClick={() => open("addOwn")}>
              + Add your own therapist
            </SecondaryButton>
          </div>
        }
      >
        <Table
          head={["THERAPIST", "TYPE", "SPECIALTIES", "SESSIONS", "BILLING", "STATUS", "ACTIONS"]}
        >
          {mine.map((t) => (
            <Tr key={t.id}>
              <Td first>
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-extraboldNunito text-white"
                    style={{ background: t.avatarBg }}
                  >
                    {t.initials}
                  </span>
                  <span className="font-boldNunito text-navy-800">
                    {t.name} <span className="text-gold-600">✦</span>
                  </span>
                </div>
              </Td>
              <Td>
                <Badge tone={t.provider === "own" ? "purple" : "blue"}>
                  {t.provider === "own" ? "Your provider" : "TalkAM network"}
                </Badge>
              </Td>
              <Td>{t.specialty}</Td>
              <Td className="font-boldNunito text-ink-600">{t.monthSessions}</Td>
              <Td>
                <Badge tone={t.billing === "self" ? "gold" : "green"}>
                  {t.billing === "self" ? "Self-billed" : "Via TalkAM"}
                </Badge>
              </Td>
              <Td>
                <Badge tone="green" dot>
                  Active
                </Badge>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <SecondaryButton
                    onClick={() => open("therapist", t)}
                    className="!px-2.5 !py-1.5 !text-[11px]"
                  >
                    View profile
                  </SecondaryButton>
                  <button
                    type="button"
                    onClick={() =>
                      open("confirm", {
                        title: `Remove ${t.name}?`,
                        body: "They stop taking new bookings from your team. Sessions already scheduled still go ahead.",
                        confirmLabel: "Remove",
                        toast: `${t.name} removed from your network`,
                      })
                    }
                    className="cursor-pointer rounded-[7px] border border-[#FFCDD2] bg-surface-errorTint px-2.5 py-1.5 text-[11px] font-boldNunito text-surface-errorInk"
                  >
                    Remove
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </PanelCard>
    </>
  );
};
