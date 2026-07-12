import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { PortalShell } from "@/components/PortalShell";
import { IconHome, IconChild, IconCalendar, IconCard } from "@/components/icons";

export const dynamic = "force-dynamic";

const items = [
  { href: "/portali", label: "Përmbledhja", icon: <IconHome /> },
  { href: "/portali/femijet", label: "Fëmijët e mi", icon: <IconChild /> },
  { href: "/portali/prezenca", label: "Prezenca", icon: <IconCalendar /> },
  { href: "/portali/faturat", label: "Faturat", icon: <IconCard /> },
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
