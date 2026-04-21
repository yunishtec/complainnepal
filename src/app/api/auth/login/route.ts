import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-now';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.body ? await req.json() : {};

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    // Create a token
    const token = jwt.sign(
      { sub: user.email, userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      access_token: token,
      token_type: "bearer"
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
