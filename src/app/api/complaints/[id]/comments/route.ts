import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const snapshot = await db.collection('complaints').doc(id).collection('comments').orderBy('createdAt', 'desc').get();
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { text, userId } = await req.json();

    if (!text) {
      return NextResponse.json({ detail: "Comment text is required" }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const commentData = {
      text,
      userId: userId || null,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('complaints').doc(id).collection('comments').add(commentData);

    return NextResponse.json({ id: docRef.id, ...commentData });
  } catch (error: any) {
    console.error("Add comment error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
