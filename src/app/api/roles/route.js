import { NextResponse } from 'next/server';
import { getRoles } from '@/lib/postgress';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const roles = await getRoles(search);
        return NextResponse.json({ success: true, roles }, { status: 200 });
    } catch (err) {
        console.error('Roles GET Error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch roles' },
            { status: 500 }
        );
    }
}
