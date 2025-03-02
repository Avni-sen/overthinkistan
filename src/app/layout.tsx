import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalLoading from "@/components/common/GlobalLoading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Overthinkistan",
  description: "Next.js ile oluşturulmuş Overthinkistan projesi",
  keywords: "overthinkistan, mizah, rehber, hikaye, quiz, forum",
  authors: [{ name: "Overthinkistan Ekibi" }],
  creator: "Overthinkistan",
  publisher: "Overthinkistan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <GlobalLoading />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
