import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Toto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.className} antialiased h-svh w-full max-w-5xl mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
