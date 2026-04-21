import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Nodemailer Config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const AUTHORITY_MAP: Record<string, string> = {
  garbage: "kathmandu.municipality@example.com",
  road: "department.roads@example.com",
  water: "water.supply@example.com",
  electricity: "nea@example.com",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    let query: any = db.collection('complaints').orderBy('createdAt', 'desc');

    if (category && category !== 'All' && category !== 'सबै') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.offset(skip).limit(limit).get();
    const complaints = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(complaints);
  } catch (error: any) {
    console.error("Fetch complaints error:", error);
    return NextResponse.json({ 
      detail: "Internal Server Error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ detail: "No file uploaded" }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    // 1. Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: "auto",
        folder: "complain-nepal",
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    const mediaUrl = uploadResponse.secure_url;

    // 2. Save to Firestore
    const complaintData = {
      title,
      description,
      category,
      location,
      mediaUrl,
      status: 'submitted',
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('complaints').add(complaintData);

    // 3. Send Email Notifications
    const recipient = AUTHORITY_MAP[category] || "general.civic@example.com";
    const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: recipient,
        subject: `Public Complaint: ${title}`,
        text: `New issue reported via ComplaineNepal:\n\nTitle: ${title}\nCategory: ${category}\nLocation: ${location}\nDescription: ${description}\nMedia URL: ${mediaUrl}\n\nPlease take necessary action.`,
    };

    transporter.sendMail(mailOptions).catch(err => console.error("Email failed:", err));

    return NextResponse.json({ id: docRef.id, ...complaintData });

  } catch (error: any) {
    console.error("Create complaint error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
