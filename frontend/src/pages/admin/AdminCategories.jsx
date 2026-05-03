import React, { useEffect, useState } from "react";
import { apiAdmin } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { toast } from "sonner";

const empty = { name: "", slug: "", description: "", icon: "" };

const AdminCategories = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const r = await apiAdmin.get("/categories"); setCats(r.data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditingId(null); setOpen(true); };
  const openEdit = (c) => { setForm({ ...empty, ...c }); setEditingId(c.id); setOpen(true); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Le nom est requis");
    try {
      const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") };
      if (editingId) await apiAdmin.put(`/admin/categories/${editingId}`, payload);
      else await apiAdmin.post("/admin/categories", payload);
      toast.success("Enregistré");
      setOpen(false); load();
    } catch (e) { toast.error("Erreur", { description: e.response?.data?.detail || e.message }); }
  };

  const del = async (id) => {
    try { await apiAdmin.delete(`/admin/categories/${id}`); toast.success("Supprimé"); load(); }
    catch (e) { toast.error("Erreur", { description: e.response?.data?.detail || e.message }); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Catégories</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{cats.length} catégorie{cats.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openNew} data-testid="admin-new-category-button"><Plus className="h-4 w-4 mr-2" /> Nouvelle catégorie</Button>
      </div>

      {loading ? <div className="text-center py-10">Chargement…</div> : (
        <div className="rounded-xl border bg-[hsl(var(--card))] overflow-hidden">
          <table className="w-full text-sm" data-testid="admin-categories-table">
            <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
              <tr><th className="p-3">Icône</th><th className="p-3">Nom</th><th className="p-3">Slug</th><th className="p-3">Description</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id} className="border-t hover:bg-[hsl(var(--accent))]/30">
                  <td className="p-3 text-xl">{c.icon || "✨"}</td>
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3 text-[hsl(var(--muted-foreground))]">{c.slug}</td>
                  <td className="p-3 text-[hsl(var(--muted-foreground))] line-clamp-2">{c.description}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)} data-testid={`admin-edit-category-${c.id}`}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" data-testid={`admin-delete-category-${c.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></AlertDialogTrigger>
                      <AlertDialogContent className="admin-theme">
                        <AlertDialogHeader><AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle><AlertDialogDescription>Les produits ne seront pas supprimés.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(c.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="admin-theme">
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouvelle catégorie"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nom</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} data-testid="admin-category-name-input" /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto si vide" /></div>
            <div><Label>Icône</Label><Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🎨" /></div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save} data-testid="admin-category-save-button">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
