import { NextResponse } from 'next/server';
import { getJobs, createJob } from '@/lib/postgress';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const mode = searchParams.get('mode') || '';
        const location = searchParams.get('location') || '';
        const minSalary = searchParams.get('minSalary') ? Number(searchParams.get('minSalary')) : null;
        const maxSalary = searchParams.get('maxSalary') ? Number(searchParams.get('maxSalary')) : null;
        const jobType = searchParams.get('jobType') || '';
        const experienceLevel = searchParams.get('experienceLevel') || '';
        const status = searchParams.get('status') || 'PUBLISHED';
        const employerId = searchParams.get('employerId') || null;

        const jobs = await getJobs({
            search,
            mode,
            location,
            minSalary,
            maxSalary,
            jobType,
            experienceLevel,
            status,
            employerId,
            limit: 100,
        });

        return NextResponse.json({ success: true, jobs }, { status: 200 });
    } catch (err) {
        console.error('Jobs GET Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch jobs' },
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

        if (session.role !== 'EMPLOYER' && session.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Only employers or admins can post jobs.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            location,
            min_salary,
            max_salary,
            mode,
            job_type,
            experience_level,
            status = 'PUBLISHED'
        } = body;

        if (!title || !description) {
            return NextResponse.json(
                { success: false, error: 'Job title and description are required.' },
                { status: 400 }
            );
        }

        const newJob = await createJob({
            employer_id: userId,
            title,
            description,
            location,
            min_salary,
            max_salary,
            mode: mode || 'REMOTE',
            job_type: job_type || 'Full-time',
            experience_level: experience_level || 'Mid',
            status: status || 'PUBLISHED'
        });

        return NextResponse.json(
            { success: true, message: 'Job posted successfully!', job: newJob },
            { status: 201 }
        );
    } catch (err) {
        console.error('Jobs POST Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to post job: ' + err.message },
            { status: 500 }
        );
    }
}
