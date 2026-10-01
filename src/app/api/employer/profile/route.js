import { NextResponse } from 'next/server';
import { getEmployerProfile, upsertEmployerProfile } from '@/lib/postgress';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const profile = await getEmployerProfile(userId);
        return NextResponse.json({ success: true, profile: profile || {} }, { status: 200 });
    } catch (err) {
        console.error('Employer Profile GET error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch employer profile' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.role !== 'EMPLOYER' && session.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Only employers can modify company profile' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const profile = await upsertEmployerProfile(userId, body);

        return NextResponse.json(
            { success: true, message: 'Company profile updated successfully', profile },
            { status: 200 }
        );
    } catch (err) {
        console.error('Employer Profile POST error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to update employer profile: ' + err.message },
            { status: 500 }
        );
    }
}
