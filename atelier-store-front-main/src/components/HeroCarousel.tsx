import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  _id: string; // Añadir _id para compatibilidad con MongoDB
  name: string;
  image: string;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar productos");
        setLoading(false);
      });
  }, []);

  const slideGroups: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    slideGroups.push(products.slice(i, i + 2));
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideGroups.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideGroups.length) % slideGroups.length);
  };

  // Función para navegar a los detalles del producto
  const goToProductDetail = (product: Product) => {
    // Usar _id si existe (MongoDB), sino usar id
    const productId = product._id || product.id;
    navigate(`/merch/${productId}`);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [products]);

  if (loading) {
    return <p className="text-white">Cargando carrusel...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative h-96 overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="min-w-full h-full flex gap-4 px-4">
                {group.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="flex-1 relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => goToProductDetail(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex items-end justify-center p-6">
                      <div className="bg-black bg-opacity-50 rounded-lg text-center text-white px-4 py-3">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100">
                          Ver Más
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/20 bg-black/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/20 bg-black/30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {slideGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;