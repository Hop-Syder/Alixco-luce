import React from "react";
import { MessageCircle, Hammer, Award, Heart, MapPin } from "lucide-react";

const About = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    <div className="max-w-2xl">
      <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Notre histoire</div>
      <h1 className="font-display text-4xl sm:text-5xl">À propos d'Alixco Luxe</h1>
      <p className="mt-5 text-[hsl(var(--muted-foreground))] leading-relaxed">
        Alixco Luxe est un atelier artisanal béninois spécialisé dans la création et la personnalisation d'objets d'art. Gravure sur bois et métal, tableaux, bijoux, vêtements et accessoires : chaque pièce est pensée, dessinée et finalisée à la main pour raconter une histoire unique, la vôtre.
      </p>
    </div>

    <div className="mt-10 grid sm:grid-cols-3 gap-5">
      {[
        { icon: Hammer, title: "Fait main", desc: "Chaque création est réalisée artisanalement dans notre atelier." },
        { icon: Award, title: "Qualité premium", desc: "Matériaux nobles et finitions soignées pour un rendu d'exception." },
        { icon: Heart, title: "Sur mesure", desc: "Votre vision, notre expertise — pour des pièces uniques." },
      ].map((f, i) => {
        const Icon = f.icon;
        return (
          <div key={i} className="rounded-xl border bg-[hsl(var(--card))] p-6 alix-card-shadow">
            <div className="h-10 w-10 rounded-lg bg-[var(--alix-brass)]/20 flex items-center justify-center mb-3">
              <Icon className="h-5 w-5 text-[var(--alix-bronze)]" />
            </div>
            <div className="font-semibold text-lg">{f.title}</div>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{f.desc}</p>
          </div>
        );
      })}
    </div>

    <div className="mt-14 rounded-2xl bg-[hsl(var(--card))] border overflow-hidden grid lg:grid-cols-2 alix-card-shadow">
      <div className="p-8 sm:p-10">
        <h2 className="font-display text-3xl">Visitez notre atelier</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[var(--alix-bronze)]" /> Cotonou, Bénin</div>
          <div className="flex gap-2"><MessageCircle className="h-4 w-4 mt-0.5 text-[var(--alix-whatsapp)]" /> +229 01 97 41 29 33</div>
        </div>
        <a
          href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--alix-whatsapp)] text-white font-semibold hover:opacity-90 transition-opacity"
          data-testid="about-whatsapp-button"
        >
          <MessageCircle className="h-4 w-4" /> Nous contacter
        </a>
      </div>
      <div className="bg-gradient-to-br from-[var(--alix-walnut)] to-[var(--alix-bronze)]/70 min-h-[240px] relative overflow-hidden">
        <div className="absolute inset-0 alix-noise opacity-30" />
        <div className="relative h-full flex flex-col items-center justify-center p-10 text-[var(--alix-ivory)]">
          <div className="font-display text-6xl mb-3">AL</div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--alix-brass)]">Atelier artisanal</div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
