import type { Metadata } from "next";
import { Volkhov } from "next/font/google";
import "./globals.css";
import "@/styles/globals.scss";
import Footer from "./components/Footer";
import { Providers } from "./providers";
const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-volkhov",
});

export const metadata: Metadata = {
  title: "Triplyst - keep track of your trips",
  description:
    "Easily view, create, update and delete your trips with this minimalist trip planner",
  icons: {
    icon: "/assets/favicon.ico",
  },
  metadataBase: new URL("https://itinerary-planner-omega.vercel.app/"), // your production URL

  openGraph: {
    title: "Triplyst - keep track of your trips",
    description:
      "Easily view, create, update and delete your trips with this minimalist trip planner",
    url: "https://itinerary-planner-omega.vercel.app/",
    siteName: "Triplyst",
    images: [
      {
        url: "/assets/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${volkhov.variable}`}>
        <Providers>
          {/* <Navbar/> */}
          {children}
          <Footer />
        </Providers>
        {/* wrapping the app with SessionProvider, so that i can access the logged-in session anywheres */}
      </body>
    </html>
  );
}
