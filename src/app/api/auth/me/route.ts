import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify Firebase ID Token
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;
      
      // Get Firestore profile
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return NextResponse.json({ detail: "User profile not found" }, { status: 404 });
      }

      const userData = userDoc.data();

      return NextResponse.json({
        uid: uid,
        email: decodedToken.email,
        username: userData?.username || '',
        is_active: true,
        is_admin: userData?.isAdmin || false,
        isProfileSetup: userData?.isProfileSetup || false,
        created_at: userData?.createdAt
      });

    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 });
    }

  } catch (error: any) {
    console.error("Get Me error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
