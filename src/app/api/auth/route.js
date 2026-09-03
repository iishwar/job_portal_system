import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
    findUserByEmail,
    findUserById,
    createUser,
    updateUserProfile,
} from '@/lib/postgress';
import {
    signToken,
    getSessionFromRequest,
    TOKEN_COOKIE_NAME,
} from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.id) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        const user = await findUserById(session.id);
        if (!user) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        const { password_hash, ...safeUser } = user;
        return NextResponse.json(
            { authenticated: true, user: safeUser },
            { status: 200 }
        );
    } catch (err) {
        console.error('Auth GET Error:', err);
        return NextResponse.json(
            { authenticated: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const action = body.action || body.mode; // Support both 'action' and 'mode'

        // ----------------- SIGN UP -----------------
        if (action === 'signup') {
            const { name, email, password } = body;

            if (!name || !email || !password) {
                return NextResponse.json(
                    { success: false, error: 'All fields (Name, Email, Password) are required.' },
                    { status: 400 }
                );
            }

            if (password.length < 6 || password.length > 12) {
                return NextResponse.json(
                    { success: false, error: 'Password must be between 6 and 12 characters.' },
                    { status: 400 }
                );
            }

            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: 'An account with this email already exists. Please log in.' },
                    { status: 409 }
                );
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await createUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash,
                title: 'Software Engineer',
                location: 'Bangalore, India',
            });

            const token = signToken(newUser);
            const { password_hash, ...safeUser } = newUser;

            const response = NextResponse.json(
                {
                    success: true,
                    message: 'Account created successfully!',
                    token,
                    user: safeUser,
                },
                { status: 201 }
            );

            // Set HTTP-only auth cookie
            response.cookies.set({
                name: TOKEN_COOKIE_NAME,
                value: token,
                httpOnly: false, // allow client-side reading for easy SPA state sync
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                sameSite: 'lax',
            });

            return response;
        }

        // ----------------- LOG IN -----------------
        if (action === 'login') {
            const { email, password } = body;

            if (!email || !password) {
                return NextResponse.json(
                    { success: false, error: 'Email and password are required.' },
                    { status: 400 }
                );
            }

            const user = await findUserByEmail(email);
            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email or password. Please try again.' },
                    { status: 401 }
                );
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email or password. Please try again.' },
                    { status: 401 }
                );
            }

            const token = signToken(user);
            const { password_hash, ...safeUser } = user;

            const response = NextResponse.json(
                {
                    success: true,
                    message: 'Logged in successfully!',
                    token,
                    user: safeUser,
                },
                { status: 200 }
            );

            // Set cookie
            response.cookies.set({
                name: TOKEN_COOKIE_NAME,
                value: token,
                httpOnly: false,
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
                sameSite: 'lax',
            });

            return response;
        }

        // ----------------- LOG OUT -----------------
        if (action === 'logout') {
            const response = NextResponse.json(
                { success: true, message: 'Logged out successfully' },
                { status: 200 }
            );

            response.cookies.set({
                name: TOKEN_COOKIE_NAME,
                value: '',
                path: '/',
                maxAge: 0,
            });

            return response;
        }

        // ----------------- UPDATE PROFILE -----------------
        if (action === 'update_profile') {
            const session = await getSessionFromRequest(request);
            if (!session || !session.id) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized. Please log in.' },
                    { status: 401 }
                );
            }

            const updated = await updateUserProfile(session.id, body.updates || {});
            if (!updated) {
                return NextResponse.json(
                    { success: false, error: 'User not found.' },
                    { status: 404 }
                );
            }

            const { password_hash, ...safeUser } = updated;
            return NextResponse.json(
                { success: true, user: safeUser },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action provided.' },
            { status: 400 }
        );
    } catch (err) {
        console.error('Auth POST Error:', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}