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
} from "../../../../../components/v2/dashboard/chrome";
import { useAdminModal } from "../adminmodals";
import {
  overviewKpis,
  sessionActivityBars,
  sessionActivityHighlight,
  sessionActivityLabels,
  topTopics,
  recentSessions,
  roi,
} from "../../../../../fakedata/v2/admin";

/** Admin › Overview. Spec: "TalkAM B2B Dashboard.dc.html" § OVERVIEW. */

const KPI_ICONS = {
  users: (c) => <Icon.Users size={17} color={c} />,
  check: (c) => <Icon.CheckCircle size={17} color={c} />,
  calendar: (c) => <Icon.Calendar size={17} color={c} />,
};

const TYPE_TONE = { Video: "blue", Audio: "purple", Chat: "green" };

export const AdminOverview = () => {
  const { open } = useAdminModal();

  return (
    <>
      {/* KPI row */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <KpiCard
            key={kpi.key}
            icon={KPI_ICONS[kpi.icon](kpi.iconColor)}
            iconBg={kpi.iconBg}
            badge={<Badge tone={kpi.tone}>{kpi.badge}</Badge>}
            value={kpi.value}
            label={kpi.label}
          />
        ))}
        <KpiCard
          dark
          icon={<Icon.DollarSign size={17} color="#DBB66E" />}
          badge={
            <span className="rounded-full bg-gold-400/[0.18] px-2 py-[3px] text-[10px] font-boldNunito text-gold-400">
              Est. ROI
            </span>
          }
          value={roi.headline}
          label="Productivity Saved"
        >
          <button
            type="button"
            onClick={() => open("roi")}
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
              <div className="text-[11px] text-ink-400">Completed sessions · July 2026</div>
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

          <div className="mb-2 flex h-[100px] items-end gap-[5px] px-0.5">
            {sessionActivityBars.map((h, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div
                  className={classNames(
                    "w-full rounded-t-[3px]",
                    i === sessionActivityHighlight
                      ? "bg-brand-400 shadow-[0_4px_10px_rgba(1,127,200,0.22)]"
                      : "bg-brand-50"
                  )}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between px-0.5">
            {sessionActivityLabels.map((label, i) => (
              <span
                key={label}
                className={classNames(
                  "text-[10px]",
                  i === sessionActivityHighlight
                    ? "font-boldNunito text-brand-400"
                    : "text-surface-muted"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-body font-extraboldNunito text-navy-800">Top Topics</div>
          <div className="mb-4 text-[11px] text-ink-400">Anonymised · no individual data</div>
          <div className="flex flex-col gap-[11px]">
            {topTopics.map((topic) => (
              <div key={topic.label}>
                <div className="mb-1.5 flex justify-between gap-3">
                  <span className="text-caption font-semiboldNunito text-ink-800">
                    {topic.label}
                  </span>
                  <span className="text-caption font-boldNunito" style={{ color: topic.color }}>
                    {topic.pct}%
                  </span>
                </div>
                <div className="h-[5px] rounded-[3px] bg-ink-100">
                  <div
                    className="h-[5px] rounded-[3px]"
                    style={{ width: `${topic.pct}%`, backgroundColor: topic.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent sessions */}
      <PanelCard
        title="Recent Sessions"
        subtitle="All data anonymised · NDPA 2023 compliant"
        action={
          <SecondaryButton>
            <Icon.Download size={13} />
            Export CSV
          </SecondaryButton>
        }
      >
        <Table head={["EMPLOYEE ID", "DEPARTMENT", "THERAPIST", "TYPE", "DATE", "STATUS"]}>
          {recentSessions.map((row) => (
            <Tr key={row.id + row.date}>
              <Td first>{row.id}</Td>
              <Td>{row.dept}</Td>
              <Td>{row.therapist}</Td>
              <Td>
                <Badge tone={TYPE_TONE[row.type]}>{row.type}</Badge>
              </Td>
              <Td className="text-ink-500">{row.date}</Td>
              <Td>
                {row.status === "Completed" ? (
                  <Badge tone="green" dot>
                    Completed
                  </Badge>
                ) : (
                  <Badge tone="gold" dot="gold">
                    Pending
                  </Badge>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </PanelCard>
    </>
  );
};
