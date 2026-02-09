
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = searchParams.get('limit') || '10';

    if (!q) {
        return NextResponse.json({ skills: [] });
    }

    const allowRemote = process.env.SKILLS_ALLOW_REMOTE === '1' || process.env.NODE_ENV === 'production';
    if (!allowRemote) {
        return NextResponse.json({ skills: [] });
    }

    try {
        const res = await fetch(`https://skills.sh/api/search?q=${encodeURIComponent(q)}&limit=${limit}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}
