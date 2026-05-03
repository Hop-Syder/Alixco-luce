import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiAdmin, formatFCFA } from "../../lib/api";
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

const KpiCard = ({ icon: Icon, label, value, color = "bronze", testId }) => (
  <div className="rounded-xl border bg-[hsl(var(--card))] p-5" data-testid={testId}>
    <div className="flex items-center justify-between">
      <div className="text-sm text-[hsl(var(--muted-foreground))]">{label}</div>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${color === "bronze" ? "bg-[var(--alix-brass)]/20 text-[var(--alix-bronze)]" : color === "amber" ? "bg-amber-50 text-amber-600" : color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <div className="mt-3 text-2xl font-bold font-display">{value}</div>
  </div>
);

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  in_production: "En production",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiAdmin.get("/admin/dashboard").then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Chargement…</div>;
  if (!data) return <div className="text-center py-20">Aucune donnée</div>;

  const salesData = (data.salesLast30Days || []).map(d => ({ ...d, dateLabel: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) }));
  const statusData = Object.entries(data.statusCounts || {}).map(([status, count]) => ({ status: STATUS_LABELS[status] || status, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Tableau de bord</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Vue d'ensemble de votre activité.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={TrendingUp} label="Chiffre d'affaires" value={formatFCFA(data.totalRevenue)} color="emerald" testId="admin-kpi-revenue" />
        <KpiCard icon={ShoppingBag} label="Commandes totales" value={data.totalOrders} color="bronze" testId="admin-kpi-orders" />
        <KpiCard icon={Clock} label="En attente" value={data.pendingOrders} color="amber" testId="admin-kpi-pending" />
        <KpiCard icon={Users} label="Clients" value={data.totalCustomers} color="slate" testId="admin-kpi-customers" />
      </div>

      {/* Stock alerts */}
      {(data.lowStockCount > 0 || data.outOfStockCount > 0) && (
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-amber-900">Alertes stock</div>
            <div className="text-sm text-amber-800 mt-1">
              {data.lowStockCount} produit{data.lowStockCount > 1 ? "s" : ""} à stock faible • {data.outOfStockCount} en rupture
            </div>
            <Link to="/admin/produits" className="text-sm text-amber-900 underline mt-1 inline-block">Voir les produits</Link>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-[hsl(var(--card))] p-5" data-testid="admin-sales-chart">
          <div className="font-semibold mb-4">Ventes des 30 derniers jours</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dateLabel" stroke="#94a3b8" fontSize={11} interval="preserveStartEnd" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(value, name) => [name === "revenue" ? formatFCFA(value) : value, name === "revenue" ? "CA" : "Commandes"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#B07A3A" strokeWidth={2} dot={false} name="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
          <div className="font-semibold mb-4">Commandes par statut</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={10} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top products + Recent orders */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
          <div className="font-semibold mb-3">Top produits</div>
          {(data.topProducts || []).length === 0 ? (
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Aucune donnée</div>
          ) : (
            <div className="space-y-2">
              {data.topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-7 w-7 rounded-md bg-[var(--alix-brass)]/20 text-[var(--alix-bronze)] flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <div className="truncate text-sm">{p.name}</div>
                  </div>
                  <div className="text-sm font-semibold flex-none">{formatFCFA(p.revenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Commandes récentes</div>
            <Link to="/admin/commandes" className="text-xs text-[var(--alix-bronze)] hover:underline">Voir tout</Link>
          </div>
          {(data.recentOrders || []).length === 0 ? (
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Aucune commande</div>
          ) : (
            <div className="space-y-2">
              {data.recentOrders.map(o => (
                <Link key={o.id} to={`/admin/commandes/${o.id}`} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-[hsl(var(--accent))]/50 px-2 rounded">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">#{o.orderNumber}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">{o.customerName}</div>
                  </div>
                  <div className="text-right flex-none">
                    <div className="text-sm font-semibold">{formatFCFA(o.total)}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{STATUS_LABELS[o.status] || o.status}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
