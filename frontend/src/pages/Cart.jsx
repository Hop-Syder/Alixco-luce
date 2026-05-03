import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { api, resolveImage, formatFCFA } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, updateNotes, removeItem, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    customerPhone: user?.phone || "",
    customerEmail: user?.email || "",
    customerAddress: user?.address || "",
    deliveryNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.customerName.trim()) return toast.error("Veuillez saisir votre nom");
    if (!form.customerPhone.trim()) return toast.error("Veuillez saisir votre numéro de téléphone");
    if (items.length === 0) return toast.error("Votre panier est vide");
    setSubmitting(true);
    try {
      const payload = {
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
        ...form,
      };
      const res = await api.post("/orders", payload);
      toast.success("Commande créée", { description: `N° ${res.data.order.orderNumber} — Ouverture de WhatsApp…` });
      clear();
      // Redirect to WhatsApp
      window.location.href = res.data.whatsappUrl;
    } catch (e) {
      toast.error("Erreur", { description: e.response?.data?.detail || e.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
        <h1 className="font-display text-3xl">Votre panier est vide</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">Découvrez nos créations et ajoutez vos coups de cœur.</p>
        <Button asChild className="mt-6" data-testid="cart-empty-shop-button">
          <Link to="/catalogue">Parcourir le catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-6">Mon panier</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-xl border bg-[hsl(var(--card))] p-4 flex flex-col sm:flex-row gap-4 alix-card-shadow" data-testid={`cart-item-${idx}`}>
              <div className="w-full sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--alix-paper)] to-[var(--alix-ivory)] flex-none aspect-square relative">
                <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                {it.image ? (
                  <img src={resolveImage(it.image)} alt={it.name} onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{it.name}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">{formatFCFA(it.price)} / unité</div>
                  </div>
                  <button onClick={() => removeItem(idx)} className="p-2 rounded-md hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))] transition-colors" data-testid={`cart-item-remove-${idx}`} aria-label="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Textarea
                  value={it.notes || ""}
                  onChange={(e) => updateNotes(idx, e.target.value)}
                  placeholder="Notes de personnalisation (optionnel)"
                  rows={2}
                  className="mt-3 text-sm"
                  data-testid={`cart-item-notes-${idx}`}
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(idx, it.quantity - 1)} className="p-2 hover:bg-[hsl(var(--accent))]" data-testid={`cart-item-decrease-${idx}`}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="px-3 py-1 text-sm font-semibold min-w-[2.5rem] text-center">{it.quantity}</span>
                    <button onClick={() => updateQuantity(idx, it.quantity + 1)} className="p-2 hover:bg-[hsl(var(--accent))]" data-testid={`cart-item-increase-${idx}`}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="font-bold">{formatFCFA(it.price * it.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={clear} data-testid="cart-clear-button">Vider le panier</Button>
        </div>

        {/* Summary */}
        <aside className="rounded-xl border bg-[hsl(var(--card))] p-6 alix-card-shadow h-fit lg:sticky lg:top-20">
          <h2 className="font-display text-2xl mb-4">Récapitulatif</h2>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nom complet *</Label>
              <Input value={form.customerName} onChange={onField("customerName")} data-testid="cart-customer-name-input" placeholder="Votre nom" />
            </div>
            <div>
              <Label className="text-xs">Téléphone *</Label>
              <Input value={form.customerPhone} onChange={onField("customerPhone")} data-testid="cart-customer-phone-input" placeholder="+229 ..." />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.customerEmail} onChange={onField("customerEmail")} data-testid="cart-customer-email-input" placeholder="email@exemple.com" />
            </div>
            <div>
              <Label className="text-xs">Adresse de livraison</Label>
              <Input value={form.customerAddress} onChange={onField("customerAddress")} data-testid="cart-customer-address-input" placeholder="Ville, quartier…" />
            </div>
            <div>
              <Label className="text-xs">Note à l'artisan</Label>
              <Textarea rows={2} value={form.deliveryNotes} onChange={onField("deliveryNotes")} data-testid="cart-delivery-notes-input" placeholder="Instructions particulières…" />
            </div>
          </div>

          <div className="mt-5 pt-5 border-t space-y-2">
            <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
              <span>Sous-total</span>
              <span>{formatFCFA(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
              <span>Livraison</span>
              <span>À convenir</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span data-testid="cart-total-amount">{formatFCFA(total)}</span>
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={submitting}
            className="mt-5 w-full bg-[var(--alix-whatsapp)] hover:opacity-90 text-white h-12 text-base font-semibold"
            data-testid="cart-whatsapp-checkout-button"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {submitting ? "Envoi…" : "Valider via WhatsApp"}
          </Button>
          <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))] text-center">
            Vous serez redirigé vers WhatsApp pour finaliser votre commande avec notre équipe.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
