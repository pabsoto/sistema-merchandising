import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  isExclusive: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Debes iniciar sesión",
        description: "Para añadir productos al carrito, inicia sesión primero.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product?._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        addToCart({
          id: product!._id,
          name: product!.name,
          price: product!.price,
          image: product!.image,
          quantity: quantity,
        });

        toast({
          title: "Producto añadido",
          description: `Añadiste ${quantity} x ${product?.name} al carrito.`,
        });
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el producto al carrito.",
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate("/merch")} className="bg-purple-600 hover:bg-purple-700">
            Volver a Merch
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <Link to="/merch" className="inline-flex items-center text-purple-300 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Merch
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-purple-300 text-lg mb-2">
                {product.isExclusive ? "Edición Exclusiva" : "Producto Disponible"}
              </p>
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-purple-300">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Descripción</h3>
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Cantidad</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-slate-600 text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-semibold text-white w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-slate-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Añadir al Carrito ({quantity})
            </Button>

            {!isAuthenticated && (
              <p className="text-yellow-400 text-sm text-center">
                Necesitas iniciar sesión para añadir productos al carrito
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
