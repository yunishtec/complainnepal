# ComplaineNepal

A civic issue reporting platform for Nepal. Report local infrastructure and civic issues directly to authorities.

## Features
- Report issues with media uploads (Cloudinary)
- Upvote and comment on issues
- Email notifications to relevant authorities
- Minimalist, premium UI

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials:
   - Cloudinary credentials
   - SMTP settings for email notifications
4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Motion
- Backend: Express, Better-SQLite3
- Services: Cloudinary, Nodemailer
