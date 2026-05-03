import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => (
  <a
    href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe%2C%20j'ai%20besoin%20d'informations"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-[var(--alix-whatsapp)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
    data-testid="whatsapp-floating-button"
    aria-label="Contacter sur WhatsApp"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);

export default WhatsAppFloat;
