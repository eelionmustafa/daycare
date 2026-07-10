import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { PortalShell } from "@/components/PortalShell";

export const dynamic = "force-dynamic";

const items = [
  { href: "/portali", label: "Përmbledhja", icon: "🏠" },
  { href: "/portali/femijet", label: "Fëmijët e mi", icon: "🧒" },
  { href: "/portali/prezenca", label: "Prezenca", icon: "📅" },
  { href: "/portali/faturat", label: "Faturat", icon: "💳" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("PARENT");
  return (
    <PortalShell
      items={items}
      userName={user.name}
      roleLabel="Prind"
      logoutAction={logout}
    >
      {children}
    </PortalShell>
  );
}
