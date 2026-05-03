import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiAdmin, BACKEND_URL, resolveImage } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { ArrowLeft, X, Upload } from "lucide-react";
import { toast } from "sonner";

const empty = {
  name: "", description: "", price: 0, categoryId: "", images: [],
  stock: 0, featured: false, customizable: true, active: true,
  material: "", dimensions: "",
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    apiAdmin.get("/categories").then(r => setCategories(r.data));
    if (isEdit) {
      apiAdmin.get(`/products/${id}`)
        .then(r => setForm({ ...empty, ...r.data, categoryId: r.data.categoryId || "" }))
        .catch(() => toast.error("Produit introuvable"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await apiAdmin.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setForm(f => ({ ...f, images: [...f.images, res.data.url] }));
      }
      toast.success("Images uploadées");
    } catch (e) {
      toast.error("Erreur upload", { description: e.response?.data?.detail || e.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Le nom est requis");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        categoryId: form.categoryId || null,
      };
      if (isEdit) {
        await apiAdmin.put(`/admin/products/${id}`, payload);
        toast.success("Produit mis à jour");
      } else {
        await apiAdmin.post("/admin/products", payload);
        toast.success("Produit créé");
      }
      navigate("/admin/produits");
    } catch (e) {
      toast.error("Erreur", { description: e.response?.data?.detail || e.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Button type="button" variant="ghost" size="icon" asChild><Link to="/admin/produits"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="font-display text-3xl">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>
      </div>

      <div className="rounded-xl border bg-[hsl(var(--card))] p-5 space-y-4">
        <div>
          <Label>Nom *</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} required data-testid="admin-product-name-input" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} data-testid="admin-product-description-input" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Prix (FCFA) *</Label>
            <Input type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} required data-testid="admin-product-price-input" />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" min="0" value={form.stock} onChange={(e) => update("stock", e.target.value)} data-testid="admin-product-stock-input" />
          </div>
          <div>
            <Label>Catégorie</Label>
            <Select value={form.categoryId || ""} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger data-testid="admin-product-category-select"><SelectValue placeholder="Choisir…" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Matériau</Label>
            <Input value={form.material || ""} onChange={(e) => update("material", e.target.value)} placeholder="ex: Bois d'acajou" data-testid="admin-product-material-input" />
          </div>
          <div>
            <Label>Dimensions</Label>
            <Input value={form.dimensions || ""} onChange={(e) => update("dimensions", e.target.value)} placeholder="ex: 30x40 cm" data-testid="admin-product-dimensions-input" />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} data-testid="admin-product-active-switch" /> Actif
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} data-testid="admin-product-featured-switch" /> En vedette
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={form.customizable} onCheckedChange={(v) => update("customizable", v)} data-testid="admin-product-customizable-switch" /> Personnalisable
          </label>
        </div>
      </div>

      <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base">Images</Label>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm cursor-pointer hover:opacity-90">
            <Upload className="h-4 w-4" />
            {uploading ? "Upload…" : "Ajouter"}
            <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" data-testid="admin-product-upload-input" />
          </label>
        </div>
        {form.images.length === 0 ? (
          <div className="text-sm text-[hsl(var(--muted-foreground))] py-6 text-center border-2 border-dashed rounded-lg">Aucune image. Vous pouvez aussi coller une URL ci-dessous.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden aspect-square border">
                <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center" data-testid={`admin-product-remove-image-${i}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Input placeholder="Ou coller une URL d'image…" onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              e.preventDefault();
              update("images", [...form.images, e.target.value.trim()]);
              e.target.value = "";
            }
          }} data-testid="admin-product-image-url-input" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} data-testid="admin-product-save-button">{saving ? "Enregistrement…" : (isEdit ? "Enregistrer" : "Créer")}</Button>
        <Button type="button" variant="outline" asChild><Link to="/admin/produits">Annuler</Link></Button>
      </div>
    </form>
  );
};

export default AdminProductForm;
