import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
    findUserByEmail,
    findUserByRole,
    findUserById,
    createUser,
    updateUser,
    getUserProfile,
    upsertUserProfile,
    getEmployerProfile,
    upsertEmployerProfile,
    getUserSettings,
    upsertUserSettings,
} from '@/lib/postgress';
import {
    signToken,
    getSessionFromRequest,
    TOKEN_COOKIE_NAME,
} from '@/lib/auth';

async function fetchFullUserData(userId) {
    const user = await findUserById(userId);
    if (!user) return null;

    const { password, ...safeUser } = user;

    let profile = null;
    if (safeUser.role === 'EMPLOYER') {
        profile = await getEmployerProfile(userId);
    } else {
        profile = await getUserProfile(userId);
    }

    const settings = await getUserSettings(userId);

    return {
        ...safeUser,
        profile: profile || {},
        settings: settings || { email_notifications: true, job_alerts: true },
    };
}

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        const fullUser = await fetchFullUserData(userId);
        if (!fullUser) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { authenticated: true, user: fullUser },
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
        const action = body.action || body.mode;

        // ----------------- SIGN UP -----------------
        if (action === 'signup') {
            const { name, email, password: plainPassword, role = 'JOB_SEEKER' } = body;

            if (!name || !email || !plainPassword) {
                return NextResponse.json(
                    { success: false, error: 'All fields (Name, Email, Password) are required.' },
                    { status: 400 }
                );
            }

            const validRole = ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'].includes(role) ? role : 'JOB_SEEKER';
            const normalizedEmail = email.trim().toLowerCase();

            // Special rules for ADMIN role
            if (validRole === 'ADMIN') {
                if (normalizedEmail !== 'admin@admin.com') {
                    return NextResponse.json(
                        { success: false, error: 'Admin registration must use email admin@admin.com.' },
                        { status: 400 }
                    );
                }

                const existingAdminByEmail = await findUserByEmail('admin@admin.com');
                const existingAdminByRole = await findUserByRole('ADMIN');
                if (existingAdminByEmail || existingAdminByRole) {
                    return NextResponse.json(
                        { success: false, error: 'Admin Already Registered' },
                        { status: 400 }
                    );
                }
            } else {
                if (normalizedEmail === 'admin@admin.com') {
                    return NextResponse.json(
                        { success: false, error: 'The email admin@admin.com is reserved for Admin.' },
                        { status: 400 }
                    );
                }

                const existingUser = await findUserByEmail(normalizedEmail);
                if (existingUser) {
                    return NextResponse.json(
                        { success: false, error: 'An account with this email already exists. Please log in.' },
                        { status: 409 }
                    );
                }
            }

            if (plainPassword.length < 6 || plainPassword.length > 12) {
                return NextResponse.json(
                    { success: false, error: 'Password must be between 6 and 12 characters.' },
                    { status: 400 }
                );
            }

            const passwordHash = await bcrypt.hash(plainPassword, 10);
            const newUser = await createUser({
                name: name.trim(),
                email: normalizedEmail,
                passwordHash,
                role: validRole,
            });

            const token = signToken(newUser);
            const fullUser = await fetchFullUserData(newUser.user_id);

            const response = NextResponse.json(
                {
                    success: true,
                    message: 'Account created successfully!',
                    token,
                    user: fullUser,
                },
                { status: 201 }
            );

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

        // ----------------- LOG IN -----------------
        if (action === 'login') {
            const { email, password: plainPassword } = body;

            if (!email || !plainPassword) {
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

            const isMatch = await bcrypt.compare(plainPassword, user.password);
            if (!isMatch) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email or password. Please try again.' },
                    { status: 401 }
                );
            }

            const token = signToken(user);
            const fullUser = await fetchFullUserData(user.user_id);

            const response = NextResponse.json(
                {
                    success: true,
                    message: 'Logged in successfully!',
                    token,
                    user: fullUser,
                },
                { status: 200 }
            );

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

        // ----------------- UPDATE PROFILE -----------------
        if (action === 'update_profile') {
            const session = await getSessionFromRequest(request);
            const userId = session?.user_id || session?.id;

            if (!session || !userId) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized. Please log in.' },
                    { status: 401 }
                );
            }

            const updates = body.updates || {};

            if (updates.name) {
                await updateUser(userId, { name: updates.name });
            }

            if (session.role === 'EMPLOYER') {
                await upsertEmployerProfile(userId, {
                    company_name: updates.company_name || updates.companyName || updates.name,
                    company_description: updates.company_description || updates.companyDescription || updates.bio,
                    website: updates.website || updates.companyWebsite,
                    logo_url: updates.logo_url || updates.logoUrl || updates.logo,
                    industry: updates.industry,
                    location: updates.location,
                });
            } else {
                await upsertUserProfile(userId, {
                    phone: updates.phone,
                    bio: updates.bio,
                    location: updates.location,
                    profile_image_url: updates.profile_image_url || updates.profileImageUrl || updates.avatar,
                    resume_url: updates.resume_url || updates.resumeUrl || updates.resume,
                    linkedin_url: updates.linkedin_url || updates.linkedinUrl || updates.linkedin,
                    github_url: updates.github_url || updates.githubUrl || updates.github,
                    portfolio_url: updates.portfolio_url || updates.portfolioUrl || updates.portfolio,
                });
            }

            const fullUser = await fetchFullUserData(userId);

            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully!',
                user: fullUser,
            });
        }

        // ----------------- UPDATE SETTINGS -----------------
        if (action === 'update_settings') {
            const session = await getSessionFromRequest(request);
            const userId = session?.user_id || session?.id;

            if (!session || !userId) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized. Please log in.' },
                    { status: 401 }
                );
            }

            const { email_notifications, job_alerts } = body;
            const updatedSettings = await upsertUserSettings(userId, {
                email_notifications,
                job_alerts,
            });

            const fullUser = await fetchFullUserData(userId);

            return NextResponse.json({
                success: true,
                message: 'Settings updated successfully!',
                settings: updatedSettings,
                user: fullUser,
            });
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