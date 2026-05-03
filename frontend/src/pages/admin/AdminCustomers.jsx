import React, { useEffect, useState } from "react";
import { apiAdmin, formatFCFA } from "../../lib/api";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    apiAdmin.get("/admin/customers").then(r => setCustomers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => !q || c.fullName.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()) || (c.phone || "").includes(q));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Clients</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{customers.length} client{customers.length > 1 ? "s" : ""}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="pl-9" data-testid="admin-customers-search-input" />
      </div>

      {loading ? <div className="text-center py-10">Chargement…</div> : (
        <div className="rounded-xl border bg-[hsl(var(--card))] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="admin-customers-table">
              <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
                <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Téléphone</th><th className="p-3">Commandes</th><th className="p-3">Total dépensé</th><th className="p-3">Inscrit le</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-t hover:bg-[hsl(var(--accent))]/30" data-testid={`admin-customer-row-${c.id}`}>
                    <td className="p-3 font-semibold">{c.fullName}</td>
                    <td className="p-3 text-[hsl(var(--muted-foreground))]">{c.email}</td>
                    <td className="p-3 text-[hsl(var(--muted-foreground))]">{c.phone || "—"}</td>
                    <td className="p-3">{c.ordersCount}</td>
                    <td className="p-3 font-semibold">{formatFCFA(c.totalSpent)}</td>
                    <td className="p-3 text-xs text-[hsl(var(--muted-foreground))]">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-10 text-center text-[hsl(var(--muted-foreground))]">Aucun client trouvé.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
