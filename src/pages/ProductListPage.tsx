import { useState, useMemo } from "react";
import { api } from "../api/client";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { generateProductData } from "../lib/product";

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.mock.postsList({ count: 300 });
      return (response.data.items || []).map(generateProductData);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const visibleProducts = useMemo(() => {
    return products.slice(0, page * itemsPerPage);
  }, [products, page]);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && products.length > visibleProducts.length) {
        setPage((prev) => prev + 1);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-primary">
                    {product.price.toLocaleString()} KRW
                  </p>
                </div>
              </div>
            ))}
          </div>
          {products.length > visibleProducts.length && (
            <div ref={ref} className="mt-8 flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
