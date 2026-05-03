import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiAdmin, resolveImage, formatFCFA } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Edit, Trash2, Percent, Search } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [bulkPct, setBulkPct] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([apiAdmin.get("/admin/products"), apiAdmin.get("/categories")]);
      setProducts(p.data);
      setCategories(c.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    if (!q) return products;
    const s = q.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(s) || (p.description || "").toLowerCase().includes(s));
  }, [products, q]);

  const onDelete = async (id) => {
    try {
      await apiAdmin.delete(`/admin/products/${id}`);
      toast.success("Produit supprimé");
      load();
    } catch (e) {
      toast.error("Erreur", { description: e.response?.data?.detail || e.message });
    }
  };

  const onBulkPrice = async () => {
    const pct = parseFloat(bulkPct);
    if (isNaN(pct)) return toast.error("Entrez un pourcentage valide");
    try {
      const res = await apiAdmin.post("/admin/products/bulk-price", { percentageChange: pct });
      toast.success(`Mise à jour réussie`, { description: `${res.data.updated} produit(s) mis à jour` });
      setBulkOpen(false);
      setBulkPct("");
      load();
    } catch (e) {
      toast.error("Erreur", { description: e.response?.data?.detail || e.message });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Produits</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{products.length} produit{products.length > 1 ? "s" : ""} au total</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="admin-bulk-price-button"><Percent className="h-4 w-4 mr-2" /> Prix en masse</Button>
            </DialogTrigger>
            <DialogContent className="admin-theme">
              <DialogHeader>
                <DialogTitle>Modifier les prix en masse</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Appliquer un pourcentage de hausse/baisse à tous les produits. Ex: 10 pour +10%, -5 pour -5%.</p>
              <div>
                <Input value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} type="number" placeholder="ex: 10" data-testid="admin-bulk-price-input" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkOpen(false)}>Annuler</Button>
                <Button onClick={onBulkPrice} data-testid="admin-bulk-price-apply">Appliquer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button asChild data-testid="admin-new-product-button">
            <Link to="/admin/produits/nouveau"><Plus className="h-4 w-4 mr-2" /> Nouveau</Link>
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="pl-9" data-testid="admin-products-search-input" />
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement…</div>
      ) : (
        <div className="rounded-xl border bg-[hsl(var(--card))] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="admin-products-table">
              <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
                <tr>
                  <th className="p-3">Produit</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-t hover:bg-[hsl(var(--accent))]/30" data-testid={`admin-product-row-${p.id}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-[hsl(var(--muted))] overflow-hidden flex-none">
                          {p.images?.[0] && <img src={resolveImage(p.images[0])} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate max-w-[240px]">{p.name}</div>
                          {p.featured && <span className="text-[10px] uppercase text-[var(--alix-bronze)] font-bold">Vedette</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[hsl(var(--muted-foreground))]">{catMap[p.categoryId]?.name || "—"}</td>
                    <td className="p-3 font-semibold">{formatFCFA(p.price)}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${p.stock === 0 ? "bg-red-100 text-red-800" : p.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${p.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"}`}>
                        {p.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="icon" asChild data-testid={`admin-edit-product-${p.id}`}>
                          <Link to={`/admin/produits/${p.id}`}><Edit className="h-4 w-4" /></Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`admin-delete-product-${p.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="admin-theme">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(p.id)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-10 text-center text-[hsl(var(--muted-foreground))]">Aucun produit trouvé.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
