import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandate — Define Your Agent's Authority",
  description: "AI agent authorization. Auth0 end-to-end: user login + Token Vault.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="antialiased">{children}</body>
      </UserProvider>
    </html>
  );
}
