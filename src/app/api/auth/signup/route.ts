import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
        email,
        username: tempUsername,
        hashedPassword,
      }
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      isActive: newUser.isActive,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt
    });

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
