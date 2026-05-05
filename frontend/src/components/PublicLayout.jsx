import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, LogOut, Package, Home as HomeIcon, Wrench, Info } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import WhatsAppFloat from "./WhatsAppFloat";
import Footer from "./Footer";

const navLinks = [
  { to: "/", label: "Accueil", icon: HomeIcon },
  { to: "/catalogue", label: "Catalogue", icon: Package },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/a-propos", label: "À propos", icon: Info },
];

const PublicLayout = () => {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/catalogue?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      <a href="#main" className="skip-link">Aller au contenu</a>
      <header
        className={`sticky top-0 z-40 border-b bg-[hsl(var(--background))]/90 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/75 transition-shadow ${scrolled ? "shadow-sm" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2" data-testid="header-logo-link">
            <span className="font-display text-2xl tracking-tight text-[hsl(var(--foreground))]">Alixco</span>
            <span className="font-display text-2xl text-[var(--alix-bronze)]">Luxe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "text-[hsl(var(--foreground))] bg-[hsl(var(--accent))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`
                }
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={onSearch} className="hidden lg:flex flex-1 max-w-sm items-center relative ml-auto">
            <Search className="absolute left-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="pl-9 bg-[hsl(var(--secondary))] border-transparent focus-visible:bg-[hsl(var(--card))]"
              data-testid="header-search-input"
            />
          </form>

          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {user ? (
              <>
                <Link to="/mon-compte" className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors hidden sm:inline-flex" data-testid="header-account-link">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={logout} className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors hidden sm:inline-flex" data-testid="header-logout-button" aria-label="Déconnexion">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/connexion" className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors hidden sm:inline-flex" data-testid="header-account-link">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link to="/panier" className="relative p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors" data-testid="header-cart-link">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-[var(--alix-bronze)] text-white text-[10px] font-semibold flex items-center justify-center" data-testid="header-cart-count">
                  {count}
                </span>
              )}
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="header-mobile-menu-button" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-[hsl(var(--background))]">
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((l) => {
                    const Icon = l.icon;
                    return (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === "/"}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-md text-base transition-colors ${isActive ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"}`
                        }
                      >
                        <Icon className="h-5 w-5" />
                        {l.label}
                      </NavLink>
                    );
                  })}
                  <div className="h-px bg-[hsl(var(--border))] my-2" />
                  {user ? (
                    <>
                      <Link to="/mon-compte" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[hsl(var(--accent))]">
                        <User className="h-5 w-5" /> Mon compte
                      </Link>
                      <button onClick={() => { logout(); setOpen(false); }} className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[hsl(var(--accent))] text-left">
                        <LogOut className="h-5 w-5" /> Déconnexion
                      </button>
                    </>
                  ) : (
                    <Link to="/connexion" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[hsl(var(--accent))]">
                      <User className="h-5 w-5" /> Connexion
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default PublicLayout;
