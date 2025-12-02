import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infynno's AI-powered Interview Platform",
  description: "Infynno's AI-powered Interviews Platform for hiring talents",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Infynno's AI-powered Interview Platform",
    description: "Infynno's AI-powered Interviews Platform for hiring talents",
    siteName: "Infynno's AI-powered Interview Platform",
    images: [
      {
        url: "/og.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "antialiased overflow-hidden min-h-screen",
        )}
      >
        <ClerkProvider>
          <Providers>
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-white border-2 border-indigo-400",
                  title: "text-black",
                  description: "text-red-400",
                  actionButton: "bg-indigo-400",
                  cancelButton: "bg-orange-400",
                  closeButton: "bg-lime-400",
                },
              }}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}


