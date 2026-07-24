import { useMemo, useState } from "react";
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
import { useAdminModal } from "../adminmodals";
import { EMPLOYEES_PER_PAGE } from "../../../../../constants/admindashboard";
import {
  useGetAdminEmployeesQuery,
  useGetAdminOverviewQuery,
  useDeactivateEmployeeMutation,
  useReactivateEmployeeMutation,
} from "../../../../../services/v2/adminApiSlice";
import { useResendInvitationMutation } from "../../../../../services/v2/businessApiSlice";

/**
 * Admin › Employees. Spec: "TalkAM B2B Dashboard.dc.html" § EMPLOYEES.
 *
 * The deck's "SESSIONS USED" and "LAST ACTIVE" columns are NOT served: a
 * per-person therapy-session count and an activity timestamp are individual
 * data, and the privacy promise forbids showing them to an employer. They are
 * replaced by ROLE and SEATED SINCE — administrative facts the admin already
 * holds. See planning-docs/web-api/03-admin-dashboard.md §0.
 */

const STATUS_TONE = { active: "green", invited: "blue", inactive: "grey" };

const Directory = () => {
  const { open, showToast } = useAdminModal();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [resent, setResent] = useState([]);
  const [nudged, setNudged] = useState([]);

  const { data, isLoading } = useGetAdminEmployeesQuery();
  const [deactivate] = useDeactivateEmployeeMutation();
  const [reactivate] = useReactivateEmployeeMutation();
  const [resendInvitation] = useResendInvitationMutation();

  const employees = data?.employees ?? [];
  const employeeDepartments = ["All Departments", ...(data?.departments ?? [])];
  const employeeStatuses = ["All Status", "Active", "Invited", "Inactive"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees
      .filter((e) => dept === "All Departments" || e.department === dept)
      .filter((e) => status === "All Status" || e.status === status.toLowerCase())
      .filter((e) => (q ? `${e.id} ${e.email} ${e.department}`.toLowerCase().includes(q) : true));
  }, [employees, search, dept, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / EMPLOYEES_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * EMPLOYEES_PER_PAGE,
    currentPage * EMPLOYEES_PER_PAGE
  );

  const allVisibleSelected =
    visible.length > 0 && visible.every((e) => selected.includes(e.id));

  const toggleAll = () =>
    setSelected(allVisibleSelected ? [] : visible.map((e) => e.id));

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const reset = (fn) => (value) => {
    fn(value);
    setPage(1);
  };

  return (
    <>
      {/* CSV banner */}
      <button
        type="button"
        onClick={() => open("csv")}
        className="flex w-full cursor-pointer items-center gap-3.5 rounded-[14px] border-2 border-dashed border-brand-200 bg-[linear-gradient(135deg,#EEF4FC,#D1EEFE)] px-5 py-4 text-left"
      >
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-ds-md bg-white shadow-[0_2px_8px_rgba(1,127,200,0.12)]">
          <Icon.Upload size={19} color="#017FC8" />
        </span>
        <span className="flex-1">
          <span className="block text-body font-boldNunito text-navy-800">
            Bulk invite via CSV
          </span>
          <span className="block text-caption text-brand-600">
            Drop a .csv here or click to browse — columns: employee_id, email, department
          </span>
        </span>
        <span className="hidden shrink-0 rounded-[9px] bg-brand-400 px-4 py-2 text-[13px] font-boldNunito text-white sm:block">
          Browse File
        </span>
      </button>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-[7px] rounded-[9px] border border-surface-line bg-white px-3 py-[7px] shadow-[0_1px_3px_rgba(20,27,52,0.04)]">
            <Icon.Search size={13} className="text-ink-400" />
            <input
              value={search}
              onChange={(e) => reset(setSearch)(e.target.value)}
              placeholder="Search employees…"
              aria-label="Search employees"
              className="w-[160px] border-none bg-transparent p-0 text-[13px] text-ink-600 focus:ring-0 sm:w-[200px]"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => reset(setDept)(e.target.value)}
            aria-label="Department filter"
            className="cursor-pointer rounded-[9px] border border-surface-line bg-white px-3 py-2 text-[13px] text-ink-600"
          >
            {employeeDepartments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => reset(setStatus)(e.target.value)}
            aria-label="Status filter"
            className="cursor-pointer rounded-[9px] border border-surface-line bg-white px-3 py-2 text-[13px] text-ink-600"
          >
            {employeeStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <SecondaryButton onClick={() => showToast("Export started — check your email")}>
            <Icon.Download size={13} />
            Export
          </SecondaryButton>
          <PrimaryButton onClick={() => open("invite")}>
            <Icon.Plus size={12} strokeWidth={2.5} />
            New Invite
          </PrimaryButton>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.length ? (
        <div className="flex flex-wrap items-center gap-4 rounded-ds-md bg-navy-800 px-[18px] py-3">
          <span className="text-[13px] font-boldNunito text-white">
            {selected.length} selected
          </span>
          <button
            type="button"
            onClick={() => showToast(`${selected.length} employees exported`)}
            className="cursor-pointer text-[12.5px] font-boldNunito text-brand-200"
          >
            Export selected
          </button>
          <button
            type="button"
            onClick={() =>
              open("confirm", {
                title: `Deactivate ${selected.length} employees?`,
                body: "They lose access at the end of the current billing period. Their individual TalkAM account and history stay with them.",
                confirmLabel: "Deactivate",
                toast: `${selected.length} employees deactivated`,
              })
            }
            className="cursor-pointer text-[12.5px] font-boldNunito text-[#FF9B9B]"
          >
            Deactivate selected
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="ml-auto cursor-pointer text-[12.5px] font-semiboldNunito text-white/50"
          >
            Clear
          </button>
        </div>
      ) : null}

      {/*
        The mock promised "session counts" here. A per-person session count is
        individual data the privacy rule forbids, so it is not shown — and this
        copy is corrected to match, rather than telling HR they can see something
        they cannot. See planning-docs/web-api/03-admin-dashboard.md §0.
      */}
      <InfoStrip tone="purple">
        <strong className="font-boldNunito">What you can see:</strong> who holds a seat,
        their department, and their invite status.{" "}
        <strong className="font-boldNunito">What you can never see:</strong> individual
        session counts, session content, chat messages, therapist notes, or community
        activity — even in aggregate below 5 users.
      </InfoStrip>

      {/* Table */}
      <PanelCard>
        <Table
          head={[
            <input
              key="all"
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleAll}
              aria-label="Select all visible employees"
              className="cursor-pointer rounded border-ink-300 text-brand-400 focus:ring-brand-400"
            />,
            "EMPLOYEE",
            "DEPARTMENT",
            "STATUS",
            "ROLE",
            "SEATED SINCE",
            "ACTIONS",
          ]}
        >
          {visible.map((e) => {
            return (
              <Tr key={e.id}>
                <Td>
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={() => toggleOne(e.id)}
                    aria-label={`Select ${e.id}`}
                    className="cursor-pointer rounded border-ink-300 text-brand-400 focus:ring-brand-400"
                  />
                </Td>
                <Td first>
                  <div className="text-[13px] font-boldNunito text-ink-800">{e.id}</div>
                  <div className="text-[11px] font-regularNunito text-ink-400">{e.email}</div>
                </Td>
                <Td>{e.department ?? "—"}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[e.status]} dot={e.status === "active"} className="capitalize">
                    {e.status}
                  </Badge>
                </Td>
                <Td className="capitalize">{e.role ?? "—"}</Td>
                <Td className="text-caption text-ink-500">{e.activated_at ?? "—"}</Td>
                <Td>
                  {e.status === "invited" ? (
                    <button
                      type="button"
                      disabled={resent.includes(e.id)}
                      onClick={async () => {
                        try {
                          await resendInvitation(e.invitation_id).unwrap();
                          setResent((p) => [...p, e.id]);
                          showToast(`Invite resent to ${e.email}`);
                        } catch {
                          showToast("Couldn't resend that invite — please try again");
                        }
                      }}
                      className={classNames(
                        "rounded-[7px] px-2.5 py-1.5 text-[11px] font-boldNunito",
                        resent.includes(e.id)
                          ? "cursor-default bg-wellness-50 text-wellness-600"
                          : "cursor-pointer bg-brand-25 text-brand-600 hover:bg-brand-50"
                      )}
                    >
                      {resent.includes(e.id) ? "Invite sent ✓" : "Resend invite"}
                    </button>
                  ) : e.status === "inactive" ? (
                    <button
                      type="button"
                      disabled={nudged.includes(e.id)}
                      onClick={async () => {
                        try {
                          await reactivate(e.member_id).unwrap();
                          setNudged((p) => [...p, e.id]);
                          showToast(`${e.id} reactivated`);
                        } catch {
                          showToast("No free seats — increase your seat count first");
                        }
                      }}
                      className={classNames(
                        "rounded-[7px] px-2.5 py-1.5 text-[11px] font-boldNunito",
                        nudged.includes(e.id)
                          ? "cursor-default bg-wellness-50 text-wellness-600"
                          : "cursor-pointer bg-gold-50 text-gold-600 hover:bg-gold-100"
                      )}
                    >
                      {nudged.includes(e.id) ? "Reactivated ✓" : "Reactivate"}
                    </button>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => open("employee", e)}
                        aria-label={`View ${e.id}`}
                        className="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-[7px] bg-surface-page hover:bg-ink-100"
                      >
                        <Icon.Eye size={12} className="text-ink-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          open("confirm", {
                            title: `Deactivate ${e.id}?`,
                            body: "They lose access at the end of the current billing period. Their individual TalkAM account and history stay with them.",
                            confirmLabel: "Deactivate",
                            toast: `${e.id} deactivated`,
                            onConfirm: () => deactivate(e.member_id).unwrap(),
                          })
                        }
                        aria-label={`Deactivate ${e.id}`}
                        className="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-[7px] bg-surface-errorTint hover:bg-[#FFE0E0]"
                      >
                        <Icon.Trash2 size={12} className="text-signal-error" />
                      </button>
                    </div>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-[#FAFAFA] px-5 py-3">
          <span className="text-caption text-ink-400">
            {filtered.length === 0
              ? "No employees match your filters"
              : `Showing ${(currentPage - 1) * EMPLOYEES_PER_PAGE + 1}–${Math.min(
                  currentPage * EMPLOYEES_PER_PAGE,
                  filtered.length
                )} of ${filtered.length} employees`}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] border border-surface-line bg-white disabled:opacity-40"
            >
              <Icon.ChevronLeft size={12} />
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                aria-current={currentPage === i + 1}
                className={classNames(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] text-[12px] font-boldNunito",
                  currentPage === i + 1
                    ? "bg-brand-400 text-white"
                    : "border border-surface-line bg-white text-ink-600"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              aria-label="Next page"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] border border-surface-line bg-white disabled:opacity-40"
            >
              <Icon.ChevronRight size={12} />
            </button>
          </div>
        </div>
      </PanelCard>
    </>
  );
};

const Reminders = () => {
  const { showToast } = useAdminModal();
  const [autoReminder, setAutoReminder] = useState(true);
  const [autoFollowup, setAutoFollowup] = useState(true);

  const { data: overview, isLoading } = useGetAdminOverviewQuery();
  const floor = overview?.cohort_floor ?? 5;

  return (
    <>
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">
          Automated Reminders
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          TalkAM sends these on your behalf — employees see them as in-app notifications
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-3">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">
                Reminder 24h before session
              </div>
              <div className="text-[10.5px] text-ink-400">
                Sent automatically to the employee only
              </div>
            </div>
            <Toggle
              on={autoReminder}
              label="24h reminder"
              onClick={() => {
                setAutoReminder((v) => !v);
                showToast(`24h reminders ${autoReminder ? "off" : "on"}`);
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">
                Follow-up nudge after a missed session
              </div>
              <div className="text-[10.5px] text-ink-400">
                Encourages rebooking within 48 hours
              </div>
            </div>
            <Toggle
              on={autoFollowup}
              label="Follow-up nudge"
              onClick={() => {
                setAutoFollowup((v) => !v);
                showToast(`Follow-up nudges ${autoFollowup ? "off" : "on"}`);
              }}
            />
          </div>
        </div>
      </Card>

      {/*
        The deck showed a per-session log here (employee · therapist · time ·
        status). Naming an employee alongside their therapist and appointment
        time is individual data, so this is served as a department rollup
        instead. See planning-docs/web-api/03-admin-dashboard.md §0.
      */}
      <PanelCard
        title="Sessions by Department"
        subtitle="Whether sessions happened — never who attended or what happened in them"
      >
        <Table head={["DEPARTMENT", "PEOPLE", "SESSIONS THIS MONTH", "STATUS"]}>
          {(overview?.departments ?? []).map((row) => (
            <Tr key={row.department}>
              <Td first>{row.department}</Td>
              <Td>{row.members}</Td>
              <Td className="text-caption text-ink-500">
                {row.suppressed ? "—" : row.value}
              </Td>
              <Td>
                <Badge tone={row.suppressed ? "gold" : "green"} className="capitalize">
                  {row.suppressed ? "Withheld" : "Reported"}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Table>

        {!isLoading && (overview?.departments ?? []).length === 0 ? (
          <div className="px-5 py-4 text-[12px] leading-[1.6] text-ink-400">
            No departments yet — assign departments when you invite people.
          </div>
        ) : null}

        <div className="border-t border-ink-100 bg-[#FAFAFA] px-5 py-3 text-[11px] leading-[1.6] text-ink-400">
          Departments with fewer than {floor} people are withheld so no individual can be
          identified.
        </div>
      </PanelCard>
    </>
  );
};

export const AdminEmployees = () => {
  const [tab, setTab] = useState("directory");

  return (
    <>
      <div className="flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-[11px] border border-surface-line bg-white p-1">
        {[
          { key: "directory", label: "Directory" },
          { key: "activity", label: "Session Reminders & Follow-ups" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={classNames(
              "whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-boldNunito transition-colors",
              tab === t.key ? "bg-brand-400 text-white" : "cursor-pointer text-ink-500"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "directory" ? <Directory /> : <Reminders />}
    </>
  );
};
