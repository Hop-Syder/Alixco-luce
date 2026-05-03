import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiAdmin, formatFCFA } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const STATUS = {
  pending: "En attente",
  confirmed: "Confirmée",
  in_production: "En production",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await apiAdmin.get(`/admin/orders/${id}`); setOrder(r.data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const r = await apiAdmin.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrder(o => ({ ...o, status: r.data.status }));
      toast.success("Statut mis à jour");
    } catch (e) { toast.error("Erreur", { description: e.response?.data?.detail || e.message }); }
  };

  if (loading) return <div className="text-center py-20">Chargement…</div>;
  if (!order) return <div className="text-center py-20">Commande introuvable.</div>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/admin/commandes"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="font-display text-3xl">#{order.orderNumber}</h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(order.createdAt).toLocaleString("fr-FR")}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-[hsl(var(--card))] p-5">
          <div className="font-semibold mb-3">Articles</div>
          <div className="divide-y">
            {order.items.map((it, i) => (
              <div key={i} className="py-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{formatFCFA(it.price)} × {it.quantity}</div>
                    {it.notes && <div className="mt-2 text-sm bg-[var(--alix-brass)]/10 text-[var(--alix-walnut)] px-3 py-2 rounded-lg italic">Note: {it.notes}</div>}
                  </div>
                  <div className="font-semibold flex-none">{formatFCFA(it.price * it.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold">
            <span>Total</span>
            <span data-testid="admin-order-total">{formatFCFA(order.total)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
            <div className="font-semibold mb-3">Statut</div>
            <Select value={order.status} onValueChange={updateStatus}>
              <SelectTrigger data-testid="admin-order-status-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
            <div className="font-semibold mb-3">Client</div>
            <div className="space-y-2 text-sm">
              <div className="font-medium">{order.customerName}</div>
              <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]"><Phone className="h-4 w-4" /> {order.customerPhone}</div>
              {order.customerEmail && <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]"><Mail className="h-4 w-4" /> {order.customerEmail}</div>}
              {order.customerAddress && <div className="flex items-start gap-2 text-[hsl(var(--muted-foreground))]"><MapPin className="h-4 w-4 mt-0.5" /> {order.customerAddress}</div>}
            </div>
            {order.deliveryNotes && (
              <div className="mt-3 text-sm bg-[hsl(var(--muted))] p-2 rounded">
                <div className="text-xs font-semibold uppercase text-[hsl(var(--muted-foreground))] mb-1">Note client</div>
                {order.deliveryNotes}
              </div>
            )}
            {order.whatsappUrl && (
              <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--alix-whatsapp)] text-white text-sm font-semibold" data-testid="admin-order-whatsapp-link">
                <MessageCircle className="h-4 w-4" /> Contacter le client
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
