import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  stock: number;
  image: string;
}

const MerchSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar productos");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto text-white">
        <p>Cargando productos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto text-red-500">
        <p>{error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto text-white">
        <p>No hay productos disponibles.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-start mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white">Merch destacados</h2>
        <button
          onClick={() => navigate('/merch')}
          className="text-sm text-purple-400 hover:underline"
        >
          ver más
        </button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div
                className="group cursor-pointer border border-purple-600 rounded-lg p-3 flex flex-col items-center gap-3 hover:shadow-lg hover:scale-105 transition-transform"
                onClick={() => navigate(`/merch/${item.id}`)}
              >
                <div className="w-full aspect-square rounded-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-semibold text-base text-center line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-purple-400 text-sm">Stock: {item.stock}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700" />
        <CarouselNext className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700" />
      </Carousel>
    </section>
  );
};

export default MerchSection;
