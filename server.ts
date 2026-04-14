import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite Setup
const db = new Database("complaints.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    mediaUrl TEXT NOT NULL,
    status TEXT DEFAULT 'submitted',
    upvotes INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.exec("ALTER TABLE complaints ADD COLUMN upvotes INTEGER DEFAULT 0");
} catch (e) {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complaintId INTEGER NOT NULL,
    text TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaintId) REFERENCES complaints (id)
  )
`);

// Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Email Setup
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/complaints", (req, res) => {
    try {
      const complaints = db.prepare(`
        SELECT c.*, 
        (SELECT COUNT(*) FROM comments WHERE complaintId = c.id) as commentCount 
        FROM complaints c 
        ORDER BY createdAt DESC 
        LIMIT 50
      `).all();
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch complaints" });
    }
  });

  app.post("/api/complaints/:id/upvote", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("UPDATE complaints SET upvotes = upvotes + 1 WHERE id = ?").run(id);
      const updated = db.prepare("SELECT upvotes FROM complaints WHERE id = ?").get(id);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote" });
    }
  });

  app.get("/api/complaints/:id/comments", (req, res) => {
    try {
      const { id } = req.params;
      const comments = db.prepare("SELECT * FROM comments WHERE complaintId = ? ORDER BY createdAt DESC").all(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/complaints/:id/comments", (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Comment text is required" });
      
      const info = db.prepare("INSERT INTO comments (complaintId, text) VALUES (?, ?)").run(id, text);
      const newComment = db.prepare("SELECT * FROM comments WHERE id = ?").get(info.lastInsertRowid);
      res.json(newComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  app.post("/api/complaints", upload.single("file"), async (req, res) => {
    try {
      const { title, description, category, location } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // 1. Upload to Cloudinary
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "complain-nepal",
      });

      const mediaUrl = uploadResponse.secure_url;

      // 2. Save to SQLite
      const stmt = db.prepare(`
        INSERT INTO complaints (title, description, category, location, mediaUrl)
        VALUES (?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title, description, category, location, mediaUrl);

      // 3. Send Email
      const recipient = AUTHORITY_MAP[category] || "general.civic@example.com";
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: recipient,
        subject: `Public Complaint: ${title}`,
        text: `
New issue reported via ComplaineNepal:

Title: ${title}
Category: ${category}
Location: ${location}
Description: ${description}
Media URL: ${mediaUrl}

Please take necessary action.
        `,
      };

      transporter.sendMail(mailOptions).catch(err => console.error("Email failed:", err));

      res.json({ 
        message: "Complaint processed successfully", 
        id: info.lastInsertRowid,
        mediaUrl,
        recipient 
      });
    } catch (error) {
      console.error("Error processing complaint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
