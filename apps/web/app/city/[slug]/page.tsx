import { permanentRedirect } from "next/navigation";

interface LegacyCityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyCityPage({ params }: LegacyCityPageProps) {
  const { slug } = await params;

  permanentRedirect(`/cities/${slug}`);
}
