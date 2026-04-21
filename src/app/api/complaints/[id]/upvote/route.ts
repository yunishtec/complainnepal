import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
import * as admin from 'firebase-admin';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const complaintRef = db.collection('complaints').doc(id);
    await complaintRef.update({
      upvotes: admin.firestore.FieldValue.increment(1)
    });

    const updatedDoc = await complaintRef.get();

    return NextResponse.json({ upvotes: updatedDoc.data()?.upvotes });
  } catch (error: any) {
    console.error("Upvote error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const complaintRef = db.collection('complaints').doc(id);
    await complaintRef.update({
      upvotes: admin.firestore.FieldValue.increment(-1)
    });

    const updatedDoc = await complaintRef.get();

    return NextResponse.json({ upvotes: updatedDoc.data()?.upvotes });
  } catch (error: any) {
    console.error("Unvote error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
