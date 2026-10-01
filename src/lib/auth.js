import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'job_portal_super_jwt_secret_token_key_2026_9565523788';
export const TOKEN_COOKIE_NAME = 'job_portal_token';

export function signToken(payload) {
    const userId = payload.user_id || payload.id;
    return jwt.sign(
        {
            user_id: userId,
            id: userId,
            email: payload.email,
            name: payload.name,
            role: payload.role || 'JOB_SEEKER',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function verifyToken(token) {
    try {
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function getSessionFromRequest(request) {
    let token = null;

    // 1. Try from cookie in request or Next.js headers
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(TOKEN_COOKIE_NAME);
        if (cookie?.value) {
            token = cookie.value;
        }
    } catch {
        // Fallback for non-cookie contexts
    }

    // 2. Try Authorization header
    if (!token && request && request.headers) {
        const authHeader = request.headers.get('authorization') || '';
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
        }
    }

    if (!token) return null;
    return verifyToken(token);
}
