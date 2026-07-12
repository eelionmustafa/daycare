import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { PortalShell } from "@/components/PortalShell";
import {
  IconChart,
  IconChild,
  IconCalendar,
  IconCard,
  IconInbox,
  IconImage,
  IconMail,
  IconGear,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const items = [
  { href: "/admin", label: "Paneli", icon: <IconChart /> },
  { href: "/admin/femijet", label: "Fëmijët", icon: <IconChild /> },
  { href: "/admin/prezenca", label: "Prezenca", icon: <IconCalendar /> },
  { href: "/admin/faturat", label: "Faturat", icon: <IconCard /> },
  { href: "/admin/aplikimet", label: "Aplikimet", icon: <IconInbox /> },
  { href: "/admin/galeria", label: "Galeria", icon: <IconImage /> },
  { href: "/admin/mesazhet", label: "Mesazhet", icon: <IconMail /> },
  { href: "/admin/cilesimet", label: "Cilësimet", icon: <IconGear /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("ADMIN");
  return (
    <PortalShell
      items={items}
      userName={user.name}
      roleLabel="Administratë"
      logoutAction={logout}
    >
      {children}
    </PortalShell>
  );
}
