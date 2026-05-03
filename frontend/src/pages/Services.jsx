import React, { useEffect, useState } from "react";
import { api, formatFCFA } from "../lib/api";
import { MessageCircle, Sparkles } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services").then(r => setServices(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Savoir-faire artisanal</div>
        <h1 className="font-display text-4xl sm:text-5xl">Nos services</h1>
        <p className="mt-4 text-[hsl(var(--muted-foreground))]">
          Chaque création est pensée, dessinée et gravée à la main dans notre atelier. Nous mettons notre expertise à votre service pour créer des pièces uniques qui racontent votre histoire.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-[hsl(var(--card))] p-6 animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(s => (
            <div key={s.id} className="rounded-xl border bg-[hsl(var(--card))] p-6 alix-card-shadow hover:alix-card-shadow-hover transition-shadow flex flex-col" data-testid={`service-card-${s.id}`}>
              <div className="text-3xl mb-3">{s.icon || "✨"}</div>
              <h3 className="font-display text-xl">{s.name}</h3>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] flex-1">{s.description}</p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">À partir de</div>
                  <div className="font-bold text-[var(--alix-bronze)]">{formatFCFA(s.priceFrom)}</div>
                </div>
                <a
                  href={`https://wa.me/2290197412933?text=${encodeURIComponent(`Bonjour Alixco Luxe, je souhaite un devis pour : ${s.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--alix-whatsapp)] hover:underline"
                  data-testid={`service-whatsapp-${s.id}`}
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Devis
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-2xl border bg-[hsl(var(--card))] p-8 sm:p-10 text-center alix-card-shadow">
        <Sparkles className="h-8 w-8 text-[var(--alix-bronze)] mx-auto mb-3" />
        <h2 className="font-display text-2xl sm:text-3xl">Vous avez un projet spécifique ?</h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
          Contactez-nous directement sur WhatsApp pour un devis personnalisé gratuit. Nous répondons sous 24h.
        </p>
        <a
          href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe%2C%20j'ai%20un%20projet%20spécifique%20à%20vous%20soumettre"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--alix-whatsapp)] text-white font-semibold hover:opacity-90 transition-opacity"
          data-testid="services-contact-whatsapp-button"
        >
          <MessageCircle className="h-4 w-4" /> Demander un devis
        </a>
      </div>
    </div>
  );
};

export default Services;
