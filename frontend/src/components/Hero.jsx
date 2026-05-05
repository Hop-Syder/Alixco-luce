import React from "react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { AccentLeafIcon } from "./icons/BrandIcons";

const Hero = ({ title = "L'artisanat raffiné, livré pour vous", subtitle = "Gravure sur bois, métal et pièces uniques — commande via WhatsApp" }) => {
    return (
        <section className="alix-hero py-16 sm:py-24">
            <div className="alix-hero-wood" aria-hidden="true" />
            <div className="alix-hero-inner max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-[-0.02em] flex items-center gap-3">
                        <AccentLeafIcon className="h-6 w-6 text-[var(--alix-bronze)]" />
                        <span>{title}</span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl">{subtitle}</p>
                    <div className="mt-6 flex items-center gap-3">
                        <a
                            href="https://wa.me/2290197412933"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="hero-whatsapp-cta"
                        >
                            <Button variant="default" className="rounded-lg" data-testid="hero-primary-cta">
                                <MessageSquare className="h-4 w-4" /> Commander sur WhatsApp
                            </Button>
                        </a>
                        <Button variant="secondary" className="rounded-lg" data-testid="hero-catalog-cta">
                            Voir le catalogue
                        </Button>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="rounded-xl overflow-hidden bg-[hsl(var(--card))] p-2 alix-card-shadow">
                        <img
                            src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=60"
                            alt="Atelier artisanal"
                            className="w-full h-64 object-cover rounded-md"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
