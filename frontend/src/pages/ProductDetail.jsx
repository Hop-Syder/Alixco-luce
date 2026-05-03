import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, resolveImage, formatFCFA } from "../lib/api";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ShoppingBag, Minus, Plus, MessageCircle, Hammer, Ruler, Sparkles } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (!mounted) return;
        setProduct(res.data);
        setActiveImage(0);
        if (res.data.categoryId) {
          const r2 = await api.get("/products", { params: { category: res.data.categoryId, limit: 8 } });
          if (mounted) setRelated(r2.data.filter(p => p.id !== res.data.id).slice(0, 4));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="max-w-6xl mx-auto p-10 text-center">Chargement…</div>;
  if (!product) return <div className="max-w-6xl mx-auto p-10 text-center">Produit introuvable.</div>;

  const images = product.images && product.images.length > 0 ? product.images : [null];

  const handleAddToCart = () => {
    addItem(product, quantity, notes);
  };

  const whatsappBuyNow = () => {
    const msg = `Bonjour Alixco Luxe, je suis intéressé(e) par :%0A%0A• ${product.name} x${quantity} — ${formatFCFA(product.price * quantity)}${notes ? `%0ANote : ${notes}` : ""}%0A%0AMerci !`;
    window.open(`https://wa.me/2290197412933?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
        <Link to="/" className="hover:text-[hsl(var(--foreground))]">Accueil</Link>
        {" / "}
        <Link to="/catalogue" className="hover:text-[hsl(var(--foreground))]">Catalogue</Link>
        {" / "}
        <span className="text-[hsl(var(--foreground))]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-[hsl(var(--card))] border aspect-[4/5] alix-card-shadow relative">
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-gradient-to-br from-[var(--alix-paper)] to-[var(--alix-ivory)]">
              <div className="text-6xl">✨</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] text-center px-4 font-display">{product.name}</div>
            </div>
            {images[activeImage] ? (
              <img
                src={resolveImage(images[activeImage])}
                alt={product.name}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-lg overflow-hidden aspect-square border-2 transition-colors ${i === activeImage ? "border-[var(--alix-bronze)]" : "border-transparent"}`}
                  data-testid={`product-thumbnail-${i}`}
                >
                  <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.featured && <Badge className="bg-[var(--alix-brass)]/30 text-[var(--alix-walnut)] hover:bg-[var(--alix-brass)]/40">Vedette</Badge>}
            {product.customizable && <Badge variant="outline" className="border-[var(--alix-bronze)] text-[var(--alix-bronze)]"><Sparkles className="h-3 w-3 mr-1" />Personnalisable</Badge>}
            <Badge variant="outline">{product.stock > 0 ? `En stock (${product.stock})` : "Sur commande"}</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl" data-testid="product-detail-title">{product.name}</h1>
          <div className="mt-3 text-3xl font-bold text-[hsl(var(--foreground))]" data-testid="product-detail-price">{formatFCFA(product.price)}</div>
          <p className="mt-5 text-[hsl(var(--muted-foreground))] leading-relaxed">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {product.material && (
              <div className="rounded-lg border bg-[hsl(var(--card))] p-3">
                <dt className="text-[hsl(var(--muted-foreground))] text-xs flex items-center gap-1"><Hammer className="h-3.5 w-3.5" /> Matériau</dt>
                <dd className="font-semibold mt-1">{product.material}</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="rounded-lg border bg-[hsl(var(--card))] p-3">
                <dt className="text-[hsl(var(--muted-foreground))] text-xs flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> Dimensions</dt>
                <dd className="font-semibold mt-1">{product.dimensions}</dd>
              </div>
            )}
          </dl>

          {product.customizable && (
            <div className="mt-6">
              <label className="text-sm font-semibold">Notes de personnalisation</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: gravure 'Pour Maman 2026', dimensions spécifiques, couleur préférée…"
                rows={3}
                className="mt-2"
                data-testid="product-detail-notes-input"
              />
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-[hsl(var(--accent))]" data-testid="product-detail-qty-decrease"><Minus className="h-4 w-4" /></button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center" data-testid="product-detail-qty-value">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-[hsl(var(--accent))]" data-testid="product-detail-qty-increase"><Plus className="h-4 w-4" /></button>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="flex-1" variant="default" data-testid="product-detail-add-to-cart-button">
              <ShoppingBag className="h-4 w-4 mr-2" /> Ajouter au panier
            </Button>
          </div>
          <button
            onClick={whatsappBuyNow}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--alix-whatsapp)] text-white font-semibold hover:opacity-90 transition-opacity"
            data-testid="product-detail-whatsapp-button"
          >
            <MessageCircle className="h-4 w-4" /> Commander sur WhatsApp
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
