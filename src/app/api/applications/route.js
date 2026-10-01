import { NextResponse } from 'next/server';
import {
    getApplicationsByUser,
    getApplicationsForEmployer,
    getUserAppliedJobIds,
    createApplication,
    updateApplicationStatus,
} from '@/lib/postgress';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const idsOnly = searchParams.get('idsOnly') === 'true';

        if (idsOnly) {
            const appliedJobIds = await getUserAppliedJobIds(userId);
            return NextResponse.json({ success: true, appliedJobIds }, { status: 200 });
        }

        if (session.role === 'EMPLOYER') {
            const applications = await getApplicationsForEmployer(userId);
            return NextResponse.json({ success: true, applications }, { status: 200 });
        } else {
            const applications = await getApplicationsByUser(userId);
            return NextResponse.json({ success: true, applications }, { status: 200 });
        }
    } catch (err) {
        console.error('Applications GET Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch applications' },
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
                { success: false, error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { jobId, resumeUrl = null, coverLetter = null } = body;

        if (!jobId) {
            return NextResponse.json(
                { success: false, error: 'jobId is required' },
                { status: 400 }
            );
        }

        const application = await createApplication({
            userId,
            jobId,
            resumeUrl,
            coverLetter,
        });

        const appliedJobIds = await getUserAppliedJobIds(userId);

        return NextResponse.json(
            {
                success: true,
                message: 'Application submitted successfully!',
                application,
                appliedJobIds,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Applications POST Error:', err);
        if (err.code === '23505') {
            return NextResponse.json(
                { success: false, error: 'You have already applied for this job.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to submit application: ' + err.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        if (session.role !== 'EMPLOYER' && session.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Only employers can update application status' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { applicationId, status } = body;

        if (!applicationId || !status) {
            return NextResponse.json(
                { success: false, error: 'applicationId and status are required' },
                { status: 400 }
            );
        }

        const updated = await updateApplicationStatus(applicationId, userId, status);
        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Application not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Application status updated!', application: updated },
            { status: 200 }
        );
    } catch (err) {
        console.error('Applications PATCH Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to update application status: ' + err.message },
            { status: 500 }
        );
    }
}
