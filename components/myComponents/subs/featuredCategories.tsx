"use client";
import { useEffect, useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAppContext } from "@/hooks/useAppContext";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  image: string;
  name: string;
  description: string;
  productCount: number;
};
import { Plus, Edit3, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "@/prisma/forms/CategoryForm";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Fetch categories from backend
async function getCategories(businessId?: string) {
  let url = `/api/dbhandler?model=category`;
  if (businessId) {
    url += `&businessId=${businessId}`;
  }

  const res = await fetch(url);

  if (!res.ok) return [];

  const categories = await res.json();

  return categories.map((cat: any) => ({
    id: cat.id,
    image: cat.image || "/logo.png",
    name: cat.name,
    description: cat.description || "",
    productCount: cat.products?.length || 0,
  }));
}

const FeaturedCategories = ({
  businessId: businessIdProp,
  layout = "cards",
  onCategorySelect,
}: {
  businessId?: string;
  layout?: "cards" | "tabs";
  onCategorySelect?: (categoryName: string) => void;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const isAdmin = useIsAdmin();
  const { currentBusiness } = useAppContext();

  const resolvedBusinessId = businessIdProp || currentBusiness?.id;

  const fetchCategories = async () => {
    if (!resolvedBusinessId) return;
    const cats = await getCategories(resolvedBusinessId);
    setCategories(cats);
  };

  useEffect(() => {
    fetchCategories();
  }, [resolvedBusinessId]);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab((prev) => prev || categories[0].id);
    }
  }, [categories]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const selected = categories.find((category: any) => category.id === value);
    if (selected && onCategorySelect) {
      onCategorySelect(selected.name);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await axios.delete(`/api/dbhandler?model=category&id=${id}`);
        toast.success("Category deleted");
        fetchCategories();
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20 border-none font-black text-[10px] tracking-widest uppercase py-1.5 px-4 rounded-full">Explore Our World</Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-primary uppercase">
            Product <span className="text-accent">Galleries</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground font-medium text-lg italic">
            "Discover premium selections curated specifically for your lifestyle."
          </p>

          {isAdmin && (
            <div className="mt-8">
              <Dialog onOpenChange={(open) => !open && fetchCategories()}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-8 rounded-2xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 gap-2 font-black text-xs uppercase tracking-widest">
                    <Plus className="h-4 w-4" />
                    Expand Catalog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-transparent border-none p-0 shadow-none">
                  <CategoryForm />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="space-y-4">
            {[1, 3].map((i) => (
              <div key={`empty-${i}`} className="rounded-3xl bg-muted/40 animate-pulse border-2 border-dashed border-muted p-6">
                <div className="h-5 w-40 bg-muted/70 rounded mb-4" />
                <div className="h-3 w-32 bg-muted/70 rounded mb-2" />
                <div className="h-3 w-20 bg-muted/70 rounded" />
              </div>
            ))}
          </div>
        ) : layout === "tabs" ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="overflow-x-auto pb-2 gap-2">
              {categories.map((category: any) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="min-w-[130px]"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category: any) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="rounded-3xl border border-muted/30 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description || "No category description yet."}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground font-medium">
                    <span>{category.productCount || 0} products</span>
                    <span className="text-muted-foreground">Category ID: {category.id}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-wrap gap-3">
                      <Dialog onOpenChange={(open) => !open && fetchCategories()}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="rounded-2xl bg-accent text-white hover:bg-accent/90">
                            Edit category
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-transparent border-none p-0 shadow-none">
                          <CategoryForm initialCategory={category} hideList={true} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        Delete category
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category: any) => (
              <div key={category.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border-2 border-muted/20 hover:border-accent/20 transition-all shadow-sm hover:shadow-xl hover:scale-105 transform duration-300">
                {/* Category Image */}
                <div className="relative h-40 bg-muted/20 overflow-hidden">
                  <img 
                    src={category.image || "/placeholder.jpg"} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>

                {/* Category Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-black text-sm uppercase tracking-tight line-clamp-2">{category.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold">{category.productCount || 0} Products</p>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2 z-30">
                    <Dialog onOpenChange={(open) => !open && fetchCategories()}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-primary hover:bg-accent hover:text-white transition-all">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-transparent border-none p-0 shadow-none">
                        <CategoryForm initialCategory={category} hideList={true} /> 
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-10 w-10 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                      onClick={() => handleDelete(category.id, category.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
