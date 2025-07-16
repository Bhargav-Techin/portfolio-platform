// src/app/public-portfolio/[username]/layout.tsx
import { Metadata } from 'next';

interface RouteParams {
  username: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { username } = await params;
  
  return {
    title: `Portfolio of ${username}`,
    description: `Explore ${username}'s portfolio on the Portfolio platform.`,
  };
}

export default function PublicPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}