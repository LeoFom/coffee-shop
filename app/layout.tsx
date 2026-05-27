import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/layout/Header";
import StoreProvider from "@/store/StoreProvider";
import {AuthProvider} from "@/components/providers/AuthProvider";
import {getUser} from "@/lib/auth/getUser";
import {Toaster} from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = await getUser();

  if (!user) {
    user = {
      id: undefined,
      name: undefined,
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${inter.variable} ${playfair.variable} font-sans antialiased`}>
      <StoreProvider>
        <AuthProvider
          initialUser={user}
        >
          <Header />
          <div
            className={'pt-[96px]'}
          >
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                success:
                  "!bg-success !text-success-foreground !border-success/20",

                error:
                  "!bg-error !text-error-foreground !border-error/20",

                warning:
                  "!bg-warning !text-warning-foreground !border-warning/20",

                info:
                  "!bg-info !text-info-foreground !border-info/20",
              },
            }}
            closeButton={true}
          />
        </AuthProvider>
      </StoreProvider>
      </body>
    </html>
  );
}
