import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  KpiCard,
  SecondaryButton,
  Table,
  Td,
  Tr,
  Withheld,
  AdminSkeleton,
} from "../../../../../components/v2/dashboard/chrome";
import { useSelector } from "react-redux";
import { useAdminModal } from "../adminmodals";
import {
  useGetAdminOverviewQuery,
  downloadCsv,
} from "../../../../../services/v2/adminApiSlice";
import { selectCurrentToken } from "../../../../../services/authSlice";
import {
  TOPIC_BAR_COLOURS,
  compactNaira,
} from "../../../../../constants/admindashboard";

/** Admin › Overview. Spec: "TalkAM B2B Dashboard.dc.html" § OVERVIEW. */

const KPI_ICONS = {
  users: (c) => <Icon.Users size={17} color={c} />,
  check: (c) => <Icon.CheckCircle size={17} color={c} />,
  calendar: (c) => <Icon.Calendar size={17} color={c} />,
};

/**
 * Collapse the month's days into `count` bars (matching the deck's bar count).
 * The days are BUCKETED into contiguous groups and each group's sessions are
 * SUMMED — never sampled — so a session on any day is always counted. (Sampling
 * every ~Nth day silently dropped sessions on the skipped days.) Each bar takes
 * its date label from the first day in its bucket.
 */
const bucketDays = (series, count = 12) => {
  if (!series?.length) return [];
  if (series.length <= count) return series;

  const size = series.length / count;
  return Array.from({ length: count }, (_, i) => {
    const group = series.slice(Math.round(i * size), Math.round((i + 1) * size));
    return {
      date: group[0]?.date,
      sessions: group.reduce((sum, d) => sum + (d.sessions ?? 0), 0),
    };
  });
};

/**
 * Zeroed day buckets across the current month, so a new or suppressed org still
 * sees the chart's frame (axis + flat baseline) rather than a blank box. Carries
 * no real data — every bucket is 0.
 */
const emptyMonthSeries = (count = 12) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const step = (daysInMonth - 1) / (count - 1);

  return Array.from({ length: count }, (_, i) => {
    const day = Math.round(i * step) + 1;
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { date, sessions: 0 };
  });
};

export const AdminOverview = () => {
  const { open, showToast } = useAdminModal();
  const { data, isLoading } = useGetAdminOverviewQuery();
  const token = useSelector(selectCurrentToken);

  const exportUsage = async () => {
    try {
      await downloadCsv("/business/reports/usage/download", token, "talkam-usage.csv");
      showToast("Usage report download started");
    } catch {
      showToast("Couldn't generate that report — please try again");
    }
  };

  const kpis = data?.kpis;
  const activity = data?.session_activity;
  const topics = data?.top_topics;
  const roi = data?.roi;
  const floor = data?.cohort_floor ?? 5;

  // Real data when we have it; otherwise a zeroed month so the chart still
  // renders empty instead of blank (covers both a brand-new and a suppressed org).
  const rawBars = bucketDays(activity?.value ?? []);
  const bars = rawBars.length ? rawBars : emptyMonthSeries();
  const peak = Math.max(...bars.map((b) => b.sessions), 1);
  const peakIndex = bars.findIndex((b) => b.sessions === peak);

  const kpiCards = [
    {
      key: "employees",
      value: String(kpis?.employees?.value ?? 0),
      label: "Total Employees",
      badge: kpis?.employees?.delta_label,
      tone: "blue",
      iconBg: "bg-brand-25",
      iconColor: "#017FC8",
      icon: "users",
      suppressed: false,
    },
    {
      key: "active",
      value: kpis?.active_this_month?.value ?? null,
      label: "Active Users This Month",
      badge: kpis?.active_this_month?.rate ? `${kpis.active_this_month.rate}% rate` : null,
      tone: "green",
      iconBg: "bg-wellness-50",
      iconColor: "#3BA88F",
      icon: "check",
      suppressed: kpis?.active_this_month?.suppressed,
    },
    {
      key: "sessions",
      value: kpis?.sessions_this_month?.value ?? null,
      label: "Sessions This Month",
      badge:
        kpis?.sessions_this_month?.delta_percent === null ||
        kpis?.sessions_this_month?.delta_percent === undefined
          ? null
          : `${kpis.sessions_this_month.delta_percent > 0 ? "+" : ""}${kpis.sessions_this_month.delta_percent}% vs last month`,
      tone: "gold",
      iconBg: "bg-gold-50",
      iconColor: "#9A6E0A",
      icon: "calendar",
      suppressed: kpis?.sessions_this_month?.suppressed,
    },
  ];

  return (
    <>
      {/* KPI row */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <KpiCard
            key={kpi.key}
            icon={KPI_ICONS[kpi.icon](kpi.iconColor)}
            iconBg={kpi.iconBg}
            badge={kpi.badge ? <Badge tone={kpi.tone}>{kpi.badge}</Badge> : null}
            value={String(kpi.value ?? 0)}
            label={kpi.label}
          >
            {kpi.suppressed ? (
              <span className="text-[10.5px] text-ink-400">
                Unlocks at {floor} employees
              </span>
            ) : null}
          </KpiCard>
        ))}
        <KpiCard
          dark
          icon={<Icon.DollarSign size={17} color="#DBB66E" />}
          badge={
            <span className="rounded-full bg-gold-400/[0.18] px-2 py-[3px] text-[10px] font-boldNunito text-gold-400">
              Est. ROI
            </span>
          }
          value={compactNaira(roi?.value?.gross_value ?? 0)}
          label="Productivity Saved"
        >
          <button
            type="button"
            onClick={() => open("roi", roi)}
            className="cursor-pointer underline decoration-white/40 underline-offset-2 hover:text-white/80"
          >
            how is this calculated?
          </button>
        </KpiCard>
      </div>

      {/* Chart + topics */}
      <div className="grid gap-3.5 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-0.5 text-body font-extraboldNunito text-navy-800">
                Session Activity
              </div>
              <div className="text-[11px] text-ink-400">
                Completed sessions · {new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="cursor-pointer rounded-[7px] bg-surface-page px-2.5 py-[5px] text-[11px] font-semiboldNunito text-ink-500">
                Week
              </span>
              <span className="cursor-pointer rounded-[7px] bg-brand-400 px-2.5 py-[5px] text-[11px] font-boldNunito text-white">
                Month
              </span>
            </div>
          </div>

          {isLoading ? (
            <AdminSkeleton className="h-[100px]" />
          ) : (
            <>
              <div className="mb-2 flex h-[100px] items-end gap-[5px] px-0.5">
                {bars.map((bar, i) => (
                  <div key={bar.date} className="flex h-full flex-1 items-end">
                    <div
                      title={`${bar.sessions} session${bar.sessions === 1 ? "" : "s"}`}
                      className={classNames(
                        "w-full rounded-t-[3px]",
                        i === peakIndex && peak > 0
                          ? "bg-brand-400 shadow-[0_4px_10px_rgba(1,127,200,0.22)]"
                          : "bg-brand-50"
                      )}
                      style={{ height: `${Math.max((bar.sessions / peak) * 100, 3)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-0.5">
                {bars.map((bar, i) => (
                  <span
                    key={bar.date}
                    className={classNames(
                      "text-[10px]",
                      i === peakIndex && peak > 0
                        ? "font-boldNunito text-brand-400"
                        : "text-surface-muted"
                    )}
                  >
                    {new Date(`${bar.date}T00:00:00`).getDate()}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card>
          <div className="text-body font-extraboldNunito text-navy-800">Top Topics</div>
          <div className="mb-4 text-[11px] text-ink-400">Anonymised · no individual data</div>
          {isLoading ? (
            <AdminSkeleton className="h-[120px]" />
          ) : topics?.suppressed ? (
            <Withheld cohort={topics.cohort} floor={floor} />
          ) : (
            <div className="flex flex-col gap-[11px]">
              {(topics?.value ?? []).map((topic, i) => {
                const colour = TOPIC_BAR_COLOURS[i % TOPIC_BAR_COLOURS.length];
                return (
                  <div key={topic.key}>
                    <div className="mb-1.5 flex justify-between gap-3">
                      <span className="text-caption font-semiboldNunito text-ink-800">
                        {topic.label}
                      </span>
                      <span className="text-caption font-boldNunito" style={{ color: colour }}>
                        {topic.percent}%
                      </span>
                    </div>
                    <div className="h-[5px] rounded-[3px] bg-ink-100">
                      <div
                        className="h-[5px] rounded-[3px]"
                        style={{ width: `${topic.percent}%`, backgroundColor: colour }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/*
        The deck showed a per-session table here (one row per employee session).
        That is individual data, so it is served as a DEPARTMENT rollup instead —
        the same panel and table, aggregated. Departments below the cohort floor
        are withheld individually. See planning-docs/web-api/03-admin-dashboard.md §0.
      */}
      <PanelCard
        title="Sessions by Department"
        subtitle="All data anonymised · NDPA 2023 compliant"
        action={
          <SecondaryButton onClick={exportUsage}>
            <Icon.Download size={13} />
            Export CSV
          </SecondaryButton>
        }
      >
        <Table head={["DEPARTMENT", "PEOPLE", "SESSIONS THIS MONTH", "STATUS"]}>
          {(data?.departments ?? []).map((row) => (
            <Tr key={row.department}>
              <Td first>{row.department}</Td>
              <Td>{row.members}</Td>
              <Td className="text-ink-500">{row.suppressed ? "—" : row.value}</Td>
              <Td>
                {row.suppressed ? (
                  <Badge tone="gold" dot="gold">
                    Withheld
                  </Badge>
                ) : (
                  <Badge tone="green" dot>
                    Reported
                  </Badge>
                )}
              </Td>
            </Tr>
          ))}
        </Table>

        {!isLoading && (data?.departments ?? []).length === 0 ? (
          <div className="px-5 py-4 text-[12px] leading-[1.6] text-ink-400">
            No departments yet — assign departments when you invite people and they will
            appear here.
          </div>
        ) : null}

        <div className="border-t border-surface-line px-5 py-3 text-[11px] leading-[1.6] text-ink-400">
          Figures are company-wide totals. Departments with fewer than {floor} people are
          withheld so no individual can be identified.
        </div>
      </PanelCard>
    </>
  );
};
