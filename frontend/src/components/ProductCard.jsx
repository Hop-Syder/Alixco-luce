import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { resolveImage, formatFCFA } from "../lib/api";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product, className = "" }) => {
  const { addItem } = useCart();
  const img = product.images && product.images[0];

  return (
    <div
      className={`group rounded-xl border bg-[hsl(var(--card))] p-3 transform-gpu alix-interaction-transition alix-lift-hover hover:alix-card-shadow-hover alix-card-shadow flex flex-col ${className}`}
      data-testid="product-card"
    >
      <Link to={`/produit/${product.id}`} className="block relative overflow-hidden rounded-lg bg-[hsl(var(--muted))] aspect-[4/5]">
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-gradient-to-br from-[var(--alix-paper)] to-[var(--alix-ivory)]">
          <div className="text-3xl">✨</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] text-center px-4 font-display">{product.name}</div>
        </div>
        {img ? (
          <img
            src={resolveImage(img)}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : null}
        {product.featured && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-[hsl(var(--card))]/90 backdrop-blur text-[var(--alix-bronze)] font-semibold z-10">
            Vedette
          </span>
        )}
      </Link>
      <div className="mt-3 flex-1 flex flex-col px-1">
        <Link 
          to={`/produit/${product.id}`} 
          className="font-display text-base leading-tight line-clamp-1 hover:text-[var(--alix-brass)] transition-colors opacity-95" 
          data-testid="product-card-title"
        >
          {product.name}
        </Link>
        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          {product.material || (product.customizable ? "Personnalisable" : "")}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="font-display text-lg font-medium" data-testid="product-card-price">
            {formatFCFA(product.price)}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => addItem(product, 1, "")}
            data-testid="product-card-add-to-cart-button"
            className="h-8 rounded-lg px-3 text-[10px] bg-[var(--alix-ink)] text-white hover:bg-[var(--alix-walnut)]"
          >
            <ShoppingBag className="h-3 w-3 mr-1.5" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
