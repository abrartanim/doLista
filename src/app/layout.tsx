// layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext"; // Note: Adjust path if context is not directly in 'app'
import Footer from "@/components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Specify the weights you want to use
  subsets: ["latin"],
  display: "swap", // Recommended for font loading optimization
});
export const metadata: Metadata = {
  title: "DoLista",
  description: "Organize your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />

          <main className="flex-grow flex flex-col items-center justify-center p-4">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
