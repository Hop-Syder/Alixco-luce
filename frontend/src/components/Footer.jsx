import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { AlixLogoIcon } from "./icons/BrandIcons";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-[hsl(var(--card))]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <AlixLogoIcon className="h-8 w-auto" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md">
            L'art de la personnalisation artisanale — gravure sur bois et métal, création de tableaux, bijoux personnalisés, vêtements et accessoires sur mesure au Bénin.
          </p>
          <a
            href="https://wa.me/2290197412933"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-[var(--alix-whatsapp)] text-white hover:opacity-90 transition-opacity text-sm font-medium"
            data-testid="footer-whatsapp-link"
          >
            <MessageCircle className="h-4 w-4" /> Discuter sur WhatsApp
          </a>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
          <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
            <li><Link to="/catalogue" className="hover:text-[hsl(var(--foreground))]">Catalogue</Link></li>
            <li><Link to="/services" className="hover:text-[hsl(var(--foreground))]">Services</Link></li>
            <li><Link to="/a-propos" className="hover:text-[hsl(var(--foreground))]">À propos</Link></li>
            <li><Link to="/panier" className="hover:text-[hsl(var(--foreground))]">Panier</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-none" /> Cotonou, Bénin</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 flex-none" /> +229 01 97 41 29 33</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 flex-none" /> contact@alixcoluxe.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-[hsl(var(--muted-foreground))]">
        © {new Date().getFullYear()} Alixco Luxe — Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
