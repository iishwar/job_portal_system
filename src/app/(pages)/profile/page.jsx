"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  User,
  Mail,
  MapPin,
  Bookmark,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Edit3,
  ShieldCheck,
  Building,
  Phone,
  Globe,
  FileText,
  AlertCircle,
  Layers,
  Users,
  Check
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ appliedCount: 0, savedCount: 0, postedJobsCount: 0 });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    location: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    // Employer fields
    company_name: "",
    company_description: "",
    website: "",
    logo_url: "",
    industry: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();

        if (isMounted) {
          if (!data.authenticated || !data.user) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("job_portal_token");
              localStorage.removeItem("job_portal_user");
            }
            router.replace("/auth");
            return;
          }

          const u = data.user;
          setUser(u);

          const prof = u.profile || {};
          setFormData({
            name: u.name || "",
            phone: prof.phone || "",
            bio: prof.bio || "",
            location: prof.location || "",
            resume_url: prof.resume_url || "",
            linkedin_url: prof.linkedin_url || "",
            github_url: prof.github_url || "",
            portfolio_url: prof.portfolio_url || "",
            company_name: prof.company_name || "",
            company_description: prof.company_description || "",
            website: prof.website || "",
            logo_url: prof.logo_url || "",
            industry: prof.industry || "",
          });

          // Fetch real stats
          if (u.role === "EMPLOYER") {
            const [jobsRes, appsRes] = await Promise.all([
              fetch(`/api/jobs?employerId=${u.user_id}`),
              fetch("/api/applications"),
            ]);
            const jobsData = await jobsRes.json();
            const appsData = await appsRes.json();
            setStats({
              postedJobsCount: jobsData.jobs?.length || 0,
              appliedCount: appsData.applications?.length || 0,
              savedCount: 0,
            });
          } else {
            const [savedRes, appsRes] = await Promise.all([
              fetch("/api/saved-jobs"),
              fetch("/api/applications"),
            ]);
            const savedData = await savedRes.json();
            const appsData = await appsRes.json();
            setStats({
              appliedCount: appsData.applications?.length || 0,
              savedCount: savedData.savedJobs?.length || 0,
              postedJobsCount: 0,
            });
          }

          setAuthChecking(false);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        if (isMounted) router.replace("/auth");
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem("job_portal_token");
      localStorage.removeItem("job_portal_user");
    }

    showToast("Logged out successfully");
    setTimeout(() => {
      router.replace("/auth");
    }, 400);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          updates: formData,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast("Profile updated successfully in PostgreSQL database!");
        setIsEditing(false);
      } else {
        showToast(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      showToast("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFBFD", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", color: "#5B5867" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid #E4E1EC", borderTopColor: "#3B6FE0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  const isEmployer = user?.role === "EMPLOYER";

  return (
    <div className="profile-page">
      <style>{styles}</style>

      {/* Top Navigation */}
      <header className="profile-nav">
        <div className="profile-nav__inner">
          <div className="profile-nav__left">
            <button className="nav__back-btn" onClick={() => router.push("/home")}>
              <ArrowLeft size={16} /> Back to Job Dashboard
            </button>
            <div className="nav__divider" />
            <div className="nav__brand" onClick={() => router.push("/home")}>
              <div className="nav__logo-icon">
                <Briefcase size={18} />
              </div>
              <span className="nav__mark">
                JobPortal<span className="nav__mark-dot">.</span>
              </span>
            </div>
          </div>

          <div className="profile-nav__right">
            <button className="nav__btn nav__btn--logout" onClick={handleLogout}>
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="profile-container">
        {/* Profile Header Hero */}
        <section className="profile-hero">
          <div className="profile-hero__banner" />
          <div className="profile-hero__content">
            <div className="profile-hero__main">
              <div className="profile-avatar">
                {(user?.name || "U").charAt(0).toUpperCase()}
                <span className="profile-avatar__badge" title="Active Account">
                  <Check size={12} />
                </span>
              </div>

              <div className="profile-hero__info">
                <div className="profile-hero__title-row">
                  <h1 className="profile-name">{user?.name || "User"}</h1>
                  <span className="status-pill status-pill--role">
                    {user?.role}
                  </span>
                </div>
                <p className="profile-headline">
                  {isEmployer
                    ? (formData.company_name || "Employer / Company Account")
                    : (formData.location ? `Based in ${formData.location}` : "Job Seeker")}
                </p>
                <div className="profile-meta">
                  <span className="meta-item">
                    <Mail size={14} /> {user?.email}
                  </span>
                  {formData.location && (
                    <span className="meta-item">
                      <MapPin size={14} /> {formData.location}
                    </span>
                  )}
                  {formData.phone && (
                    <span className="meta-item">
                      <Phone size={14} /> {formData.phone}
                    </span>
                  )}
                  <span className="meta-item">
                    <ShieldCheck size={14} /> {user?.is_email_verified ? "Email Verified" : "Active Member"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-hero__actions">
              {isEditing ? (
                <>
                  <button
                    className="btn btn--secondary"
                    onClick={() => {
                      setIsEditing(false);
                      const prof = user.profile || {};
                      setFormData({
                        name: user.name || "",
                        phone: prof.phone || "",
                        bio: prof.bio || "",
                        location: prof.location || "",
                        resume_url: prof.resume_url || "",
                        linkedin_url: prof.linkedin_url || "",
                        github_url: prof.github_url || "",
                        portfolio_url: prof.portfolio_url || "",
                        company_name: prof.company_name || "",
                        company_description: prof.company_description || "",
                        website: prof.website || "",
                        logo_url: prof.logo_url || "",
                        industry: prof.industry || "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn--primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={15} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Real Metrics from DB */}
          <div className="profile-stats">
            {isEmployer ? (
              <>
                <div className="stat-card">
                  <span className="stat-card__val">{stats.postedJobsCount}</span>
                  <span className="stat-card__lbl">Jobs Posted</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <span className="stat-card__val">{stats.appliedCount}</span>
                  <span className="stat-card__lbl">Applicants Received</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <span className="stat-card__val">{user?.role}</span>
                  <span className="stat-card__lbl">Account Level</span>
                </div>
              </>
            ) : (
              <>
                <div className="stat-card">
                  <span className="stat-card__val">{stats.appliedCount}</span>
                  <span className="stat-card__lbl">Applications Submitted</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <span className="stat-card__val">{stats.savedCount}</span>
                  <span className="stat-card__lbl">Saved Jobs</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <span className="stat-card__val">{user?.role}</span>
                  <span className="stat-card__lbl">Account Level</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Profile Body Grid */}
        <div className="profile-grid">
          {/* Main Column */}
          <div className="profile-col-main">
            {isEmployer ? (
              /* Employer Profile Details */
              <section className="card">
                <div className="card__head">
                  <h2 className="card__title">
                    <Building size={18} className="card__icon" /> Company Information
                  </h2>
                  {!isEditing && (
                    <button className="card__action-btn" onClick={() => setIsEditing(true)}>
                      <Edit3 size={14} /> Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="e.g. Acme Tech Solutions"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Industry</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. Fintech, SaaS, Healthcare"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Website</label>
                      <input
                        type="url"
                        className="form-input"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://acme.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Headquarters / Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Bangalore, India"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Logo URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Company Description</label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={formData.company_description}
                        onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
                        placeholder="Tell candidates about your company mission, team culture, and engineering stack..."
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--ink-faint)" }}>Company Name</h4>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>
                        {formData.company_name || "Not set yet"}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--ink-faint)" }}>About Company</h4>
                      <p className="bio-text">
                        {formData.company_description || "No description provided yet. Click 'Edit Profile' to add company overview."}
                      </p>
                    </div>

                    {formData.website && (
                      <div>
                        <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--ink-faint)" }}>Official Website</h4>
                        <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Globe size={14} /> {formData.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </section>
            ) : (
              /* Job Seeker Profile Details */
              <>
                <section className="card">
                  <div className="card__head">
                    <h2 className="card__title">
                      <User size={18} className="card__icon" /> About & Bio
                    </h2>
                    {!isEditing && (
                      <button className="card__action-btn" onClick={() => setIsEditing(true)}>
                        <Edit3 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="form-group">
                      <label className="form-label">Professional Summary</label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell recruiters about your background, strengths, and experience..."
                      />
                    </div>
                  ) : (
                    <p className="bio-text">
                      {formData.bio || "No summary provided yet. Click 'Edit Profile' to add your professional bio."}
                    </p>
                  )}
                </section>

                <section className="card">
                  <div className="card__head">
                    <h2 className="card__title">
                      <FileText size={18} className="card__icon" /> Resume & Links
                    </h2>
                  </div>

                  {isEditing ? (
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Bangalore, India"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Resume URL (Drive / Cloud link)</label>
                        <input
                          type="url"
                          className="form-input"
                          value={formData.resume_url}
                          onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                          placeholder="https://drive.google.com/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">LinkedIn URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">GitHub URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={formData.github_url}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label className="form-label">Portfolio URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={formData.portfolio_url}
                          onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                          placeholder="https://myportfolio.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {formData.resume_url && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FileText size={16} style={{ color: "var(--blue)" }} />
                          <a href={formData.resume_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", fontWeight: 500 }}>
                            View Uploaded Resume
                          </a>
                        </div>
                      )}
                      {formData.linkedin_url && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Globe size={16} style={{ color: "var(--violet)" }} />
                          <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--violet)", fontWeight: 500 }}>
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {formData.github_url && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Globe size={16} />
                          <a href={formData.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", fontWeight: 500 }}>
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      {formData.portfolio_url && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Globe size={16} style={{ color: "var(--blue)" }} />
                          <a href={formData.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", fontWeight: 500 }}>
                            Portfolio Website
                          </a>
                        </div>
                      )}
                      {!formData.resume_url && !formData.linkedin_url && !formData.github_url && !formData.portfolio_url && (
                        <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "13.5px" }}>
                          No links added yet. Click "Edit Profile" to add your resume and social links.
                        </p>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="profile-col-side">
            <section className="card">
              <div className="card__head">
                <h3 className="card__title card__title--sm">
                  <ShieldCheck size={16} className="card__icon" /> Account Security
                </h3>
              </div>

              <div className="pref-list">
                <div className="pref-item">
                  <span className="pref-lbl">Registered Email</span>
                  <span className="pref-val" style={{ fontSize: "12.5px" }}>
                    {user?.email}
                  </span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Role</span>
                  <span className="pref-val">{user?.role}</span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Email Notifications</span>
                  <span className="pref-val">
                    {user?.settings?.email_notifications !== false ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Job Alerts</span>
                  <span className="pref-val">
                    {user?.settings?.job_alerts !== false ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <button
                className="btn btn--danger-outline"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={handleLogout}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="profile-toast">
          <CheckCircle2 size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .profile-page {
    --paper: #FBFBFD;
    --panel: #FFFFFF;
    --ink: #14121C;
    --ink-soft: #5B5867;
    --ink-faint: #8B889A;
    --blue: #3B6FE0;
    --blue-soft: #EAF0FE;
    --violet: #7C5CFF;
    --violet-soft: #F1EDFF;
    --line: #E4E1EC;
    --line-strong: #D4D0E0;

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .profile-nav {
    border-bottom: 1px solid var(--line);
    background: var(--panel);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .profile-nav__inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .profile-nav__left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav__back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink-soft);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .nav__back-btn:hover {
    color: var(--ink);
    background: var(--paper);
  }

  .nav__divider {
    width: 1px;
    height: 20px;
    background: var(--line);
  }

  .nav__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .nav__logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--blue);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
  }

  .nav__mark {
    font-size: 18px;
    font-weight: 700;
  }

  .nav__mark-dot {
    color: var(--blue);
  }

  .profile-nav__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .nav__btn--logout {
    background: #FFEBEE;
    color: #D32F2F;
  }

  .nav__btn--logout:hover {
    background: #FFCDD2;
  }

  .profile-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .profile-hero {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
  }

  .profile-hero__banner {
    height: 120px;
    background: linear-gradient(135deg, #3B6FE0 0%, #7C5CFF 100%);
  }

  .profile-hero__content {
    padding: 0 32px 24px;
    margin-top: -44px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .profile-hero__main {
    display: flex;
    align-items: flex-end;
    gap: 20px;
  }

  .profile-avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 4px solid #FFFFFF;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 800;
    color: var(--blue);
    position: relative;
    flex-shrink: 0;
  }

  .profile-avatar__badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #10B981;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #FFFFFF;
  }

  .profile-hero__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .profile-hero__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .profile-name {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: var(--ink);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .status-pill--role {
    background: var(--blue-soft);
    color: var(--blue);
  }

  .profile-headline {
    margin: 0;
    font-size: 14.5px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  .profile-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--ink-faint);
    margin-top: 4px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .profile-hero__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .profile-stats {
    border-top: 1px solid var(--line);
    padding: 16px 32px;
    background: var(--paper);
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-card__val {
    font-size: 18px;
    font-weight: 800;
    color: var(--ink);
  }

  .stat-card__lbl {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-divider {
    width: 1px;
    height: 28px;
    background: var(--line);
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    align-items: start;
  }

  .profile-col-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card__title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card__title--sm {
    font-size: 14.5px;
  }

  .card__icon {
    color: var(--blue);
  }

  .card__action-btn {
    background: transparent;
    border: none;
    color: var(--blue);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card__action-btn:hover {
    text-decoration: underline;
  }

  .bio-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--ink-soft);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink);
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 10px 12px;
    font-size: 13.5px;
    font-family: inherit;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: var(--blue);
    background: var(--panel);
  }

  .pref-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pref-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .pref-lbl {
    color: var(--ink-soft);
  }

  .pref-val {
    font-weight: 600;
    color: var(--ink);
  }

  .btn {
    font-size: 13.5px;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn--primary {
    background: var(--blue);
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background: #2D5EC9;
  }

  .btn--secondary {
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--line);
  }

  .btn--secondary:hover {
    background: #ECEAF2;
  }

  .btn--danger-outline {
    background: transparent;
    color: #D32F2F;
    border: 1px solid #FFCDD2;
  }

  .btn--danger-outline:hover {
    background: #FFEBEE;
  }

  .profile-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideUp 0.2s ease-out;
  }

  .toast-icon {
    color: #10B981;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 900px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;
