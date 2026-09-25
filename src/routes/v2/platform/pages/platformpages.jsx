import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import * as Icon from "react-feather";
import { V2 } from "../../../../constants/v2routes";
import {
  Card,
  PanelCard,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Table,
  Td,
  Tr,
  Toggle,
  InfoStrip,
  KpiCard,
  AdminSkeleton,
  Modal,
} from "../../../../components/v2/dashboard/chrome";
import { usePlatform } from "../platformlayout";
import { apiErrorMessage } from "../../business/auth/authlayout";
import {
  useGetPlatformDashboardQuery,
  useGetPlatformGrowthQuery,
  useGetPlatformBusinessesQuery,
  useGetPlatformBusinessQuery,
  useCreatePlatformBusinessMutation,
  useUpdatePlatformBusinessMutation,
  useSuspendPlatformBusinessMutation,
  useReactivatePlatformBusinessMutation,
  useGetPlatformBusinessEmployeesQuery,
  useGetPlatformBusinessEmployeeDetailQuery,
  useDeactivatePlatformEmployeeMutation,
  useReactivatePlatformEmployeeMutation,
  useInvitePlatformEmployeeMutation,
  useGetPlatformBusinessTherapistsQuery,
  useGetPlatformBusinessInvoicesQuery,
  useGetPlatformBusinessActivityQuery,
  useDeletePlatformBusinessMutation,
  useGetPlatformSessionsQuery,
  useGetPlatformBillingQuery,
  useGetPlatformPayoutsQuery,
  useProcessPlatformPayoutMutation,
  useProcessAllPlatformPayoutsMutation,
  useGetPlatformPayoutLastRunQuery,
  useResolvePlatformCommentReportMutation,
  useDeletePlatformCommentReportMutation,
  useGetPlatformCommunityOverviewQuery,
  useResolvePlatformGroupReportMutation,
  useSuspendPlatformGroupMutation,
  useBanPlatformGroupMutation,
  useReactivatePlatformGroupMutation,
  useDeletePlatformGroupMutation,
  useGetPlatformCommunityCategoriesQuery,
  useCreatePlatformGroupMutation,
  useGetPlatformGroupMembersQuery,
  useUpdatePlatformGroupMemberRoleMutation,
  useSuspendPlatformGroupMemberMutation,
  useGetPlatformGroupsQuery,
  useUpdatePlatformGroupMutation,
  useAddPlatformGroupMemberMutation,
  useRemovePlatformGroupMemberMutation,
  useGetPlatformGroupDetailQuery,
  useGetPlatformGroupReportsForGroupQuery,
  useGetPlatformCommentReportsForGroupQuery,
  useGetPlatformArticlesQuery,
  useCreatePlatformArticleMutation,
  useUpdatePlatformArticleMutation,
  useDeletePlatformArticleMutation,
  useGetPlatformDisputesQuery,
  useStartReviewPlatformDisputeMutation,
  useEscalatePlatformDisputeMutation,
  useResolvePlatformDisputeMutation,
  useGetPlatformFeedbackQuery,
  useResolvePlatformFeedbackMutation,
  useRespondPlatformFeedbackMutation,
  useGetPlatformDeactivationsQuery,
  useApprovePlatformDeactivationMutation,
  useRejectPlatformDeactivationMutation,
  useGetPlatformRolesQuery,
  useAssignPlatformRoleMutation,
  useRevokePlatformRoleMutation,
  useGetPlatformWaitlistQuery,
  useGetPlatformLegalDocumentQuery,
  useUpdatePlatformLegalDocumentMutation,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingMutation,
  useGetPlatformUsersQuery,
  useGetPlatformUserDetailQuery,
  useGetPlatformUserSessionsQuery,
  useGetPlatformUserMoodQuery,
  useGetPlatformUserCommunityQuery,
  useGetPlatformUserActivityQuery,
  useGetPlatformUserJourneyQuery,
  useSuspendPlatformUserMutation,
  useUnsuspendPlatformUserMutation,
  useBanPlatformUserMutation,
  useStrikePlatformUserMutation,
  useUpdatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useGetPlatformTherapistVerificationsQuery,
  useStartReviewPlatformApplicationMutation,
  useVerdictPlatformDocumentMutation,
  useApprovePlatformApplicationMutation,
  useRejectPlatformApplicationMutation,
  useGetPlatformPerformanceQuery,
  useUpdatePlatformPerformanceThresholdMutation,
  useSendPlatformTherapistWarningMutation,
  useHoldPlatformTherapistMutation,
  useClearHoldPlatformTherapistMutation,
  useReverifyPlatformTherapistMutation,
  useTerminatePlatformTherapistMutation,
  useGetPlatformActivityLogsQuery,
} from "../../../../services/v2/platformAdminApiSlice";

/* ── Shared bits ──────────────────────────────────────────────────────── */

const money = (n) =>
  `₦${Number(n ?? 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const when = (iso) => (iso ? new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "—");

/** A page-level "just launched" note for the two brand-new surfaces
 *  (disputes, settings) — real, just empty until it's used. */
const JustLaunched = ({ children }) => (
  <InfoStrip tone="blue" icon={<Icon.Info size={15} className="mt-px shrink-0 text-brand-400" />}>
    {children ?? "Just launched — data will build up here as it happens. This is real, not sample data."}
  </InfoStrip>
);

const EmptyRow = ({ span, children }) => (
  <tr>
    <td colSpan={span} className="px-4 py-8 text-center text-[12.5px] text-ink-400">
      {children}
    </td>
  </tr>
);

JustLaunched.propTypes = { children: PropTypes.node };
EmptyRow.propTypes = { span: PropTypes.number, children: PropTypes.node };

const SkeletonPanel = ({ rows = 4 }) => (
  <PanelCard>
    <div className="flex flex-col gap-2 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <AdminSkeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </PanelCard>
);

const KpiRow = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
);
KpiRow.propTypes = { children: PropTypes.node };
SkeletonPanel.propTypes = { rows: PropTypes.number };

const StatusBadge = ({ status }) => {
  const s = String(status ?? "").toLowerCase();
  const tone = ["completed", "resolved", "active", "paid", "confirmed", "approved"].includes(s)
    ? "green"
    : ["pending", "processing", "awaiting_approval", "inactive"].includes(s)
      ? "gold"
      : ["failed", "declined", "rejected", "cancelled", "disabled", "unresolved", "banned"].includes(s)
        ? "red"
        : "grey";
  return <Badge tone={tone}>{status ?? "—"}</Badge>;
};
StatusBadge.propTypes = { status: PropTypes.string };

/* ── 1. Dashboard ─────────────────────────────────────────────────────── */

export const PlatformDashboardPage = () => {
  const { data, isLoading } = useGetPlatformDashboardQuery();

  if (isLoading) return <KpiRow>{Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} className="h-32" />)}</KpiRow>;

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard dark icon={<Icon.Users size={17} className="text-gold-400" />} value={data?.users?.total ?? 0} label={`${data?.users?.new_this_month ?? 0} new this month`} />
        <KpiCard icon={<Icon.Briefcase size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={data?.organizations?.total ?? 0} label={`${data?.organizations?.active ?? 0} active`} />
        <KpiCard icon={<Icon.Calendar size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={data?.sessions?.completed_this_month ?? 0} label="Sessions completed this month" />
        <KpiCard icon={<Icon.DollarSign size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={money(data?.sessions?.revenue_this_month)} label="Session revenue this month" />
      </KpiRow>

      <Card>
        <div className="mb-3 text-body font-extraboldNunito text-navy-800">Open queues</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-[10px] bg-surface-page px-4 py-3">
            <span className="text-[13px] text-ink-600">Pending feedback</span>
            <Badge tone="gold">{data?.queues?.pending_feedback ?? 0}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-[10px] bg-surface-page px-4 py-3">
            <span className="text-[13px] text-ink-600">Pending deactivations</span>
            <Badge tone="gold">{data?.queues?.pending_deactivations ?? 0}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-[10px] bg-surface-page px-4 py-3">
            <span className="text-[13px] text-ink-600">Open disputes</span>
            <Badge tone="gold">{data?.queues?.open_disputes ?? 0}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ── 2. Growth ────────────────────────────────────────────────────────── */

export const PlatformGrowthPage = () => {
  const { data, isLoading } = useGetPlatformGrowthQuery("12w");

  if (isLoading) return <SkeletonPanel />;

  const maxSignups = Math.max(1, ...(data?.user_signups ?? []).map((w) => w.count));

  return (
    <div className="flex flex-col gap-5">
      <JustLaunched>
        A coarse funnel from real signup/session timestamps — not the full segment/cohort
        engine from the design mockup (that needs an events pipeline that doesn&apos;t exist yet).
      </JustLaunched>

      <KpiRow>
        <KpiCard icon={<Icon.UserPlus size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={data?.funnel?.signed_up ?? 0} label="Signed up (window)" />
        <KpiCard icon={<Icon.Calendar size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={data?.funnel?.booked_first_session ?? 0} label="Booked a first session" />
      </KpiRow>

      <PanelCard title="Weekly user signups">
        <div className="flex h-[160px] items-end gap-1.5 overflow-x-auto p-5">
          {(data?.user_signups ?? []).map((w) => (
            <div key={w.week_start} className="flex flex-1 min-w-[18px] flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-[4px] bg-brand-400"
                style={{ height: `${Math.max(4, (w.count / maxSignups) * 120)}px` }}
                title={`${w.week_start}: ${w.count}`}
              />
            </div>
          ))}
          {(data?.user_signups ?? []).length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-[12.5px] text-ink-400">No signups in this window yet.</div>
          ) : null}
        </div>
      </PanelCard>
    </div>
  );
};

/* ── 3. Businesses ────────────────────────────────────────────────────── */

const BUSINESS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending Setup" },
  { key: "suspended", label: "Suspended" },
];

const emptyOrgForm = { company_name: "", work_email: "", password: "", first_name: "", last_name: "", industry: "" };

export const PlatformBusinessesPage = () => {
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformBusinessesQuery({ tab: tab === "all" ? undefined : tab, search: search || undefined, page });
  const [createOrg, { isLoading: isCreating }] = useCreatePlatformBusinessMutation();
  const [deleteOrg] = useDeletePlatformBusinessMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyOrgForm);
  const [deleting, setDeleting] = useState(null);

  const rows = data?.organizations?.data ?? [];
  const overview = data?.overview ?? {};
  const tabCounts = { all: overview.total_orgs ?? 0, active: overview.setup_complete ?? 0, pending: overview.setup_pending ?? 0, suspended: overview.suspended ?? 0 };

  const submit = async () => {
    if (!form.company_name.trim() || !form.work_email.trim() || !form.password) return;
    try {
      await createOrg(form).unwrap();
      showToast("Organisation created");
      setForm(emptyOrgForm);
      setShowForm(false);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't create that organisation"));
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteOrg(deleting.id).unwrap();
      showToast("Organisation removed");
      setDeleting(null);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't remove that organisation"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.Briefcase size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={overview.total_orgs ?? 0} label="Total Orgs" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={overview.setup_complete ?? 0} label="Setup Complete" />
        <KpiCard icon={<Icon.Clock size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={overview.setup_pending ?? 0} label="Setup Pending" />
        <KpiCard icon={<Icon.Users size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={(overview.total_seats ?? 0).toLocaleString()} label="Total Seats" />
        <KpiCard icon={<Icon.DollarSign size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={money(overview.revenue_mtd)} label="Revenue MTD" />
      </KpiRow>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${tab === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
            >
              {t.label} ({tabCounts[t.key] ?? 0})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisations…"
            className="h-10 w-full max-w-[220px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
          />
          <PrimaryButton onClick={() => setShowForm((v) => !v)}>
            <Icon.Plus size={14} /> Add Organisation
          </PrimaryButton>
        </div>
      </div>

      {showForm ? (
        <Card>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input placeholder="Company name" value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Industry" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Admin work email" type="email" value={form.work_email} onChange={(e) => setForm((f) => ({ ...f, work_email: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Admin temporary password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Admin first name" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Admin last name" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
          </div>
          <p className="mb-3 text-[11.5px] text-ink-400">
            Creates the organisation and its first admin account, same as the self-serve signup — that admin gets a verification email next.
          </p>
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submit} disabled={isCreating || !form.company_name.trim() || !form.work_email.trim() || !form.password}>
              {isCreating ? "Creating…" : "Create organisation"}
            </PrimaryButton>
          </div>
        </Card>
      ) : null}

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Organisation", "Admin", "Seats", "Active", "Setup", "Billing", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={7}>No organisations found.</EmptyRow>
            ) : (
              rows.map((org) => (
                <Tr key={org.id}>
                  <Td first>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-extraboldNunito text-white" style={{ background: avatarColor(org.id) }}>
                        {initialsOfName(org.name)}
                      </span>
                      <div>
                        <div className="font-boldNunito text-ink-800">{org.name}</div>
                        <div className="text-[11px] font-normal text-ink-400">{org.industry || "—"}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{org.admin || "—"}</Td>
                  <Td>{org.seats_licensed ?? 0}</Td>
                  <Td>{org.active_members ?? 0}</Td>
                  <Td><Badge tone={org.setup_complete ? "green" : "gold"}>{org.setup_complete ? "Setup Complete" : "Pending Setup"}</Badge></Td>
                  <Td className="capitalize">{org.pay_method || "—"}</Td>
                  <Td>
                    <div className="flex gap-1">
                      <Link to={`${V2.platform}/businesses/${org.id}`} title="View" className="cursor-pointer rounded-[8px] p-1.5 text-brand-600 hover:bg-brand-25">
                        <Icon.Eye size={15} />
                      </Link>
                      <button type="button" title="Delete" onClick={() => setDeleting(org)} className="cursor-pointer rounded-[8px] p-1.5 text-signal-error hover:bg-surface-errorTint">
                        <Icon.Trash2 size={15} />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.organizations?.current_page ?? 1} lastPage={data?.organizations?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title={`Remove ${deleting?.name ?? "this organisation"}?`} width="max-w-[420px]">
        <p className="mb-4 text-[13px] leading-[1.6] text-ink-500">
          This removes the organisation and all its employees&apos; access. This cannot be undone from here.
        </p>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setDeleting(null)}>Cancel</SecondaryButton>
          <button type="button" onClick={confirmDelete} className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E]">
            Remove organisation
          </button>
        </div>
      </Modal>
    </div>
  );
};

/* ── 3b. Business Detail ──────────────────────────────────────────────── */

const ORG_TABS = [
  { key: "overview", label: "Overview" },
  { key: "employees", label: "Employees" },
  { key: "billing", label: "Billing" },
  { key: "activity", label: "Activity Log" },
];

const emptyEditOrgForm = { name: "", industry: "" };

export const PlatformBusinessDetailPage = () => {
  const { id } = useParams();
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("overview");
  const { data: org, isFetching } = useGetPlatformBusinessQuery(id);
  const [suspendOrg] = useSuspendPlatformBusinessMutation();
  const [reactivateOrg] = useReactivatePlatformBusinessMutation();
  const [updateOrg, { isLoading: isSaving }] = useUpdatePlatformBusinessMutation();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyEditOrgForm);

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  if (isFetching || !org) return <SkeletonPanel rows={6} />;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-[12px] text-ink-400">
        <Link to={`${V2.platform}/businesses`} className="font-boldNunito text-brand-400">← Businesses &amp; Organisations</Link>
        <span className="mx-1.5">/</span>{org.name}
      </div>

      <Card className="!p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link to={`${V2.platform}/businesses`} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-surface-page text-ink-500 hover:bg-ink-100">
              <Icon.ArrowLeft size={16} />
            </Link>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-extraboldNunito text-white" style={{ background: avatarColor(org.id) }}>
              {initialsOfName(org.name)}
            </span>
            <div>
              <div className="text-[18px] font-extraboldNunito leading-tight text-navy-800">{org.name}</div>
              <div className="text-[12px] text-ink-400">{org.industry || "—"} · Joined {fmtDate(org.created_at)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge tone={org.status === "active" ? "green" : org.status === "suspended" ? "red" : "grey"} className="capitalize">{org.status}</Badge>
            <Badge tone={org.setup_complete ? "green" : "gold"}>{org.setup_complete ? "Setup Complete" : "Pending Setup"}</Badge>
            {org.status === "suspended" ? (
              <button type="button" onClick={() => act(() => reactivateOrg(org.id).unwrap(), "Organisation reactivated")} className="cursor-pointer rounded-[10px] bg-wellness-25 px-4 py-2.5 text-[13px] font-boldNunito text-wellness-600 hover:bg-wellness-50">
                Reactivate
              </button>
            ) : (
              <button type="button" onClick={() => act(() => suspendOrg(org.id).unwrap(), "Organisation suspended")} className="cursor-pointer rounded-[10px] bg-gold-50 px-4 py-2.5 text-[13px] font-boldNunito text-gold-600 hover:bg-[#F3E4C4]">
                Suspend
              </button>
            )}
            <PrimaryButton onClick={() => { setForm({ name: org.name, industry: org.industry || "" }); setEditing(true); }}>Edit Org</PrimaryButton>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 border-b border-surface-line">
        {ORG_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`cursor-pointer border-b-2 px-3 py-2.5 text-[12.5px] font-boldNunito ${tab === t.key ? "border-brand-400 text-brand-600" : "border-transparent text-ink-400"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? <OrgOverviewTab org={org} /> : null}
      {tab === "employees" ? <OrgEmployeesTab id={id} /> : null}
      {tab === "billing" ? <OrgBillingTab id={id} org={org} /> : null}
      {tab === "activity" ? <OrgActivityTab id={id} /> : null}

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit organisation" width="max-w-[420px]">
        <div className="mb-3">
          <label className="mb-1.5 block text-[11px] font-boldNunito text-ink-400">Name</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-boldNunito text-ink-400">Industry</label>
          <input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
          <PrimaryButton
            disabled={isSaving || !form.name.trim()}
            onClick={() => act(() => updateOrg({ id: org.id, ...form }).unwrap(), "Organisation updated").then(() => setEditing(false))}
          >
            {isSaving ? "Saving…" : "Save"}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};

/** Label-left/value-right row, bordered between rows — distinct from
 *  Field (stacked label-above-value), which the User Detail page's own
 *  mockup uses instead. Two different card designs from two different
 *  mockup pages, so this stays local to the org detail cards. */
const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 border-b border-[#F5F5F5] py-2.5 text-[13px] last:border-b-0">
    <span className="text-ink-500">{label}</span>
    <span className="font-boldNunito text-navy-800">{children}</span>
  </div>
);
InfoRow.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };

const OrgOverviewTab = ({ org }) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div className="flex flex-col gap-4 lg:col-span-1">
      <Card>
        <CardHeading>Organisation details</CardHeading>
        <InfoRow label="Admin Name">{org.admin || "—"}</InfoRow>
        <InfoRow label="Admin Email">{org.admin_email || "—"}</InfoRow>
        <InfoRow label="Industry">{org.industry || "—"}</InfoRow>
        {org.admin_country ? <InfoRow label="Admin's country">{org.admin_country}</InfoRow> : null}
        <InfoRow label="Billing Model">{org.pay_method ? <span className="capitalize">{org.pay_method}</span> : "—"}</InfoRow>
        <InfoRow label="Plan">{org.plan ? `${org.plan.planName} · ${org.plan.seats} seats` : "—"}</InfoRow>
      </Card>

      <Card>
        <CardHeading>Financials</CardHeading>
        <InfoRow label="Sessions This Month">{org.sessions_this_month}</InfoRow>
        <InfoRow label={`Amount Due${org.amount_due_period ? ` (${org.amount_due_period})` : ""}`}>{money(org.amount_due)}</InfoRow>
        <InfoRow label="Payment Method">{org.payment_method_display || "Not on file"}</InfoRow>
      </Card>
    </div>

    <div className="flex flex-col gap-4 lg:col-span-2">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Seats Licensed" value={org.seats_licensed ?? 0} sub={`${org.active_members ?? 0} in use`} />
        <StatCard label="Active Employees" value={org.active_members ?? 0} sub="This month" subTone="blue" />
        <StatCard label="Therapists" value={org.therapist_count ?? 0} sub="Network + invited" />
        <StatCard label="Utilisation" value={`${org.utilisation_percent ?? 0}%`} sub="Seats used / licensed" />
      </div>

      <PanelCard title="Therapist Network Access">
        <OrgTherapistList id={org.id} />
      </PanelCard>
    </div>
  </div>
);
OrgOverviewTab.propTypes = { org: PropTypes.object.isRequired };

const ACCESS_TONE = { Network: "green", "B2B-Invited": "gold" };

/** Prev/Next pager — no paginated list anywhere in this deck had more than
 *  one page until this one, so nothing reusable existed yet. */
const Pager = ({ page, lastPage, onChange }) => {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-[#F5F5F5] px-5 py-3">
      <span className="text-[11.5px] text-ink-400">Page {page} of {lastPage}</span>
      <div className="flex gap-1.5">
        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</SecondaryButton>
        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Next →</SecondaryButton>
      </div>
    </div>
  );
};
Pager.propTypes = { page: PropTypes.number.isRequired, lastPage: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired };

const OrgTherapistList = ({ id }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformBusinessTherapistsQuery({ id, page });
  const rows = data?.data ?? [];

  if (isFetching) return <div className="p-5"><AdminSkeleton className="h-24 w-full" /></div>;
  if (rows.length === 0) return <div className="p-6 text-center text-[12.5px] text-ink-400">No therapists linked to this organisation yet.</div>;

  return (
    <div className="flex flex-col">
      {rows.map((t) => (
        <div key={t.id} className="flex items-center justify-between border-b border-[#F5F5F5] px-5 py-3 last:border-b-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white" style={{ background: avatarColor(t.id.length) }}>
              {initialsOfName(t.name || "?")}
            </span>
            <div>
              <div className="text-[13px] font-boldNunito text-ink-800">{t.name || "—"}</div>
              <div className="text-[11px] text-ink-400">{t.email}</div>
            </div>
          </div>
          <Badge tone={ACCESS_TONE[t.access] ?? "grey"}>{t.access}</Badge>
        </div>
      ))}
      <Pager page={data.current_page} lastPage={data.last_page} onChange={setPage} />
    </div>
  );
};
OrgTherapistList.propTypes = { id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired };

const PLATFORM_TONE = { Both: "gold", Mobile: "blue", Web: "purple" };
const emptyInviteForm = { email: "", role: "employee", department: "" };

/** List identity is deliberately anonymised (see PlatformBusinessService::
 *  employees()'s docblock) — staff monitor patterns, not who's who. */
const employeeAvatarColor = (id) => avatarColor(parseInt(id.replace(/\D/g, ""), 10) || 0);

const OrgEmployeesTab = ({ id }) => {
  const { showToast } = usePlatform();
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformBusinessEmployeesQuery({ id, page });
  const [deactivateEmployee] = useDeactivatePlatformEmployeeMutation();
  const [reactivateEmployee] = useReactivatePlatformEmployeeMutation();
  const [inviteEmployee, { isLoading: isInviting }] = useInvitePlatformEmployeeMutation();

  const [viewing, setViewing] = useState(null); // member_id
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState(emptyInviteForm);

  const rows = data?.data ?? [];
  const activeCount = rows.filter((e) => e.status === "active").length;

  const remove = async (memberId) => {
    try {
      await deactivateEmployee({ id, memberId }).unwrap();
      showToast("Employee deactivated");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't deactivate that employee"));
    }
  };

  const restore = async (memberId) => {
    try {
      await reactivateEmployee({ id, memberId }).unwrap();
      showToast("Employee reactivated");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't reactivate that employee"));
    }
  };

  const sendInvite = async () => {
    if (!form.email.trim()) return;
    try {
      await inviteEmployee({ id, invites: [form] }).unwrap();
      showToast("Invitation sent");
      setForm(emptyInviteForm);
      setInviting(false);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't send that invite"));
    }
  };

  const exportCsv = () => {
    const header = "ID,Platform,Status,Sessions Used,Sessions Cap\n";
    const body = rows.map((e) => `${e.id},${e.platform},${e.status},${e.sessions_used ?? ""},${e.sessions_cap ?? ""}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isFetching) return <SkeletonPanel />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[15px] font-extraboldNunito text-navy-800">{activeCount} active employees (this page)</span>
        <div className="flex gap-2">
          <SecondaryButton onClick={exportCsv}>Export CSV</SecondaryButton>
          <PrimaryButton onClick={() => setInviting(true)}><Icon.Plus size={14} /> Invite Employee</PrimaryButton>
        </div>
      </div>

      <PanelCard>
        <Table head={["Employee", "Platform", "Status", "Sessions Used", "Actions"]}>
          {rows.length === 0 ? (
            <EmptyRow span={5}>No employees yet.</EmptyRow>
          ) : (
            rows.map((e) => (
              <Tr key={e.id}>
                <Td first>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white" style={{ background: employeeAvatarColor(e.id) }}>
                      {e.id.slice(-2)}
                    </span>
                    <div>
                      <div className="font-boldNunito text-ink-800">Employee {e.id.replace('EMP-', '#')}</div>
                      <div className="text-[11px] font-normal text-ink-400">Anonymised ID</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge tone={PLATFORM_TONE[e.platform] ?? "grey"}>{e.platform}</Badge></Td>
                <Td><StatusBadge status={e.status} /></Td>
                <Td>{e.sessions_used !== null ? `${e.sessions_used} / ${e.sessions_cap ?? "∞"}` : "—"}</Td>
                <Td>
                  <div className="flex gap-1">
                    <button type="button" title="View" onClick={() => setViewing(e.member_id)} className="cursor-pointer rounded-[8px] p-1.5 text-brand-600 hover:bg-brand-25">
                      <Icon.Eye size={15} />
                    </button>
                    {e.role !== "admin" ? (
                      e.status === "inactive" ? (
                        <button type="button" title="Reactivate" onClick={() => restore(e.member_id)} className="cursor-pointer rounded-[8px] p-1.5 text-wellness-600 hover:bg-wellness-25">
                          <Icon.RotateCcw size={15} />
                        </button>
                      ) : (
                        <button type="button" title="Deactivate" onClick={() => remove(e.member_id)} className="cursor-pointer rounded-[8px] p-1.5 text-signal-error hover:bg-surface-errorTint">
                          <Icon.Trash2 size={15} />
                        </button>
                      )
                    ) : null}
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Table>
        <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
      </PanelCard>

      <EmployeeDetailModal id={id} memberId={viewing} onClose={() => setViewing(null)} />

      <Modal open={inviting} onClose={() => setInviting(false)} title="Invite employee" width="max-w-[400px]">
        <div className="mb-3">
          <input type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <div className="mb-3">
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]">
            <option value="employee">Employee</option>
            <option value="therapist">Therapist (employer-vouched)</option>
          </select>
        </div>
        <div className="mb-4">
          <input placeholder="Department (optional)" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setInviting(false)}>Cancel</SecondaryButton>
          <PrimaryButton disabled={isInviting || !form.email.trim()} onClick={sendInvite}>{isInviting ? "Sending…" : "Send invite"}</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
OrgEmployeesTab.propTypes = { id: PropTypes.string.isRequired };

const EmployeeDetailModal = ({ id, memberId, onClose }) => {
  const { data, isFetching } = useGetPlatformBusinessEmployeeDetailQuery({ id, memberId }, { skip: !memberId });
  const maxCount = Math.max(1, ...(data?.monthly_sessions ?? []).map((m) => m.count));

  return (
    <Modal open={!!memberId} onClose={onClose} title={data ? `Employee ${data.id.replace('EMP-', '#')}` : "Employee"} subtitle="Anonymised ID" width="max-w-[440px]">
      {isFetching || !data ? (
        <AdminSkeleton className="h-40 w-full" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-[13px]"><span className="text-ink-400">Role</span><Badge tone={ROLE_TONE[data.role] ?? "grey"} className="capitalize">{data.role}</Badge></div>
          <div className="flex justify-between text-[13px]"><span className="text-ink-400">Status</span><StatusBadge status={data.status} /></div>
          <div className="flex justify-between text-[13px]"><span className="text-ink-400">This cycle</span><span className="font-boldNunito text-navy-800">{data.sessions_this_cycle ? `${data.sessions_this_cycle.used} / ${data.sessions_this_cycle.cap}` : "—"}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-ink-400">Avg / month</span><span className="font-boldNunito text-navy-800">{data.avg_sessions_per_month}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-ink-400">Last session</span><span className="font-boldNunito text-navy-800">{data.last_active ? when(data.last_active) : "—"}</span></div>
          <div className="mt-2">
            <div className="mb-1.5 text-[11px] font-boldNunito text-ink-400">SESSIONS PER MONTH</div>
            <div className="flex h-[50px] items-end gap-1.5">
              {(data.monthly_sessions ?? []).map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-[3px] bg-brand-400" style={{ height: `${Math.max(4, (m.count / maxCount) * 40)}px` }} />
                  <span className="text-[9.5px] text-ink-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
EmployeeDetailModal.propTypes = { id: PropTypes.string.isRequired, memberId: PropTypes.number, onClose: PropTypes.func.isRequired };

const ROLE_TONE = { admin: "purple", employee: "blue", therapist: "green" };

const OrgBillingTab = ({ id, org }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformBusinessInvoicesQuery({ id, page });
  const rows = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      {org.plan ? (
        <PanelCard title="Current plan" subtitle={org.plan.renews}>
          <div className="px-5 py-4">
            <div className="mb-3 text-[15px] font-extraboldNunito text-navy-800">{org.plan.planName}</div>
            {(org.plan.lines ?? []).map((l) => (
              <div key={l.label} className="flex items-center justify-between border-b border-[#F5F5F5] py-2 text-[13px] last:border-b-0">
                <span className="text-ink-500">{l.label}</span>
                <span className="font-boldNunito text-ink-800">{l.value}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between pt-2 text-[14px]">
              <span className="font-boldNunito text-navy-800">Total</span>
              <span className="font-extraboldNunito text-navy-800">{org.plan.total}</span>
            </div>
          </div>
        </PanelCard>
      ) : null}

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard title="Invoices">
          <Table head={["Reference", "Period", "Amount", "Status", "Due"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No invoices yet.</EmptyRow>
            ) : (
              rows.map((inv) => (
                <Tr key={inv.id}>
                  <Td first>{inv.reference}</Td>
                  <Td>{fmtDate(inv.period_start)} – {fmtDate(inv.period_end)}</Td>
                  <Td>{money(inv.amount)}</Td>
                  <Td><StatusBadge status={inv.status} /></Td>
                  <Td>{inv.due_at ? fmtDate(inv.due_at) : "—"}</Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};
OrgBillingTab.propTypes = { id: PropTypes.string.isRequired, org: PropTypes.object.isRequired };

const OrgActivityTab = ({ id }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformBusinessActivityQuery({ id, page });
  const rows = data?.data ?? [];

  if (isFetching) return <SkeletonPanel />;

  return (
    <PanelCard>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-[12.5px] text-ink-400">
          No activity logged for this organisation yet — actions taken from this page (suspend, reactivate) will start appearing here.
        </div>
      ) : (
        <>
          <Table head={["Event", "Title", "Description", "By", "When"]}>
            {rows.map((log) => (
              <Tr key={log.id}>
                <Td first className="capitalize">{log.event}</Td>
                <Td>{log.title}</Td>
                <Td className="max-w-[320px] truncate">{log.description}</Td>
                <Td>{log.user ? `${log.user.first_name} ${log.user.last_name}` : "System"}</Td>
                <Td>{when(log.created_at)}</Td>
              </Tr>
            ))}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </>
      )}
    </PanelCard>
  );
};
OrgActivityTab.propTypes = { id: PropTypes.string.isRequired };

/* ── 4. Sessions ──────────────────────────────────────────────────────── */

const SESSION_TABS = [
  { key: "", label: "All" },
  { key: "mobile", label: "Mobile" },
  { key: "b2b", label: "B2B Web" },
];

const SESSION_STATUS_META = {
  completed: { label: "Completed", tone: "green" },
  in_progress: { label: "Live", tone: "green" },
  confirmed: { label: "Upcoming", tone: "blue" },
  pending_payment: { label: "Upcoming", tone: "blue" },
  cancelled: { label: "Cancelled", tone: "red" },
  failed: { label: "Failed", tone: "red" },
  expired: { label: "Expired", tone: "grey" },
  no_show: { label: "No-show", tone: "grey" },
};

const sessionWhen = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-NG", { month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
};

export const PlatformSessionsPage = () => {
  const [tab, setTab] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformSessionsQuery({ coverage_group: tab || undefined, page });
  const rows = data?.sessions?.data ?? [];
  const overview = data?.overview ?? {};

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.Calendar size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={overview.total_mtd ?? 0} label="Total Sessions MTD">
          <div className="text-[11px] text-ink-400">{overview.date_range_label ?? "—"}</div>
        </KpiCard>
        <KpiCard icon={<Icon.Radio size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={overview.live_now ?? 0} label="Live Now">
          <div className="text-[11px] text-ink-400">Active session rooms</div>
        </KpiCard>
        <KpiCard icon={<Icon.XCircle size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview.cancelled_mtd ?? 0} label="Cancelled">
          <div className="text-[11px] text-ink-400">{overview.cancellation_rate_percent ?? 0}% cancellation rate</div>
        </KpiCard>
        <KpiCard icon={<Icon.Star size={17} className="text-gold-500" />} iconBg="bg-gold-50" value={overview.avg_rating ? `${overview.avg_rating}★` : "—"} label="Avg Rating">
          <div className="text-[11px] text-ink-400">Across all completed sessions</div>
        </KpiCard>
      </KpiRow>

      <div className="flex flex-wrap gap-2">
        {SESSION_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${tab === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Session ID", "Client", "Therapist", "Type", "Date", "Status", "Rating"]}>
            {rows.length === 0 ? (
              <EmptyRow span={7}>No sessions found.</EmptyRow>
            ) : (
              rows.map((s) => {
                const meta = SESSION_STATUS_META[s.status] ?? { label: s.status, tone: "grey" };
                return (
                  <Tr key={s.id}>
                    <Td first className="!font-boldNunito !text-brand-600">{s.reference}</Td>
                    <Td>{s.client ?? "—"}</Td>
                    <Td>{s.therapist ?? "—"}</Td>
                    <Td><Badge tone={s.is_b2b ? "gold" : "purple"}>{s.is_b2b ? "B2B" : "Mobile"}</Badge></Td>
                    <Td>{sessionWhen(s.starts_at)}</Td>
                    <Td><Badge tone={meta.tone}>{meta.label}</Badge></Td>
                    <Td>{s.rating ? s.rating.toFixed(1) : "—"}</Td>
                  </Tr>
                );
              })
            )}
          </Table>
          <Pager page={data?.sessions?.current_page ?? 1} lastPage={data?.sessions?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};

/* ── 5. Billing ───────────────────────────────────────────────────────── */

export const PlatformBillingPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPlatformBillingQuery(page);
  const overview = data?.overview;
  const invoices = data?.invoices?.data ?? [];

  if (isLoading) return <KpiRow>{Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} className="h-32" />)}</KpiRow>;

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard dark icon={<Icon.DollarSign size={17} className="text-gold-400" />} value={money(overview?.mrr)} label="MRR (this month)" />
        <KpiCard icon={<Icon.TrendingUp size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={money(overview?.arr)} label="ARR (projected)" />
        <KpiCard icon={<Icon.Percent size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={`${overview?.take_rate_percent ?? 0}%`} label="Platform take rate" />
        <KpiCard icon={<Icon.AlertCircle size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview?.overdue_invoices ?? 0} label="Overdue invoices" />
      </KpiRow>

      <PanelCard title="Organization invoices">
        <Table head={["Organization", "Period", "Amount", "Status", "Due"]}>
          {invoices.length === 0 ? (
            <EmptyRow span={5}>No invoices yet.</EmptyRow>
          ) : (
            invoices.map((inv) => (
              <Tr key={inv.id}>
                <Td first>{inv.organization?.name ?? "—"}</Td>
                <Td>{inv.period_start} → {inv.period_end}</Td>
                <Td>{money(inv.amount)}</Td>
                <Td><StatusBadge status={inv.status} /></Td>
                <Td>{inv.due_at ? new Date(inv.due_at).toLocaleDateString() : "—"}</Td>
              </Tr>
            ))
          )}
        </Table>
        <Pager page={data?.invoices?.current_page ?? 1} lastPage={data?.invoices?.last_page ?? 1} onChange={setPage} />
      </PanelCard>
    </div>
  );
};

/* ── 6. Payouts ───────────────────────────────────────────────────────── */

const PAYOUT_TABS = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
  { key: "b2b_invited", label: "B2B-Invited" },
];

const PAYOUT_TYPE_TONE = { Network: "green", "B2B-Invited": "gold" };

export const PlatformPayoutsPage = () => {
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("pending");
  const [page, setPage] = useState(1);
  const { data, isFetching, refetch } = useGetPlatformPayoutsQuery({ tab, page });
  const [processPayout, { isLoading: isProcessingOne }] = useProcessPlatformPayoutMutation();
  const [processAll, { isLoading: isQueuing }] = useProcessAllPlatformPayoutsMutation();
  const [processingId, setProcessingId] = useState(null);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [watchingRun, setWatchingRun] = useState(false);

  // Process All is queued (see ProcessAllPayoutsJob) — an admin bulk action
  // that fires a real outbound Flutterwave call per therapist has no
  // business blocking the request. Poll for the result while a run is in
  // flight instead of waiting on the original request.
  const { data: lastRun } = useGetPlatformPayoutLastRunQuery(undefined, {
    pollingInterval: watchingRun ? 2000 : 0,
  });

  useEffect(() => {
    if (watchingRun && lastRun?.status === "completed") {
      setWatchingRun(false);
      showToast(`Batch complete — ${lastRun.processed} payout${lastRun.processed === 1 ? "" : "s"} initiated${lastRun.failed ? `, ${lastRun.failed} failed` : ""}`);
      refetch();
    }
  }, [watchingRun, lastRun, showToast, refetch]);

  const overview = data?.overview ?? {};
  const rows = data?.payouts?.data ?? [];
  const tabCounts = overview.tab_counts ?? {};
  const fw = overview.flutterwave ?? {};

  const doProcess = async (therapistId) => {
    setProcessingId(therapistId);
    try {
      await processPayout(therapistId).unwrap();
      showToast("Payout initiated via Flutterwave");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't process that payout"));
    } finally {
      setProcessingId(null);
    }
  };

  const doProcessAll = async () => {
    try {
      await processAll().unwrap();
      showToast("Payout run queued — processing in the background");
      setConfirmingAll(false);
      setWatchingRun(true);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't queue the payout batch"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5 shadow-[0_4px_16px_rgba(20,27,52,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-400/[0.14]">
              <Icon.DollarSign size={18} className="text-brand-400" />
            </span>
            <div>
              <div className="text-[15px] font-extraboldNunito text-white">Next Payout Run: {fmtDate(overview.next_payout_date)}</div>
              <div className="text-[11.5px] text-white/50">
                Runs every {overview.next_payout_date ? new Date(overview.next_payout_date).toLocaleDateString("en-NG", { weekday: "long" }) : "week"}. Mon–Sun sessions aggregated, disbursed via Flutterwave bank transfer.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone={fw.webhooks_active ? "green" : "grey"} dot>
              {fw.connected ? `Flutterwave Connected (${fw.mode})` : "Flutterwave Not Connected"} · Webhooks {fw.webhooks_active ? "Active" : "Idle"}
            </Badge>
            {watchingRun ? (
              <Badge tone="gold" dot>Batch running…</Badge>
            ) : null}
            <PrimaryButton disabled={!overview.pending_total || watchingRun} onClick={() => setConfirmingAll(true)}>
              Process All {money(overview.pending_total)} →
            </PrimaryButton>
          </div>
        </div>
      </div>

      <KpiRow>
        <KpiCard icon={<Icon.Clock size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={money(overview.pending_total)} label="Pending This Run" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={money(overview.processed_this_month)} label="Processed This Month" />
        <KpiCard icon={<Icon.AlertCircle size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview.open_disputes ?? 0} label="Open Disputes" />
        <KpiCard icon={<Icon.Zap size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={fw.mode === "sandbox" ? "Sandbox" : fw.connected ? "Live ✓" : "Off"} label="Flutterwave Status" />
      </KpiRow>

      <div className="flex flex-wrap gap-2">
        {PAYOUT_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${tab === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
          >
            {t.label} ({tabCounts[t.key] ?? 0})
          </button>
        ))}
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : tab === "pending" ? (
        <PanelCard title="Pending Payouts">
          <Table head={["Therapist", "Sessions", "Amount Due", "Bank", "Type", "Action"]}>
            {rows.length === 0 ? (
              <EmptyRow span={6}>No pending payouts.</EmptyRow>
            ) : (
              rows.map((r) => (
                <Tr key={r.therapist_id}>
                  <Td first>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white" style={{ background: avatarColor(r.therapist_id) }}>
                        {initialsOfName(r.name || "?")}
                      </span>
                      <div>
                        <div className="font-boldNunito text-ink-800">Dr. {r.name || "—"}</div>
                        <div className="text-[11px] font-normal text-ink-400">{r.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{r.sessions}</Td>
                  <Td>{money(r.amount_due)}</Td>
                  <Td>{r.bank || <span className="text-signal-error">No account on file</span>}</Td>
                  <Td><Badge tone={PAYOUT_TYPE_TONE[r.type] ?? "grey"}>{r.type}</Badge></Td>
                  <Td>
                    <SecondaryButton
                      className="!px-2.5 !py-1 !text-[11px]"
                      disabled={!r.has_payout_account || (isProcessingOne && processingId === r.therapist_id)}
                      onClick={() => doProcess(r.therapist_id)}
                    >
                      {isProcessingOne && processingId === r.therapist_id ? "Processing…" : "Process"}
                    </SecondaryButton>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.payouts?.current_page ?? 1} lastPage={data?.payouts?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      ) : tab === "b2b_invited" ? (
        <PanelCard title="B2B-Invited Therapists">
          <Table head={["Therapist", "Organisation", "Note"]}>
            {rows.length === 0 ? (
              <EmptyRow span={3}>No B2B-invited therapists.</EmptyRow>
            ) : (
              rows.map((r) => (
                <Tr key={r.id}>
                  <Td first>{r.name || "—"} <span className="font-normal text-ink-400">· {r.email}</span></Td>
                  <Td>{r.organization || "—"}</Td>
                  <Td className="text-ink-400">{r.note}</Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.payouts?.current_page ?? 1} lastPage={data?.payouts?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      ) : (
        <PanelCard>
          <Table head={["Reference", "Therapist", "Amount", "Provider", "Status", "Completed"]}>
            {rows.length === 0 ? (
              <EmptyRow span={6}>No payouts here yet.</EmptyRow>
            ) : (
              rows.map((p) => (
                <Tr key={p.id}>
                  <Td first>{p.provider_ref}</Td>
                  <Td>Dr. {p.name || "—"}</Td>
                  <Td>{money(p.amount)}</Td>
                  <Td className="capitalize">{p.provider}</Td>
                  <Td><StatusBadge status={p.status} /></Td>
                  <Td>{p.completed_at ? when(p.completed_at) : "—"}</Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.payouts?.current_page ?? 1} lastPage={data?.payouts?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}

      <Modal open={confirmingAll} onClose={() => setConfirmingAll(false)} title="Process all pending payouts?" width="max-w-[440px]">
        <p className="mb-4 text-[13px] leading-[1.6] text-ink-500">
          This initiates a real Flutterwave transfer (sandbox) for every therapist with a positive balance and a bank
          account on file — {money(overview.pending_total)} across {overview.pending_therapist_count ?? 0} therapist{overview.pending_therapist_count === 1 ? "" : "s"}. This cannot be undone from here.
        </p>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setConfirmingAll(false)}>Cancel</SecondaryButton>
          <PrimaryButton disabled={isQueuing} onClick={doProcessAll}>{isQueuing ? "Queuing…" : "Process all"}</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};

/* ── 7. Community ─────────────────────────────────────────────────────── */

const GROUP_STATUS_META = {
  Active: { label: "Active", tone: "green" },
  Suspended: { label: "Suspended", tone: "gold" },
  Banned: { label: "Banned", tone: "red" },
};

const reporterName = (r) => (r.user?.first_name ? `${r.user.first_name} ${r.user.last_name ?? ""}`.trim() : "—");

const ADMIN_ASSIGNABLE_GROUP_ROLES = ["Admin", "Community Manager", "Moderator", "Member"];

const MEMBER_STATUS_TONE = { Active: "green", Suspended: "gold" };

export const PlatformCommunityPage = () => {
  const { showToast } = usePlatform();
  const [allGroupsPage, setAllGroupsPage] = useState(1);
  const [allGroupsSearch, setAllGroupsSearch] = useState("");
  const [allGroupsStatus, setAllGroupsStatus] = useState("");

  const { data: overview } = useGetPlatformCommunityOverviewQuery();
  const allGroups = useGetPlatformGroupsQuery({ page: allGroupsPage, search: allGroupsSearch || undefined, status: allGroupsStatus || undefined });
  const { data: categories } = useGetPlatformCommunityCategoriesQuery();

  const [suspendGroup] = useSuspendPlatformGroupMutation();
  const [banGroup] = useBanPlatformGroupMutation();
  const [reactivateGroup] = useReactivatePlatformGroupMutation();
  const [deleteGroup] = useDeletePlatformGroupMutation();
  const [createGroup, { isLoading: creatingGroupSaving }] = useCreatePlatformGroupMutation();

  const [groupAction, setGroupAction] = useState(null); // { group, mode: "suspend" | "ban" | "delete" }
  const [actionReason, setActionReason] = useState("");
  const [suspendUntil, setSuspendUntil] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", category_id: "", description: "", owner_email: "", group_access: "Opened" });

  const act = async (fn, okMsg) => {
    try {
      await fn().unwrap();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through — please try again"));
    }
  };

  const openGroupAction = (group, mode) => {
    setGroupAction({ group, mode });
    setActionReason("");
    setSuspendUntil(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  };

  const submitGroupAction = async () => {
    if (!groupAction) return;
    const groupId = groupAction.group?.id;
    if (groupAction.mode === "suspend") {
      await act(() => suspendGroup({ groupId, reason: actionReason, suspend_until: suspendUntil }), "Group suspended");
    } else if (groupAction.mode === "ban") {
      await act(() => banGroup({ groupId, reason: actionReason }), "Group banned");
    } else {
      await act(() => deleteGroup(groupId), "Group deleted");
    }
    setGroupAction(null);
  };

  const openCreateGroup = () => {
    setNewGroup({ name: "", category_id: categories?.[0]?.id ?? "", description: "", owner_email: "", group_access: "Opened" });
    setCreatingGroup(true);
  };

  const submitCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.category_id || !newGroup.owner_email.trim()) return;
    try {
      await createGroup(newGroup).unwrap();
      showToast("Group created");
      setCreatingGroup(false);
    } catch (err) {
      showToast(apiErrorMessage(err, "That didn't go through — check the owner's email and try again"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.Users size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={overview?.total_groups ?? 0} label="Total Groups" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={overview?.active_groups ?? 0} label="Active Groups" />
        <KpiCard icon={<Icon.AlertTriangle size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={overview?.flagged_groups ?? 0} label="Flagged Groups" />
        <KpiCard icon={<Icon.Flag size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview?.suspended_groups ?? 0} label="Suspended / Banned" />
      </KpiRow>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={allGroupsSearch}
            onChange={(e) => { setAllGroupsSearch(e.target.value); setAllGroupsPage(1); }}
            placeholder="Search by name, description, creator…"
            className="h-10 min-w-[220px] flex-1 rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
          />
          <select
            value={allGroupsStatus}
            onChange={(e) => { setAllGroupsStatus(e.target.value); setAllGroupsPage(1); }}
            className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Banned">Banned</option>
          </select>
        </div>
        <PrimaryButton onClick={openCreateGroup}><Icon.Plus size={14} /> Create Group</PrimaryButton>
      </div>

      {allGroups.isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Group", "Category", "Owner", "Members", "Open Reports", "Status", "Actions"]}>
            {(allGroups.data?.data ?? []).length === 0 ? (
              <EmptyRow span={7}>No groups found.</EmptyRow>
            ) : (
              (allGroups.data?.data ?? []).map((g) => {
                const gMeta = GROUP_STATUS_META[g.status] ?? { label: g.status ?? "—", tone: "grey" };
                return (
                  <Tr key={g.id}>
                    <Td first>
                      <Link to={`${V2.platform}/community/groups/${g.id}`} className="font-boldNunito text-brand-600 hover:underline">{g.name}</Link>
                    </Td>
                    <Td>{g.category?.name ?? "—"}</Td>
                    <Td>{g.creator ? `${g.creator.first_name} ${g.creator.last_name ?? ""}`.trim() : "—"}</Td>
                    <Td>{g.members_count ?? 0}</Td>
                    <Td>{g.open_report_count ?? 0}</Td>
                    <Td><Badge tone={gMeta.tone}>{gMeta.label}</Badge></Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {g.status === "Active" ? (
                          <>
                            <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => openGroupAction(g, "suspend")}>Suspend</SecondaryButton>
                            <SecondaryButton className="!px-2.5 !py-1 !text-[11px] !text-signal-error" onClick={() => openGroupAction(g, "ban")}>Ban</SecondaryButton>
                          </>
                        ) : (
                          <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => reactivateGroup(g.id), "Group reactivated")}>Reactivate</SecondaryButton>
                        )}
                        <Link to={`${V2.platform}/community/groups/${g.id}`} className="inline-flex cursor-pointer items-center rounded-[8px] bg-brand-25 px-2.5 py-1 text-[11px] font-boldNunito text-brand-600 hover:bg-brand-50">
                          Manage
                        </Link>
                      </div>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Table>
          <Pager page={allGroups.data?.current_page ?? 1} lastPage={allGroups.data?.last_page ?? 1} onChange={setAllGroupsPage} />
        </PanelCard>
      )}

      <Modal
        open={!!groupAction}
        onClose={() => setGroupAction(null)}
        title={groupAction?.mode === "suspend" ? "Suspend Group" : groupAction?.mode === "ban" ? "Ban Group" : "Delete Group"}
        subtitle={groupAction?.group?.name}
        width="max-w-[440px]"
      >
        {groupAction ? (
          <div className="flex flex-col gap-4">
            {groupAction.mode === "delete" ? (
              <p className="text-[13px] leading-[1.6] text-ink-600">
                This permanently deletes &ldquo;{groupAction.group?.name}&rdquo; and notifies the group owner. This cannot be undone.
              </p>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Reason</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Why is this group being actioned?"
                    className="h-24 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]"
                  />
                </div>
                {groupAction.mode === "suspend" ? (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Suspend Until</label>
                    <input
                      type="date"
                      value={suspendUntil}
                      onChange={(e) => setSuspendUntil(e.target.value)}
                      className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
                    />
                  </div>
                ) : null}
              </>
            )}
            <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
              <SecondaryButton onClick={() => setGroupAction(null)}>Cancel</SecondaryButton>
              {groupAction.mode === "suspend" ? (
                <button
                  type="button"
                  disabled={!actionReason.trim()}
                  onClick={submitGroupAction}
                  className="cursor-pointer rounded-[10px] bg-gold-50 px-4 py-2.5 text-[13px] font-boldNunito text-gold-700 hover:bg-[#F3E4C4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suspend Group
                </button>
              ) : (
                <button
                  type="button"
                  disabled={groupAction.mode === "ban" && !actionReason.trim()}
                  onClick={submitGroupAction}
                  className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {groupAction.mode === "ban" ? "Ban Group" : "Delete Group"}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={creatingGroup} onClose={() => setCreatingGroup(false)} title="Create Group" subtitle="Official / curated group" width="max-w-[480px]">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Group Name</label>
            <input
              value={newGroup.name}
              onChange={(e) => setNewGroup((g) => ({ ...g, name: e.target.value }))}
              placeholder="e.g. Anxiety Support Circle"
              className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Category</label>
            <select
              value={newGroup.category_id}
              onChange={(e) => setNewGroup((g) => ({ ...g, category_id: e.target.value }))}
              className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
            >
              <option value="">Select a category</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Description</label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup((g) => ({ ...g, description: e.target.value }))}
              placeholder="What is this group for?"
              className="h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Owner Email</label>
            <input
              value={newGroup.owner_email}
              onChange={(e) => setNewGroup((g) => ({ ...g, owner_email: e.target.value }))}
              placeholder="A real TalkAM user's email — becomes group Owner"
              className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Access</label>
            <select
              value={newGroup.group_access}
              onChange={(e) => setNewGroup((g) => ({ ...g, group_access: e.target.value }))}
              className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
            >
              <option value="Opened">Open — anyone can join</option>
              <option value="Approval">Approval — join requests reviewed</option>
              <option value="Closed">Closed — invite only</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <SecondaryButton onClick={() => setCreatingGroup(false)}>Cancel</SecondaryButton>
            <PrimaryButton disabled={creatingGroupSaving || !newGroup.name.trim() || !newGroup.category_id || !newGroup.owner_email.trim()} onClick={submitCreateGroup}>
              Create Group
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const GROUP_DETAIL_TABS = [
  { key: "overview", label: "Overview" },
  { key: "members", label: "Members" },
  { key: "group-reports", label: "Group Reports" },
  { key: "comment-reports", label: "Comment Reports" },
];

const GroupOverviewTab = ({ group }) => (
  <div className="flex flex-col gap-4">
    <KpiRow>
      <KpiCard icon={<Icon.Users size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={group.members_count ?? 0} label="Members" />
      <KpiCard icon={<Icon.Flag size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={group.open_report_count ?? 0} label="Open Group Reports" />
      <KpiCard icon={<Icon.MessageSquare size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={group.open_comment_report_count ?? 0} label="Open Comment Reports" />
    </KpiRow>
    <PanelCard title="Group details">
      <div className="flex flex-col gap-1 p-1">
        <InfoRow label="Description">{group.description || "—"}</InfoRow>
        <InfoRow label="About">{group.about || "—"}</InfoRow>
        <InfoRow label="Category">{group.category?.name ?? "—"}</InfoRow>
        <InfoRow label="Access">{group.group_access ?? "—"}</InfoRow>
        <InfoRow label="Owner">{group.creator ? `${group.creator.first_name} ${group.creator.last_name ?? ""}`.trim() : "—"}</InfoRow>
        <InfoRow label="Owner Email">{group.creator?.email ?? "—"}</InfoRow>
        <InfoRow label="Created">{fmtDate(group.created_at)}</InfoRow>
      </div>
    </PanelCard>
  </div>
);
GroupOverviewTab.propTypes = { group: PropTypes.object.isRequired };

const GroupMembersTab = ({ groupId, showToast }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformGroupMembersQuery({ groupId, page });
  const [updateRole] = useUpdatePlatformGroupMemberRoleMutation();
  const [suspendMember] = useSuspendPlatformGroupMemberMutation();
  const [removeMember] = useRemovePlatformGroupMemberMutation();
  const [addMember, { isLoading: addingMember }] = useAddPlatformGroupMemberMutation();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Member");
  const rows = data?.data ?? [];

  const act = async (fn, okMsg) => {
    try {
      await fn().unwrap();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through — please try again"));
    }
  };

  const submitAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    await act(() => addMember({ groupId, email: newMemberEmail.trim(), role: newMemberRole }), "Member added");
    setNewMemberEmail("");
  };

  return (
    <div className="flex flex-col gap-3">
      <PanelCard>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-[11px] font-boldNunito text-navy-800">Add member by email</label>
            <input
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-9 w-full rounded-[8px] border-[1.5px] border-ink-200 px-3 text-[12.5px]"
            />
          </div>
          <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="h-9 rounded-[8px] border-[1.5px] border-ink-200 px-2 text-[12px]">
            {ADMIN_ASSIGNABLE_GROUP_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <SecondaryButton disabled={addingMember || !newMemberEmail.trim()} onClick={submitAddMember}>Add</SecondaryButton>
        </div>
      </PanelCard>

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Member", "Email", "Role", "Status", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No members found.</EmptyRow>
            ) : (
              rows.map((m) => (
                <Tr key={m.id}>
                  <Td first>{m.user ? `${m.user.first_name} ${m.user.last_name ?? ""}`.trim() : "—"}</Td>
                  <Td>{m.user?.email ?? "—"}</Td>
                  <Td>
                    {m.role === "Owner" ? (
                      <Badge tone="purple">Owner</Badge>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => act(() => updateRole({ memberId: m.id, role: e.target.value }), "Role updated")}
                        className="h-8 rounded-[8px] border-[1.5px] border-ink-200 px-2 text-[11.5px]"
                      >
                        {ADMIN_ASSIGNABLE_GROUP_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </Td>
                  <Td><Badge tone={MEMBER_STATUS_TONE[m.status] ?? "grey"}>{m.status}</Badge></Td>
                  <Td>
                    {m.role !== "Owner" ? (
                      <div className="flex flex-wrap gap-1.5">
                        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => suspendMember(m.id), m.status === "Suspended" ? "Member unsuspended" : "Member suspended")}>
                          {m.status === "Suspended" ? "Unsuspend" : "Suspend"}
                        </SecondaryButton>
                        <SecondaryButton className="!px-2.5 !py-1 !text-[11px] !text-signal-error" onClick={() => act(() => removeMember(m.id), "Member removed")}>Remove</SecondaryButton>
                      </div>
                    ) : null}
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};
GroupMembersTab.propTypes = { groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, showToast: PropTypes.func.isRequired };

const GroupReportsTab = ({ groupId, showToast }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformGroupReportsForGroupQuery({ groupId, page });
  const [resolveGroupReport] = useResolvePlatformGroupReportMutation();
  const rows = data?.data ?? [];

  const act = async (fn, okMsg) => {
    try {
      await fn().unwrap();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through — please try again"));
    }
  };

  return isFetching ? <SkeletonPanel /> : (
    <PanelCard>
      <Table head={["Reporter", "Reason", "Status", "Reported", "Actions"]}>
        {rows.length === 0 ? (
          <EmptyRow span={4}>No group reports for this group.</EmptyRow>
        ) : (
          rows.map((r) => (
            <Tr key={r.id}>
              <Td first>{reporterName(r)}</Td>
              <Td>{r.reason ?? "—"}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>{when(r.created_at)}</Td>
              <Td>
                {r.status !== "Resolved" ? (
                  <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => resolveGroupReport(r.id), "Report resolved")}>Resolve</SecondaryButton>
                ) : null}
              </Td>
            </Tr>
          ))
        )}
      </Table>
      <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
    </PanelCard>
  );
};
GroupReportsTab.propTypes = { groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, showToast: PropTypes.func.isRequired };

const GroupCommentReportsTab = ({ groupId, showToast }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformCommentReportsForGroupQuery({ groupId, page });
  const [resolveComment] = useResolvePlatformCommentReportMutation();
  const [deleteComment] = useDeletePlatformCommentReportMutation();
  const [viewContent, setViewContent] = useState(null);
  const rows = data?.data ?? [];

  const act = async (fn, okMsg) => {
    try {
      await fn().unwrap();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through — please try again"));
    }
  };

  return (
    <>
      {isFetching ? <SkeletonPanel /> : (
        <PanelCard>
          <Table head={["Reporter", "Reason", "Status", "Reported", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No comment reports for this group.</EmptyRow>
            ) : (
              rows.map((r) => (
                <Tr key={r.id}>
                  <Td first>{reporterName(r)}</Td>
                  <Td>{r.reason ?? "—"}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>{when(r.created_at)}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => setViewContent({ body: r.comment?.comment, empty: "This comment has already been removed." })}>View</SecondaryButton>
                      {r.status !== "Resolved" ? (
                        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => resolveComment(r.id), "Report resolved")}>Resolve</SecondaryButton>
                      ) : null}
                      <SecondaryButton className="!px-2.5 !py-1 !text-[11px] !text-signal-error" onClick={() => act(() => deleteComment(r.id), "Comment removed")}>Delete comment</SecondaryButton>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}

      <Modal open={!!viewContent} onClose={() => setViewContent(null)} title="Reported Comment" width="max-w-[480px]">
        {viewContent ? (
          <div className="whitespace-pre-wrap rounded-[10px] bg-surface-page px-4 py-3 text-[13px] leading-[1.6] text-ink-700">
            {viewContent.body || viewContent.empty}
          </div>
        ) : null}
      </Modal>
    </>
  );
};
GroupCommentReportsTab.propTypes = { groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, showToast: PropTypes.func.isRequired };

export const PlatformGroupDetailPage = () => {
  const { id } = useParams();
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("overview");
  const { data: group, isFetching } = useGetPlatformGroupDetailQuery(id);

  const [suspendGroup] = useSuspendPlatformGroupMutation();
  const [banGroup] = useBanPlatformGroupMutation();
  const [reactivateGroup] = useReactivatePlatformGroupMutation();
  const [deleteGroup] = useDeletePlatformGroupMutation();
  const [updateGroup, { isLoading: editingGroupSaving }] = useUpdatePlatformGroupMutation();
  const { data: categories } = useGetPlatformCommunityCategoriesQuery();
  const navigate = useNavigate();

  const [groupAction, setGroupAction] = useState(null); // "suspend" | "ban" | "delete"
  const [actionReason, setActionReason] = useState("");
  const [suspendUntil, setSuspendUntil] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", category_id: "", description: "", group_access: "Opened" });

  const act = async (fn, okMsg) => {
    try {
      await fn().unwrap();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through — please try again"));
    }
  };

  const submitGroupAction = async () => {
    if (!groupAction) return;
    if (groupAction === "suspend") {
      await act(() => suspendGroup({ groupId: id, reason: actionReason, suspend_until: suspendUntil }), "Group suspended");
    } else if (groupAction === "ban") {
      await act(() => banGroup({ groupId: id, reason: actionReason }), "Group banned");
    } else {
      try {
        await deleteGroup(id).unwrap();
        showToast("Group deleted");
        navigate(`${V2.platform}/community`);
        return;
      } catch (err) {
        showToast(apiErrorMessage(err, "That didn't go through — please try again"));
      }
    }
    setGroupAction(null);
  };

  const openEdit = () => {
    setEditForm({ name: group.name ?? "", category_id: group.category_id ?? group.category?.id ?? "", description: group.description ?? "", group_access: group.group_access ?? "Opened" });
    setEditing(true);
  };

  const submitEdit = async () => {
    if (!editForm.name.trim()) return;
    await act(() => updateGroup({ groupId: id, ...editForm }), "Group updated");
    setEditing(false);
  };

  if (isFetching || !group) return <SkeletonPanel rows={6} />;

  const gMeta = GROUP_STATUS_META[group.status] ?? { label: group.status ?? "—", tone: "grey" };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-[12px] text-ink-400">
        <Link to={`${V2.platform}/community`} className="font-boldNunito text-brand-400">← Community &amp; Groups</Link>
        <span className="mx-1.5">/</span>{group.name}
      </div>

      <Card className="!p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link to={`${V2.platform}/community`} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-surface-page text-ink-500 hover:bg-ink-100">
              <Icon.ArrowLeft size={16} />
            </Link>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-extraboldNunito text-white" style={{ background: avatarColor(group.id) }}>
              {initialsOfName(group.name)}
            </span>
            <div>
              <div className="text-[18px] font-extraboldNunito leading-tight text-navy-800">{group.name}</div>
              <div className="text-[12px] text-ink-400">{group.category?.name ?? "—"} · Created {fmtDate(group.created_at)}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone={gMeta.tone}>{gMeta.label}</Badge>
            {group.status === "Active" ? (
              <>
                <button type="button" onClick={() => { setGroupAction("suspend"); setActionReason(""); setSuspendUntil(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)); }} className="cursor-pointer rounded-[10px] bg-gold-50 px-4 py-2.5 text-[13px] font-boldNunito text-gold-600 hover:bg-[#F3E4C4]">
                  Suspend
                </button>
                <button type="button" onClick={() => { setGroupAction("ban"); setActionReason(""); }} className="cursor-pointer rounded-[10px] bg-surface-errorTint px-4 py-2.5 text-[13px] font-boldNunito text-surface-errorInk hover:bg-[#FFD9D9]">
                  Ban
                </button>
              </>
            ) : (
              <button type="button" onClick={() => act(() => reactivateGroup(id), "Group reactivated")} className="cursor-pointer rounded-[10px] bg-wellness-25 px-4 py-2.5 text-[13px] font-boldNunito text-wellness-600 hover:bg-wellness-50">
                Reactivate
              </button>
            )}
            <button type="button" onClick={() => { setGroupAction("delete"); }} className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E]">
              Delete
            </button>
            <PrimaryButton onClick={openEdit}>Edit Group</PrimaryButton>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 border-b border-surface-line">
        {GROUP_DETAIL_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`cursor-pointer border-b-2 px-3 py-2.5 text-[12.5px] font-boldNunito ${tab === t.key ? "border-brand-400 text-brand-600" : "border-transparent text-ink-400"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? <GroupOverviewTab group={group} /> : null}
      {tab === "members" ? <GroupMembersTab groupId={id} showToast={showToast} /> : null}
      {tab === "group-reports" ? <GroupReportsTab groupId={id} showToast={showToast} /> : null}
      {tab === "comment-reports" ? <GroupCommentReportsTab groupId={id} showToast={showToast} /> : null}

      <Modal
        open={!!groupAction}
        onClose={() => setGroupAction(null)}
        title={groupAction === "suspend" ? "Suspend Group" : groupAction === "ban" ? "Ban Group" : "Delete Group"}
        subtitle={group.name}
        width="max-w-[440px]"
      >
        {groupAction ? (
          <div className="flex flex-col gap-4">
            {groupAction === "delete" ? (
              <p className="text-[13px] leading-[1.6] text-ink-600">
                This permanently deletes &ldquo;{group.name}&rdquo; and notifies the group owner. This cannot be undone.
              </p>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Reason</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Why is this group being actioned?"
                    className="h-24 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]"
                  />
                </div>
                {groupAction === "suspend" ? (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Suspend Until</label>
                    <input
                      type="date"
                      value={suspendUntil}
                      onChange={(e) => setSuspendUntil(e.target.value)}
                      className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
                    />
                  </div>
                ) : null}
              </>
            )}
            <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
              <SecondaryButton onClick={() => setGroupAction(null)}>Cancel</SecondaryButton>
              {groupAction === "suspend" ? (
                <button
                  type="button"
                  disabled={!actionReason.trim()}
                  onClick={submitGroupAction}
                  className="cursor-pointer rounded-[10px] bg-gold-50 px-4 py-2.5 text-[13px] font-boldNunito text-gold-700 hover:bg-[#F3E4C4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suspend Group
                </button>
              ) : (
                <button
                  type="button"
                  disabled={groupAction === "ban" && !actionReason.trim()}
                  onClick={submitGroupAction}
                  className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {groupAction === "ban" ? "Ban Group" : "Delete Group"}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Group" subtitle={group.name} width="max-w-[480px]">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Group Name</label>
            <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Category</label>
            <select value={editForm.category_id} onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]">
              <option value="">Select a category</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Description</label>
            <textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className="h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Access</label>
            <select value={editForm.group_access} onChange={(e) => setEditForm((f) => ({ ...f, group_access: e.target.value }))} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]">
              <option value="Opened">Open — anyone can join</option>
              <option value="Approval">Approval — join requests reviewed</option>
              <option value="Closed">Closed — invite only</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton disabled={editingGroupSaving || !editForm.name.trim()} onClick={submitEdit}>Save Changes</PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* ── 8. CMS / Journal ─────────────────────────────────────────────────── */

const emptyArticle = { title: "", category: "", excerpt: "", author: "", status: "draft" };

export const PlatformCmsPage = () => {
  const { showToast } = usePlatform();
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformArticlesQuery({ page });
  const [createArticle, { isLoading: isCreating }] = useCreatePlatformArticleMutation();
  const [updateArticle] = useUpdatePlatformArticleMutation();
  const [deleteArticle] = useDeletePlatformArticleMutation();

  const [form, setForm] = useState(emptyArticle);
  const [showForm, setShowForm] = useState(false);
  const rows = data?.data ?? [];

  const submit = async () => {
    if (!form.title.trim()) return;
    try {
      await createArticle({ ...form, body: [{ type: "paragraph", text: form.excerpt || "" }] }).unwrap();
      showToast("Article created");
      setForm(emptyArticle);
      setShowForm(false);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't create that article"));
    }
  };

  const togglePublish = async (article) => {
    try {
      await updateArticle({ id: article.id, status: article.status === "published" ? "draft" : "published", published_at: new Date().toISOString() }).unwrap();
      showToast("Article updated");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't update that article"));
    }
  };

  const remove = async (id) => {
    try {
      await deleteArticle(id).unwrap();
      showToast("Article deleted");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't delete that article"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <PrimaryButton onClick={() => setShowForm((v) => !v)}>
          <Icon.Plus size={14} /> New article
        </PrimaryButton>
      </div>

      {showForm ? (
        <Card>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            <input placeholder="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
          </div>
          <textarea placeholder="Excerpt / body" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="mb-3 h-24 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3 py-2 text-[13px]" />
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submit} disabled={isCreating || !form.title.trim()}>{isCreating ? "Creating…" : "Create article"}</PrimaryButton>
          </div>
        </Card>
      ) : null}

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Title", "Category", "Author", "Status", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No articles yet.</EmptyRow>
            ) : (
              rows.map((a) => (
                <Tr key={a.id}>
                  <Td first>{a.title}</Td>
                  <Td>{a.category ?? "—"}</Td>
                  <Td>{a.author ?? "—"}</Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => togglePublish(a)}>
                        {a.status === "published" ? "Unpublish" : "Publish"}
                      </SecondaryButton>
                      <SecondaryButton className="!px-2.5 !py-1 !text-[11px] !text-signal-error" onClick={() => remove(a.id)}>Delete</SecondaryButton>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};

/* ── 9. Disputes ──────────────────────────────────────────────────────── */

const DISPUTE_TABS = [
  { key: "open", label: "Open" },
  { key: "in_review", label: "In Review" },
  { key: "resolved", label: "Resolved" },
];

const DISPUTE_STATUS_TONE = { Pending: "red", "In Review": "gold", Resolved: "green", Dismissed: "grey" };
const REPORTER_TYPE_LABEL = { therapists: "Therapist", employees: "B2B Employee", business: "Business Admin", regular: "Regular User" };

/** Each option maps to one of the two real terminal statuses
 *  (PlatformDisputeService only has Resolved/Dismissed) — the richer
 *  label just gives the admin a starting point for the notes below. */
const RESOLUTION_OUTCOMES = [
  { key: "refund", label: "Resolved in favour of complainant — refund initiated", status: "Resolved" },
  { key: "credit", label: "Resolved in favour of complainant — session credit issued", status: "Resolved" },
  { key: "no_action", label: "Resolved in favour of other party — no action needed", status: "Resolved" },
  { key: "insufficient", label: "Dismissed — insufficient evidence", status: "Dismissed" },
  { key: "duplicate", label: "Dismissed — duplicate report", status: "Dismissed" },
];

export const PlatformDisputesPage = () => {
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("open");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformDisputesQuery({ tab, page });
  const [startReview] = useStartReviewPlatformDisputeMutation();
  const [escalate] = useEscalatePlatformDisputeMutation();
  const [resolveDispute] = useResolvePlatformDisputeMutation();
  const [resolving, setResolving] = useState(null); // dispute row
  const [outcome, setOutcome] = useState(RESOLUTION_OUTCOMES[0]);
  const [resolutionText, setResolutionText] = useState("");
  const [notifyParties, setNotifyParties] = useState(false);

  const rows = data?.disputes?.data ?? [];
  const overview = data?.overview ?? {};
  const tabCounts = { open: overview.open ?? 0, in_review: overview.in_review ?? 0, resolved: overview.resolved_mtd ?? 0 };

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  const openResolve = (d) => {
    setResolving(d);
    setOutcome(RESOLUTION_OUTCOMES[0]);
    setResolutionText("");
    setNotifyParties(false);
  };

  const submitResolution = async () => {
    if (!resolving || !resolutionText.trim()) return;
    await act(
      () => resolveDispute({ id: resolving.id, resolution: resolutionText, status: outcome.status, notify: notifyParties }).unwrap(),
      outcome.status === "Resolved" ? "Dispute resolved" : "Dispute dismissed"
    );
    setResolving(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.AlertTriangle size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview.open ?? 0} label="Open Disputes" />
        <KpiCard icon={<Icon.Eye size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={overview.in_review ?? 0} label="In Review" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={overview.resolved_mtd ?? 0} label="Resolved (MTD)" />
        <KpiCard icon={<Icon.Clock size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={overview.avg_resolution_days !== null ? `${overview.avg_resolution_days} days` : "—"} label="Avg Resolution Time" />
      </KpiRow>

      <div className="flex flex-wrap gap-2">
        {DISPUTE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${tab === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
          >
            {t.label} ({tabCounts[t.key] ?? 0})
          </button>
        ))}
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : rows.length === 0 ? (
        <PanelCard><div className="p-8 text-center text-[12.5px] text-ink-400">No disputes in this queue.</div></PanelCard>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((d) => (
            <Card key={d.id}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extraboldNunito text-white" style={{ background: avatarColor(d.id) }}>
                    {initialsOfName(d.reporter?.name || "?")}
                  </span>
                  <div>
                    <div className="text-[13.5px] font-extraboldNunito text-navy-800">{d.reporter?.name || "—"}</div>
                    <div className="text-[11.5px] text-ink-400">{REPORTER_TYPE_LABEL[d.reporter?.type] ?? "—"} · Filed {fmtDate(d.created_at)}</div>
                  </div>
                </div>
                <Badge tone={DISPUTE_STATUS_TONE[d.status] ?? "grey"}>{d.status === "Pending" ? "Open" : d.status}</Badge>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field label="Dispute Type">{d.type}</Field>
                <Field label="Amount">{d.amount !== null ? money(d.amount) : "Session credit"}</Field>
                <Field label="Session ID">{d.session_ref || "—"}</Field>
              </div>

              {d.description ? <p className="mb-3 text-[12.5px] leading-[1.6] text-ink-500">{d.description}</p> : null}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {["Resolved", "Dismissed"].includes(d.status) ? null : (
                    <>
                      <button type="button" onClick={() => openResolve(d)} className="cursor-pointer rounded-[10px] bg-brand-25 px-3.5 py-2 text-[12px] font-boldNunito text-brand-600 hover:bg-brand-50">
                        Resolve Dispute
                      </button>
                      <button type="button" onClick={() => act(() => (d.status === "Pending" ? startReview(d.id).unwrap() : escalate(d.id).unwrap()), d.status === "Pending" ? "Moved to In Review" : "Escalated to a Super Admin")} className="cursor-pointer rounded-[10px] bg-gold-50 px-3.5 py-2 text-[12px] font-boldNunito text-gold-700 hover:bg-[#F3E4C4]">
                        {d.status === "Pending" ? "Review" : "Escalate"}
                      </button>
                    </>
                  )}
                  {d.resolution ? <span className="text-[11.5px] text-ink-400">Resolution: {d.resolution}</span> : null}
                </div>
                <span className="text-[11px] text-ink-400">
                  {d.escalated_at ? "Escalated · " : ""}Assigned: {d.assigned_to || "Unassigned"}
                </span>
              </div>
            </Card>
          ))}
          <Pager page={data?.disputes?.current_page ?? 1} lastPage={data?.disputes?.last_page ?? 1} onChange={setPage} />
        </div>
      )}

      <Modal open={!!resolving} onClose={() => setResolving(null)} title="Resolve Dispute" subtitle={resolving ? `${resolving.reference} · ${resolving.reporter?.name ?? "—"}` : undefined} width="max-w-[520px]">
        {resolving ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-[10px] bg-surface-page px-4 py-3">
              <div className="mb-1 text-[10.5px] font-boldNunito uppercase tracking-[0.05em] text-ink-400">Complaint</div>
              <div className="text-[13px] leading-[1.6] text-ink-700">{resolving.description || "No description provided."}</div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Resolution Status</label>
              <select
                value={outcome.key}
                onChange={(e) => setOutcome(RESOLUTION_OUTCOMES.find((o) => o.key === e.target.value) ?? RESOLUTION_OUTCOMES[0])}
                className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
              >
                {RESOLUTION_OUTCOMES.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-boldNunito text-navy-800">Resolution Notes</label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Describe what action was taken and how the dispute was resolved…"
                className="h-28 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-600">
              <input type="checkbox" checked={notifyParties} onChange={(e) => setNotifyParties(e.target.checked)} />
              Notify both parties by email upon resolution
            </label>

            <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
              <SecondaryButton onClick={() => setResolving(null)}>Cancel</SecondaryButton>
              <PrimaryButton disabled={!resolutionText.trim()} onClick={submitResolution}>
                Mark as {outcome.status}{notifyParties ? " & Notify Parties" : ""}
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

/* ── 10. Feedback ─────────────────────────────────────────────────────── */

export const PlatformFeedbackPage = () => {
  const { showToast } = usePlatform();
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformFeedbackQuery({ page });
  const [resolveFeedback] = useResolvePlatformFeedbackMutation();
  const [respondFeedback] = useRespondPlatformFeedbackMutation();
  const [respondingTo, setRespondingTo] = useState(null);
  const [message, setMessage] = useState("");
  const rows = data?.data ?? [];

  const resolve = async (id) => {
    try {
      await resolveFeedback(id).unwrap();
      showToast("Feedback marked resolved");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't resolve that feedback"));
    }
  };

  const respond = async (id) => {
    if (!message.trim()) return;
    try {
      await respondFeedback({ id, message }).unwrap();
      showToast("Response sent");
      setRespondingTo(null);
      setMessage("");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't send that response"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isFetching ? (
        <SkeletonPanel />
      ) : rows.length === 0 ? (
        <PanelCard><div className="p-8 text-center text-[12.5px] text-ink-400">No feedback submitted yet.</div></PanelCard>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((f) => (
            <Card key={f.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13px] font-boldNunito text-navy-800">{f.name} · {f.email}</div>
                  <div className="text-[11px] text-ink-400">{f.platform ?? "—"} · {f.feedback_type ?? "—"} · {when(f.created_at)}</div>
                </div>
                <StatusBadge status={f.status} />
              </div>
              <p className="mb-3 text-[13px] leading-[1.6] text-ink-600">{f.content}</p>
              {respondingTo === f.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Reply to send by email…"
                    className="h-9 flex-1 rounded-[8px] border-[1.5px] border-ink-200 px-3 text-[12.5px]"
                  />
                  <SecondaryButton className="!px-2.5 !py-1.5 !text-[11px]" onClick={() => respond(f.id)}>Send</SecondaryButton>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => setRespondingTo(f.id)}>Respond</SecondaryButton>
                  {f.status !== "Resolved" ? (
                    <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => resolve(f.id)}>Mark resolved</SecondaryButton>
                  ) : null}
                </div>
              )}
            </Card>
          ))}
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </div>
      )}
    </div>
  );
};

/* ── 11. Deactivations ────────────────────────────────────────────────── */

export const PlatformDeactivationsPage = () => {
  const { showToast } = usePlatform();
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformDeactivationsQuery({ page });
  const [approve] = useApprovePlatformDeactivationMutation();
  const [reject] = useRejectPlatformDeactivationMutation();
  const rows = data?.data ?? [];

  const act = async (fn, msg) => {
    try {
      await fn().unwrap();
      showToast(msg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["User", "Reason", "Status", "Requested", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No deactivation requests.</EmptyRow>
            ) : (
              rows.map((d) => (
                <Tr key={d.id}>
                  <Td first>{d.user ? `${d.user.first_name} ${d.user.last_name}` : d.email}</Td>
                  <Td>{d.reason ?? "—"}</Td>
                  <Td><StatusBadge status={d.status} /></Td>
                  <Td>{when(d.created_at)}</Td>
                  <Td>
                    {["Pending", "Processing"].includes(d.status) ? (
                      <div className="flex gap-1.5">
                        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => approve(d.id), "Deactivation approved")}>Approve</SecondaryButton>
                        <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => reject(d.id), "Request rejected")}>Reject</SecondaryButton>
                      </div>
                    ) : (
                      <span className="text-[11.5px] text-ink-400">—</span>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};

/* ── 12. Roles & Staff ────────────────────────────────────────────────── */

const PLATFORM_ROLES = ["Super Admin", "Admin", "Content Manager", "Support Staff"];

export const PlatformRolesPage = () => {
  const { showToast } = usePlatform();
  const { data, isFetching } = useGetPlatformRolesQuery();
  const [assignRole, { isLoading: isAssigning }] = useAssignPlatformRoleMutation();
  const [revokeRole] = useRevokePlatformRoleMutation();
  const [form, setForm] = useState({ user_id: "", role: PLATFORM_ROLES[1] });

  const assign = async () => {
    if (!form.user_id) return;
    try {
      await assignRole(form).unwrap();
      showToast("Role assigned");
      setForm({ user_id: "", role: PLATFORM_ROLES[1] });
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't assign that role — check the user ID"));
    }
  };

  const revoke = async (user_id) => {
    try {
      await revokeRole({ user_id }).unwrap();
      showToast("Role revoked");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't revoke that role"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        {(data?.roles ?? []).map((r) => (
          <KpiCard key={r.id} icon={<Icon.Shield size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={r.users_count ?? 0} label={r.name} />
        ))}
      </KpiRow>

      <Card>
        <div className="mb-3 text-body font-extraboldNunito text-navy-800">Assign a role</div>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="number"
            placeholder="User ID"
            value={form.user_id}
            onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
            className="h-10 w-[140px] rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="h-10 rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]"
          >
            {PLATFORM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <PrimaryButton onClick={assign} disabled={isAssigning || !form.user_id}>
            {isAssigning ? "Assigning…" : "Assign"}
          </PrimaryButton>
        </div>
      </Card>

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard title="Platform staff">
          <Table head={["Name", "Email", "Role", "Actions"]}>
            {(data?.staff ?? []).length === 0 ? (
              <EmptyRow span={4}>No staff assigned yet.</EmptyRow>
            ) : (
              (data?.staff ?? []).map((u) => (
                <Tr key={u.id}>
                  <Td first>{u.first_name} {u.last_name}</Td>
                  <Td>{u.email}</Td>
                  <Td>{(u.roles ?? []).map((r) => r.name).join(", ") || "—"}</Td>
                  <Td><SecondaryButton className="!px-2.5 !py-1 !text-[11px] !text-signal-error" onClick={() => revoke(u.id)}>Revoke</SecondaryButton></Td>
                </Tr>
              ))
            )}
          </Table>
        </PanelCard>
      )}
    </div>
  );
};

/* ── 13. Waitlist ─────────────────────────────────────────────────────── */

export const PlatformWaitlistPage = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformWaitlistQuery({ page });
  const rows = data?.signups?.data ?? [];

  if (isFetching) return <SkeletonPanel />;

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.List size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={data?.total ?? 0} label="Total signups" />
        <KpiCard icon={<Icon.ToggleRight size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={data?.waitlist_mode ? "ON" : "OFF"} label="Waitlist mode (see Settings)" />
      </KpiRow>

      <PanelCard>
        <Table head={["Name", "Email", "Status", "Joined"]}>
          {rows.length === 0 ? (
            <EmptyRow span={4}>No waitlist signups yet.</EmptyRow>
          ) : (
            rows.map((w) => (
              <Tr key={w.id}>
                <Td first>{w.name}</Td>
                <Td>{w.email}</Td>
                <Td><StatusBadge status={w.status} /></Td>
                <Td>{when(w.created_at)}</Td>
              </Tr>
            ))
          )}
        </Table>
        <Pager page={data?.signups?.current_page ?? 1} lastPage={data?.signups?.last_page ?? 1} onChange={setPage} />
      </PanelCard>
    </div>
  );
};

/* ── 14. Legal ────────────────────────────────────────────────────────── */

const LegalEditor = ({ slug, title }) => {
  const { showToast } = usePlatform();
  const { data, isFetching } = useGetPlatformLegalDocumentQuery(slug);
  const [update, { isLoading }] = useUpdatePlatformLegalDocumentMutation();
  const [body, setBody] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data?.body && !dirty) setBody(data.body);
  }, [data?.body]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    try {
      await update({ slug, body }).unwrap();
      showToast(`${title} updated`);
      setDirty(false);
    } catch (err) {
      showToast(apiErrorMessage(err, `Couldn't update ${title}`));
    }
  };

  return (
    <PanelCard title={title} subtitle={data?.updated_at ? `Last updated ${when(data.updated_at)}` : undefined}>
      <div className="p-5">
        {isFetching ? (
          <AdminSkeleton className="h-40 w-full" />
        ) : (
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); setDirty(true); }}
            className="mb-3 h-40 w-full resize-y rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] leading-[1.6] text-ink-800"
          />
        )}
        <div className="flex justify-end">
          <PrimaryButton onClick={save} disabled={isLoading || !dirty}>
            {isLoading ? "Saving…" : "Save new version"}
          </PrimaryButton>
        </div>
      </div>
    </PanelCard>
  );
};

LegalEditor.propTypes = { slug: PropTypes.string.isRequired, title: PropTypes.string.isRequired };

export const PlatformLegalPage = () => (
  <div className="flex flex-col gap-5">
    <InfoStrip tone="gold" icon={<Icon.AlertTriangle size={15} className="mt-px shrink-0 text-gold-600" />}>
      Saving creates a new version — the live public document updates immediately.
    </InfoStrip>
    <LegalEditor slug="privacy" title="Privacy Policy" />
    <LegalEditor slug="terms" title="Terms & Conditions" />
  </div>
);

/* ── 15. Settings ─────────────────────────────────────────────────────── */

export const PlatformSettingsPage = () => {
  const { showToast } = usePlatform();
  const { data, isFetching } = useGetPlatformSettingsQuery();
  const [updateSetting, { isLoading }] = useUpdatePlatformSettingMutation();

  const waitlistMode = (data ?? []).find((s) => s.key === "waitlist_mode");
  const on = waitlistMode?.value === "1" || waitlistMode?.value === true;

  const toggle = async () => {
    try {
      await updateSetting({ key: "waitlist_mode", value: !on }).unwrap();
      showToast(`Waitlist mode turned ${!on ? "on" : "off"}`);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't update that setting"));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <JustLaunched>
        Only the settings with a real switch behind them are here — the design mockup&apos;s
        broader settings surface isn&apos;t backed by anything yet.
      </JustLaunched>

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-boldNunito text-navy-800">Waitlist mode</div>
              <div className="text-[11.5px] text-ink-400">
                When on, new signups join the waitlist instead of getting instant access.
              </div>
            </div>
            <Toggle on={on} label="Waitlist mode" onClick={toggle} disabled={isLoading} />
          </div>
        </Card>
      )}
    </div>
  );
};

/* ── 16. All Users ────────────────────────────────────────────────────── */

const AVATAR_PALETTE = ["#017FC8", "#3BA88F", "#8B5CF6", "#DBB66E", "#E4694A", "#5A8CD8", "#4A9E7C"];
const avatarColor = (id) => AVATAR_PALETTE[id % AVATAR_PALETTE.length];

const TYPE_TABS = [
  { key: "all", label: "All" },
  { key: "regular", label: "Regular" },
  { key: "employees", label: "Employees" },
  { key: "therapists", label: "Therapists" },
  { key: "business", label: "Business" },
];

const TYPE_BADGE_TONE = { regular: "blue", employees: "gold", therapists: "green", business: "purple" };

const UserAvatar = ({ user }) => (
  <span
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white"
    style={{ background: avatarColor(user.id) }}
  >
    {initialsOfName(user.name || user.email)}
  </span>
);
UserAvatar.propTypes = { user: PropTypes.object.isRequired };

const initialsOfName = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

export const PlatformUsersPage = () => {
  const { showToast } = usePlatform();
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformUsersQuery({ type: type === "all" ? undefined : type, search: search || undefined, page });
  const [suspendUser] = useSuspendPlatformUserMutation();
  const [unsuspendUser] = useUnsuspendPlatformUserMutation();
  const [banUser] = useBanPlatformUserMutation();
  const [updateUser, { isLoading: isSaving }] = useUpdatePlatformUserMutation();
  const [deleteUser] = useDeletePlatformUserMutation();

  const navigate = useNavigate();
  const [editing, setEditing] = useState(null); // { id, name }
  const [suspending, setSuspending] = useState(null); // user row
  const [deleting, setDeleting] = useState(null); // user row
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");

  const rows = data?.users?.data ?? [];
  const counts = data?.type_counts ?? {};

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  const confirmSuspend = async () => {
    if (!suspending || !duration) return;
    await act(() => suspendUser({ id: suspending.id, duration, suspend_reason: reason }).unwrap(), "User suspended");
    setSuspending(null);
    setDuration("");
    setReason("");
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await act(() => deleteUser(deleting.id).unwrap(), "User deleted");
    setDeleting(null);
  };

  const saveEdit = async () => {
    if (!editing?.name?.trim()) return;
    await act(() => updateUser({ id: editing.id, name: editing.name.trim() }).unwrap(), "User updated");
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setType(t.key)}
              className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${type === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
            >
              {t.label} ({counts[t.key] ?? 0})
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="h-10 w-full max-w-[240px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
        />
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["User", "Type", "Status", "Strikes", "Joined", "Actions"]}>
            {rows.length === 0 ? (
              <EmptyRow span={6}>No users found.</EmptyRow>
            ) : (
              rows.map((u) => (
                <Tr key={u.id}>
                  <Td first>
                    <div className="flex items-center gap-2.5">
                      <UserAvatar user={u} />
                      <div>
                        <div className="font-boldNunito text-ink-800">{u.name || "—"}</div>
                        <div className="text-[11px] font-normal text-ink-400">{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><Badge tone={TYPE_BADGE_TONE[u.type] ?? "grey"} className="capitalize">{u.type}</Badge></Td>
                  <Td><StatusBadge status={u.status} /></Td>
                  <Td>{u.strike ?? 0}</Td>
                  <Td>{new Date(u.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <div className="flex gap-1">
                      <button type="button" title="View" onClick={() => navigate(`${V2.platform}/users/${u.id}`)} className="cursor-pointer rounded-[8px] p-1.5 text-brand-600 hover:bg-brand-25">
                        <Icon.Eye size={15} />
                      </button>
                      <button type="button" title="Edit" onClick={() => setEditing({ id: u.id, name: u.name })} className="cursor-pointer rounded-[8px] p-1.5 text-ink-500 hover:bg-ink-50">
                        <Icon.Edit2 size={15} />
                      </button>
                      {u.status === "Inactive" ? (
                        <button type="button" title="Unsuspend" onClick={() => act(() => unsuspendUser(u.id).unwrap(), "Suspension lifted")} className="cursor-pointer rounded-[8px] p-1.5 text-wellness-600 hover:bg-wellness-25">
                          <Icon.Play size={15} />
                        </button>
                      ) : (
                        <button type="button" title="Suspend" onClick={() => setSuspending(u)} className="cursor-pointer rounded-[8px] p-1.5 text-gold-600 hover:bg-gold-50">
                          <Icon.Pause size={15} />
                        </button>
                      )}
                      <button type="button" title="Delete" onClick={() => setDeleting(u)} className="cursor-pointer rounded-[8px] p-1.5 text-signal-error hover:bg-surface-errorTint">
                        <Icon.Trash2 size={15} />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.users?.current_page ?? 1} lastPage={data?.users?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}

      {/* Edit name */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit user" width="max-w-[400px]">
        <input
          value={editing?.name ?? ""}
          onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))}
          placeholder="Full name"
          className="mb-4 h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]"
        />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={saveEdit} disabled={isSaving || !editing?.name?.trim()}>{isSaving ? "Saving…" : "Save"}</PrimaryButton>
        </div>
      </Modal>

      {/* Suspend */}
      <Modal open={!!suspending} onClose={() => setSuspending(null)} title={`Suspend ${suspending?.name ?? ""}`} width="max-w-[400px]">
        <div className="mb-3">
          <label className="mb-1.5 block text-[11px] font-boldNunito text-ink-400">Suspended until</label>
          <input type="date" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" className="mb-4 h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setSuspending(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={confirmSuspend} disabled={!duration}>Suspend</PrimaryButton>
        </div>
      </Modal>

      {/* Delete / ban confirm */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title={`Remove ${deleting?.name ?? "this user"}?`} width="max-w-[420px]">
        <p className="mb-4 text-[13px] leading-[1.6] text-ink-500">
          Ban keeps the account on record (reversible by support); Delete permanently erases it. Choose carefully.
        </p>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" className="mb-4 h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setDeleting(null)}>Cancel</SecondaryButton>
          <SecondaryButton
            disabled={!reason.trim()}
            onClick={async () => { await act(() => banUser({ id: deleting.id, suspend_ban_reason: reason }).unwrap(), "User banned"); setDeleting(null); setReason(""); }}
          >
            Ban
          </SecondaryButton>
          <button
            type="button"
            onClick={confirmDelete}
            className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E]"
          >
            Delete permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};

/* ── 16b. User Detail ─────────────────────────────────────────────────── */

const DETAIL_TABS = [
  { key: "overview", label: "Overview" },
  { key: "sessions", label: "Sessions" },
  { key: "mood", label: "Mood & Wellness" },
  { key: "community", label: "Community" },
  { key: "journey", label: "Journey" },
  { key: "activity", label: "Event Log" },
];

/** "Just now" / "2 hours ago" / "3 days ago" — falls back to a date past a week. */
const ago = (iso) => {
  if (!iso) return null;
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
};

/** Mood is 1–5 (config v2.checkins.moods): 4–5 good, 3 neutral, 1–2 low. */
const moodBarClass = (mood) =>
  mood === null ? "bg-ink-100" : mood >= 4 ? "bg-wellness-400" : mood === 3 ? "bg-gold-400" : "bg-[#D45B5B]";

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "—");

const Stars = ({ rating }) =>
  rating ? <span className="font-boldNunito text-gold-600">{rating}★</span> : <span className="text-ink-300">—</span>;
Stars.propTypes = { rating: PropTypes.number };

const FORMAT_TONE = { video: "blue", voice: "green", chat: "green" };

export const PlatformUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("overview");

  const { data: user, isFetching } = useGetPlatformUserDetailQuery(id);
  const [suspendUser] = useSuspendPlatformUserMutation();
  const [unsuspendUser] = useUnsuspendPlatformUserMutation();
  const [banUser] = useBanPlatformUserMutation();
  const [strikeUser] = useStrikePlatformUserMutation();
  const [updateUser, { isLoading: isSaving }] = useUpdatePlatformUserMutation();
  const [deleteUser] = useDeletePlatformUserMutation();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [suspending, setSuspending] = useState(false);
  const [banning, setBanning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  if (isFetching || !user) {
    return <SkeletonPanel rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-[12px] text-ink-400">
        <Link to={`${V2.platform}/users`} className="font-boldNunito text-brand-400">← All Users</Link>
        <span className="mx-1.5">/</span>{user.name}
      </div>

      <Card className="!p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] text-[22px] font-extraboldNunito text-white" style={{ background: avatarColor(user.id) }}>
              {initialsOfName(user.name)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[24px] font-extraboldNunito leading-tight text-navy-800">{user.name}</span>
                <span className="text-[12px] font-boldNunito text-navy-800">{user.status}</span>
                <span className="text-[12px] font-boldNunito text-navy-800">{user.platform}</span>
              </div>
              <div className="mt-1 text-[13px] text-ink-400">
                {user.email} · Joined {fmtDate(user.created_at)} · Last active {ago(user.last_active_at) ?? "never"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {user.status === "Inactive" ? (
              <button type="button" onClick={() => act(() => unsuspendUser(user.id).unwrap(), "Suspension lifted")} className="cursor-pointer rounded-[10px] bg-wellness-25 px-4 py-2.5 text-[13px] font-boldNunito text-wellness-600 hover:bg-wellness-50">
                Unsuspend
              </button>
            ) : (
              <button type="button" onClick={() => setSuspending(true)} className="cursor-pointer rounded-[10px] bg-gold-50 px-4 py-2.5 text-[13px] font-boldNunito text-gold-600 hover:bg-[#F3E4C4]">
                Suspend
              </button>
            )}
            <button type="button" onClick={() => setDeleting(true)} className="cursor-pointer rounded-[10px] bg-surface-errorTint px-4 py-2.5 text-[13px] font-boldNunito text-surface-errorInk hover:bg-[#FFD9D9]">
              Delete
            </button>
            <PrimaryButton onClick={() => { setName(user.name); setEditing(true); }}>Edit Profile</PrimaryButton>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 border-b border-surface-line">
        {DETAIL_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`cursor-pointer border-b-2 px-3 py-2.5 text-[12.5px] font-boldNunito ${tab === t.key ? "border-brand-400 text-brand-600" : "border-transparent text-ink-400"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <UserOverviewTab
          user={user}
          onStrike={() => act(() => strikeUser(user.id).unwrap(), "Strike recorded")}
          onBan={() => setBanning(true)}
          onViewAll={() => setTab("sessions")}
        />
      ) : null}
      {tab === "journey" ? <UserJourneyTab id={id} /> : null}
      {tab === "sessions" ? <UserSessionsTab id={id} /> : null}
      {tab === "mood" ? <UserMoodTab id={id} /> : null}
      {tab === "community" ? <UserCommunityTab id={id} /> : null}
      {tab === "activity" ? <UserActivityTab id={id} /> : null}

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit user" width="max-w-[400px]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="mb-4 h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
          <PrimaryButton disabled={isSaving || !name.trim()} onClick={() => act(() => updateUser({ id: user.id, name: name.trim() }).unwrap(), "User updated").then(() => setEditing(false))}>
            {isSaving ? "Saving…" : "Save"}
          </PrimaryButton>
        </div>
      </Modal>

      <Modal open={suspending} onClose={() => setSuspending(false)} title="Suspend user" width="max-w-[400px]">
        <div className="mb-3">
          <label className="mb-1.5 block text-[11px] font-boldNunito text-ink-400">Suspended until</label>
          <input type="date" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-11 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px]" />
        </div>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" className="mb-4 h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setSuspending(false)}>Cancel</SecondaryButton>
          <PrimaryButton disabled={!duration} onClick={() => act(() => suspendUser({ id: user.id, duration, suspend_reason: reason }).unwrap(), "User suspended").then(() => { setSuspending(false); setDuration(""); setReason(""); })}>
            Suspend
          </PrimaryButton>
        </div>
      </Modal>

      <Modal open={banning} onClose={() => setBanning(false)} title="Ban user" width="max-w-[400px]">
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" className="mb-4 h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setBanning(false)}>Cancel</SecondaryButton>
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => act(() => banUser({ id: user.id, suspend_ban_reason: reason }).unwrap(), "User banned").then(() => { setBanning(false); setReason(""); })}
            className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ban user
          </button>
        </div>
      </Modal>

      <Modal open={deleting} onClose={() => setDeleting(false)} title="Delete this account?" width="max-w-[400px]">
        <p className="mb-4 text-[13px] leading-[1.6] text-ink-500">This permanently erases the account. This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setDeleting(false)}>Cancel</SecondaryButton>
          <button
            type="button"
            onClick={() => act(() => deleteUser(user.id).unwrap(), "User deleted").then(() => navigate(`${V2.platform}/users`))}
            className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-[#8B2E2E]"
          >
            Delete permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};

/* Design: small uppercase card headings, stacked label/value pairs. */
const CardHeading = ({ children }) => (
  <div className="mb-3 text-[11px] font-boldNunito uppercase tracking-[0.08em] text-ink-400">{children}</div>
);
CardHeading.propTypes = { children: PropTypes.node };

const Field = ({ label, children }) => (
  <div className="mb-3.5 last:mb-0">
    <div className="text-[10.5px] font-boldNunito uppercase tracking-[0.06em] text-ink-400">{label}</div>
    <div className="mt-0.5 text-[13.5px] font-boldNunito text-navy-800">{children}</div>
  </div>
);
Field.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };

const StatCard = ({ label, value, sub, subTone, dark }) => (
  <div
    className={
      dark
        ? "rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5 shadow-[0_4px_16px_rgba(20,27,52,0.18)]"
        : "rounded-ds-lg border border-surface-line bg-white p-5 shadow-[0_1px_4px_rgba(20,27,52,0.04)]"
    }
  >
    <div className={`text-[10.5px] font-boldNunito uppercase tracking-[0.08em] ${dark ? "text-white/60" : "text-ink-400"}`}>{label}</div>
    <div className={`mt-2 text-[30px] font-extraboldNunito leading-none ${dark ? "text-white" : "text-navy-800"}`}>{value}</div>
    <div className={`mt-2 text-[11.5px] ${dark ? "text-white/60" : subTone === "blue" ? "text-brand-400" : "text-ink-400"}`}>{sub}</div>
  </div>
);
StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.node, sub: PropTypes.node, subTone: PropTypes.string, dark: PropTypes.bool };

const CONCERN_COLORS = ["bg-brand-400 text-brand-600", "bg-wellness-400 text-wellness-600", "bg-gold-400 text-gold-600"];

const UserOverviewTab = ({ user, onStrike, onBan, onViewAll }) => {
  const series = user.mood?.series ?? [];
  const hasMood = series.some((d) => d.mood !== null);
  const delta = user.mood?.month_delta_percent;
  const trendLabel = delta === null || delta === undefined ? null : delta > 0 ? "Improving" : delta < 0 ? "Declining" : "Stable";
  const flags = user.flags ?? {};
  const completion = user.profile_completion ?? { percent: 0, label: "Low", items: [] };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Left column */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeading>Account details</CardHeading>
          <Field label="Email">{user.email}</Field>
          <Field label="Phone">{user.phone_number || "—"}</Field>
          <Field label="Joined">{fmtDate(user.created_at)}</Field>
          <Field label="Organisation">{user.organization_name || "N/A"}</Field>
          <Field label="Last active">{ago(user.last_active_at) ?? "No activity yet"}</Field>
          <Field label="Platform">{user.platform}</Field>
          <Field label="User ID">#{user.id}</Field>
          <Field label="Moderation">
            <span className="flex flex-wrap items-center gap-2">
              <span>{user.strike ?? 0} strike{user.strike === 1 ? "" : "s"}</span>
              <SecondaryButton className="!px-2 !py-0.5 !text-[10.5px]" onClick={onStrike}>+1 strike</SecondaryButton>
              <SecondaryButton className="!px-2 !py-0.5 !text-[10.5px] !text-signal-error" onClick={onBan}>Ban</SecondaryButton>
            </span>
          </Field>
          {user.suspension_end ? <Field label="Suspended until">{fmtDate(user.suspension_end)}</Field> : null}
        </Card>

        <Card>
          <CardHeading>Profile completion</CardHeading>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-[28px] font-extraboldNunito leading-none text-navy-800">{completion.percent}%</span>
            <span className={`text-[12px] font-boldNunito ${completion.label === "Good" ? "text-wellness-600" : completion.label === "Fair" ? "text-gold-600" : "text-signal-error"}`}>
              {completion.label}
            </span>
          </div>
          <div className="mb-4 h-[7px] w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#017FC8,#3BA88F)]" style={{ width: `${completion.percent}%` }} />
          </div>
          {completion.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1.5 text-[12.5px]">
              <span className="text-ink-600">{item.label}</span>
              {item.done ? (
                <Icon.Check size={15} strokeWidth={2.5} className="text-wellness-600" />
              ) : (
                <span className="text-[11.5px] font-boldNunito text-signal-error">Pending</span>
              )}
            </div>
          ))}
        </Card>

        <Card>
          <CardHeading>Account flags</CardHeading>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={flags.two_factor_enabled ? "green" : "grey"}>{flags.two_factor_enabled ? "2FA Enabled" : "2FA Off"}</Badge>
            <Badge tone={flags.research_consent ? "blue" : "grey"}>{flags.research_consent ? "Consent: Research" : "No Research Consent"}</Badge>
            <Badge tone={flags.email_verified ? "green" : "gold"}>{flags.email_verified ? "Email Verified" : "Email Unverified"}</Badge>
            <Badge tone={flags.phone === "none" ? "grey" : "gold"}>{flags.phone === "none" ? "No Phone" : "Phone Unverified"}</Badge>
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Sessions" value={user.counts.sessions} sub={`↑ ${user.counts.sessions_this_month} this month`} subTone="blue" />
          <StatCard label="Check-ins" value={user.counts.checkins} sub={`${user.streak}-day streak`} />
          <StatCard label="Posts" value={user.counts.posts} sub="Community" />
          <StatCard label="Streak" value={user.streak} sub="days active" dark />
        </div>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-extraboldNunito text-navy-800">Mood Trend — Last {user.mood?.window_days ?? 30} days</span>
            {trendLabel ? (
              <Badge tone={trendLabel === "Improving" ? "green" : trendLabel === "Declining" ? "red" : "grey"}>{trendLabel}</Badge>
            ) : null}
          </div>
          {hasMood ? (
            <>
              <div className="flex h-[60px] items-end gap-[3px]">
                {series.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date}: ${d.mood ?? "no check-in"}`}
                    className={`min-w-0 flex-1 rounded-[3px] ${moodBarClass(d.mood)}`}
                    style={{ height: d.mood === null ? "6px" : `${Math.max(12, (d.mood / 5) * 60)}px` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-ink-400">
                <span>{fmtDate(series[0]?.date)}</span>
                <span>{fmtDate(series[series.length - 1]?.date)}</span>
              </div>
            </>
          ) : (
            <div className="rounded-[10px] bg-surface-page px-4 py-6 text-center text-[12.5px] text-ink-400">
              No mood check-ins in the last {user.mood?.window_days ?? 30} days.
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <div className="mb-3 text-[15px] font-extraboldNunito text-navy-800">Top Concerns</div>
            {user.mood?.top_factors?.length ? (
              user.mood.top_factors.map((f, i) => {
                const [bar, text] = CONCERN_COLORS[i % CONCERN_COLORS.length].split(" ");
                return (
                  <div key={f.key} className="mb-3 last:mb-0">
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="text-ink-600">{f.label}</span>
                      <span className={`font-boldNunito ${text}`}>{f.percent}%</span>
                    </div>
                    <div className="h-[5px] w-full overflow-hidden rounded-full bg-ink-100">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${f.percent}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[10px] bg-surface-page px-4 py-5 text-center text-[12.5px] text-ink-400">
                No factors logged with check-ins yet.
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-3 text-[15px] font-extraboldNunito text-navy-800">Mental Health Score</div>
            {user.wellbeing ? (
              <div className="flex items-center gap-4">
                <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[5px] border-wellness-400">
                  <div className="text-center leading-none">
                    <div className="text-[22px] font-extraboldNunito text-navy-800">{user.wellbeing.score}</div>
                    <div className="mt-0.5 text-[9px] text-ink-400">/100</div>
                  </div>
                </div>
                <div>
                  <div className="text-[14px] font-boldNunito text-wellness-600">{user.wellbeing.comparison}</div>
                  <div className="mt-1 text-[12px] text-ink-500">
                    {user.wellbeing.month_delta_percent !== null
                      ? `Mood ${user.wellbeing.month_delta_percent >= 0 ? "up" : "down"} ${Math.abs(user.wellbeing.month_delta_percent)}% vs last month. `
                      : ""}
                    {user.wellbeing.basis}.
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] bg-surface-page px-4 py-5 text-center text-[12.5px] text-ink-400">
                Appears after the first mood check-in.
              </div>
            )}
          </Card>
        </div>

        <PanelCard
          title="Recent Sessions"
          action={
            <button type="button" onClick={onViewAll} className="cursor-pointer text-[12.5px] font-boldNunito text-brand-400">
              View all →
            </button>
          }
        >
          <Table head={["Date", "Therapist", "Type", "Rating"]}>
            {(user.recent_sessions ?? []).length === 0 ? (
              <EmptyRow span={4}>No sessions yet.</EmptyRow>
            ) : (
              user.recent_sessions.map((s) => (
                <Tr key={s.id}>
                  <Td first>{fmtDate(s.starts_at)}</Td>
                  <Td>{s.therapist?.user ? `${s.therapist.user.first_name} ${s.therapist.user.last_name}` : "—"}</Td>
                  <Td><Badge tone={FORMAT_TONE[s.format] ?? "grey"} className="capitalize">{s.format}</Badge></Td>
                  <Td><Stars rating={s.review?.rating} /></Td>
                </Tr>
              ))
            )}
          </Table>
        </PanelCard>
      </div>
    </div>
  );
};
UserOverviewTab.propTypes = {
  user: PropTypes.object.isRequired,
  onStrike: PropTypes.func.isRequired,
  onBan: PropTypes.func.isRequired,
  onViewAll: PropTypes.func.isRequired,
};

const UserJourneyTab = ({ id }) => {
  const { data, isFetching } = useGetPlatformUserJourneyQuery(id);
  const events = data ?? [];

  if (isFetching) return <SkeletonPanel />;

  return (
    <Card>
      <div className="mb-4 text-[15px] font-extraboldNunito text-navy-800">Journey</div>
      {events.length === 0 ? (
        <div className="rounded-[10px] bg-surface-page px-4 py-6 text-center text-[12.5px] text-ink-400">No milestones yet.</div>
      ) : (
        <ol className="relative ml-2 border-l-2 border-ink-100 pl-5">
          {events.map((e) => (
            <li key={e.key} className="relative mb-5 last:mb-0">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-400" />
              <div className="text-[13px] font-boldNunito text-navy-800">{e.label}</div>
              <div className="text-[11.5px] text-ink-400">{when(e.at)}</div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};
UserJourneyTab.propTypes = { id: PropTypes.string.isRequired };

const UserSessionsTab = ({ id }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformUserSessionsQuery({ id, page });
  const rows = data?.data ?? [];

  if (isFetching) return <SkeletonPanel />;

  return (
    <PanelCard>
      <Table head={["When", "Therapist", "Format", "Status", "Rating"]}>
        {rows.length === 0 ? (
          <EmptyRow span={5}>No sessions yet.</EmptyRow>
        ) : (
          rows.map((s) => (
            <Tr key={s.id}>
              <Td first>{when(s.starts_at)}</Td>
              <Td>{s.therapist?.user ? `${s.therapist.user.first_name} ${s.therapist.user.last_name}` : "—"}</Td>
              <Td className="capitalize">{s.format}</Td>
              <Td><StatusBadge status={s.status} /></Td>
              <Td>{s.review?.rating ? `${s.review.rating}★` : "—"}</Td>
            </Tr>
          ))
        )}
      </Table>
      <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
    </PanelCard>
  );
};
UserSessionsTab.propTypes = { id: PropTypes.string.isRequired };

const UserMoodTab = ({ id }) => {
  const { data, isFetching } = useGetPlatformUserMoodQuery(id);

  if (isFetching) return <SkeletonPanel />;

  const series = data?.series ?? [];
  const hasData = series.some((d) => d.mood !== null);

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.Zap size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={data?.streak ?? 0} label="Day streak" />
        <KpiCard icon={<Icon.Activity size={17} className="text-brand-600" />} iconBg="bg-brand-25" value={data?.average_mood ?? "—"} label="Average mood" />
        <KpiCard icon={<Icon.Calendar size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={data?.days_logged ?? 0} label={`Days logged (${data?.window_days ?? 0}d window)`} />
      </KpiRow>

      <PanelCard title={`Mood trend — last ${data?.window_days ?? 0} days`}>
        {hasData ? (
          <div className="flex h-[120px] items-end gap-1 overflow-x-auto p-5">
            {series.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.mood ?? "no check-in"}`}
                className={`w-full min-w-[6px] flex-1 rounded-t-[3px] ${d.mood === null ? "bg-ink-100" : "bg-wellness-400"}`}
                style={{ height: d.mood === null ? "6px" : `${Math.max(8, (d.mood / 5) * 100)}px` }}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[12.5px] text-ink-400">No mood check-ins in this window.</div>
        )}
      </PanelCard>

      {data?.top_factors?.length ? (
        <Card>
          <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">Top factors mentioned</div>
          <div className="flex flex-wrap gap-1.5">
            {data.top_factors.map((f) => (
              <Badge key={f.key} tone="purple">
                {f.label} · {f.percent}%
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
};
UserMoodTab.propTypes = { id: PropTypes.string.isRequired };

const UserCommunityTab = ({ id }) => {
  const { data, isFetching } = useGetPlatformUserCommunityQuery(id);

  if (isFetching) return <SkeletonPanel />;

  const posts = data?.posts ?? [];
  const comments = data?.comments ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PanelCard title="Recent posts">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-[12.5px] text-ink-400">No posts yet.</div>
        ) : (
          <div className="flex flex-col">
            {posts.map((p) => (
              <div key={p.id} className="border-b border-[#F5F5F5] px-5 py-3 last:border-b-0">
                <div className="mb-1 text-[13px] font-boldNunito text-ink-800">{p.title || "Untitled"}</div>
                <div className="mb-1.5 line-clamp-2 text-[12px] text-ink-500">{p.body}</div>
                <div className="text-[10.5px] text-ink-400">{when(p.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>

      <PanelCard title="Recent comments">
        {comments.length === 0 ? (
          <div className="p-6 text-center text-[12.5px] text-ink-400">No comments yet.</div>
        ) : (
          <div className="flex flex-col">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-[#F5F5F5] px-5 py-3 last:border-b-0">
                <div className="mb-1.5 line-clamp-2 text-[12px] text-ink-600">{c.comment}</div>
                <div className="text-[10.5px] text-ink-400">{when(c.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
};
UserCommunityTab.propTypes = { id: PropTypes.string.isRequired };

const UserActivityTab = ({ id }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformUserActivityQuery({ id, page });
  const rows = data?.data ?? [];

  if (isFetching) return <SkeletonPanel />;

  return (
    <PanelCard>
      <Table head={["Event", "Title", "Description", "When"]}>
        {rows.length === 0 ? (
          <EmptyRow span={4}>No activity logged for this user yet.</EmptyRow>
        ) : (
          rows.map((log) => (
            <Tr key={log.id}>
              <Td first className="capitalize">{log.event ?? "—"}</Td>
              <Td>{log.title}</Td>
              <Td className="max-w-[320px] truncate">{log.description}</Td>
              <Td>{when(log.created_at)}</Td>
            </Tr>
          ))
        )}
      </Table>
      <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
    </PanelCard>
  );
};
UserActivityTab.propTypes = { id: PropTypes.string.isRequired };

/* ── 17. Therapist Verification ──────────────────────────────────────── */

const VERIFICATION_TABS = [
  { key: "pending", label: "Pending" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "declined", label: "Declined" },
];

const DOC_LABEL = {
  degree_certificate: "Degree Certificate",
  licence: "Licence",
  government_id: "Government ID",
  indemnity_insurance: "Indemnity Insurance",
  headshot: "Headshot",
};

export const PlatformTherapistVerificationPage = () => {
  const { showToast } = usePlatform();
  const [tab, setTab] = useState("pending");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformTherapistVerificationsQuery({ tab, page });
  const [startReview] = useStartReviewPlatformApplicationMutation();
  const [approve] = useApprovePlatformApplicationMutation();
  const [reject] = useRejectPlatformApplicationMutation();
  const [verdictDocument] = useVerdictPlatformDocumentMutation();
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  const rows = data?.applications?.data ?? [];
  const overview = data?.overview ?? {};
  const tabCounts = { pending: overview.pending ?? 0, under_review: overview.under_review ?? 0, approved: overview.approved_mtd ?? 0, declined: overview.declined_mtd ?? 0 };

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  const doReject = async () => {
    if (!rejectingId || !reason.trim()) return;
    await act(() => reject({ id: rejectingId, reason }).unwrap(), "Application rejected");
    setRejectingId(null);
    setReason("");
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiRow>
        <KpiCard icon={<Icon.Clock size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={overview.pending ?? 0} label="Pending Review" />
        <KpiCard icon={<Icon.Eye size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={overview.under_review ?? 0} label="Under Review" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={overview.approved_mtd ?? 0} label="Approved (MTD)" />
        <KpiCard icon={<Icon.XCircle size={17} className="text-ink-400" />} iconBg="bg-ink-100" value={overview.declined_mtd ?? 0} label="Declined (MTD)" />
      </KpiRow>

      <div className="flex flex-wrap gap-2">
        {VERIFICATION_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`cursor-pointer rounded-[10px] px-3.5 py-2 text-[12.5px] font-boldNunito ${tab === t.key ? "bg-navy-800 text-white" : "border border-surface-line bg-white text-ink-600"}`}
          >
            {t.label} ({tabCounts[t.key] ?? 0})
          </button>
        ))}
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : rows.length === 0 ? (
        <PanelCard><div className="p-8 text-center text-[12.5px] text-ink-400">No applications in this queue.</div></PanelCard>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((app) => (
            <Card key={app.id}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extraboldNunito text-white" style={{ background: avatarColor(app.id) }}>
                    {initialsOfName(app.user?.name || "?")}
                  </span>
                  <div>
                    <div className="text-[14px] font-extraboldNunito text-navy-800">Dr. {app.user?.name || "—"}</div>
                    <div className="text-[11.5px] text-ink-400">{app.user?.email} · {app.specialties?.join(", ") || "No specialties yet"}</div>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field label="Credential">{app.credential_type || "—"}</Field>
                <Field label="Experience">{app.years_experience != null ? `${app.years_experience} yrs` : "—"}</Field>
                <Field label="Submitted">{fmtDate(app.submitted_at)}</Field>
              </div>

              {(app.documents ?? []).length ? (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {app.documents.map((d) => (
                    <span key={d.id} className="inline-flex items-center gap-1.5 rounded-[8px] border border-ink-200 bg-surface-page px-2.5 py-1.5 text-[11.5px]">
                      {d.file_url ? (
                        <a href={d.file_url} target="_blank" rel="noreferrer" className="font-boldNunito text-brand-600 hover:underline">
                          {DOC_LABEL[d.type] ?? d.type}
                        </a>
                      ) : (
                        <span className="text-ink-400">{DOC_LABEL[d.type] ?? d.type} (not uploaded)</span>
                      )}
                      {d.status === "pending" && d.file_url ? (
                        <span className="flex gap-0.5">
                          <button type="button" title="Approve document" onClick={() => act(() => verdictDocument({ documentId: d.id, status: "approved" }).unwrap(), "Document approved")} className="cursor-pointer text-wellness-600">
                            <Icon.Check size={12} />
                          </button>
                          <button type="button" title="Reject document" onClick={() => act(() => verdictDocument({ documentId: d.id, status: "rejected", reason: "Rejected by staff" }).unwrap(), "Document rejected")} className="cursor-pointer text-signal-error">
                            <Icon.X size={12} />
                          </button>
                        </span>
                      ) : (
                        <StatusBadge status={d.status} />
                      )}
                    </span>
                  ))}
                </div>
              ) : null}

              {rejectingId === app.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Rejection reason"
                    className="h-9 flex-1 rounded-[8px] border-[1.5px] border-ink-200 px-3 text-[12.5px]"
                  />
                  <SecondaryButton className="!px-2.5 !py-1.5 !text-[11px]" onClick={doReject}>Confirm reject</SecondaryButton>
                  <SecondaryButton className="!px-2.5 !py-1.5 !text-[11px]" onClick={() => setRejectingId(null)}>Cancel</SecondaryButton>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {app.status === "submitted" ? (
                    <SecondaryButton className="!px-2.5 !py-1 !text-[11px]" onClick={() => act(() => startReview(app.id).unwrap(), "Moved to Under Review")}>Review Application</SecondaryButton>
                  ) : null}
                  {["submitted", "in_review"].includes(app.status) ? (
                    <>
                      <button type="button" onClick={() => act(() => approve(app.id).unwrap(), "Application approved — therapist role granted")} className="cursor-pointer rounded-[10px] bg-wellness-25 px-3.5 py-2 text-[12.5px] font-boldNunito text-wellness-600 hover:bg-wellness-50">
                        ✓ Approve
                      </button>
                      <button type="button" onClick={() => setRejectingId(app.id)} className="cursor-pointer rounded-[10px] bg-surface-errorTint px-3.5 py-2 text-[12.5px] font-boldNunito text-surface-errorInk hover:bg-[#FFD9D9]">
                        ✕ Decline with Reason
                      </button>
                    </>
                  ) : app.status === "rejected" && app.rejection_reason ? (
                    <span className="text-[11.5px] text-ink-400">Declined: {app.rejection_reason}</span>
                  ) : null}
                </div>
              )}
            </Card>
          ))}
          <Pager page={data?.applications?.current_page ?? 1} lastPage={data?.applications?.last_page ?? 1} onChange={setPage} />
        </div>
      )}
    </div>
  );
};

/* ── 18. Performance Watch ────────────────────────────────────────────── */

const TIER_LABEL = { red: "RED FLAG", yellow: "YELLOW FLAG" };
const TIER_BADGE_TONE = { red: "red", yellow: "gold" };

const RatingTrendChart = ({ ratings }) => {
  if (!ratings?.length) {
    return <div className="rounded-[8px] bg-surface-page px-3 py-4 text-center text-[11px] text-ink-400">Not enough reviews yet.</div>;
  }
  return (
    <div>
      <div className="flex h-[50px] items-end gap-1">
        {ratings.map((r, i) => (
          <div key={i} className={`min-w-0 flex-1 rounded-t-[2px] ${r >= 4 ? "bg-wellness-400" : r === 3 ? "bg-gold-400" : "bg-[#D45B5B]"}`} style={{ height: `${Math.max(8, (r / 5) * 50)}px` }} title={`${r}★`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[9.5px] text-ink-400"><span>Oldest</span><span>Latest</span></div>
    </div>
  );
};
RatingTrendChart.propTypes = { ratings: PropTypes.array };

const emptyThresholdForm = null;

export const PlatformPerformancePage = () => {
  const { showToast } = usePlatform();
  const [flaggedOnly, setFlaggedOnly] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformPerformanceQuery({ flagged_only: flaggedOnly || undefined, page });
  const [updateThreshold, { isLoading: isSavingThreshold }] = useUpdatePlatformPerformanceThresholdMutation();
  const [sendWarning] = useSendPlatformTherapistWarningMutation();
  const [holdTherapist] = useHoldPlatformTherapistMutation();
  const [clearHold] = useClearHoldPlatformTherapistMutation();
  const [reverify] = useReverifyPlatformTherapistMutation();
  const [terminate] = useTerminatePlatformTherapistMutation();

  const [editingThresholds, setEditingThresholds] = useState(false);
  const [thresholdForm, setThresholdForm] = useState(emptyThresholdForm);
  const [warningFor, setWarningFor] = useState(null);
  const [warningNote, setWarningNote] = useState("");
  const [terminatingId, setTerminatingId] = useState(null);
  const [terminateReason, setTerminateReason] = useState("");

  const rows = data?.therapists ?? [];
  const t = data?.thresholds ?? {};

  const act = async (fn, okMsg) => {
    try {
      await fn();
      showToast(okMsg);
    } catch (err) {
      showToast(apiErrorMessage(err, "That action didn't go through"));
    }
  };

  const openThresholds = () => {
    setThresholdForm({ ...t });
    setEditingThresholds(true);
  };

  const saveThresholds = async () => {
    try {
      for (const key of Object.keys(thresholdForm)) {
        if (thresholdForm[key] !== t[key]) {
          await updateThreshold({ key, value: thresholdForm[key] }).unwrap();
        }
      }
      showToast("Thresholds updated");
      setEditingThresholds(false);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't save those thresholds"));
    }
  };

  const sendTheWarning = async () => {
    if (!warningFor) return;
    await act(() => sendWarning({ id: warningFor, note: warningNote || undefined }).unwrap(), "Warning email sent");
    setWarningFor(null);
    setWarningNote("");
  };

  const confirmTerminate = async () => {
    if (!terminatingId || !terminateReason.trim()) return;
    await act(() => terminate({ id: terminatingId, reason: terminateReason }).unwrap(), "Account terminated");
    setTerminatingId(null);
    setTerminateReason("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5 shadow-[0_4px_16px_rgba(20,27,52,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gold-400/[0.14]">
              <Icon.AlertTriangle size={18} className="text-gold-400" />
            </span>
            <div>
              <div className="text-[15px] font-extraboldNunito text-white">Automated Performance Thresholds</div>
              <div className="text-[11.5px] text-white/50">System monitors every therapist continuously. Flags are raised automatically based on these rules.</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-[10px] bg-white/[0.06] px-3.5 py-2 text-center">
              <div className="text-[9.5px] font-boldNunito uppercase tracking-[0.06em] text-gold-400">Yellow Flag</div>
              <div className="text-[13px] font-extraboldNunito text-white">Avg &lt; {t.performance_yellow_rating}</div>
              <div className="text-[9.5px] text-white/40">over {t.performance_yellow_min_sessions}+ sessions</div>
            </div>
            <div className="rounded-[10px] bg-white/[0.06] px-3.5 py-2 text-center">
              <div className="text-[9.5px] font-boldNunito uppercase tracking-[0.06em] text-[#FF9B9B]">Red Flag</div>
              <div className="text-[13px] font-extraboldNunito text-white">Avg &lt; {t.performance_red_rating}</div>
              <div className="text-[9.5px] text-white/40">over {t.performance_red_min_sessions}+ sessions</div>
            </div>
            <div className="rounded-[10px] bg-white/[0.06] px-3.5 py-2 text-center">
              <div className="text-[9.5px] font-boldNunito uppercase tracking-[0.06em] text-white/60">Auto-Suspend</div>
              <div className="text-[13px] font-extraboldNunito text-white">{t.performance_dispute_auto_suspend}+ disputes</div>
              <div className="text-[9.5px] text-white/40">within 30 days</div>
            </div>
            <SecondaryButton className="!border-white/20 !bg-white/[0.06] !text-white" onClick={openThresholds}>Edit Thresholds</SecondaryButton>
          </div>
        </div>
      </div>

      <KpiRow>
        <KpiCard icon={<Icon.AlertTriangle size={17} className="text-gold-600" />} iconBg="bg-gold-50" value={data?.yellow_count ?? 0} label="Yellow Flag" />
        <KpiCard icon={<Icon.AlertCircle size={17} className="text-signal-error" />} iconBg="bg-surface-errorTint" value={data?.red_count ?? 0} label="Red Flag" />
        <KpiCard icon={<Icon.Clock size={17} className="text-ink-400" />} iconBg="bg-ink-100" value={data?.suspended_pending ?? 0} label="Suspended Pending" />
        <KpiCard icon={<Icon.CheckCircle size={17} className="text-wellness-600" />} iconBg="bg-wellness-25" value={data?.resolved_this_month ?? 0} label="Resolved This Month" />
      </KpiRow>

      <div className="flex items-center justify-between">
        <span className="text-[15px] font-extraboldNunito text-navy-800">{data?.flagged_count ?? 0} flagged therapists</span>
        <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-500">
          <input type="checkbox" checked={!flaggedOnly} onChange={(e) => { setFlaggedOnly(!e.target.checked); setPage(1); }} />
          Show all therapists
        </label>
      </div>

      {isFetching ? (
        <SkeletonPanel />
      ) : rows.length === 0 ? (
        <PanelCard><div className="p-8 text-center text-[12.5px] text-ink-400">{flaggedOnly ? "No flagged therapists — everyone's within range." : "No therapist data yet."}</div></PanelCard>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((th) => (
            <Card key={th.therapist_id} className={th.tier === "red" ? "!border-l-[3px] !border-l-signal-error" : th.tier === "yellow" ? "!border-l-[3px] !border-l-gold-400" : ""}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extraboldNunito text-white" style={{ background: avatarColor(th.therapist_id) }}>
                    {initialsOfName(th.name || "?")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-extraboldNunito text-navy-800">Dr. {th.name || "—"}</span>
                      {th.tier ? <Badge tone={TIER_BADGE_TONE[th.tier]}>{TIER_LABEL[th.tier]}</Badge> : th.auto_suspend_flag ? <Badge tone="red">AUTO-SUSPEND</Badge> : null}
                    </div>
                    <div className="text-[11.5px] text-ink-400">{th.specialty || "No specialty on file"} · {th.total_sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-extraboldNunito leading-none text-navy-800">{th.avg_rating ?? "—"}</div>
                  <div className="text-[10.5px] text-ink-400">avg rating</div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)_auto]">
                <div>
                  <div className="mb-1.5 text-[10.5px] font-boldNunito uppercase tracking-[0.05em] text-ink-400">Rating Trend (last 12 sessions)</div>
                  <RatingTrendChart ratings={th.recent_ratings} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  <Field label="Open Disputes"><span className={th.open_disputes > 0 ? "text-signal-error" : ""}>{th.open_disputes}</span></Field>
                  <Field label="Low Ratings (≤2)"><span className={th.low_ratings_count > 0 ? "text-signal-error" : ""}>{th.low_ratings_count}</span></Field>
                  <Field label="Cancellations">{th.cancellations}</Field>
                  <Field label="No-show Rate">{th.no_show_rate_percent !== null ? `${th.no_show_rate_percent}%` : "—"}</Field>
                </div>

                <div className="flex flex-col gap-1.5 lg:w-[190px]">
                  <div className="mb-0.5 text-[10.5px] font-boldNunito uppercase tracking-[0.05em] text-ink-400">Admin Actions</div>
                  <button type="button" onClick={() => setWarningFor(th.therapist_id)} className="cursor-pointer rounded-[8px] bg-gold-50 px-3 py-2 text-left text-[12px] font-boldNunito text-gold-700 hover:bg-[#F3E4C4]">
                    ✉ Send Warning Email
                  </button>
                  {th.review_hold_at ? (
                    <button type="button" onClick={() => act(() => clearHold(th.therapist_id).unwrap(), "Review hold cleared")} className="cursor-pointer rounded-[8px] bg-wellness-25 px-3 py-2 text-left text-[12px] font-boldNunito text-wellness-600 hover:bg-wellness-50">
                      ⏱ Clear Review Hold
                    </button>
                  ) : (
                    <button type="button" onClick={() => act(() => holdTherapist(th.therapist_id).unwrap(), "Placed on review hold")} className="cursor-pointer rounded-[8px] bg-brand-25 px-3 py-2 text-left text-[12px] font-boldNunito text-brand-600 hover:bg-brand-50">
                      ⏱ Place on Review Hold
                    </button>
                  )}
                  <button type="button" onClick={() => act(() => reverify(th.therapist_id).unwrap(), "Flagged for re-verification")} className="cursor-pointer rounded-[8px] bg-[#F5F0FF] px-3 py-2 text-left text-[12px] font-boldNunito text-[#6B44A8] hover:bg-[#EAE0FF]">
                    ✓ Force Re-verification
                  </button>
                  <button type="button" onClick={() => setTerminatingId(th.therapist_id)} className="cursor-pointer rounded-[8px] bg-surface-errorTint px-3 py-2 text-left text-[12px] font-boldNunito text-surface-errorInk hover:bg-[#FFD9D9]">
                    🗑 Terminate Account
                  </button>
                </div>
              </div>

              <div className="border-t border-[#F5F5F5] pt-2.5 text-[11px] text-ink-400">
                {th.last_action ? `${th.last_action.title} · ${when(th.last_action.at)} by ${th.last_action.by}` : "No action taken yet · Auto-flagged by system"}
              </div>
            </Card>
          ))}
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </div>
      )}

      <Modal open={editingThresholds} onClose={() => setEditingThresholds(false)} title="Edit performance thresholds" width="max-w-[440px]">
        {thresholdForm ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-boldNunito text-ink-400">Yellow flag — avg rating below</label>
              <input type="number" step="0.1" value={thresholdForm.performance_yellow_rating} onChange={(e) => setThresholdForm((f) => ({ ...f, performance_yellow_rating: e.target.value }))} className="h-10 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-boldNunito text-ink-400">Yellow flag — minimum sessions</label>
              <input type="number" value={thresholdForm.performance_yellow_min_sessions} onChange={(e) => setThresholdForm((f) => ({ ...f, performance_yellow_min_sessions: e.target.value }))} className="h-10 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-boldNunito text-ink-400">Red flag — avg rating below</label>
              <input type="number" step="0.1" value={thresholdForm.performance_red_rating} onChange={(e) => setThresholdForm((f) => ({ ...f, performance_red_rating: e.target.value }))} className="h-10 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-boldNunito text-ink-400">Red flag — minimum sessions</label>
              <input type="number" value={thresholdForm.performance_red_min_sessions} onChange={(e) => setThresholdForm((f) => ({ ...f, performance_red_min_sessions: e.target.value }))} className="h-10 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-boldNunito text-ink-400">Auto-suspend — open disputes within 30 days</label>
              <input type="number" value={thresholdForm.performance_dispute_auto_suspend} onChange={(e) => setThresholdForm((f) => ({ ...f, performance_dispute_auto_suspend: e.target.value }))} className="h-10 w-full rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px]" />
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <SecondaryButton onClick={() => setEditingThresholds(false)}>Cancel</SecondaryButton>
              <PrimaryButton disabled={isSavingThreshold} onClick={saveThresholds}>{isSavingThreshold ? "Saving…" : "Save thresholds"}</PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={!!warningFor} onClose={() => setWarningFor(null)} title="Send warning email" width="max-w-[420px]">
        <p className="mb-3 text-[13px] leading-[1.6] text-ink-500">This sends a real email to the therapist about their recent ratings.</p>
        <textarea value={warningNote} onChange={(e) => setWarningNote(e.target.value)} placeholder="Add a personal note (optional)" className="mb-4 h-24 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setWarningFor(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={sendTheWarning}>Send email</PrimaryButton>
        </div>
      </Modal>

      <Modal open={!!terminatingId} onClose={() => setTerminatingId(null)} title="Terminate this account?" width="max-w-[420px]">
        <p className="mb-3 text-[13px] leading-[1.6] text-ink-500">This bans the therapist&apos;s account and removes them from client search immediately. This cannot be undone from here.</p>
        <textarea value={terminateReason} onChange={(e) => setTerminateReason(e.target.value)} placeholder="Reason (required)" className="mb-4 h-20 w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px]" />
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={() => setTerminatingId(null)}>Cancel</SecondaryButton>
          <button type="button" disabled={!terminateReason.trim()} onClick={confirmTerminate} className="cursor-pointer rounded-[10px] bg-[#AC4242] px-4 py-[9px] text-[13px] font-boldNunito text-white disabled:cursor-not-allowed disabled:opacity-50">
            Terminate account
          </button>
        </div>
      </Modal>
    </div>
  );
};

/* ── 19. Activity Logs ────────────────────────────────────────────────── */

export const PlatformActivityLogsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetPlatformActivityLogsQuery({ search: search || undefined, page });
  const rows = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search activity…"
        className="h-10 w-full max-w-[280px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
      />

      {isFetching ? (
        <SkeletonPanel />
      ) : (
        <PanelCard>
          <Table head={["Event", "Title", "Description", "By", "When"]}>
            {rows.length === 0 ? (
              <EmptyRow span={5}>No activity logged yet.</EmptyRow>
            ) : (
              rows.map((log) => (
                <Tr key={log.id}>
                  <Td first className="capitalize">{log.event ?? "—"}</Td>
                  <Td>{log.title}</Td>
                  <Td className="max-w-[320px] truncate">{log.description}</Td>
                  <Td>{log.user ? `${log.user.first_name} ${log.user.last_name}` : "System"}</Td>
                  <Td>{when(log.created_at)}</Td>
                </Tr>
              ))
            )}
          </Table>
          <Pager page={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} onChange={setPage} />
        </PanelCard>
      )}
    </div>
  );
};
