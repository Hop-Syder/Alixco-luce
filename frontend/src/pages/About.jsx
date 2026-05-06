/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Page À propos - Design Premium Liquid Glass
 * @created 2026-05-06
 * @updated 2026-05-06
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 * ──────────────────────────────────
 */
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Hammer, Award, Heart, MapPin, Sparkles, Star, ChevronRight } from "lucide-react";
import { AccentLeafIcon } from "../components/icons/BrandIcons";

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="relative overflow-hidden bg-[var(--alix-ivory)]">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-[var(--alix-brass)]/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] rounded-full bg-[var(--alix-walnut)]/5 blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mb-20"
                >
                    <div className="flex items-center gap-2 text-[var(--alix-bronze)] font-semibold text-xs uppercase tracking-[0.2em] mb-4">
                        <AccentLeafIcon className="h-4 w-4" />
                        <span>Notre héritage</span>
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8 text-[var(--alix-ink)]">
                        L'art de donner <br />
                        <span className="text-[var(--alix-walnut)] italic">une âme</span> aux objets
                    </h1>
                    <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed font-light">
                        Alixco Luxe est né d'une passion pour la matière et le détail. 
                        Depuis notre atelier à Cotonou, nous transformons le bois, le métal et le textile 
                        en pièces d'exception qui portent votre histoire.
                    </p>
                </motion.div>

                {/* Values Grid */}
                <div className="grid sm:grid-cols-3 gap-8 mb-24">
                    {[
                        { 
                            icon: Hammer, 
                            title: "Artisanat Pur", 
                            desc: "Chaque coup de burin, chaque gravure est un geste maîtrisé, loin des standards industriels.",
                            color: "var(--alix-walnut)"
                        },
                        { 
                            icon: Award, 
                            title: "Excellence", 
                            desc: "Nous sélectionnons rigoureusement nos bois précieux et métaux pour garantir une longévité éternelle.",
                            color: "var(--alix-brass)"
                        },
                        { 
                            icon: Heart, 
                            title: "Émotion", 
                            desc: "Une personnalisation n'est pas qu'un nom, c'est un souvenir gravé pour toujours.",
                            color: "var(--alix-bronze)"
                        },
                    ].map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                className="group relative p-8 rounded-3xl border bg-white/40 backdrop-blur-md alix-card-shadow-hover alix-interaction-transition alix-lift-hover cursor-default"
                            >
                                <div className="absolute inset-0 alix-noise opacity-[0.03] pointer-events-none rounded-3xl" />
                                <div 
                                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
                                    style={{ backgroundColor: `${f.color}15`, color: f.color }}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="font-display text-2xl mb-3 text-[var(--alix-ink)]">{f.title}</h3>
                                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{f.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Philosophy Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div 
                        {...fadeIn}
                        className="relative rounded-[2rem] overflow-hidden aspect-square sm:aspect-video lg:aspect-square alix-card-shadow"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--alix-walnut)]/20 to-transparent z-10" />
                        <img 
                            src="https://images.unsplash.com/photo-1581450134466-071f510793b5?auto=format&fit=crop&w=1000&q=80" 
                            alt="Atelier Alixco"
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        />
                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl z-20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[var(--alix-brass)] flex items-center justify-center text-white font-display text-xl">A</div>
                                <div>
                                    <div className="text-[var(--alix-ivory)] font-semibold">Alixco Luxe</div>
                                    <div className="text-[var(--alix-ivory)]/70 text-xs">Cotonou, Bénin</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-display text-4xl sm:text-5xl mb-6">Notre Philosophie</h2>
                        <div className="space-y-6 text-[hsl(var(--muted-foreground))] leading-relaxed">
                            <p>
                                Nous croyons que dans un monde de consommation de masse, l'objet unique redevient un luxe essentiel. 
                                Chaque pièce qui sort de notre atelier est le résultat d'un dialogue entre l'artisan et la matière.
                            </p>
                            <div className="flex gap-4 p-4 rounded-2xl bg-[var(--alix-paper)] border border-[var(--alix-brass)]/20">
                                <Sparkles className="h-6 w-6 text-[var(--alix-brass)] shrink-0" />
                                <p className="text-sm italic">
                                    "La gravure n'est pas seulement une technique, c'est l'immortalisation d'un instant sur un support noble."
                                </p>
                            </div>
                            <p>
                                Que ce soit pour un cadeau d'entreprise, un bijou de famille ou une décoration d'intérieur, 
                                nous mettons la même rigueur et le même amour dans chaque détail.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] bg-[var(--alix-ink)] text-[var(--alix-ivory)] p-8 sm:p-16 relative overflow-hidden alix-card-shadow"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--alix-walnut)]/20 to-transparent opacity-50" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--alix-brass)]/10 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-display text-4xl sm:text-5xl mb-6">Prêt à créer votre pièce unique ?</h2>
                            <p className="text-[var(--alix-ivory)]/70 mb-8 max-w-md">
                                Discutons de votre projet. Nos devis sont personnalisés et gratuits.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="https://wa.me/2290197412933?text=Bonjour%20Alixco%20Luxe"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--alix-whatsapp)] text-white font-bold alix-interaction-transition alix-press-active hover:shadow-lg hover:shadow-green-500/20"
                                    data-testid="about-whatsapp-button-new"
                                >
                                    <MessageCircle className="h-5 w-5" /> 
                                    WhatsApp
                                </a>
                                <div className="flex items-center gap-4 px-6 text-sm text-[var(--alix-ivory)]/60">
                                    <MapPin className="h-5 w-5 text-[var(--alix-brass)]" />
                                    <span>Cotonou, Bénin</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--alix-brass)]/20 blur-2xl rounded-full" />
                                <div className="w-48 h-48 border-2 border-[var(--alix-brass)]/30 rounded-full flex items-center justify-center relative z-10 animate-[spin_20s_linear_infinite]">
                                    <Star className="h-8 w-8 text-[var(--alix-brass)] absolute top-0" />
                                    <Star className="h-8 w-8 text-[var(--alix-brass)] absolute bottom-0" />
                                    <Star className="h-8 w-8 text-[var(--alix-brass)] absolute left-0" />
                                    <Star className="h-8 w-8 text-[var(--alix-brass)] absolute right-0" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center font-display text-5xl">AL</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
