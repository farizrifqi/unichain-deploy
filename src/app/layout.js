import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'sonner'
import EthereumContextProvider from "@/components/providers/EthereumProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Deploy Smart Contract",
  description: "Deploy smart contract on Unichain Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >          <Toaster richColors />

        <EthereumContextProvider>
          {children}
        </EthereumContextProvider>
      </body>
    </html>
  );
}
