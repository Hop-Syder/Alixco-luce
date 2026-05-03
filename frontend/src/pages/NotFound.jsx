import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => (
  <div className="max-w-lg mx-auto px-4 py-20 text-center">
    <div className="font-display text-7xl text-[var(--alix-bronze)]">404</div>
    <h1 className="font-display text-2xl mt-3">Page introuvable</h1>
    <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">La page que vous cherchez n'existe plus ou a été déplacée.</p>
    <Button asChild className="mt-6">
      <Link to="/">Retour à l'accueil</Link>
    </Button>
  </div>
);

export default NotFound;
