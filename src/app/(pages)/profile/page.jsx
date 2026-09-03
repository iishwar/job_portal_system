"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  User,
  Mail,
  MapPin,
  Sparkles,
  Bookmark,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Plus,
  X,
  Edit3,
  ShieldCheck,
  Building,
  Bell,
  Check,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [user, setUser] = useState({
    id: "",
    name: "Alex Morgan",
    email: "alex.m@example.com",
    title: "Senior Software Engineer",
    location: "Bangalore, India",
    bio: "Full stack developer with 5+ years of experience building high-scale distributed systems and responsive React frontends. Passionate about web performance and developer productivity.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Docker", "GraphQL"],
    avatar: "A",
  });

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    skills: [],
    jobMode: "Hybrid",
    minSalary: 30,
    openToWork: true,
    emailAlerts: true,
  });

  const [newSkill, setNewSkill] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth check & load profile data
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("job_portal_token") : null;
        const cachedUser = typeof window !== "undefined" ? localStorage.getItem("job_portal_user") : null;

        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            setUser(parsed);
            setFormData({
              name: parsed.name || "",
              title: parsed.title || "Software Engineer",
              location: parsed.location || "Bangalore, India",
              bio: parsed.bio || "Passionate engineer looking for exciting tech opportunities.",
              skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : ["React", "JavaScript", "Node.js"],
              jobMode: "Hybrid",
              minSalary: 30,
              openToWork: true,
              emailAlerts: true,
            });
          } catch {}
        }

        const res = await fetch("/api/auth", {
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
        });
        const data = await res.json();

        if (isMounted) {
          if (!data.authenticated || !data.user) {
            // Not authenticated -> redirect to auth
            if (typeof window !== "undefined") {
              localStorage.removeItem("job_portal_token");
              localStorage.removeItem("job_portal_user");
            }
            router.replace("/auth");
            return;
          }

          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            title: data.user.title || "Software Engineer",
            location: data.user.location || "Bangalore, India",
            bio: data.user.bio || "Passionate engineer looking for exciting tech opportunities.",
            skills: Array.isArray(data.user.skills) && data.user.skills.length > 0 ? data.user.skills : ["React", "JavaScript", "Node.js"],
            jobMode: "Hybrid",
            minSalary: 30,
            openToWork: true,
            emailAlerts: true,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem("job_portal_user", JSON.stringify(data.user));
          }
          setAuthChecking(false);
        }
      } catch (err) {
        console.error("Profile auth error:", err);
        if (isMounted) router.replace("/auth");
      }
    }

    loadUser();
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

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skillTrimmed = newSkill.trim();
    if (!skillTrimmed) return;
    if (formData.skills.includes(skillTrimmed)) {
      showToast("Skill is already in list");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillTrimmed],
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("job_portal_token") : null;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localToken ? { Authorization: `Bearer ${localToken}` } : {}),
        },
        body: JSON.stringify({
          action: "update_profile",
          updates: {
            name: formData.name,
            title: formData.title,
            location: formData.location,
            bio: formData.bio,
            skills: formData.skills,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("job_portal_user", JSON.stringify(data.user));
        }
        showToast("Profile updated successfully!");
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
      <div className="profile-splash">
        <style>{styles}</style>
        <div className="splash-card">
          <div className="splash-spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <style>{styles}</style>

      {/* Top Navigation */}
      <header className="profile-nav">
        <div className="profile-nav__inner">
          <div className="profile-nav__left">
            <button className="nav__back-btn" onClick={() => router.push("/home")}>
              <ArrowLeft size={16} /> Back to Jobs
            </button>
            <div className="nav__divider" />
            <div className="nav__brand" onClick={() => router.push("/home")}>
              <div className="nav__logo-icon">
                <Briefcase size={18} />
              </div>
              <span className="nav__mark">
                North<span className="nav__mark-dot">beam</span>
              </span>
            </div>
          </div>

          <div className="profile-nav__right">
            <button className="nav__btn nav__btn--ghost" onClick={() => router.push("/home")}>
              <Bookmark size={15} /> Saved Jobs
            </button>
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
                {(user.name || "U").charAt(0).toUpperCase()}
                <span className="profile-avatar__badge" title="Active Candidate">
                  <Check size={12} />
                </span>
              </div>

              <div className="profile-hero__info">
                <div className="profile-hero__title-row">
                  <h1 className="profile-name">{user.name || "User"}</h1>
                  <span className="status-pill status-pill--open">
                    <Sparkles size={13} /> Open to Offers
                  </span>
                </div>
                <p className="profile-headline">{user.title || "Software Engineer"}</p>
                <div className="profile-meta">
                  <span className="meta-item">
                    <MapPin size={14} /> {user.location || "Bangalore, India"}
                  </span>
                  <span className="meta-item">
                    <Mail size={14} /> {user.email}
                  </span>
                  <span className="meta-item">
                    <ShieldCheck size={14} /> Verified Member
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
                      setFormData({
                        name: user.name,
                        title: user.title,
                        location: user.location,
                        bio: user.bio,
                        skills: user.skills,
                        jobMode: formData.jobMode,
                        minSalary: formData.minSalary,
                        openToWork: formData.openToWork,
                        emailAlerts: formData.emailAlerts,
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

          {/* Quick Stats */}
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-card__val">100%</span>
              <span className="stat-card__lbl">Profile Completeness</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-card__val">12</span>
              <span className="stat-card__lbl">Job Matches Today</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-card__val">4</span>
              <span className="stat-card__lbl">Applied Roles</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-card__val">18</span>
              <span className="stat-card__lbl">Recruiter Views</span>
            </div>
          </div>
        </section>

        {/* Profile Body Grid */}
        <div className="profile-grid">
          {/* Left Column - Details */}
          <div className="profile-col-main">
            {/* About / Bio Section */}
            <section className="card">
              <div className="card__head">
                <h2 className="card__title">
                  <User size={18} className="card__icon" /> About Me
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
                    placeholder="Tell recruiters about your key achievements, tech stack, and what drives you..."
                  />
                </div>
              ) : (
                <p className="bio-text">
                  {user.bio || "No summary provided yet. Click 'Edit Profile' to add your bio."}
                </p>
              )}
            </section>

            {/* Core Skills Section */}
            <section className="card">
              <div className="card__head">
                <h2 className="card__title">
                  <Sparkles size={18} className="card__icon" /> Core Skills & Technologies
                </h2>
              </div>

              <div className="skills-wrap">
                {formData.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        className="skill-remove-btn"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <form className="add-skill-form" onSubmit={handleAddSkill}>
                  <input
                    type="text"
                    className="form-input form-input--small"
                    placeholder="Add a new skill (e.g. AWS, Kubernetes, GraphQL)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button type="submit" className="btn btn--secondary btn--small">
                    <Plus size={14} /> Add Skill
                  </button>
                </form>
              )}
            </section>

            {/* Professional Details Section (in Edit mode or display) */}
            {isEditing && (
              <section className="card">
                <div className="card__head">
                  <h2 className="card__title">
                    <Building size={18} className="card__icon" /> Personal & Job Details
                  </h2>
                </div>

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
                    <label className="form-label">Headline / Job Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bangalore, India / Remote"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Job Mode</label>
                    <select
                      className="form-select"
                      value={formData.jobMode}
                      onChange={(e) => setFormData({ ...formData, jobMode: e.target.value })}
                    >
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="OnSite">Onsite</option>
                    </select>
                  </div>
                </div>

                <div className="card__footer">
                  <button
                    className="btn btn--primary"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Profile Details"}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Preferences & Security */}
          <div className="profile-col-side">
            {/* Career Preferences */}
            <section className="card">
              <div className="card__head">
                <h3 className="card__title card__title--sm">
                  <Briefcase size={16} className="card__icon" /> Career Preferences
                </h3>
              </div>

              <div className="pref-list">
                <div className="pref-item">
                  <span className="pref-lbl">Work Authorization</span>
                  <span className="pref-val">India (Authorized)</span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Preferred Work Mode</span>
                  <span className="pref-val">{formData.jobMode}</span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Target Compensation</span>
                  <span className="pref-val">₹{formData.minSalary}+ LPA</span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Notice Period</span>
                  <span className="pref-val">Immediate / 30 Days</span>
                </div>
              </div>
            </section>

            {/* Account & Security */}
            <section className="card">
              <div className="card__head">
                <h3 className="card__title card__title--sm">
                  <ShieldCheck size={16} className="card__icon" /> Account & Auth
                </h3>
              </div>

              <div className="pref-list">
                <div className="pref-item">
                  <span className="pref-lbl">Registered Email</span>
                  <span className="pref-val" style={{ fontSize: "12.5px" }}>
                    {user.email}
                  </span>
                </div>
                <div className="pref-item">
                  <span className="pref-lbl">Authentication</span>
                  <span className="pref-val">JWT Protected (Active)</span>
                </div>
              </div>

              <button
                className="btn btn--danger-outline"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={handleLogout}
              >
                <LogOut size={14} /> Sign Out of JobPortal
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
    --success: #2E9E63;
    --error: #D64545;

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }

  /* Nav */
  .profile-nav {
    background: var(--panel);
    border-bottom: 1px solid var(--line);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .profile-nav__inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 24px;
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
    background: transparent;
    border: none;
    color: var(--ink-soft);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
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
    gap: 8px;
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
  }

  .nav__mark {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
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
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--line);
    background: var(--panel);
    color: var(--ink-soft);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }

  .nav__btn:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }

  .nav__btn--logout {
    color: var(--error);
    border-color: #F8BEBD;
    background: #FFF5F5;
  }

  .nav__btn--logout:hover {
    background: #FEECEB;
    border-color: var(--error);
  }

  /* Main container */
  .profile-container {
    max-width: 1180px;
    margin: 32px auto 64px;
    padding: 0 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* Hero Banner */
  .profile-hero {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }

  .profile-hero__banner {
    height: 120px;
    background: linear-gradient(135deg, #3B6FE0 0%, #7C5CFF 100%);
  }

  .profile-hero__content {
    padding: 0 32px 28px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: -50px;
  }

  .profile-hero__main {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--blue);
    color: #FFFFFF;
    font-size: 38px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid var(--panel);
    box-shadow: 0 4px 14px rgba(0,0,0,0.1);
    position: relative;
    flex-shrink: 0;
  }

  .profile-avatar__badge {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--success);
    color: #FFFFFF;
    border: 2px solid var(--panel);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-hero__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 4px;
  }

  .profile-hero__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .profile-name {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--ink);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
  }

  .status-pill--open {
    background: var(--blue-soft);
    color: var(--blue);
    border: 1px solid rgba(59, 111, 224, 0.2);
  }

  .profile-headline {
    font-size: 15px;
    font-weight: 600;
    color: var(--ink-soft);
    margin: 0;
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
    gap: 5px;
  }

  .profile-hero__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 4px;
  }

  /* Stats Bar */
  .profile-stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 18px 32px;
    background: var(--paper);
    border-top: 1px solid var(--line);
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    text-align: center;
  }

  .stat-card__val {
    font-size: 20px;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  .stat-card__lbl {
    font-size: 12px;
    color: var(--ink-faint);
    font-weight: 500;
  }

  .stat-divider {
    width: 1px;
    height: 32px;
    background: var(--line);
  }

  /* Grid Layout */
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }

  .profile-col-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .profile-col-side {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Cards */
  .card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card__title--sm {
    font-size: 15px;
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
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .card__action-btn:hover {
    background: var(--blue-soft);
  }

  .card__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid var(--line);
  }

  .bio-text {
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--ink-soft);
    margin: 0;
  }

  /* Skills */
  .skills-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .skill-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--line-strong);
    padding: 6px 12px;
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .skill-pill:hover {
    border-color: var(--blue);
    background: var(--blue-soft);
    color: var(--blue);
  }

  .skill-remove-btn {
    background: transparent;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
  }

  .skill-remove-btn:hover {
    color: var(--error);
  }

  .add-skill-form {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  /* Forms */
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
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .form-input, .form-textarea, .form-select {
    font-family: inherit;
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--line-strong);
    background: var(--panel);
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s ease;
  }

  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: var(--blue);
  }

  .form-input--small {
    flex: 1;
    padding: 8px 12px;
  }

  /* Preferences List */
  .pref-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pref-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--line);
    font-size: 13.5px;
  }

  .pref-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .pref-lbl {
    color: var(--ink-faint);
  }

  .pref-val {
    font-weight: 600;
    color: var(--ink);
  }

  /* Buttons */
  .btn {
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s ease;
  }

  .btn--primary {
    background: var(--blue);
    color: #FFFFFF;
  }

  .btn--primary:hover:not(:disabled) {
    background: #2F5BC4;
  }

  .btn--secondary {
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--line-strong);
  }

  .btn--secondary:hover:not(:disabled) {
    background: #EFEFEF;
  }

  .btn--small {
    padding: 8px 14px;
    font-size: 13px;
  }

  .btn--danger-outline {
    background: transparent;
    border: 1px solid #F8BEBD;
    color: var(--error);
    font-size: 13.5px;
    padding: 9px 14px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 600;
    transition: all 0.15s ease;
  }

  .btn--danger-outline:hover {
    background: #FEECEB;
  }

  /* Toast */
  .profile-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #14121C;
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.18);
    z-index: 1000;
    animation: toastSlide 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-icon {
    color: #2E9E63;
  }

  @keyframes toastSlide {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Splash loader */
  .profile-splash {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--paper);
  }

  .splash-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--ink-soft);
    font-size: 14px;
    font-weight: 500;
  }

  .splash-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--line);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 860px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
    .profile-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .stat-divider {
      display: none;
    }
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;
