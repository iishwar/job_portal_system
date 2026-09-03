"use client";

import { useMemo, useState } from "react";

const Field = ({ label, optional, hint, children }) => (
  <label className="field">
    <span className="field__label">
      {label}
      {optional && <span className="field__optional">Optional</span>}
    </span>
    {children}
    {hint && <span className="field__hint">{hint}</span>}
  </label>
);

const TextInput = (props) => (
  <input className="field__input" {...props} />
);

const TextArea = (props) => (
  <textarea className="field__input field__input--area" rows={3} {...props} />
);

const SelectInput = ({ options, ...props }) => (
  <select className="field__input field__select" {...props}>
    <option value="">Select…</option>
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

const FileInput = ({ label, optional, fileName, onFile, accept }) => (
  <Field label={label} optional={optional}>
    <label className="file">
      <span className="file__icon">↑</span>
      <span className="file__text">
        {fileName ? fileName : "Click to upload, or drag file here"}
      </span>
      <input
        type="file"
        accept={accept}
        className="file__input"
        onChange={(e) => onFile(e.target.files?.[0]?.name || "")}
      />
    </label>
  </Field>
);

const ChipGroup = ({ label, optional, options, value, onChange, multi }) => {
  const selected = multi ? value || [] : value;
  const isSelected = (o) => (multi ? selected.includes(o) : selected === o);

  const toggle = (o) => {
    if (!multi) {
      onChange(selected === o ? "" : o);
      return;
    }
    onChange(
      selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]
    );
  };

  return (
    <Field label={label} optional={optional}>
      <div className="chips">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            className={"chip" + (isSelected(o) ? " chip--active" : "")}
            onClick={() => toggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </Field>
  );
};

/* ---------------------------------------------------------- */
/* Initial data                                                */
/* ---------------------------------------------------------- */

const initialStudent = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  location: "",
  photo: "",
  college: "",
  degree: "",
  branch: "",
  gradYear: "",
  cgpa: "",
  technicalSkills: "",
  softSkills: "",
  languages: "",
  skillLevel: "",
  lookingFor: [],
  preferredRoles: "",
  preferredLocation: "",
  workMode: "",
  expectedPay: "",
  availableFrom: "",
  experienceStatus: "",
  internships: "",
  workExperience: "",
  resume: "",
  portfolio: "",
  github: "",
  linkedin: "",
  website: "",
  industries: [],
  preferredCompanies: "",
  careerGoals: "",
  emailVerified: false,
  phoneVerified: false,
  acceptedTerms: false,
};

const initialRecruiter = {
  fullName: "",
  workEmail: "",
  phone: "",
  jobTitle: "",
  linkedin: "",
  companyName: "",
  companyWebsite: "",
  industry: "",
  companySize: "",
  hqLocation: "",
  companyDescription: "",
  logo: "",
  rolesHiring: [],
  hiringType: [],
  hiringLocations: "",
  workMode: "",
  expectedHires: "",
};

/* ---------------------------------------------------------- */
/* Page                                                         */
/* ---------------------------------------------------------- */

const OnboardingPage = () => {
  const [role, setRole] = useState(null); // "student" | "recruiter"
  const [step, setStep] = useState(1);
  const [student, setStudent] = useState(initialStudent);
  const [recruiter, setRecruiter] = useState(initialRecruiter);

  const data = role === "student" ? student : recruiter;
  const setData = role === "student" ? setStudent : setRecruiter;

  const update = (name, value) =>
    setData((prev) => ({ ...prev, [name]: value }));

  const totalSteps = role === "student" ? 8 : 3;
  const isLastStep = step === totalSteps;
  const showSkip = step >= 3;

  const stepTitles =
    role === "student"
      ? [
          "Personal Information",
          "Education",
          "Skills",
          "Career Preferences",
          "Experience",
          "Resume & Portfolio",
          "Interests",
          "Verification",
        ]
      : ["Basic Information", "Company Information", "Hiring Preferences"];

  const chooseRole = (r) => {
    setRole(r);
    setStep(1);
  };

  const goBack = () => {
    if (step === 1) {
      setRole(null);
      return;
    }
    setStep((s) => s - 1);
  };

  const goNext = () => {
    if (isLastStep) return;
    setStep((s) => s + 1);
  };

  const finish = () => {
    // wire up submission here
  };

  return (
    <div className="onboarding">
      <style>{styles}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <header className="topbar">
        <span className="topbar__mark">
          North<span className="topbar__mark-dot">beam</span>
        </span>
        {role && (
          <span className="topbar__step">
            Step {step} of {totalSteps} — {stepTitles[step - 1]}
          </span>
        )}
      </header>

      {!role ? (
        <RoleSelect onChoose={chooseRole} />
      ) : (
        <main className="wizard">
          <div className="wizard__inner">
            <Progress step={step} total={totalSteps} titles={stepTitles} />

            <div className="panel">
              <div className="panel__head">
                <h1 className="panel__title">{stepTitles[step - 1]}</h1>
                <p className="panel__subtitle">
                  {role === "student"
                    ? "Tell us a bit about yourself so we can match you to the right roles."
                    : "Tell us about your company so we can match you to the right talent."}
                </p>
              </div>

              <div className="panel__body">
                {role === "student" ? (
                  <StudentStep step={step} data={student} update={update} />
                ) : (
                  <RecruiterStep step={step} data={recruiter} update={update} />
                )}
              </div>

              <div className="panel__nav">
                <button type="button" className="btn btn--ghost" onClick={goBack}>
                  Back
                </button>

                {isLastStep ? (
                  <button type="button" className="btn btn--primary" onClick={finish}>
                    Complete setup
                  </button>
                ) : (
                  <button type="button" className="btn btn--primary" onClick={goNext}>
                    Continue
                  </button>
                )}
              </div>

              {showSkip && !isLastStep && (
                <button type="button" className="skip" onClick={goNext}>
                  Skip this step
                </button>
              )}
              {showSkip && isLastStep && (
                <button type="button" className="skip" onClick={finish}>
                  Skip &amp; finish later
                </button>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default OnboardingPage;

/* ---------------------------------------------------------- */
/* Role select screen                                           */
/* ---------------------------------------------------------- */

const RoleSelect = ({ onChoose }) => (
  <main className="rolewrap">
    <div className="rolescreen">
      <p className="rolescreen__eyebrow">Let's set up your account</p>
      <h1 className="rolescreen__title">Who are you?</h1>
      <p className="rolescreen__subtitle">
        We'll tailor the next steps based on what you're here to do.
      </p>

      <div className="rolecards">
        <button
          type="button"
          className="rolecard"
          onClick={() => onChoose("student")}
        >
          <span className="rolecard__icon">🎓</span>
          <span className="rolecard__title">I'm a Student</span>
          <span className="rolecard__desc">
            Looking for internships or your first full-time role.
          </span>
        </button>

        <button
          type="button"
          className="rolecard"
          onClick={() => onChoose("recruiter")}
        >
          <span className="rolecard__icon">🏢</span>
          <span className="rolecard__title">I'm a Recruiter</span>
          <span className="rolecard__desc">
            Hiring talent and want to post roles to candidates.
          </span>
        </button>
      </div>
    </div>
  </main>
);

/* ---------------------------------------------------------- */
/* Progress bar                                                 */
/* ---------------------------------------------------------- */

const Progress = ({ step, total, titles }) => (
  <div className="progress">
    <div className="progress__track">
      <div
        className="progress__fill"
        style={{ width: `${((step - 1) / (total - 1)) * 100}%` }}
      />
    </div>
    <div className="progress__labels">
      {titles.map((t, i) => (
        <span
          key={t}
          className={
            "progress__label" +
            (i + 1 === step ? " progress__label--active" : "") +
            (i + 1 < step ? " progress__label--done" : "")
          }
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------- */
/* Student steps                                                */
/* ---------------------------------------------------------- */

const StudentStep = ({ step, data, update }) => {
  switch (step) {
    case 1:
      return (
        <div className="grid">
          <Field label="Full Name">
            <TextInput
              placeholder="Jordan Casey"
              value={data.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </Field>
          <Field label="Email Address">
            <TextInput
              type="email"
              placeholder="you@college.edu"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone Number">
            <TextInput
              type="tel"
              placeholder="+1 555 000 0000"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Date of Birth" optional>
            <TextInput
              type="date"
              value={data.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </Field>
          <Field label="Location (City, State, Country)">
            <TextInput
              placeholder="Austin, TX, USA"
              value={data.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </Field>
          <FileInput
            label="Profile Photo"
            optional
            accept="image/*"
            fileName={data.photo}
            onFile={(name) => update("photo", name)}
          />
        </div>
      );

    case 2:
      return (
        <div className="grid">
          <Field label="College / University">
            <TextInput
              placeholder="University of Texas"
              value={data.college}
              onChange={(e) => update("college", e.target.value)}
            />
          </Field>
          <Field label="Degree">
            <TextInput
              placeholder="B.Tech, B.Sc, MBA…"
              value={data.degree}
              onChange={(e) => update("degree", e.target.value)}
            />
          </Field>
          <Field label="Branch / Specialization">
            <TextInput
              placeholder="Computer Science"
              value={data.branch}
              onChange={(e) => update("branch", e.target.value)}
            />
          </Field>
          <Field label="Current Year / Graduation Year">
            <TextInput
              placeholder="2026"
              value={data.gradYear}
              onChange={(e) => update("gradYear", e.target.value)}
            />
          </Field>
          <Field label="CGPA / Percentage" optional>
            <TextInput
              placeholder="8.4 CGPA or 84%"
              value={data.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
            />
          </Field>
        </div>
      );

    case 3:
      return (
        <div className="grid">
          <Field
            label="Technical Skills"
            hint="Separate with commas — e.g. C++, Java, Python"
          >
            <TextInput
              placeholder="C++, Java, Python"
              value={data.technicalSkills}
              onChange={(e) => update("technicalSkills", e.target.value)}
            />
          </Field>
          <Field label="Soft Skills" optional>
            <TextInput
              placeholder="Communication, teamwork, leadership"
              value={data.softSkills}
              onChange={(e) => update("softSkills", e.target.value)}
            />
          </Field>
          <Field label="Languages Known">
            <TextInput
              placeholder="English, Hindi, Spanish"
              value={data.languages}
              onChange={(e) => update("languages", e.target.value)}
            />
          </Field>
          <ChipGroup
            label="Skill Level"
            options={["Beginner", "Intermediate", "Advanced"]}
            value={data.skillLevel}
            onChange={(v) => update("skillLevel", v)}
          />
        </div>
      );

    case 4:
      return (
        <div className="grid">
          <ChipGroup
            label="Looking for"
            multi
            options={["Internship", "Full-time", "Part-time", "Freelance"]}
            value={data.lookingFor}
            onChange={(v) => update("lookingFor", v)}
          />
          <Field label="Preferred Job Roles">
            <TextInput
              placeholder="Frontend Engineer, Data Analyst"
              value={data.preferredRoles}
              onChange={(e) => update("preferredRoles", e.target.value)}
            />
          </Field>
          <Field label="Preferred Location">
            <TextInput
              placeholder="Austin, Remote, Anywhere in US"
              value={data.preferredLocation}
              onChange={(e) => update("preferredLocation", e.target.value)}
            />
          </Field>
          <ChipGroup
            label="Work Mode"
            options={["Remote", "Hybrid", "On-site"]}
            value={data.workMode}
            onChange={(v) => update("workMode", v)}
          />
          <Field label="Expected Salary / Stipend" optional>
            <TextInput
              placeholder="$2,000/mo"
              value={data.expectedPay}
              onChange={(e) => update("expectedPay", e.target.value)}
            />
          </Field>
          <Field label="Available From">
            <TextInput
              type="date"
              value={data.availableFrom}
              onChange={(e) => update("availableFrom", e.target.value)}
            />
          </Field>
        </div>
      );

    case 5:
      return (
        <div className="grid">
          <ChipGroup
            label="Experience Status"
            options={["Fresher", "Experienced"]}
            value={data.experienceStatus}
            onChange={(v) => update("experienceStatus", v)}
          />
          <Field label="Previous Internships" optional>
            <TextArea
              placeholder="Company, role, duration…"
              value={data.internships}
              onChange={(e) => update("internships", e.target.value)}
            />
          </Field>
          <Field label="Work Experience" optional>
            <TextArea
              placeholder="Company, role, duration…"
              value={data.workExperience}
              onChange={(e) => update("workExperience", e.target.value)}
            />
          </Field>
        </div>
      );

    case 6:
      return (
        <div className="grid">
          <FileInput
            label="Upload Resume (PDF)"
            accept="application/pdf"
            fileName={data.resume}
            onFile={(name) => update("resume", name)}
          />
          <Field label="Portfolio Website" optional>
            <TextInput
              placeholder="https://yourportfolio.com"
              value={data.portfolio}
              onChange={(e) => update("portfolio", e.target.value)}
            />
          </Field>
          <Field label="GitHub" optional>
            <TextInput
              placeholder="https://github.com/username"
              value={data.github}
              onChange={(e) => update("github", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn" optional>
            <TextInput
              placeholder="https://linkedin.com/in/username"
              value={data.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
            />
          </Field>
          <Field label="Personal Website" optional>
            <TextInput
              placeholder="https://yoursite.com"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </Field>
        </div>
      );

    case 7:
      return (
        <div className="grid">
          <ChipGroup
            label="Interested Industries"
            optional
            multi
            options={[
              "Software",
              "Finance",
              "Healthcare",
              "E-commerce",
              "Education",
              "Media",
            ]}
            value={data.industries}
            onChange={(v) => update("industries", v)}
          />
          <Field label="Preferred Companies" optional>
            <TextInput
              placeholder="Google, Stripe, local startups…"
              value={data.preferredCompanies}
              onChange={(e) => update("preferredCompanies", e.target.value)}
            />
          </Field>
          <Field label="Career Goals" optional>
            <TextArea
              placeholder="What are you hoping to work toward?"
              value={data.careerGoals}
              onChange={(e) => update("careerGoals", e.target.value)}
            />
          </Field>
        </div>
      );

    case 8:
      return (
        <div className="grid">
          <VerifyRow
            label="Email Address"
            value={data.email || "your email"}
            verified={data.emailVerified}
            onVerify={() => update("emailVerified", true)}
          />
          <VerifyRow
            label="Phone Number"
            optional
            value={data.phone || "your phone"}
            verified={data.phoneVerified}
            onVerify={() => update("phoneVerified", true)}
          />
          <label className="terms">
            <input
              type="checkbox"
              checked={data.acceptedTerms}
              onChange={(e) => update("acceptedTerms", e.target.checked)}
            />
            <span>
              I agree to the Terms &amp; Conditions and Privacy Policy.
            </span>
          </label>
        </div>
      );

    default:
      return null;
  }
};

/* ---------------------------------------------------------- */
/* Recruiter steps                                               */
/* ---------------------------------------------------------- */

const RecruiterStep = ({ step, data, update }) => {
  switch (step) {
    case 1:
      return (
        <div className="grid">
          <Field label="Full Name">
            <TextInput
              placeholder="Alex Rivera"
              value={data.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </Field>
          <Field label="Work Email">
            <TextInput
              type="email"
              placeholder="you@company.com"
              value={data.workEmail}
              onChange={(e) => update("workEmail", e.target.value)}
            />
          </Field>
          <Field label="Phone Number" optional>
            <TextInput
              type="tel"
              placeholder="+1 555 000 0000"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Job Title / Designation">
            <TextInput
              placeholder="Talent Acquisition Lead"
              value={data.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn Profile" optional>
            <TextInput
              placeholder="https://linkedin.com/in/username"
              value={data.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
            />
          </Field>
        </div>
      );

    case 2:
      return (
        <div className="grid">
          <Field label="Company Name">
            <TextInput
              placeholder="Acme Inc."
              value={data.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </Field>
          <Field label="Company Website">
            <TextInput
              placeholder="https://acme.com"
              value={data.companyWebsite}
              onChange={(e) => update("companyWebsite", e.target.value)}
            />
          </Field>
          <Field label="Industry">
            <SelectInput
              options={[
                "Software",
                "Finance",
                "Healthcare",
                "E-commerce",
                "Education",
                "Manufacturing",
                "Other",
              ]}
              value={data.industry}
              onChange={(e) => update("industry", e.target.value)}
            />
          </Field>
          <ChipGroup
            label="Company Size"
            options={["1–10", "11–50", "51–200", "201–1000", "1000+"]}
            value={data.companySize}
            onChange={(v) => update("companySize", v)}
          />
          <Field label="Headquarters Location">
            <TextInput
              placeholder="San Francisco, CA, USA"
              value={data.hqLocation}
              onChange={(e) => update("hqLocation", e.target.value)}
            />
          </Field>
          <Field label="Company Description" optional>
            <TextArea
              placeholder="What does your company do?"
              value={data.companyDescription}
              onChange={(e) => update("companyDescription", e.target.value)}
            />
          </Field>
          <FileInput
            label="Company Logo"
            accept="image/*"
            fileName={data.logo}
            onFile={(name) => update("logo", name)}
          />
        </div>
      );

    case 3:
      return (
        <div className="grid">
          <ChipGroup
            label="What roles are you hiring for?"
            multi
            options={[
              "Software Engineering",
              "Marketing",
              "Sales",
              "Design",
              "HR",
              "Finance",
              "Other",
            ]}
            value={data.rolesHiring}
            onChange={(v) => update("rolesHiring", v)}
          />
          <ChipGroup
            label="Hiring Type"
            multi
            options={["Full-time", "Part-time", "Internship", "Contract", "Freelance"]}
            value={data.hiringType}
            onChange={(v) => update("hiringType", v)}
          />
          <Field label="Typical Hiring Locations">
            <TextInput
              placeholder="Austin, Remote, Bangalore…"
              value={data.hiringLocations}
              onChange={(e) => update("hiringLocations", e.target.value)}
            />
          </Field>
          <ChipGroup
            label="Work Mode"
            options={["Remote", "Hybrid", "On-site"]}
            value={data.workMode}
            onChange={(v) => update("workMode", v)}
          />
          <Field label="Expected Number of Hires This Month">
            <TextInput
              type="number"
              placeholder="5"
              value={data.expectedHires}
              onChange={(e) => update("expectedHires", e.target.value)}
            />
          </Field>
        </div>
      );

    default:
      return null;
  }
};

/* ---------------------------------------------------------- */
/* Verify row (step 8, students)                                */
/* ---------------------------------------------------------- */

const VerifyRow = ({ label, value, verified, onVerify, optional }) => (
  <div className="verify">
    <div className="verify__info">
      <span className="verify__label">
        {label}
        {optional && <span className="field__optional">Optional</span>}
      </span>
      <span className="verify__value">{value}</span>
    </div>
    {verified ? (
      <span className="verify__badge">Verified ✓</span>
    ) : (
      <button type="button" className="verify__btn" onClick={onVerify}>
        Send code
      </button>
    )}
  </div>
);

/* ---------------------------------------------------------- */
/* Styles                                                        */
/* ---------------------------------------------------------- */

const styles = `
  * {
    box-sizing: border-box;
  }

  .onboarding {
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
    --blue-dot: rgba(59, 111, 224, 0.14);
    --success: #2E9E63;

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ---------- Topbar ---------- */

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 32px;
    border-bottom: 1px solid var(--line);
    background: var(--panel);
  }

  .topbar__mark {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .topbar__mark-dot {
    color: var(--blue);
  }

  .topbar__step {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  /* ---------- Role select ---------- */

  .rolewrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 72px 24px;
    background-image: radial-gradient(var(--blue-dot) 1.5px, transparent 1.5px);
    background-size: 24px 24px;
    min-height: calc(100vh - 73px);
  }

  .rolescreen {
    max-width: 620px;
    text-align: center;
  }

  .rolescreen__eyebrow {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--violet);
    margin: 0 0 12px;
  }

  .rolescreen__title {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }

  .rolescreen__subtitle {
    font-size: 16px;
    color: var(--ink-soft);
    margin: 0 0 40px;
  }

  .rolecards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .rolecard {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 32px 24px;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .rolecard:hover {
    border-color: var(--blue);
    background: var(--blue-soft);
  }

  .rolecard__icon {
    font-size: 26px;
    margin-bottom: 6px;
  }

  .rolecard__title {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
  }

  .rolecard__desc {
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.5;
  }

  /* ---------- Wizard shell ---------- */

  .wizard {
    display: flex;
    justify-content: center;
    padding: 48px 24px 80px;
  }

  .wizard__inner {
    width: 100%;
    max-width: 640px;
  }

  /* ---------- Progress ---------- */

  .progress {
    margin-bottom: 28px;
  }

  .progress__track {
    height: 4px;
    background: var(--line);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .progress__fill {
    height: 100%;
    background: var(--blue);
    border-radius: 999px;
    transition: width 0.25s ease;
  }

  .progress__labels {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
  }

  .progress__label {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--ink-faint);
  }

  .progress__label--done {
    color: var(--blue);
  }

  .progress__label--active {
    color: var(--ink);
    font-weight: 700;
  }

  /* ---------- Panel ---------- */

  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 36px;
  }

  .panel__head {
    margin-bottom: 28px;
  }

  .panel__title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0 0 6px;
  }

  .panel__subtitle {
    font-size: 14px;
    color: var(--ink-soft);
    margin: 0;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ---------- Fields ---------- */

  .field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .field__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .field__optional {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-faint);
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 1px 7px;
    border-radius: 999px;
  }

  .field__hint {
    font-size: 12px;
    color: var(--ink-faint);
  }

  .field__input {
    font-family: inherit;
    font-size: 14.5px;
    padding: 11px 14px;
    border-radius: 9px;
    border: 1px solid var(--line-strong);
    background: var(--panel);
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s ease;
    width: 100%;
  }

  .field__input::placeholder {
    color: var(--ink-faint);
  }

  .field__input:focus {
    border-color: var(--blue);
  }

  .field__input--area {
    resize: vertical;
    font-family: inherit;
  }

  .field__select {
    appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, var(--ink-faint) 50%),
      linear-gradient(135deg, var(--ink-faint) 50%, transparent 50%);
    background-position: calc(100% - 18px) center, calc(100% - 13px) center;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
  }

  /* ---------- Chips ---------- */

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
    padding: 8px 15px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: var(--panel);
    color: var(--ink-soft);
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .chip:hover {
    border-color: var(--blue);
    color: var(--ink);
  }

  .chip--active {
    background: var(--blue);
    border-color: var(--blue);
    color: #FFFFFF;
  }

  /* ---------- File input ---------- */

  .file {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border: 1px dashed var(--line-strong);
    border-radius: 9px;
    cursor: pointer;
    font-size: 13.5px;
    color: var(--ink-soft);
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .file:hover {
    border-color: var(--blue);
    background: var(--blue-soft);
  }

  .file__icon {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--blue-soft);
    color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .file input.file__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    padding: 0;
    border: none;
  }

  /* ---------- Verify row ---------- */

  .verify {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
  }

  .verify__info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .verify__label {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .verify__value {
    font-size: 13px;
    color: var(--ink-soft);
  }

  .verify__btn {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--line-strong);
    background: var(--panel);
    color: var(--blue);
    cursor: pointer;
  }

  .verify__btn:hover {
    border-color: var(--blue);
  }

  .verify__badge {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--success);
    background: #E9F7EF;
    padding: 6px 12px;
    border-radius: 999px;
  }

  /* ---------- Terms ---------- */

  .terms {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13.5px;
    color: var(--ink-soft);
    cursor: pointer;
  }

  .terms input {
    margin-top: 2px;
  }

  /* ---------- Nav buttons ---------- */

  .panel__nav {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
  }

  .btn {
    font-family: inherit;
    font-size: 14.5px;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .btn--primary {
    background: var(--blue);
    border: 1px solid var(--blue);
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background: #2F5BC4;
  }

  .btn--ghost {
    background: transparent;
    border: 1px solid var(--line-strong);
    color: var(--ink);
  }

  .btn--ghost:hover {
    border-color: var(--ink-soft);
  }

  .skip {
    display: block;
    margin: 16px auto 0;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-faint);
    background: none;
    border: none;
    cursor: pointer;
  }

  .skip:hover {
    color: var(--violet);
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 640px) {
    .rolecards {
      grid-template-columns: 1fr;
    }

    .panel {
      padding: 24px 20px;
    }

    .topbar {
      padding: 18px 20px;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;