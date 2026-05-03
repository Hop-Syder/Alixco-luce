import React, { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Wrench, Tag, ShoppingBag, Users, LogOut, Menu, Store } from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/categories", label: "Catégories", icon: Tag },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/clients", label: "Clients", icon: Users },
];

const NavList = ({ onItemClick }) => (
  <nav className="flex flex-col gap-1">
    {navItems.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onItemClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]"}`
        }
        data-testid={`admin-nav-${label.toLowerCase().replace(/[^a-z]/g, "")}`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </NavLink>
    ))}
  </nav>
);

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/admin/connexion");
  };

  return (
    <div className="admin-theme min-h-screen bg-[hsl(var(--background))]">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[hsl(var(--card))] border-b px-4 h-14 flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="admin-mobile-menu-button"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 admin-theme bg-[hsl(var(--background))]">
            <div className="mt-8 mb-6 flex items-center gap-2">
              <Store className="h-5 w-5 text-[var(--alix-bronze)]" />
              <span className="font-display text-xl">Alixco Luxe Admin</span>
            </div>
            <NavList onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="font-display text-lg flex-1">Alixco Luxe Admin</div>
        <Link to="/" className="text-xs text-[hsl(var(--muted-foreground))]">Voir la boutique</Link>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col border-r bg-[hsl(var(--card))] p-5 sticky top-0 h-screen">
          <Link to="/admin" className="flex items-center gap-2 mb-8">
            <Store className="h-5 w-5 text-[var(--alix-bronze)]" />
            <span className="font-display text-xl">Alixco Luxe</span>
          </Link>
          <NavList />
          <div className="mt-auto pt-6 border-t">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
              <div className="font-semibold text-[hsl(var(--foreground))] truncate">{admin?.fullName || admin?.email}</div>
              <div className="truncate">{admin?.email}</div>
            </div>
            <Link to="/" className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors block mb-2" data-testid="admin-view-shop-link">
              → Voir la boutique
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout} className="w-full" data-testid="admin-logout-button">
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </aside>

        <main className="p-5 sm:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
