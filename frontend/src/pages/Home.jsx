import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Hammer, MessageCircle, Star } from "lucide-react";
import { api, resolveImage } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeletons";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const HERO_IMAGE = null;
const HERO_IMAGE_2 = null;

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, c, s] = await Promise.all([
          api.get("/products", { params: { featured: true, limit: 8 } }),
          api.get("/categories"),
          api.get("/services"),
        ]);
        if (!mounted) return;
        setFeatured(p.data);
        setCategories(c.data);
        setServices(s.data.slice(0, 6));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 alix-hero-gradient" aria-hidden />
        <div className="absolute inset-0 alix-noise opacity-50" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[hsl(var(--foreground))]">
              L'art de la<br />
              <span className="text-[var(--alix-bronze)]">personnalisation</span><br />
              sur mesure.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-xl">
              Découvrez un monde artisanal d'exception : gravure sur bois et métal, tableaux, bijoux, vêtements et accessoires — créés uniquement pour vous.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 rounded-lg" data-testid="hero-catalog-button">
                <Link to="/catalogue">Découvrir le catalogue <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <a
                href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe%2C%20je%20souhaite%20un%20devis%20personnalisé"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[var(--alix-whatsapp)] text-white font-medium hover:opacity-90 transition-opacity"
                data-testid="hero-whatsapp-button"
              >
                <MessageCircle className="h-4 w-4" /> Devis sur WhatsApp
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 max-w-md gap-4 text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
              <div className="flex items-center gap-2"><Hammer className="h-4 w-4 text-[var(--alix-bronze)]" /> Fait main</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--alix-bronze)]" /> Qualité premium</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--alix-bronze)]" /> Délai rapide</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative grid grid-cols-5 grid-rows-6 gap-3 h-[420px] sm:h-[520px]">
            <div className="col-span-3 row-span-6 rounded-2xl overflow-hidden alix-card-shadow relative bg-[var(--alix-walnut)]">
              <div className="absolute inset-0 alix-noise opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--alix-walnut)] via-[var(--alix-walnut)]/85 to-[var(--alix-bronze)]/40" />
              <div className="relative h-full flex flex-col justify-between p-6 text-[var(--alix-ivory)]">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--alix-brass)]">Atelier Alixco</div>
                <div>
                  <div className="font-display text-5xl sm:text-6xl leading-none">A</div>
                  <div className="font-display text-3xl sm:text-4xl text-[var(--alix-brass)]">&amp; L</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--alix-brass)]">Gravure &middot; Bijoux</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--alix-brass)]">Tableaux &middot; Sur mesure</div>
                </div>
              </div>
            </div>
            <div className="col-span-2 row-span-3 rounded-2xl overflow-hidden alix-card-shadow relative bg-gradient-to-br from-[var(--alix-brass)]/40 via-[var(--alix-paper)] to-[var(--alix-ivory)]">
              <div className="absolute inset-0 alix-noise opacity-40" />
              <div className="relative h-full flex flex-col justify-center items-center p-4 text-center">
                <Sparkles className="h-8 w-8 text-[var(--alix-bronze)] mb-2" />
                <div className="font-display text-lg leading-tight text-[var(--alix-walnut)]">Créations<br />uniques</div>
              </div>
            </div>
            <div className="col-span-2 row-span-3 rounded-2xl bg-[hsl(var(--card))] border p-5 flex flex-col justify-between alix-card-shadow">
              <div className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Délai moyen</div>
              <div className="font-display text-4xl">48h</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">pour un devis personnalisé</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Nos univers</div>
              <h2 className="font-display text-3xl sm:text-4xl">Explorez nos catégories</h2>
            </div>
            <Link to="/catalogue" className="hidden sm:inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" data-testid="home-all-categories-link">
              Tout voir <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/catalogue?category=${c.id}`}
                className="group rounded-xl border bg-[hsl(var(--card))] p-4 flex flex-col items-center text-center gap-2 hover:border-[var(--alix-bronze)] hover:alix-card-shadow-hover transition-colors alix-card-shadow"
                data-testid={`home-category-${c.slug}`}
              >
                <div className="text-2xl">{c.icon || "✨"}</div>
                <div className="text-sm font-semibold group-hover:text-[var(--alix-bronze)] transition-colors">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-14 sm:py-20 bg-[hsl(var(--card))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Sélection</div>
              <h2 className="font-display text-3xl sm:text-4xl">Nos créations en vedette</h2>
            </div>
            <Link to="/catalogue" className="hidden sm:inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              Voir le catalogue <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Comment commander</div>
            <h2 className="font-display text-3xl sm:text-4xl">3 étapes pour votre création</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Choisissez", desc: "Parcourez notre catalogue et sélectionnez l'article qui vous inspire." },
              { n: "02", title: "Personnalisez", desc: "Ajoutez vos notes de personnalisation : texte, dimensions, matière." },
              { n: "03", title: "Confirmez via WhatsApp", desc: "Validez votre commande et on s'occupe du reste — paiement et livraison." },
            ].map((step) => (
              <div key={step.n} className="rounded-xl border bg-[hsl(var(--card))] p-6 alix-card-shadow">
                <div className="font-display text-3xl text-[var(--alix-bronze)]">{step.n}</div>
                <div className="mt-2 font-semibold text-lg">{step.title}</div>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-14 sm:py-20 bg-[hsl(var(--card))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold mb-2">Savoir-faire</div>
              <h2 className="font-display text-3xl sm:text-4xl">Nos services</h2>
            </div>
            <Link to="/services" className="hidden sm:inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              Tous les services <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="rounded-xl border bg-[hsl(var(--background))] p-5 alix-card-shadow">
                <div className="text-2xl mb-3">{s.icon || "✨"}</div>
                <h3 className="font-semibold text-lg">{s.name}</h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">{s.description}</p>
                <div className="mt-3 text-sm font-semibold text-[var(--alix-bronze)]">
                  Dès {s.priceFrom ? `${s.priceFrom.toLocaleString("fr-FR")} FCFA` : "sur devis"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[var(--alix-brass)] text-[var(--alix-brass)]" />)}
          </div>
          <blockquote className="font-display text-2xl sm:text-3xl leading-tight">
            « Veuillez découvrir mon monde artisanal avec la création d'objets d'art, la confection et la personnalisation des tableaux en passant par la personnalisation de vos bijoux, accessoires, vêtements… »
          </blockquote>
          <div className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">— Alixco Luxe</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
