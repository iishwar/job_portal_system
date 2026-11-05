"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Briefcase,
  Building2,
  Users,
  UserCheck,
  UserX,
  FileText,
  Trash2,
  Search,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Check
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  // Auth states
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Admin Data states
  const [loadingData, setLoadingData] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalHired: 0,
    totalRejected: 0,
    totalEmployers: 0,
    totalJobSeekers: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState("overview");

  // Search & Filter states
  const [companySearch, setCompanySearch] = useState("");
  const [rejectedSearch, setRejectedSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("ALL");

  // Delete modal dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    subtitle: "",
    warning: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Verify Authentication & Admin Email Access
  const checkAdminAuth = useCallback(async () => {
    setCheckingAuth(true);
    try {
      const localToken =
        typeof window !== "undefined"
          ? localStorage.getItem("job_portal_token")
          : null;

      const res = await fetch("/api/auth", {
        headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
      });
      const data = await res.json();

      if (data.authenticated && data.user) {
        if (data.user.email?.toLowerCase() === "admin@admin.com") {
          setCurrentUser(data.user);
          setIsAuthorized(true);
        } else {
          setCurrentUser(data.user);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthorized(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  // 2. Fetch Admin Data
  const fetchAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const localToken =
        typeof window !== "undefined"
          ? localStorage.getItem("job_portal_token")
          : null;

      const res = await fetch("/api/admin", {
        headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
      });

      if (!res.ok) {
        if (res.status === 403) setIsAuthorized(false);
        throw new Error("Failed to load admin dataset");
      }

      const data = await res.json();
      if (data.success) {
        setStats(data.stats || {});
        setCompanies(data.companies || []);
        setRejectedCandidates(data.rejectedCandidates || []);
        setJobs(data.jobs || []);
        setTimeline(data.timeline || []);
      } else {
        showToast(data.error || "Failed to fetch data", "error");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      showToast("Error retrieving admin records.", "error");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized, fetchAdminData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("job_portal_token");
        localStorage.removeItem("job_portal_user");
      }
      router.push("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/auth");
    }
  };

  // Trigger Delete Dialog
  const openDeleteJobModal = (job) => {
    setDeleteDialog({
      isOpen: true,
      type: "job",
      id: job.job_id,
      title: "Delete job listing?",
      subtitle: `"${job.title}" at ${job.company_name || job.employer_name}`,
      warning:
        "This listing will be permanently removed. All associated candidate applications will be wiped.",
    });
  };

  const openDeleteOrgModal = (company) => {
    setDeleteDialog({
      isOpen: true,
      type: "organization",
      id: company.user_id,
      title: "Delete organization account?",
      subtitle: `${company.company_name || company.employer_name} (${company.employer_email})`,
      warning:
        "Permanently cascades and deletes all posted jobs, applicant history, and company profile data.",
    });
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    setIsDeleting(true);
    try {
      const localToken =
        typeof window !== "undefined"
          ? localStorage.getItem("job_portal_token")
          : null;

      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(localToken ? { Authorization: `Bearer ${localToken}` } : {}),
        },
        body: JSON.stringify({
          type: deleteDialog.type,
          id: deleteDialog.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Record removed.", "success");
        setDeleteDialog({ isOpen: false, type: null, id: null, title: "", subtitle: "", warning: "" });
        fetchAdminData();
      } else {
        showToast(data.error || "Failed to delete record.", "error");
      }
    } catch (err) {
      console.error("Deletion failed:", err);
      showToast("Network error during deletion.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Datasets
  const filteredCompanies = useMemo(() => {
    const q = companySearch.toLowerCase().trim();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(q) ||
        c.employer_name?.toLowerCase().includes(q) ||
        c.employer_email?.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
    );
  }, [companies, companySearch]);

  const filteredRejected = useMemo(() => {
    const q = rejectedSearch.toLowerCase().trim();
    if (!q) return rejectedCandidates;
    return rejectedCandidates.filter(
      (r) =>
        r.candidate_name?.toLowerCase().includes(q) ||
        r.candidate_email?.toLowerCase().includes(q) ||
        r.job_title?.toLowerCase().includes(q) ||
        r.company_name?.toLowerCase().includes(q) ||
        r.employer_email?.toLowerCase().includes(q)
    );
  }, [rejectedCandidates, rejectedSearch]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company_name?.toLowerCase().includes(q) ||
        j.employer_name?.toLowerCase().includes(q) ||
        j.employer_email?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.job_type?.toLowerCase().includes(q)
    );
  }, [jobs, jobSearch]);

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === "ALL") return timeline;
    return timeline.filter((t) => t.event_type === timelineFilter);
  }, [timeline, timelineFilter]);

  // Loading Screen
  if (checkingAuth) {
    return (
      <div className="shadcn-screen-center">
        <style>{shadcnCss}</style>
        <div className="shadcn-loading-box">
          <RefreshCw className="shadcn-spin-icon" size={18} />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  // Access Denied Screen
  if (!isAuthorized) {
    return (
      <div className="shadcn-screen-center">
        <style>{shadcnCss}</style>
        <div className="shadcn-gate-card">
          <div className="shadcn-gate-icon">
            <ShieldAlert size={22} />
          </div>
          <h1 className="shadcn-gate-title">Access Restricted</h1>
          <p className="shadcn-gate-desc">
            This module is reserved for administrative personnel only (<code className="shadcn-code">admin@admin.com</code>).
          </p>
          {currentUser && (
            <div className="shadcn-gate-current">
              Signed in as <span className="font-semibold text-foreground">{currentUser.email}</span> ({currentUser.role})
            </div>
          )}
          <div className="shadcn-gate-actions">
            <button onClick={() => router.push("/auth")} className="s-btn s-btn-default w-full">
              Sign In as Admin
            </button>
            <button onClick={() => router.push("/home")} className="s-btn s-btn-outline w-full">
              Back to Job Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadcn-root">
      <style>{shadcnCss}</style>

      {/* Top Navbar */}
      <header className="s-navbar">
        <div className="s-navbar-container">
          <div className="s-navbar-left">
            <div className="s-brand">
              <span className="s-brand-title">Northbeam</span>
              <span className="s-badge s-badge-secondary">Admin</span>
            </div>
            <span className="s-slash">/</span>
            <span className="s-subnav-label">Monitoring Console</span>
          </div>

          <div className="s-navbar-right">
            <div className="s-user-identity">
              <div className="s-avatar">AD</div>
              <span className="s-user-email">admin@admin.com</span>
            </div>

            <button
              onClick={fetchAdminData}
              disabled={loadingData}
              className="s-btn s-btn-ghost s-btn-icon"
              title="Refresh dataset"
            >
              <RefreshCw size={14} className={loadingData ? "shadcn-spin-icon" : ""} />
            </button>

            <button
              onClick={handleLogout}
              className="s-btn s-btn-ghost s-btn-icon text-muted hover-destructive"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="s-main-content">
        {/* Page Title & Subtitle */}
        <div className="s-page-header">
          <div>
            <h1 className="s-page-title">Dashboard</h1>
            <p className="s-page-subtitle">
              Platform status, company hiring metrics, applicant moderation, and audit logs.
            </p>
          </div>
          <span className="s-badge s-badge-outline">
            Audit Mode
          </span>
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="s-kpi-grid">
          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Jobs Posted</span>
              <Briefcase size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalJobs}</div>
            <p className="s-kpi-hint">All listed positions</p>
          </div>

          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Applications</span>
              <FileText size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalApplications}</div>
            <p className="s-kpi-hint">Candidate submissions</p>
          </div>

          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Employed</span>
              <UserCheck size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalHired}</div>
            <p className="s-kpi-hint">Hired candidates</p>
          </div>

          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Rejected</span>
              <UserX size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalRejected}</div>
            <p className="s-kpi-hint">Total declined</p>
          </div>

          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Companies</span>
              <Building2 size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalEmployers}</div>
            <p className="s-kpi-hint">Active employers</p>
          </div>

          <div className="s-card s-kpi-card">
            <div className="s-kpi-head">
              <span className="s-kpi-label">Job Seekers</span>
              <Users size={14} className="s-kpi-icon" />
            </div>
            <div className="s-kpi-value">{stats.totalJobSeekers}</div>
            <p className="s-kpi-hint">Registered talent</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="s-tabs-nav">
          <button
            onClick={() => setActiveTab("overview")}
            className={`s-tab-item ${activeTab === "overview" ? "s-tab-item-active" : ""}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`s-tab-item ${activeTab === "companies" ? "s-tab-item-active" : ""}`}
          >
            Companies
            <span className="s-tab-badge">{companies.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`s-tab-item ${activeTab === "rejected" ? "s-tab-item-active" : ""}`}
          >
            Rejected Candidates
            <span className="s-tab-badge">{rejectedCandidates.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`s-tab-item ${activeTab === "jobs" ? "s-tab-item-active" : ""}`}
          >
            Jobs Management
            <span className="s-tab-badge">{jobs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`s-tab-item ${activeTab === "timeline" ? "s-tab-item-active" : ""}`}
          >
            Timeline
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ANALYTICS                                          */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="s-analytics-layout">
            <div className="s-card s-analytics-main">
              <div className="s-card-header">
                <h3 className="s-card-title">Company Hiring Ratios</h3>
                <p className="s-card-desc">Audit breakdown of hired vs rejected candidates by company</p>
              </div>
              <div className="s-card-body">
                {companies.length === 0 ? (
                  <div className="s-empty-notice">No companies recorded.</div>
                ) : (
                  <div className="s-company-ratio-list">
                    {companies.map((c) => {
                      const totalDecisions = (c.total_hired || 0) + (c.total_rejected || 0);
                      const hiredPct = totalDecisions > 0 ? Math.round((c.total_hired / totalDecisions) * 100) : 0;
                      const rejectedPct = totalDecisions > 0 ? Math.round((c.total_rejected / totalDecisions) * 100) : 0;

                      return (
                        <div key={c.user_id} className="s-ratio-row">
                          <div className="s-ratio-row-top">
                            <div>
                              <div className="s-ratio-company-name">
                                {c.company_name || c.employer_name}
                              </div>
                              <div className="s-ratio-company-email">{c.employer_email}</div>
                            </div>
                            <div className="s-ratio-numbers">
                              <span className="s-ratio-hired">{c.total_hired} hired</span>
                              <span className="s-ratio-slash">/</span>
                              <span className="s-ratio-rejected">{c.total_rejected} rejected</span>
                              <span className="s-badge s-badge-secondary ml-2">{c.total_jobs_posted} jobs</span>
                            </div>
                          </div>

                          <div className="s-progress-track">
                            <div
                              className="s-progress-bar s-progress-hired"
                              style={{ width: `${totalDecisions > 0 ? hiredPct : 0}%` }}
                              title={`${hiredPct}% Hired`}
                            />
                            <div
                              className="s-progress-bar s-progress-rejected"
                              style={{ width: `${totalDecisions > 0 ? rejectedPct : 0}%` }}
                              title={`${rejectedPct}% Rejected`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="s-card s-analytics-side">
              <div>
                <div className="s-card-header">
                  <h3 className="s-card-title">Platform Summary</h3>
                  <p className="s-card-desc">Aggregate outcome metrics</p>
                </div>
                <div className="s-card-body s-funnel-stack">
                  <div className="s-funnel-item">
                    <div className="s-funnel-label-row">
                      <span className="s-funnel-title">Hiring Rate</span>
                      <span className="s-funnel-pct">
                        {stats.totalApplications > 0
                          ? Math.round((stats.totalHired / stats.totalApplications) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="s-progress-track">
                      <div
                        className="s-progress-bar s-progress-hired"
                        style={{
                          width: `${
                            stats.totalApplications > 0
                              ? (stats.totalHired / stats.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="s-funnel-item">
                    <div className="s-funnel-label-row">
                      <span className="s-funnel-title">Rejection Rate</span>
                      <span className="s-funnel-pct">
                        {stats.totalApplications > 0
                          ? Math.round((stats.totalRejected / stats.totalApplications) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="s-progress-track">
                      <div
                        className="s-progress-bar s-progress-rejected"
                        style={{
                          width: `${
                            stats.totalApplications > 0
                              ? (stats.totalRejected / stats.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="s-boundary-box">
                    <span className="s-boundary-title">Role Boundary</span>
                    This view is read-only. Job publishing and applicant submission routes are restricted to candidate and employer roles.
                  </div>
                </div>
              </div>

              <div className="s-side-footer">
                Northbeam ATS Monitor • Real-time Sync
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COMPANIES                                          */}
        {/* ========================================================= */}
        {activeTab === "companies" && (
          <div className="s-card">
            <div className="s-card-header s-table-header-split">
              <div>
                <h3 className="s-card-title">Companies</h3>
                <p className="s-card-desc">Employers registered on platform and their hiring records</p>
              </div>
              <div className="s-search-box">
                <Search size={14} className="s-search-icon" />
                <input
                  type="text"
                  placeholder="Filter companies..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="s-input s-input-search"
                />
              </div>
            </div>

            <div className="s-table-wrapper">
              <table className="s-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Location / Industry</th>
                    <th>Jobs</th>
                    <th>Hired</th>
                    <th>Rejected</th>
                    <th>Submissions</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="s-table-empty">
                        No organizations found.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((c) => (
                      <tr key={c.user_id}>
                        <td>
                          <div className="s-table-bold">
                            {c.company_name || c.employer_name}
                          </div>
                          <div className="s-table-mono">{c.employer_email}</div>
                          {c.website && (
                            <a
                              href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="s-external-link"
                            >
                              <span>{c.website.replace(/^https?:\/\//, "")}</span>
                              <ArrowUpRight size={10} />
                            </a>
                          )}
                        </td>
                        <td>
                          <div className="s-table-text">{c.location || "Remote"}</div>
                          <div className="s-table-sub">{c.industry || "General"}</div>
                        </td>
                        <td>
                          <span className="s-table-mono">{c.total_jobs_posted}</span>
                        </td>
                        <td>
                          <span className="s-table-mono font-semibold">{c.total_hired}</span>
                        </td>
                        <td>
                          <span className="s-table-mono text-muted">{c.total_rejected}</span>
                        </td>
                        <td>
                          <span className="s-table-mono text-muted">{c.total_applications_received}</span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => openDeleteOrgModal(c)}
                            className="s-btn s-btn-ghost s-btn-icon text-muted hover-destructive"
                            title="Delete Organization Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REJECTED CANDIDATES                                */}
        {/* ========================================================= */}
        {activeTab === "rejected" && (
          <div className="s-card">
            <div className="s-card-header s-table-header-split">
              <div>
                <h3 className="s-card-title">Rejected Candidates</h3>
                <p className="s-card-desc">Applicants whose status was formally marked as rejected</p>
              </div>
              <div className="s-search-box">
                <Search size={14} className="s-search-icon" />
                <input
                  type="text"
                  placeholder="Filter candidate or role..."
                  value={rejectedSearch}
                  onChange={(e) => setRejectedSearch(e.target.value)}
                  className="s-input s-input-search"
                />
              </div>
            </div>

            <div className="s-table-wrapper">
              <table className="s-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role Applied</th>
                    <th>Company</th>
                    <th>Application</th>
                    <th>Rejected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejected.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="s-table-empty">
                        No rejected candidates on file.
                      </td>
                    </tr>
                  ) : (
                    filteredRejected.map((r) => (
                      <tr key={r.application_id}>
                        <td>
                          <div className="s-table-bold">{r.candidate_name}</div>
                          <div className="s-table-mono">{r.candidate_email}</div>
                          {r.candidate_phone && (
                            <div className="s-table-sub">{r.candidate_phone}</div>
                          )}
                        </td>
                        <td>
                          <div className="s-table-bold">{r.job_title}</div>
                          <div className="s-table-sub">{r.job_location || "Remote"}</div>
                        </td>
                        <td>
                          <div className="s-table-text">{r.company_name}</div>
                          <div className="s-table-mono">{r.employer_email}</div>
                        </td>
                        <td>
                          <div className="s-app-cell">
                            {r.resume_url || r.profile_resume_url ? (
                              <a
                                href={r.resume_url || r.profile_resume_url}
                                target="_blank"
                                rel="noreferrer"
                                className="s-inline-link"
                              >
                                <span>Resume</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="s-table-sub">No link</span>
                            )}
                            {r.cover_letter && (
                              <span className="s-cover-preview" title={r.cover_letter}>
                                &ldquo;{r.cover_letter}&rdquo;
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="s-table-mono text-muted">
                            {new Date(r.rejected_at || r.applied_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: JOBS MANAGEMENT                                    */}
        {/* ========================================================= */}
        {activeTab === "jobs" && (
          <div className="s-card">
            <div className="s-card-header s-table-header-split">
              <div>
                <h3 className="s-card-title">Jobs</h3>
                <p className="s-card-desc">Review and moderate active job listings</p>
              </div>
              <div className="s-search-box">
                <Search size={14} className="s-search-icon" />
                <input
                  type="text"
                  placeholder="Filter listings..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="s-input s-input-search"
                />
              </div>
            </div>

            <div className="s-table-wrapper">
              <table className="s-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Type / Mode</th>
                    <th>Salary</th>
                    <th>Submissions</th>
                    <th>Date Posted</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="s-table-empty">
                        No jobs listed.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((j) => (
                      <tr key={j.job_id}>
                        <td>
                          <div className="s-table-bold">{j.title}</div>
                          <div className="s-table-sub">{j.location || "Remote"}</div>
                        </td>
                        <td>
                          <div className="s-table-text">{j.company_name || j.employer_name}</div>
                          <div className="s-table-mono">{j.employer_email}</div>
                        </td>
                        <td>
                          <div className="s-table-text">{j.job_type || "Full-time"}</div>
                          <div className="s-table-sub">{j.mode || "REMOTE"}</div>
                        </td>
                        <td>
                          <div className="s-table-mono text-muted">
                            {j.min_salary || j.max_salary ? (
                              `$${Number(j.min_salary || 0).toLocaleString()} - $${Number(
                                j.max_salary || 0
                              ).toLocaleString()}`
                            ) : (
                              "Undisclosed"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="s-table-mono">
                            <span className="font-semibold">{j.application_count}</span>
                            <span className="text-muted ml-1">
                              ({j.hired_count || 0} hired)
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="s-table-mono text-muted">
                            {new Date(j.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => openDeleteJobModal(j)}
                            className="s-btn s-btn-ghost s-btn-icon text-muted hover-destructive"
                            title="Delete Job"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TIMELINE                                           */}
        {/* ========================================================= */}
        {activeTab === "timeline" && (
          <div className="s-card">
            <div className="s-card-header s-table-header-split">
              <div>
                <h3 className="s-card-title">Activity Timeline</h3>
                <p className="s-card-desc">Chronological system events stream</p>
              </div>

              <div className="s-filter-group">
                {["ALL", "HIRED", "REJECTED", "JOB_POSTED", "ORG_REGISTERED", "APPLIED"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTimelineFilter(type)}
                    className={`s-btn s-btn-sm ${
                      timelineFilter === type ? "s-btn-default" : "s-btn-outline"
                    }`}
                  >
                    {type === "ALL"
                      ? "All"
                      : type === "JOB_POSTED"
                      ? "Jobs"
                      : type === "ORG_REGISTERED"
                      ? "Companies"
                      : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="s-card-body">
              {filteredTimeline.length === 0 ? (
                <div className="s-empty-notice">No events recorded.</div>
              ) : (
                <div className="s-timeline-list">
                  {filteredTimeline.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="s-timeline-item">
                      <div className="s-timeline-left">
                        <div className="s-timeline-dot">
                          <Clock size={13} />
                        </div>
                        <div>
                          <div className="s-timeline-text">
                            {item.event_type === "HIRED" && (
                              <span>{item.actor_name} hired for &ldquo;{item.target_title}&rdquo;</span>
                            )}
                            {item.event_type === "REJECTED" && (
                              <span>{item.actor_name} rejected for &ldquo;{item.target_title}&rdquo;</span>
                            )}
                            {item.event_type === "APPLIED" && (
                              <span>{item.actor_name} applied for &ldquo;{item.target_title}&rdquo;</span>
                            )}
                            {item.event_type === "JOB_POSTED" && (
                              <span>New role &ldquo;{item.target_title}&rdquo; published</span>
                            )}
                            {item.event_type === "ORG_REGISTERED" && (
                              <span>{item.company_name || item.actor_name} registered</span>
                            )}
                          </div>
                          <div className="s-timeline-sub">
                            <span>{item.actor_email}</span>
                            {item.company_name && (
                              <>
                                <span className="s-dot-separator">•</span>
                                <span>{item.company_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="s-timeline-time">
                        {new Date(item.event_time).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteDialog.isOpen && (
        <div className="s-modal-overlay">
          <div className="s-modal-card">
            <div className="s-modal-head">
              <div className="s-modal-icon-destructive">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="s-modal-title">{deleteDialog.title}</h3>
                <p className="s-modal-subtitle">{deleteDialog.subtitle}</p>
              </div>
            </div>

            <p className="s-modal-warning">
              {deleteDialog.warning}
            </p>

            <div className="s-modal-actions">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  setDeleteDialog({
                    isOpen: false,
                    type: null,
                    id: null,
                    title: "",
                    subtitle: "",
                    warning: "",
                  })
                }
                className="s-btn s-btn-outline s-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="s-btn s-btn-destructive s-btn-sm"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="s-toast">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// PURE STANDALONE SHADCN DESIGN SYSTEM (ZERO EXTERNAL TAILWIND DEPENDENCY)
// =========================================================================
const shadcnCss = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg-page: #fafafa;
    --bg-card: #ffffff;
    --border: #e4e4e7;
    --border-subtle: #f4f4f5;
    --text-primary: #09090b;
    --text-muted: #71717a;
    --text-subtle: #a1a1aa;
    --bg-muted: #f4f4f5;
    --primary: #18181b;
    --primary-fg: #fafafa;
    --destructive: #ef4444;
    --destructive-bg: #fef2f2;
    --destructive-border: #fecaca;
    --radius: 8px;
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  body {
    background-color: var(--bg-page);
    color: var(--text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  .shadcn-root {
    min-height: 100vh;
    background-color: var(--bg-page);
    color: var(--text-primary);
    font-family: var(--font-sans);
    display: flex;
    flex-direction: column;
  }

  /* Screen Center States (Loading & Gatekeeper) */
  .shadcn-screen-center {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-page);
    padding: 24px;
    font-family: var(--font-sans);
  }

  .shadcn-loading-box {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-muted);
  }

  .shadcn-spin-icon {
    animation: s-spin 1s linear infinite;
  }

  @keyframes s-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .shadcn-gate-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }

  .shadcn-gate-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--destructive-bg);
    color: var(--destructive);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .shadcn-gate-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .shadcn-gate-desc {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .shadcn-code {
    background-color: var(--bg-muted);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    color: var(--text-primary);
  }

  .shadcn-gate-current {
    font-size: 12px;
    color: var(--text-muted);
    background-color: var(--bg-muted);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 20px;
  }

  .shadcn-gate-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Top Navbar */
  .s-navbar {
    background-color: var(--bg-card);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .s-navbar-container {
    max-width: 1280px;
    margin: 0 auto;
    height: 56px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .s-navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .s-brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .s-brand-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .s-slash {
    color: var(--text-subtle);
    font-size: 13px;
  }

  .s-subnav-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  .s-navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .s-user-identity {
    display: flex;
    align-items: center;
    gap: 8px;
    border-right: 1px solid var(--border);
    padding-right: 12px;
    margin-right: 4px;
  }

  .s-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--bg-muted);
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .s-user-email {
    font-size: 12px;
    font-family: monospace;
    color: var(--text-muted);
  }

  /* Main Container */
  .s-main-content {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    padding: 32px 24px 64px;
    flex: 1;
  }

  /* Header Section */
  .s-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }

  .s-page-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .s-page-subtitle {
    font-size: 14px;
    color: var(--text-muted);
  }

  /* 6 KPI Grid */
  .s-kpi-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  @media (max-width: 1024px) {
    .s-kpi-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 640px) {
    .s-kpi-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .s-kpi-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .s-kpi-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .s-kpi-label {
    font-size: 12px;
    font-weight: 500;
  }

  .s-kpi-icon {
    color: var(--text-muted);
  }

  .s-kpi-value {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 6px;
  }

  .s-kpi-hint {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* Tabs Nav */
  .s-tabs-nav {
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
    overflow-x: auto;
  }

  .s-tab-item {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 2px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .s-tab-item:hover {
    color: var(--text-primary);
  }

  .s-tab-item-active {
    color: var(--text-primary);
    border-bottom-color: var(--text-primary);
    font-weight: 600;
  }

  .s-tab-badge {
    background-color: var(--bg-muted);
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 9999px;
  }

  /* Card Container */
  .s-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  .s-card-header {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
  }

  .s-card-title {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }

  .s-card-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  .s-card-body {
    padding: 22px;
  }

  /* Analytics Layout (2 cols) */
  .s-analytics-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  @media (max-width: 960px) {
    .s-analytics-layout { grid-template-columns: 1fr; }
  }

  .s-analytics-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .s-company-ratio-list {
    display: flex;
    flex-direction: column;
  }

  .s-ratio-row {
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }

  .s-ratio-row:first-child { padding-top: 0; }
  .s-ratio-row:last-child { border-bottom: none; padding-bottom: 0; }

  .s-ratio-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .s-ratio-company-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .s-ratio-company-email {
    font-size: 12px;
    color: var(--text-muted);
  }

  .s-ratio-numbers {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }

  .s-ratio-hired { font-weight: 500; color: var(--text-primary); }
  .s-ratio-slash { color: var(--text-subtle); }
  .s-ratio-rejected { color: var(--text-muted); }

  /* Progress Bars */
  .s-progress-track {
    width: 100%;
    height: 6px;
    background-color: var(--bg-muted);
    border-radius: 9999px;
    display: flex;
    overflow: hidden;
  }

  .s-progress-bar {
    height: 100%;
    transition: width 0.3s ease;
  }

  .s-progress-hired {
    background-color: var(--primary);
  }

  .s-progress-rejected {
    background-color: #a1a1aa;
  }

  /* Funnel Stack */
  .s-funnel-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .s-funnel-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .s-funnel-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
  }

  .s-funnel-title { color: var(--text-muted); }
  .s-funnel-pct { font-weight: 600; color: var(--text-primary); }

  .s-boundary-box {
    margin-top: 12px;
    padding: 12px 14px;
    background-color: #fbfbfb;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .s-boundary-title {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .s-side-footer {
    border-top: 1px solid var(--border);
    padding: 14px 22px;
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
  }

  /* Tables */
  .s-table-header-split {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .s-search-box {
    position: relative;
    width: 240px;
  }

  .s-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }

  .s-input-search {
    padding-left: 32px;
  }

  .s-input {
    width: 100%;
    height: 34px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background-color: #ffffff;
    padding: 0 10px;
    font-size: 13px;
    color: var(--text-primary);
    outline: none;
    font-family: inherit;
  }

  .s-input:focus {
    border-color: var(--primary);
  }

  .s-table-wrapper {
    overflow-x: auto;
  }

  .s-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 13px;
  }

  .s-table th {
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    background-color: #fafafa;
    white-space: nowrap;
  }

  .s-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .s-table tbody tr:hover {
    background-color: #fafafa;
  }

  .s-table tbody tr:last-child td {
    border-bottom: none;
  }

  .s-table-bold {
    font-weight: 500;
    color: var(--text-primary);
  }

  .s-table-mono {
    font-family: monospace;
    font-size: 12px;
    color: var(--text-muted);
  }

  .s-table-text {
    color: var(--text-primary);
  }

  .s-table-sub {
    font-size: 12px;
    color: var(--text-muted);
  }

  .s-external-link {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: var(--text-muted);
    text-decoration: none;
    margin-top: 2px;
  }

  .s-external-link:hover {
    color: var(--text-primary);
  }

  .s-inline-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .s-inline-link:hover {
    text-decoration: underline;
  }

  .s-app-cell {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .s-cover-preview {
    font-size: 11px;
    color: var(--text-muted);
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .s-table-empty {
    text-align: center;
    padding: 40px !important;
    color: var(--text-muted);
  }

  /* Timeline */
  .s-filter-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .s-timeline-list {
    display: flex;
    flex-direction: column;
  }

  .s-timeline-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    gap: 16px;
  }

  .s-timeline-item:first-child { padding-top: 0; }
  .s-timeline-item:last-child { border-bottom: none; padding-bottom: 0; }

  .s-timeline-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .s-timeline-dot {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background-color: var(--bg-muted);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .s-timeline-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .s-timeline-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .s-dot-separator {
    margin: 0 6px;
  }

  .s-timeline-time {
    font-size: 12px;
    font-family: monospace;
    color: var(--text-muted);
    white-space: nowrap;
  }

  /* Buttons */
  .s-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .s-btn-sm {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
  }

  .s-btn-icon {
    width: 32px;
    height: 32px;
    padding: 0;
  }

  .s-btn-default {
    background-color: var(--primary);
    color: var(--primary-fg);
  }
  .s-btn-default:hover { background-color: #27272a; }

  .s-btn-outline {
    background-color: transparent;
    border-color: var(--border);
    color: var(--text-primary);
  }
  .s-btn-outline:hover { background-color: var(--bg-muted); }

  .s-btn-ghost {
    background-color: transparent;
    color: var(--text-muted);
  }
  .s-btn-ghost:hover {
    background-color: var(--bg-muted);
    color: var(--text-primary);
  }

  .s-btn-destructive {
    background-color: var(--destructive);
    color: #ffffff;
  }
  .s-btn-destructive:hover { background-color: #dc2626; }

  .hover-destructive:hover {
    color: var(--destructive) !important;
  }

  /* Badges */
  .s-badge {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 9999px;
    border: 1px solid transparent;
    line-height: 1.2;
  }

  .s-badge-secondary {
    background-color: var(--bg-muted);
    color: var(--text-primary);
  }

  .s-badge-outline {
    border-color: var(--border);
    color: var(--text-muted);
  }

  /* Modals */
  .s-modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 50;
  }

  .s-modal-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  }

  .s-modal-head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .s-modal-icon-destructive {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--destructive-bg);
    color: var(--destructive);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .s-modal-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .s-modal-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .s-modal-warning {
    font-size: 12px;
    color: var(--text-muted);
    border-left: 2px solid var(--destructive);
    padding-left: 10px;
    margin: 14px 0 20px;
    line-height: 1.4;
  }

  .s-modal-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  /* Toast */
  .s-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: var(--primary);
    color: var(--primary-fg);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .s-empty-notice {
    padding: 32px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
  }

  /* Utility helpers */
  .text-right { text-align: right; }
  .font-semibold { font-weight: 600; }
  .text-muted { color: var(--text-muted); }
  .text-foreground { color: var(--text-primary); }
  .w-full { width: 100%; }
  .ml-1 { margin-left: 4px; }
  .ml-2 { margin-left: 8px; }
`;
