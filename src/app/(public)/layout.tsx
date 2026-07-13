import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AssistantWidget } from "@/components/AssistantWidget";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    name: s.site_name,
    description: s.tagline,
    address: { "@type": "PostalAddress", streetAddress: s.address },
    telephone: s.phone,
    email: s.email,
    openingHours: s.hours,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    sameAs: [s.facebook_url].filter(Boolean),
  };

  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <AssistantWidget />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
