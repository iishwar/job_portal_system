import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool = null;

export function getPool() {
    if (!pool) {
        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is missing.');
        }
        pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
        });
    }
    return pool;
}

export async function query(text, params = []) {
    const p = getPool();
    return p.query(text, params);
}

// ============================================================
// USERS
// ============================================================

export async function findUserByEmail(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const res = await query(
        'SELECT user_id, name, email, password, role, is_email_verified, two_factor_enabled, created_at FROM users WHERE LOWER(email) = $1 LIMIT 1',
        [normalizedEmail]
    );
    return res.rows[0] || null;
}

export async function findUserByRole(role) {
    const res = await query(
        'SELECT user_id, name, email, password, role, is_email_verified, two_factor_enabled, created_at FROM users WHERE role = $1 LIMIT 1',
        [role]
    );
    return res.rows[0] || null;
}

export async function findUserById(id) {
    const res = await query(
        'SELECT user_id, name, email, password, role, is_email_verified, two_factor_enabled, created_at FROM users WHERE user_id = $1 LIMIT 1',
        [id]
    );
    return res.rows[0] || null;
}

export async function createUser({ name, email, passwordHash, role = 'JOB_SEEKER' }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const validRole = ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'].includes(role) ? role : 'JOB_SEEKER';

    const res = await query(
        `INSERT INTO users (name, email, password, role, is_email_verified, two_factor_enabled)
         VALUES ($1, $2, $3, $4, FALSE, FALSE)
         RETURNING user_id, name, email, role, is_email_verified, two_factor_enabled, created_at`,
        [name.trim(), normalizedEmail, passwordHash, validRole]
    );
    const user = res.rows[0];

    // Initialize user_settings
    await query(
        `INSERT INTO user_settings (user_id, email_notifications, job_alerts)
         VALUES ($1, TRUE, TRUE)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.user_id]
    );

    // Initialize profile based on role
    if (validRole === 'EMPLOYER') {
        await query(
            `INSERT INTO employer_profiles (user_id, company_name, location)
             VALUES ($1, $2, 'Remote / On-site')
             ON CONFLICT (user_id) DO NOTHING`,
            [user.user_id, `${user.name}'s Company`]
        );
    } else {
        await query(
            `INSERT INTO user_profiles (user_id, bio, location)
             VALUES ($1, '', '')
             ON CONFLICT (user_id) DO NOTHING`,
            [user.user_id]
        );
    }

    return user;
}

export async function updateUser(userId, { name }) {
    if (!name) return null;
    const res = await query(
        `UPDATE users SET name = $1 WHERE user_id = $2 RETURNING user_id, name, email, role, created_at`,
        [name.trim(), userId]
    );
    return res.rows[0] || null;
}

// ============================================================
// USER PROFILES
// ============================================================

export async function getUserProfile(userId) {
    const res = await query(
        `SELECT user_id, phone, bio, location, profile_image_url, resume_url, linkedin_url, github_url, portfolio_url, updated_at
         FROM user_profiles WHERE user_id = $1 LIMIT 1`,
        [userId]
    );
    return res.rows[0] || null;
}

export async function upsertUserProfile(userId, data = {}) {
    const {
        phone = null,
        bio = null,
        location = null,
        profile_image_url = null,
        resume_url = null,
        linkedin_url = null,
        github_url = null,
        portfolio_url = null
    } = data;

    const res = await query(
        `INSERT INTO user_profiles (user_id, phone, bio, location, profile_image_url, resume_url, linkedin_url, github_url, portfolio_url, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
             bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
             location = COALESCE(EXCLUDED.location, user_profiles.location),
             profile_image_url = COALESCE(EXCLUDED.profile_image_url, user_profiles.profile_image_url),
             resume_url = COALESCE(EXCLUDED.resume_url, user_profiles.resume_url),
             linkedin_url = COALESCE(EXCLUDED.linkedin_url, user_profiles.linkedin_url),
             github_url = COALESCE(EXCLUDED.github_url, user_profiles.github_url),
             portfolio_url = COALESCE(EXCLUDED.portfolio_url, user_profiles.portfolio_url),
             updated_at = NOW()
         RETURNING *`,
        [userId, phone, bio, location, profile_image_url, resume_url, linkedin_url, github_url, portfolio_url]
    );
    return res.rows[0];
}

// ============================================================
// EMPLOYER PROFILES
// ============================================================

export async function getEmployerProfile(userId) {
    const res = await query(
        `SELECT user_id, company_name, company_description, website, logo_url, industry, location, updated_at
         FROM employer_profiles WHERE user_id = $1 LIMIT 1`,
        [userId]
    );
    return res.rows[0] || null;
}

export async function upsertEmployerProfile(userId, data = {}) {
    const {
        company_name = 'My Company',
        company_description = null,
        website = null,
        logo_url = null,
        industry = null,
        location = null
    } = data;

    const res = await query(
        `INSERT INTO employer_profiles (user_id, company_name, company_description, website, logo_url, industry, location, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET company_name = COALESCE(EXCLUDED.company_name, employer_profiles.company_name),
             company_description = COALESCE(EXCLUDED.company_description, employer_profiles.company_description),
             website = COALESCE(EXCLUDED.website, employer_profiles.website),
             logo_url = COALESCE(EXCLUDED.logo_url, employer_profiles.logo_url),
             industry = COALESCE(EXCLUDED.industry, employer_profiles.industry),
             location = COALESCE(EXCLUDED.location, employer_profiles.location),
             updated_at = NOW()
         RETURNING *`,
        [userId, company_name, company_description, website, logo_url, industry, location]
    );
    return res.rows[0];
}

// ============================================================
// USER SETTINGS
// ============================================================

export async function getUserSettings(userId) {
    const res = await query(
        `SELECT user_id, email_notifications, job_alerts, updated_at
         FROM user_settings WHERE user_id = $1 LIMIT 1`,
        [userId]
    );
    return res.rows[0] || null;
}

export async function upsertUserSettings(userId, { email_notifications = true, job_alerts = true }) {
    const res = await query(
        `INSERT INTO user_settings (user_id, email_notifications, job_alerts, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET email_notifications = EXCLUDED.email_notifications,
             job_alerts = EXCLUDED.job_alerts,
             updated_at = NOW()
         RETURNING *`,
        [userId, Boolean(email_notifications), Boolean(job_alerts)]
    );
    return res.rows[0];
}

// ============================================================
// JOBS
// ============================================================

export async function getJobs({
    search = '',
    mode = '',
    location = '',
    minSalary = null,
    maxSalary = null,
    jobType = '',
    experienceLevel = '',
    status = 'PUBLISHED',
    employerId = null,
    limit = 50,
    offset = 0
} = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (status) {
        conditions.push(`j.status = $${idx++}`);
        values.push(status);
    }

    if (employerId) {
        conditions.push(`j.employer_id = $${idx++}`);
        values.push(employerId);
    }

    if (mode && ['ONSITE', 'REMOTE', 'HYBRID'].includes(mode.toUpperCase())) {
        conditions.push(`j.mode = $${idx++}`);
        values.push(mode.toUpperCase());
    }

    if (location && location.trim()) {
        conditions.push(`j.location ILIKE $${idx++}`);
        values.push(`%${location.trim()}%`);
    }

    if (jobType && jobType.trim()) {
        conditions.push(`j.job_type ILIKE $${idx++}`);
        values.push(`%${jobType.trim()}%`);
    }

    if (experienceLevel && experienceLevel.trim()) {
        conditions.push(`j.experience_level ILIKE $${idx++}`);
        values.push(`%${experienceLevel.trim()}%`);
    }

    if (minSalary !== null && !isNaN(minSalary) && minSalary > 0) {
        conditions.push(`(j.min_salary >= $${idx++} OR j.max_salary >= $${idx - 1})`);
        values.push(minSalary);
    }

    if (search && search.trim()) {
        conditions.push(`(
            j.title ILIKE $${idx}
            OR j.description ILIKE $${idx}
            OR j.location ILIKE $${idx}
            OR ep.company_name ILIKE $${idx}
            OR ep.industry ILIKE $${idx}
        )`);
        values.push(`%${search.trim()}%`);
        idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
        SELECT 
            j.job_id,
            j.employer_id,
            j.title,
            j.description,
            j.location,
            j.min_salary,
            j.max_salary,
            j.mode,
            j.job_type,
            j.experience_level,
            j.status,
            j.created_at,
            j.updated_at,
            u.name as employer_name,
            u.email as employer_email,
            ep.company_name,
            ep.company_description,
            ep.website as company_website,
            ep.logo_url as company_logo,
            ep.industry as company_industry,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.job_id)::int as application_count
        FROM jobs j
        JOIN users u ON j.employer_id = u.user_id
        LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
        ${whereClause}
        ORDER BY j.created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
    `;

    values.push(limit, offset);

    const res = await query(sql, values);
    return res.rows;
}

export async function getJobById(jobId) {
    const sql = `
        SELECT 
            j.job_id,
            j.employer_id,
            j.title,
            j.description,
            j.location,
            j.min_salary,
            j.max_salary,
            j.mode,
            j.job_type,
            j.experience_level,
            j.status,
            j.created_at,
            j.updated_at,
            u.name as employer_name,
            u.email as employer_email,
            ep.company_name,
            ep.company_description,
            ep.website as company_website,
            ep.logo_url as company_logo,
            ep.industry as company_industry,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.job_id)::int as application_count
        FROM jobs j
        JOIN users u ON j.employer_id = u.user_id
        LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
        WHERE j.job_id = $1
        LIMIT 1
    `;
    const res = await query(sql, [jobId]);
    return res.rows[0] || null;
}

export async function createJob({
    employer_id,
    title,
    description,
    location = null,
    min_salary = null,
    max_salary = null,
    mode = 'REMOTE',
    job_type = 'Full-time',
    experience_level = 'Mid',
    status = 'PUBLISHED'
}) {
    const validMode = ['ONSITE', 'REMOTE', 'HYBRID'].includes((mode || '').toUpperCase())
        ? mode.toUpperCase()
        : 'REMOTE';

    const res = await query(
        `INSERT INTO jobs (
            employer_id, title, description, location, 
            min_salary, max_salary, mode, job_type, 
            experience_level, status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *`,
        [
            employer_id,
            title.trim(),
            description.trim(),
            location ? location.trim() : null,
            min_salary !== '' && min_salary !== null && !isNaN(min_salary) ? Number(min_salary) : null,
            max_salary !== '' && max_salary !== null && !isNaN(max_salary) ? Number(max_salary) : null,
            validMode,
            job_type ? job_type.trim() : 'Full-time',
            experience_level ? experience_level.trim() : 'Mid',
            status || 'PUBLISHED'
        ]
    );
    return res.rows[0];
}

export async function updateJob(jobId, employerId, data) {
    const {
        title,
        description,
        location,
        min_salary,
        max_salary,
        mode,
        job_type,
        experience_level,
        status
    } = data;

    const validMode = mode && ['ONSITE', 'REMOTE', 'HYBRID'].includes(mode.toUpperCase())
        ? mode.toUpperCase()
        : undefined;

    const res = await query(
        `UPDATE jobs
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             location = COALESCE($3, location),
             min_salary = COALESCE($4, min_salary),
             max_salary = COALESCE($5, max_salary),
             mode = COALESCE($6, mode),
             job_type = COALESCE($7, job_type),
             experience_level = COALESCE($8, experience_level),
             status = COALESCE($9, status),
             updated_at = NOW()
         WHERE job_id = $10 AND (employer_id = $11 OR $12 = 'ADMIN')
         RETURNING *`,
        [
            title || null,
            description || null,
            location || null,
            min_salary !== undefined && min_salary !== null ? Number(min_salary) : null,
            max_salary !== undefined && max_salary !== null ? Number(max_salary) : null,
            validMode || null,
            job_type || null,
            experience_level || null,
            status || null,
            jobId,
            employerId,
            data.role || ''
        ]
    );
    return res.rows[0] || null;
}

export async function deleteJob(jobId, employerId, role = '') {
    const res = await query(
        `DELETE FROM jobs
         WHERE job_id = $1 AND (employer_id = $2 OR $3 = 'ADMIN')
         RETURNING job_id`,
        [jobId, employerId, role]
    );
    return res.rowCount > 0;
}

// ============================================================
// SAVED JOBS
// ============================================================

export async function getSavedJobs(userId) {
    const sql = `
        SELECT 
            sj.saved_at,
            j.job_id,
            j.employer_id,
            j.title,
            j.description,
            j.location,
            j.min_salary,
            j.max_salary,
            j.mode,
            j.job_type,
            j.experience_level,
            j.status,
            j.created_at,
            ep.company_name,
            ep.logo_url as company_logo,
            ep.industry as company_industry
        FROM saved_jobs sj
        JOIN jobs j ON sj.job_id = j.job_id
        LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
        WHERE sj.user_id = $1
        ORDER BY sj.saved_at DESC
    `;
    const res = await query(sql, [userId]);
    return res.rows;
}

export async function saveJob(userId, jobId) {
    const res = await query(
        `INSERT INTO saved_jobs (user_id, job_id, saved_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, job_id) DO NOTHING
         RETURNING *`,
        [userId, jobId]
    );
    return res.rows[0] || { user_id: userId, job_id: jobId };
}

export async function unsaveJob(userId, jobId) {
    const res = await query(
        `DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2 RETURNING *`,
        [userId, jobId]
    );
    return res.rowCount > 0;
}

export async function getUserSavedJobIds(userId) {
    const res = await query(
        `SELECT job_id FROM saved_jobs WHERE user_id = $1`,
        [userId]
    );
    return res.rows.map(r => r.job_id);
}

// ============================================================
// APPLICATIONS
// ============================================================

export async function getApplicationsByUser(userId) {
    const sql = `
        SELECT 
            a.application_id,
            a.job_id,
            a.user_id,
            a.resume_url,
            a.cover_letter,
            a.status,
            a.applied_at,
            a.updated_at,
            j.title as job_title,
            j.location as job_location,
            j.mode as job_mode,
            j.min_salary,
            j.max_salary,
            ep.company_name,
            ep.logo_url as company_logo
        FROM applications a
        JOIN jobs j ON a.job_id = j.job_id
        LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
        WHERE a.user_id = $1
        ORDER BY a.applied_at DESC
    `;
    const res = await query(sql, [userId]);
    return res.rows;
}

export async function getUserAppliedJobIds(userId) {
    const res = await query(
        `SELECT job_id FROM applications WHERE user_id = $1`,
        [userId]
    );
    return res.rows.map(r => r.job_id);
}

export async function getApplicationsForEmployer(employerId) {
    const sql = `
        SELECT 
            a.application_id,
            a.job_id,
            a.user_id,
            a.resume_url,
            a.cover_letter,
            a.status,
            a.applied_at,
            a.updated_at,
            j.title as job_title,
            u.name as applicant_name,
            u.email as applicant_email,
            up.phone as applicant_phone,
            up.location as applicant_location,
            up.linkedin_url as applicant_linkedin,
            up.github_url as applicant_github,
            up.portfolio_url as applicant_portfolio
        FROM applications a
        JOIN jobs j ON a.job_id = j.job_id
        JOIN users u ON a.user_id = u.user_id
        LEFT JOIN user_profiles up ON u.user_id = up.user_id
        WHERE j.employer_id = $1
        ORDER BY a.applied_at DESC
    `;
    const res = await query(sql, [employerId]);
    return res.rows;
}

export async function createApplication({ userId, jobId, resumeUrl = null, coverLetter = null }) {
    const res = await query(
        `INSERT INTO applications (user_id, job_id, resume_url, cover_letter, status, applied_at, updated_at)
         VALUES ($1, $2, $3, $4, 'APPLIED', NOW(), NOW())
         RETURNING *`,
        [userId, jobId, resumeUrl, coverLetter]
    );
    return res.rows[0];
}

export async function updateApplicationStatus(applicationId, employerId, status) {
    const validStatuses = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }

    const res = await query(
        `UPDATE applications a
         SET status = $1, updated_at = NOW()
         FROM jobs j
         WHERE a.application_id = $2 
           AND a.job_id = j.job_id 
           AND j.employer_id = $3
         RETURNING a.*`,
        [status, applicationId, employerId]
    );
    return res.rows[0] || null;
}
