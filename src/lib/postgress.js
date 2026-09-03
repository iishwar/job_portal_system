import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

let pool = null;
let isPgAvailable = null;

function getPool() {
    if (!pool && connectionString) {
        pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 3000,
        });
    }
    return pool;
}

// Local fallback store setup
const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureLocalStore() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
}

function getLocalUsers() {
    ensureLocalStore();
    try {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveLocalUsers(users) {
    ensureLocalStore();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function query(text, params = []) {
    const p = getPool();
    if (!p) throw new Error('No database connection configured');
    return p.query(text, params);
}

export async function initDb() {
    try {
        const p = getPool();
        if (!p) {
            isPgAvailable = false;
            return;
        }

        await p.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                title VARCHAR(255) DEFAULT 'Software Professional',
                location VARCHAR(255) DEFAULT 'Bangalore, India',
                bio TEXT DEFAULT '',
                skills TEXT[] DEFAULT ARRAY['React', 'JavaScript', 'Node.js'],
                avatar VARCHAR(255) DEFAULT '',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        isPgAvailable = true;
    } catch (err) {
        console.warn('Postgres connection failed, using local persistent fallback store:', err.message);
        isPgAvailable = false;
    }
}

export async function findUserByEmail(email) {
    if (isPgAvailable === null) await initDb();

    const normalizedEmail = (email || '').trim().toLowerCase();

    if (isPgAvailable) {
        try {
            const res = await query(
                'SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1',
                [normalizedEmail]
            );
            return res.rows[0] || null;
        } catch (err) {
            console.warn('Postgres findUserByEmail error, falling back:', err.message);
            isPgAvailable = false;
        }
    }

    const users = getLocalUsers();
    return users.find((u) => (u.email || '').toLowerCase() === normalizedEmail) || null;
}

export async function findUserById(id) {
    if (isPgAvailable === null) await initDb();

    if (isPgAvailable) {
        try {
            const res = await query(
                'SELECT * FROM users WHERE id = $1 LIMIT 1',
                [id]
            );
            return res.rows[0] || null;
        } catch (err) {
            console.warn('Postgres findUserById error, falling back:', err.message);
            isPgAvailable = false;
        }
    }

    const users = getLocalUsers();
    return users.find((u) => u.id === id) || null;
}

export async function createUser({ name, email, passwordHash, title, location, bio, skills }) {
    if (isPgAvailable === null) await initDb();

    const id = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const normalizedEmail = (email || '').trim().toLowerCase();
    const userTitle = title || 'Software Engineer';
    const userLocation = location || 'Bangalore, India';
    const userBio = bio || 'Passionate software engineer looking for high-impact tech opportunities.';
    const userSkills = Array.isArray(skills) && skills.length > 0 ? skills : ['React', 'JavaScript', 'Node.js', 'System Design'];
    const avatar = name ? name.trim().charAt(0).toUpperCase() : 'U';

    if (isPgAvailable) {
        try {
            const res = await query(
                `INSERT INTO users (id, name, email, password_hash, title, location, bio, skills, avatar)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING *`,
                [id, name.trim(), normalizedEmail, passwordHash, userTitle, userLocation, userBio, userSkills, avatar]
            );
            return res.rows[0];
        } catch (err) {
            console.warn('Postgres createUser error, falling back:', err.message);
            isPgAvailable = false;
        }
    }

    const users = getLocalUsers();
    const newUser = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        title: userTitle,
        location: userLocation,
        bio: userBio,
        skills: userSkills,
        avatar,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    saveLocalUsers(users);
    return newUser;
}

export async function updateUserProfile(id, updates) {
    if (isPgAvailable === null) await initDb();

    if (isPgAvailable) {
        try {
            const existing = await findUserById(id);
            if (!existing) return null;

            const name = updates.name !== undefined ? updates.name : existing.name;
            const title = updates.title !== undefined ? updates.title : existing.title;
            const location = updates.location !== undefined ? updates.location : existing.location;
            const bio = updates.bio !== undefined ? updates.bio : existing.bio;
            const skills = updates.skills !== undefined ? updates.skills : existing.skills;
            const avatar = updates.avatar !== undefined ? updates.avatar : (name ? name.charAt(0).toUpperCase() : existing.avatar);

            const res = await query(
                `UPDATE users 
                 SET name = $1, title = $2, location = $3, bio = $4, skills = $5, avatar = $6, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $7
                 RETURNING *`,
                [name, title, location, bio, skills, avatar, id]
            );
            return res.rows[0];
        } catch (err) {
            console.warn('Postgres updateUserProfile error, falling back:', err.message);
            isPgAvailable = false;
        }
    }

    const users = getLocalUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    users[idx] = {
        ...users[idx],
        ...updates,
        avatar: updates.name ? updates.name.trim().charAt(0).toUpperCase() : users[idx].avatar,
        updated_at: new Date().toISOString(),
    };
    saveLocalUsers(users);
    return users[idx];
}
