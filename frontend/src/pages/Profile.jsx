import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiCustomer, formatFCFA } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const STATUS_LABELS = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-800" },
  in_production: { label: "En production", color: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Livrée", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || "", phone: user.phone || "", address: user.address || "" });
  }, [user]);

  useEffect(() => {
    apiCustomer.get("/orders/mine").then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error("Échec", { description: err.response?.data?.detail || err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Mon compte</h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{user.email}</p>
        </div>
        <Button variant="outline" onClick={logout} data-testid="profile-logout-button">Déconnexion</Button>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <form onSubmit={save} className="rounded-xl border bg-[hsl(var(--card))] p-6 alix-card-shadow space-y-4 h-fit">
          <h2 className="font-display text-xl">Informations personnelles</h2>
          <div>
            <Label>Nom complet</Label>
            <Input value={form.fullName} onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))} data-testid="profile-name-input" />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} data-testid="profile-phone-input" />
          </div>
          <div>
            <Label>Adresse</Label>
            <Input value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} data-testid="profile-address-input" />
          </div>
          <Button type="submit" disabled={saving} className="w-full" data-testid="profile-save-button">{saving ? "Enregistrement…" : "Enregistrer"}</Button>
        </form>

        <div>
          <h2 className="font-display text-xl mb-4">Historique des commandes</h2>
          {orders.length === 0 ? (
            <div className="rounded-xl border bg-[hsl(var(--card))] p-8 text-center text-[hsl(var(--muted-foreground))] alix-card-shadow">
              Aucune commande pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="rounded-xl border bg-[hsl(var(--card))] p-5 alix-card-shadow" data-testid={`profile-order-${o.orderNumber}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-semibold">#{o.orderNumber}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(o.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</div>
                    </div>
                    <Badge className={`${STATUS_LABELS[o.status]?.color || "bg-gray-100"} border-0`}>{STATUS_LABELS[o.status]?.label || o.status}</Badge>
                  </div>
                  <div className="mt-3 text-sm">
                    {o.items.map((it, i) => (
                      <div key={i} className="flex justify-between py-1 text-[hsl(var(--muted-foreground))]">
                        <span>• {it.name} × {it.quantity}</span>
                        <span>{formatFCFA(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatFCFA(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
