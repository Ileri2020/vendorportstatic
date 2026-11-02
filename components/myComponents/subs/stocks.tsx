'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { ProductCard } from "./productCard";
import ProductForm from "@/prisma/forms/ProductForm";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

type StocksProps = {
  categoryFilter?: string;
  search?: string;
  selectedId?: string;
  businessId?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: any;
  rating?: number;
};

import { useAppContext } from "@/hooks/useAppContext";

const Stocks = ({ categoryFilter, search, selectedId, businessId }: StocksProps) => {
  const { addItem } = useCart();
  const { user, currentBusiness, openDialog } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingPlaceholders, setDeletingPlaceholders] = useState(false);

  const fetchProducts = async () => {
    try {
      let url = "/api/dbhandler?model=product";
      if (businessId) url += `&businessId=${businessId}`;
      const res = await axios.get(url);
      const fetchedProducts: Product[] = res.data;

      // Filter and prioritize
      let prioritized: Product[] = [];

      // 1️⃣ Product by selectedId first
      if (selectedId) {
        const selectedProduct = fetchedProducts.find(p => p.id === selectedId);
        if (selectedProduct) prioritized.push(selectedProduct);
      }

      // 2️⃣ Products whose name contains search
      if (search) {
        const searchMatches = fetchedProducts.filter(
          p => p.name.toLowerCase().includes(search.toLowerCase()) &&
            p.id !== selectedId
        );
        prioritized.push(...searchMatches);
      }

      // 3️⃣ Products in same category
      if (categoryFilter) {
        const categoryMatches = fetchedProducts.filter(
          p =>
            p.category?.name?.toLowerCase() === categoryFilter.toLowerCase() &&
            p.id !== selectedId &&
            !(search && p.name.toLowerCase().includes(search.toLowerCase()))
        );
        prioritized.push(...categoryMatches);
      }


      // If nothing matches, fallback to all products
      if (prioritized.length === 0) {
        prioritized = fetchedProducts.sort(() => Math.random() - 0.5);
      }

      setProducts(prioritized);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products, please check your network connection");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, search, selectedId]);

  const isCurrentBusinessOwner =
    currentBusiness && user && currentBusiness.ownerId === user.id;

  const handleDeletePlaceholderProducts = async () => {
    const placeholderProducts = products.filter(
      (product) =>
        typeof product.name === "string" &&
        product.name.startsWith("Placeholder Product")
    );

    if (placeholderProducts.length === 0) {
      openDialog("No placeholder products found.", "Nothing to delete");
      return;
    }

    if (!confirm("Delete all placeholder products?")) return;

    try {
      setDeletingPlaceholders(true);
      await Promise.all(
        placeholderProducts.map((product) =>
          axios.delete(`/api/dbhandler?model=product&id=${product.id}`)
        )
      );
      openDialog("Placeholder products deleted successfully.", "Deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      openDialog("Failed to delete placeholder products.", "Error");
    } finally {
      setDeletingPlaceholders(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full max-w-[500px] md:max-w-[1000px] flex gap-5 flex-wrap relative p-2 mx-auto justify-between">
        <div className="absolute w-full h-full flex justify-center items-center z-10 bg-black/30 p-2">
          {error && <p className="w-full text-center text-white">{error}</p>}
        </div>
        {[...Array(8)].map((_, index) => (
          <Skeleton
            key={index}
            className="w-[100vw] md:w-[200px] h-[150px] md:h-[300px] mb-5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isCurrentBusinessOwner && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeletePlaceholderProducts}
              disabled={deletingPlaceholders}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deletingPlaceholders ? "Deleting..." : "Delete all placeholder products"}
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create new product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Create new product</DialogTitle>
                </DialogHeader>
                <ProductForm hideList={true} businessId={currentBusiness?.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      <div className="h-full max-w-[500px] md:max-w-[1000px] flex gap-5 flex-wrap mx-5 p-2 self-center justify-between">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              inStock: true,
              rating: product.rating ?? 5,
            }}
            orientation="horizontal"
            onAddToCart={addItem}
            onAddToWishlist={(id) => openDialog(`Add ${id} to wishlist`, "Wishlist")}
            className="w-[100vw] md:w-[200px] mb-5 flex flex-row md:flex-col"
          />
        ))}
      </div>
    </div>
  );
};

export default Stocks;
