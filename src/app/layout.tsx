import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { UploadProvider } from "@/context/UploadContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ComplaineNepal | Public Issue Reporting Platform",
  description: "Report and track civic issues in Nepal with direct authority notification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <UploadProvider>
              <Navbar />
              <main className="pt-20 md:pt-24 min-h-screen">
                {children}
              </main>
            </UploadProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
