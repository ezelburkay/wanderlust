import { permanentRedirect } from "next/navigation";

interface LegacyCityPageProps {
params: { slug: string };
}

export default function LegacyCityPage({ params }: LegacyCityPageProps) {
permanentRedirect(`/cities/${params.slug}`);
}
