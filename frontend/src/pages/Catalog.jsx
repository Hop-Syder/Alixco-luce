import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeletons";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../components/ui/sheet";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [price, setPrice] = useState([0, 100000]);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort, limit: 200 };
      if (search) params.search = search;
      if (category && category !== "all") params.category = category;
      if (price[0] > 0) params.minPrice = price[0];
      if (price[1] < 100000) params.maxPrice = price[1];
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort, price]);

  useEffect(() => {
    const p = {};
    if (search) p.q = search;
    if (category && category !== "all") p.category = category;
    setSearchParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const activeCategoryName = useMemo(() => {
    if (category === "all") return "Tous les produits";
    const c = categories.find(x => x.id === category);
    return c ? c.name : "Tous les produits";
  }, [category, categories]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-[hsl(var(--muted-foreground))]">Catégorie</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("all")}
            className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${category === "all" ? "bg-[hsl(var(--accent))] font-semibold" : "hover:bg-[hsl(var(--accent))]/60"}`}
            data-testid="catalog-filter-category-all"
          >
            Tous
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${category === c.id ? "bg-[hsl(var(--accent))] font-semibold" : "hover:bg-[hsl(var(--accent))]/60"}`}
              data-testid={`catalog-filter-category-${c.slug}`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-[hsl(var(--muted-foreground))]">Prix (FCFA)</div>
        <Slider
          value={price}
          onValueChange={setPrice}
          min={0}
          max={100000}
          step={1000}
          data-testid="catalog-price-slider"
        />
        <div className="mt-3 flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
          <span>{price[0].toLocaleString("fr-FR")} FCFA</span>
          <span>{price[1].toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl">{activeCategoryName}</h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{loading ? "Chargement…" : `${products.length} article${products.length > 1 ? "s" : ""} disponible${products.length > 1 ? "s" : ""}`}</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border bg-[hsl(var(--card))] p-4 alix-card-shadow">
            {FilterPanel}
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="pl-9"
                data-testid="catalog-search-input"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[hsl(var(--accent))]" aria-label="Effacer">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]" data-testid="catalog-sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Récents d'abord</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
                <SelectItem value="name">A → Z</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={drawer} onOpenChange={setDrawer}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden" data-testid="catalog-open-filters-button">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-[hsl(var(--background))]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{FilterPanel}</div>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="rounded-xl border bg-[hsl(var(--card))] p-10 text-center">
              <Filter className="h-8 w-8 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
              <div className="font-semibold">Aucun produit trouvé</div>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Modifiez vos filtres ou votre recherche.</p>
              <Button className="mt-4" variant="outline" onClick={() => { setSearch(""); setCategory("all"); setPrice([0, 100000]); }} data-testid="catalog-reset-filters-button">
                Réinitialiser
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
