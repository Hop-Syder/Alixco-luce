import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiAdmin, formatFCFA } from "../../lib/api";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, ExternalLink } from "lucide-react";

const STATUS = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-800" },
  in_production: { label: "En production", color: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Livrée", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status !== "all") params.status = status;
    apiAdmin.get("/admin/orders", { params }).then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, [status]);

  const filtered = useMemo(() => {
    if (!q) return orders;
    const s = q.toLowerCase();
    return orders.filter(o => o.orderNumber.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s) || (o.customerPhone || "").includes(s));
  }, [orders, q]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Commandes</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="N° commande, client, tél…" className="pl-9" data-testid="admin-orders-search-input" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]" data-testid="admin-orders-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? <div className="text-center py-10">Chargement…</div> : (
        <div className="rounded-xl border bg-[hsl(var(--card))] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="admin-orders-table">
              <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
                <tr><th className="p-3">N°</th><th className="p-3">Client</th><th className="p-3">Articles</th><th className="p-3">Total</th><th className="p-3">Statut</th><th className="p-3">Date</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-t hover:bg-[hsl(var(--accent))]/30" data-testid={`admin-order-row-${o.orderNumber}`}>
                    <td className="p-3 font-semibold">#{o.orderNumber}</td>
                    <td className="p-3">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{o.customerPhone}</div>
                    </td>
                    <td className="p-3 text-[hsl(var(--muted-foreground))]">{o.items.length} article{o.items.length > 1 ? "s" : ""}</td>
                    <td className="p-3 font-semibold">{formatFCFA(o.total)}</td>
                    <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${STATUS[o.status]?.color || "bg-gray-100"}`}>{STATUS[o.status]?.label || o.status}</span></td>
                    <td className="p-3 text-xs text-[hsl(var(--muted-foreground))]">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-right">
                      <Link to={`/admin/commandes/${o.id}`} className="inline-flex items-center gap-1 text-xs text-[var(--alix-bronze)] hover:underline" data-testid={`admin-view-order-${o.orderNumber}`}>
                        Détails <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-10 text-center text-[hsl(var(--muted-foreground))]">Aucune commande trouvée.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
