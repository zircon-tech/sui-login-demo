import Nav from "@/components/nav";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { Suspense } from "react";
import { inter, sfPro } from "./fonts";
import "./globals.css";
// import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Sui Authentication",
  description:
    "",
  twitter: {
    card: "summary_large_image",
    title: "zkLogin - Authentication on Sui",
    description:
      "",
    creator: "@wolivera",
  },
  metadataBase: new URL("https://mith.io"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-blue-400 via-white to-gray-200" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        {/* <Footer /> */}
        <Analytics />
      </body>
    </html>
  );
}
