import React, { useEffect, useState } from "react";
import { apiAdmin, formatFCFA } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { toast } from "sonner";

const empty = { name: "", description: "", priceFrom: 0, priceTo: 0, icon: "", featured: false, active: true };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const r = await apiAdmin.get("/admin/services"); setServices(r.data); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditingId(null); setOpen(true); };
  const openEdit = (s) => { setForm({ ...empty, ...s }); setEditingId(s.id); setOpen(true); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Le nom est requis");
    try {
      const payload = { ...form, priceFrom: parseFloat(form.priceFrom) || 0, priceTo: parseFloat(form.priceTo) || null };
      if (editingId) {
        await apiAdmin.put(`/admin/services/${editingId}`, payload);
        toast.success("Service mis à jour");
      } else {
        await apiAdmin.post("/admin/services", payload);
        toast.success("Service créé");
      }
      setOpen(false); load();
    } catch (e) { toast.error("Erreur", { description: e.response?.data?.detail || e.message }); }
  };

  const del = async (id) => {
    try { await apiAdmin.delete(`/admin/services/${id}`); toast.success("Supprimé"); load(); }
    catch (e) { toast.error("Erreur", { description: e.response?.data?.detail || e.message }); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Services</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{services.length} service{services.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openNew} data-testid="admin-new-service-button"><Plus className="h-4 w-4 mr-2" /> Nouveau service</Button>
      </div>

      {loading ? <div className="text-center py-10">Chargement…</div> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(s => (
            <div key={s.id} className="rounded-xl border bg-[hsl(var(--card))] p-5" data-testid={`admin-service-card-${s.id}`}>
              <div className="flex items-start justify-between">
                <div className="text-2xl">{s.icon || "✨"}</div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} data-testid={`admin-edit-service-${s.id}`}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" data-testid={`admin-delete-service-${s.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></AlertDialogTrigger>
                    <AlertDialogContent className="admin-theme">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                        <AlertDialogDescription>Action irréversible.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => del(s.id)}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-3 font-semibold">{s.name}</div>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">{s.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[var(--alix-bronze)] font-semibold">Dès {formatFCFA(s.priceFrom)}</span>
                <div className="flex gap-2">
                  {s.featured && <span className="text-[10px] uppercase bg-[var(--alix-brass)]/20 text-[var(--alix-bronze)] px-2 py-0.5 rounded-full">Vedette</span>}
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>{s.active ? "Actif" : "Inactif"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="admin-theme" data-testid="admin-service-dialog">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le service" : "Nouveau service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nom *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} data-testid="admin-service-name-input" /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} data-testid="admin-service-description-input" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prix à partir de (FCFA)</Label><Input type="number" value={form.priceFrom} onChange={(e) => setForm(f => ({ ...f, priceFrom: e.target.value }))} data-testid="admin-service-pricefrom-input" /></div>
              <div><Label>Prix jusqu'à (FCFA)</Label><Input type="number" value={form.priceTo || ""} onChange={(e) => setForm(f => ({ ...f, priceTo: e.target.value }))} data-testid="admin-service-priceto-input" /></div>
            </div>
            <div><Label>Emoji / Icône</Label><Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🎨" /></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><Switch checked={form.active} onCheckedChange={(v) => setForm(f => ({ ...f, active: v }))} /> Actif</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><Switch checked={form.featured} onCheckedChange={(v) => setForm(f => ({ ...f, featured: v }))} /> Vedette</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save} data-testid="admin-service-save-button">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
