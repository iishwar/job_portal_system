import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import {
    getAdminStats,
    getAdminCompanies,
    getAdminRejectedCandidates,
    getAdminJobs,
    getAdminTimeline,
    deleteJob,
    deleteOrganizationByAdmin,
} from '@/lib/postgress';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.email !== 'admin@admin.com') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Admin access only.' },
                { status: 403 }
            );
        }

        const [stats, companies, rejectedCandidates, jobs, timeline] = await Promise.all([
            getAdminStats(),
            getAdminCompanies(),
            getAdminRejectedCandidates(),
            getAdminJobs(),
            getAdminTimeline(),
        ]);

        return NextResponse.json({
            success: true,
            stats,
            companies,
            rejectedCandidates,
            jobs,
            timeline,
        });
    } catch (err) {
        console.error('Admin API GET Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to load admin data: ' + err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.email !== 'admin@admin.com') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Admin access only.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { type, id } = body;

        if (!type || !id) {
            return NextResponse.json(
                { success: false, error: 'Target type and ID are required.' },
                { status: 400 }
            );
        }

        if (type === 'job') {
            const deleted = await deleteJob(id, null, 'ADMIN');
            if (!deleted) {
                return NextResponse.json(
                    { success: false, error: 'Job not found or already deleted.' },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                message: 'Job deleted successfully.',
            });
        }

        if (type === 'organization') {
            const deleted = await deleteOrganizationByAdmin(id);
            if (!deleted) {
                return NextResponse.json(
                    { success: false, error: 'Organization not found or already deleted.' },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                message: `Organization "${deleted.name}" and associated records deleted successfully.`,
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid entity type specified.' },
            { status: 400 }
        );
    } catch (err) {
        console.error('Admin API DELETE Error:', err);
        return NextResponse.json(
            { success: false, error: 'Delete operation failed: ' + err.message },
            { status: 500 }
        );
    }
}
