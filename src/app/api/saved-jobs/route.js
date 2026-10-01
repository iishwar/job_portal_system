import { NextResponse } from 'next/server';
import { getSavedJobs, saveJob, unsaveJob, getUserSavedJobIds } from '@/lib/postgress';
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
            const savedJobIds = await getUserSavedJobIds(userId);
            return NextResponse.json({ success: true, savedJobIds }, { status: 200 });
        }

        const savedJobs = await getSavedJobs(userId);
        return NextResponse.json({ success: true, savedJobs }, { status: 200 });
    } catch (err) {
        console.error('Saved Jobs GET Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch saved jobs' },
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
        const { jobId, action = 'toggle' } = body;

        if (!jobId) {
            return NextResponse.json(
                { success: false, error: 'jobId is required' },
                { status: 400 }
            );
        }

        const currentSavedIds = await getUserSavedJobIds(userId);
        const isCurrentlySaved = currentSavedIds.includes(jobId);

        let isSaved = false;

        if (action === 'save' || (action === 'toggle' && !isCurrentlySaved)) {
            await saveJob(userId, jobId);
            isSaved = true;
        } else if (action === 'unsave' || (action === 'toggle' && isCurrentlySaved)) {
            await unsaveJob(userId, jobId);
            isSaved = false;
        }

        const updatedSavedIds = await getUserSavedJobIds(userId);

        return NextResponse.json(
            {
                success: true,
                isSaved,
                savedJobIds: updatedSavedIds,
                message: isSaved ? 'Job saved' : 'Job removed from saved',
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Saved Jobs POST Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to update saved job: ' + err.message },
            { status: 500 }
        );
    }
}
