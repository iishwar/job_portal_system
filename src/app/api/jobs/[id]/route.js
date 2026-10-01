import { NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/postgress';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request, context) {
    try {
        const { id } = await context.params;
        const job = await getJobById(id);

        if (!job) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, job }, { status: 200 });
    } catch (err) {
        console.error('Job GET by ID error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();

        const updated = await updateJob(id, userId, { ...body, role: session.role });
        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Job not found or unauthorized to edit.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Job updated successfully!', job: updated },
            { status: 200 }
        );
    } catch (err) {
        console.error('Job PUT error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to update job: ' + err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const session = await getSessionFromRequest(request);
        const userId = session?.user_id || session?.id;

        if (!session || !userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const deleted = await deleteJob(id, userId, session.role);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Job not found or unauthorized to delete.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Job deleted successfully!' },
            { status: 200 }
        );
    } catch (err) {
        console.error('Job DELETE error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}
