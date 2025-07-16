// app/public-portfolio/[username]/layout.tsx

import type { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `Portfolio of ${params.username}`,
    description: `Explore ${params.username}'s portfolio on the Portfolio platform.`,
  };
}

export default function PublicPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // 👈 no <html> or <body> here
}
