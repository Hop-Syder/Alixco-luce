/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Page d'accueil - Design Premium Liquid Glass
 * @created 2026-05-06
 * @updated 2026-05-06
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 * ──────────────────────────────────
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    ArrowRight, Sparkles, ShieldCheck, Clock, Hammer, 
    MessageCircle, Star, ChevronRight, Play, ExternalLink 
} from "lucide-react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeletons";
import { Button } from "../components/ui/button";
import { AccentLeafIcon, AlixLogoIcon } from "../components/icons/BrandIcons";

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-[var(--alix-ivory)] selection:bg-[var(--alix-brass)]/30">
            {/* HERO SECTION - Premium Liquid Glass */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-14">
                <div className="absolute inset-0 alix-hero-gradient opacity-40 z-0" />
                <div className="absolute inset-0 alix-noise opacity-30 z-0" />
                
                {/* Floating Glass Blobs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--alix-brass)]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-[var(--alix-walnut)]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:-mt-10"
                    >
                        <div className="flex items-center gap-2 text-[var(--alix-bronze)] font-semibold text-xs uppercase tracking-[0.3em] mb-6">
                            <AccentLeafIcon className="h-4 w-4" />
                            <span>Atelier d'Exception à Cotonou</span>
                        </div>
                        <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] mb-8 text-[var(--alix-ink)]">
                            L'essence du <br />
                            <span className="relative">
                                <span className="relative z-10 text-[var(--alix-walnut)]">Sur-Mesure</span>
                                <motion.span 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="absolute bottom-2 left-0 h-3 bg-[var(--alix-brass)]/20 -rotate-1 z-0" 
                                />
                            </span>
                        </h1>
                        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-lg mb-10 leading-relaxed font-light">
                            Découvrez une collection artisanale où chaque gravure, chaque tissu et chaque bijou 
                            devient une œuvre d'art unique façonnée selon vos désirs.
                        </p>
                        <div className="flex flex-wrap items-center gap-5">
                            <Button asChild size="lg" className="h-14 px-8 bg-[var(--alix-ink)] hover:bg-[var(--alix-walnut)] rounded-xl text-[var(--alix-ivory)] alix-interaction-transition alix-press-active shadow-xl shadow-black/10">
                                <Link to="/catalogue" className="flex items-center gap-2">
                                    Explorer le monde Alixco <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <a
                                href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe"
                                target="_blank"
                                rel="noreferrer"
                                className="h-14 px-8 rounded-xl bg-white/60 backdrop-blur-md border border-white/20 flex items-center gap-2 font-bold text-[var(--alix-ink)] hover:bg-white/80 transition-all alix-card-shadow"
                            >
                                <MessageCircle className="h-5 w-5 text-[var(--alix-whatsapp)]" />
                                Devis WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="grid grid-cols-12 gap-4 h-[420px]">
                            {/* Row 1: Main + 48h (Réduite de 20%) */}
                            <div className="col-span-8 row-span-9 rounded-3xl overflow-hidden alix-card-shadow relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--alix-ink)]/60 to-transparent z-10" />
                                <img 
                                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" 
                                    alt="Artisanat" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute bottom-8 left-8 z-20 text-white">
                                    <div className="text-[10px] uppercase tracking-widest text-[var(--alix-brass)] mb-1">Inspiration</div>
                                    <div className="font-display text-3xl">Gravure Artisanale</div>
                                </div>
                            </div>

                            <div className="col-span-4 row-span-9 rounded-3xl bg-[var(--alix-walnut)] p-8 flex flex-col justify-end alix-card-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-full h-full alix-noise opacity-20 pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="font-display text-5xl text-white mb-2 italic">48h</div>
                                    <div className="text-[10px] uppercase tracking-widest text-[var(--alix-ivory)]/60">Délai Devis</div>
                                </div>
                            </div>

                            {/* Row 2: Atelier + Créations */}
                            <div className="col-span-8 row-span-3 rounded-3xl bg-white/60 backdrop-blur-md border border-white/20 px-8 py-2 flex items-center justify-between alix-card-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full border border-[var(--alix-brass)] flex items-center justify-center text-[var(--alix-brass)] font-display text-lg">A</div>
                                    <div>
                                        <div className="text-sm font-bold">Atelier Alixco</div>
                                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Cotonou, Bénin</div>
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-[var(--alix-paper)] overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="h-8 w-8 rounded-full border-2 border-white bg-[var(--alix-brass)] flex items-center justify-center text-[7px] font-bold text-white">+500</div>
                                </div>
                            </div>

                            <div className="col-span-4 row-span-3 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/30 px-6 py-2 flex flex-row items-center gap-4 alix-card-shadow">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--alix-brass)]/20 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-[var(--alix-brass)]" />
                                </div>
                                <div className="font-display text-lg leading-tight text-[var(--alix-ink)]">Créations <br />Uniques</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CATEGORIES SECTION - Glass Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="flex flex-col md:flex-row md:items-end justify-between mb-12"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-[var(--alix-bronze)] font-semibold text-[10px] uppercase tracking-[0.3em] mb-3">
                                <ChevronRight className="h-3 w-3" />
                                <span>Collections</span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl text-[var(--alix-ink)]">Nos Univers Créatifs</h2>
                        </div>
                        <Link to="/catalogue" className="group mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[var(--alix-ink)] hover:text-[var(--alix-walnut)] transition-colors">
                            Voir tout le catalogue 
                            <div className="h-8 w-8 rounded-full border border-[var(--alix-ink)] group-hover:border-[var(--alix-walnut)] group-hover:bg-[var(--alix-walnut)] group-hover:text-white flex items-center justify-center transition-all">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((c, i) => (
                            <motion.div 
                                key={c.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={`/catalogue?category=${c.id}`}
                                    className="group relative h-48 rounded-[1.5rem] border bg-white/40 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/80 transition-all alix-card-shadow alix-interaction-transition alix-lift-hover"
                                >
                                    <div className="text-4xl transform group-hover:scale-125 transition-transform duration-500 ease-out">{c.icon || "✨"}</div>
                                    <div className="text-sm font-bold text-[var(--alix-ink)] tracking-tight">{c.name}</div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-3 w-3 text-[var(--alix-brass)]" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED SECTION - Elegant Showcase */}
            <section className="py-24 bg-[var(--alix-ink)] text-[var(--alix-ivory)] relative overflow-hidden rounded-[2rem] mx-2 sm:mx-6">
                <div className="absolute top-0 right-0 w-full h-full alix-noise opacity-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                        <div>
                            <div className="flex items-center gap-2 text-[var(--alix-brass)] font-semibold text-[10px] uppercase tracking-[0.3em] mb-3">
                                <Star className="h-3 w-3" />
                                <span>Sélection</span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl leading-tight">Pièces d'Exception <br />en Vedette</h2>
                        </div>
                    </div>
                    
                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : (
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                            {featured.map((p, i) => (
                                <motion.div 
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <ProductCard product={p} className="bg-white/5 border-white/10 text-white" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* PROCESS SECTION - Minimal Timeline */}
            <section className="py-32">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="text-[var(--alix-bronze)] font-semibold text-[10px] uppercase tracking-[0.3em] mb-4">Parcours Client</div>
                        <h2 className="font-display text-4xl sm:text-5xl text-[var(--alix-ink)]">Votre Vision, <br />Notre Réalisation</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--alix-brass)]/30 to-transparent z-0" />

                        {[
                            { n: "01", title: "Inspiration", desc: "Choisissez un modèle ou partagez votre idée unique.", icon: Hammer },
                            { n: "02", title: "Conception", desc: "Nous affinons ensemble les détails : gravure, matière, dimensions.", icon: Sparkles },
                            { n: "03", title: "Livraison", desc: "Confirmation sur WhatsApp et livraison de votre pièce d'art.", icon: ShieldCheck },
                        ].map((step, i) => (
                            <motion.div 
                                key={step.n}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="h-24 w-24 rounded-[1.5rem] bg-white border border-[var(--alix-brass)]/20 flex items-center justify-center alix-card-shadow mb-8 group-hover:scale-110 group-hover:bg-[var(--alix-brass)] group-hover:text-white transition-all duration-500">
                                    <div className="font-display text-3xl">{step.n}</div>
                                </div>
                                <h3 className="font-display text-2xl mb-4 text-[var(--alix-ink)]">{step.title}</h3>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION - Immersive Cards */}
            <section className="py-24 bg-[var(--alix-paper)] rounded-[2rem] mx-2 sm:mx-6 mb-24 relative overflow-hidden">
                <div className="absolute inset-0 alix-noise opacity-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                        <div>
                            <div className="text-[var(--alix-bronze)] font-semibold text-[10px] uppercase tracking-[0.3em] mb-3">Savoir-Faire</div>
                            <h2 className="font-display text-4xl sm:text-5xl text-[var(--alix-ink)]">Nos Services Experts</h2>
                        </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((s, i) => (
                            <motion.div 
                                key={s.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 rounded-[1.5rem] bg-white/60 backdrop-blur-sm border border-white/40 alix-card-shadow-hover alix-interaction-transition alix-lift-hover"
                            >
                                <div className="h-16 w-16 rounded-[1.5rem] bg-[var(--alix-brass)]/10 flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">
                                    {s.icon || "✨"}
                                </div>
                                <h3 className="font-display text-2xl mb-4 text-[var(--alix-ink)]">{s.name}</h3>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3 mb-6">{s.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-[var(--alix-walnut)] uppercase tracking-wider">
                                        {s.priceFrom ? `Dès ${s.priceFrom.toLocaleString("fr-FR")} FCFA` : "Sur Devis"}
                                    </span>
                                    <Link to={`/services`} className="h-10 w-10 rounded-full bg-[var(--alix-ink)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION - Final Impact */}
            <section className="py-32 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <AlixLogoIcon className="h-16 w-auto mx-auto mb-10 opacity-20" />
                        <h2 className="font-display text-4xl sm:text-6xl text-[var(--alix-ink)] mb-8">L'artisanat qui raconte <br /><span className="text-[var(--alix-brass)] italic">votre histoire</span>.</h2>
                        <p className="text-lg text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl mx-auto">
                            Rejoignez plus de 500 clients satisfaits qui ont choisi l'excellence et la personnalisation Alixco Luxe.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button asChild size="lg" className="h-16 px-12 bg-[var(--alix-ink)] text-[var(--alix-ivory)] rounded-2xl alix-interaction-transition alix-lift-hover text-lg">
                                <Link to="/catalogue">Accéder au catalogue</Link>
                            </Button>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[var(--alix-brass)] text-[var(--alix-brass)]" />)}
                                <span className="ml-2 font-bold text-[var(--alix-ink)]">4.9/5</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
